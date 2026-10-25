import 'dotenv/config';
import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import multer from 'multer';
import mysql from 'mysql2/promise';

const app = express();
const port = Number(process.env.PORT || 3001);
const production = process.env.NODE_ENV === 'production';
const sessionCookie = 'alldisplay_admin_session';
const customerSessionCookie = 'alldisplay_customer_session';
const oauthStateCookie = 'alldisplay_google_state';
const oauthNonceCookie = 'alldisplay_google_nonce';
const sessionTtlSeconds = 8 * 60 * 60;
const customerSessionTtlSeconds = 7 * 24 * 60 * 60;
const oauthConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_REDIRECT_URI
);
const scrypt = promisify(scryptCallback);
const rootDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.join(rootDirectory, 'public', 'uploads');
const mysqlConfigured = Boolean(
  process.env.MYSQL_HOST &&
  process.env.MYSQL_USER &&
  process.env.MYSQL_DATABASE &&
  (process.env.ADMIN_PASSWORD?.length || 0) >= 16 &&
  (process.env.SESSION_SECRET?.length || 0) >= 32
);
let schemaReady = Promise.resolve();
const pool = mysqlConfigured
  ? mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE,
      ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
      waitForConnections: true,
      connectionLimit: 5,
      charset: 'utf8mb4',
    })
  : null;

app.disable('x-powered-by');
app.use((request, response, next) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(uploadDirectory, {
  dotfiles: 'deny',
  index: false,
  maxAge: production ? '1d' : 0,
}));

mkdirSync(uploadDirectory, { recursive: true });
const imageExtensions = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
]);
const imageUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (_request, file, callback) => {
      callback(null, `${randomBytes(16).toString('hex')}${imageExtensions.get(file.mimetype) || '.img'}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (!imageExtensions.has(file.mimetype)) {
      callback(new Error('Choose a JPEG, PNG, WebP, or GIF image.'));
      return;
    }
    callback(null, true);
  },
});
const videoExtensions = new Map([
  ['video/mp4', '.mp4'],
  ['video/webm', '.webm'],
  ['video/quicktime', '.mov'],
]);
const videoUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (_request, file, callback) => {
      callback(null, `${randomBytes(16).toString('hex')}${videoExtensions.get(file.mimetype) || '.video'}`);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (!videoExtensions.has(file.mimetype)) {
      callback(new Error('Choose an MP4, WebM, or QuickTime video.'));
      return;
    }
    callback(null, true);
  },
});

const loginAttempts = new Map();
const submissionAttempts = new Map();
const customerAuthAttempts = new Map();

function readCookie(request, name) {
  return request.get('cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function signSession(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', process.env.SESSION_SECRET).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function verifySession(token) {
  if (!token || !process.env.SESSION_SECRET) return false;
  const [body, signature, extra] = token.split('.');
  if (!body || !signature || extra) return false;

  const expected = createHmac('sha256', process.env.SESSION_SECRET).update(body).digest();
  let supplied;
  try {
    supplied = Buffer.from(signature, 'base64url');
  } catch {
    return false;
  }
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return false;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    return payload.role === 'Owner' && Number(payload.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function verifyCustomerSession(token) {
  if (!token || !process.env.SESSION_SECRET) return null;
  const [body, signature, extra] = token.split('.');
  if (!body || !signature || extra) return null;

  const expected = createHmac('sha256', process.env.SESSION_SECRET).update(body).digest();
  const supplied = Buffer.from(signature, 'base64url');
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (
      typeof payload.sub !== 'string' ||
      !/^[a-f0-9]{32}$/.test(payload.sub) ||
      typeof payload.sid !== 'string' ||
      !/^[a-f0-9]{64}$/.test(payload.sid) ||
      !Number.isFinite(Number(payload.exp)) ||
      Number(payload.exp) <= Math.floor(Date.now() / 1000)
    ) return null;
    return payload;
  } catch {
    return null;
  }
}

function publicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatarUrl: row.avatar_url || null,
    role: row.role,
    createdAt: row.created_at,
  };
}

function authLimit(request, response, next) {
  const key = `${request.ip || 'unknown'}:${request.path}`;
  const now = Date.now();
  const attempts = (customerAuthAttempts.get(key) || []).filter((time) => now - time < 15 * 60 * 1000);
  if (attempts.length >= 10) {
    return response.status(429).json({ error: 'Too many authentication attempts. Please wait and try again.' });
  }
  attempts.push(now);
  customerAuthAttempts.set(key, attempts);
  next();
}

function requireAuthRequest(request, response, next) {
  if (request.get('x-auth-request') !== '1') {
    return response.status(403).json({ error: 'Invalid authentication request.' });
  }
  next();
}

function requireCustomer(request, response, next) {
  const session = verifyCustomerSession(readCookie(request, customerSessionCookie));
  if (!session) {
    return response.status(401).json({ error: 'Customer sign-in required.' });
  }
  pool.query(
    `SELECT u.id, u.name, u.email, u.avatar_url, u.role, u.created_at
     FROM auth_sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.id = ? AND s.user_id = ? AND s.expires_at > UNIX_TIMESTAMP() AND u.role = 'user'
     LIMIT 1`,
    [session.sid, session.sub]
  ).then(([rows]) => {
    if (!rows.length) return response.status(401).json({ error: 'Customer sign-in required.' });
    request.customer = publicUser(rows[0]);
    request.customerSessionId = session.sid;
    next();
  }).catch(next);
}

function loadOptionalCustomer(request, response, next) {
  const session = verifyCustomerSession(readCookie(request, customerSessionCookie));
  if (!session) {
    request.customer = null;
    return next();
  }
  pool.query(
    `SELECT u.id, u.name, u.email, u.avatar_url, u.role, u.created_at
     FROM auth_sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.id = ? AND s.user_id = ? AND s.expires_at > UNIX_TIMESTAMP() AND u.role = 'user'
     LIMIT 1`,
    [session.sid, session.sub]
  ).then(([rows]) => {
    request.customer = rows.length ? publicUser(rows[0]) : null;
    next();
  }).catch(next);
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`;
}

async function verifyPassword(password, storedHash) {
  const [algorithm, saltHex, keyHex, extra] = (storedHash || '').split('$');
  if (algorithm !== 'scrypt' || !saltHex || !keyHex || extra || !/^[a-f0-9]{32}$/.test(saltHex) || !/^[a-f0-9]{128}$/.test(keyHex)) {
    return false;
  }
  const expected = Buffer.from(keyHex, 'hex');
  const actual = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length);
  return timingSafeEqual(expected, actual);
}

async function setCustomerSession(response, userId) {
  const now = Math.floor(Date.now() / 1000);
  const sessionId = randomBytes(32).toString('hex');
  const expiresAt = now + customerSessionTtlSeconds;
  await pool.query(
    'INSERT INTO auth_sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
    [sessionId, userId, expiresAt]
  );
  const token = signSession({ sub: userId, sid: sessionId, iat: now, exp: now + customerSessionTtlSeconds });
  response.cookie(customerSessionCookie, token, {
    httpOnly: true,
    secure: production,
    sameSite: 'strict',
    maxAge: customerSessionTtlSeconds * 1000,
    path: '/',
  });
}

function oauthCookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: production,
    sameSite: 'lax',
    maxAge,
    path: '/api/auth/google/callback',
  };
}

function requireGoogleOAuth(_request, response, next) {
  if (!oauthConfigured) {
    return response.status(503).json({
      error: 'Google sign-in is not enabled. Configure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI.',
    });
  }
  next();
}

async function requireDatabase(request, response, next) {
  if (!pool) {
    return response.status(503).json({ error: 'MySQL is not configured. Set the server environment variables and restart.' });
  }
  try {
    if (!await schemaReady) throw new Error('MySQL schema initialization failed.');
    next();
  } catch {
    response.status(503).json({ error: 'Could not initialize the MySQL catalog tables.' });
  }
}

function requireAdmin(request, response, next) {
  const token = request.cookies?.[sessionCookie] ?? request.get('cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${sessionCookie}=`))
    ?.slice(sessionCookie.length + 1);

  if (!verifySession(token)) {
    return response.status(401).json({ error: 'Admin sign-in required.' });
  }
  next();
}

function requireSameOrigin(request, response, next) {
  if (request.get('x-admin-request') !== '1') {
    return response.status(403).json({ error: 'Invalid admin request.' });
  }
  next();
}

function limitPublicSubmissions(request, response, next) {
  const key = `${request.ip || 'unknown'}:${request.path}`;
  const now = Date.now();
  const recent = (submissionAttempts.get(key) || []).filter((timestamp) => now - timestamp < 15 * 60 * 1000);
  if (recent.length >= 10) {
    return response.status(429).json({ error: 'Too many submissions. Please wait a few minutes and try again.' });
  }
  recent.push(now);
  submissionAttempts.set(key, recent);
  next();
}

app.get('/api/health', async (_request, response) => {
  if (!pool) {
    return response.json({ configured: false, connected: false });
  }

  try {
    if (!await schemaReady) throw new Error('MySQL catalog tables are unavailable.');
    await pool.query('SELECT 1');
    response.json({ configured: true, connected: true });
  } catch {
    response.json({ configured: true, connected: false, error: 'Could not connect to MySQL.' });
  }
});

app.post('/api/auth/signup', requireAuthRequest, requireDatabase, authLimit, async (request, response, next) => {
  const name = typeof request.body?.name === 'string' ? request.body.name.trim().replace(/\s+/g, ' ') : '';
  const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : '';
  const password = typeof request.body?.password === 'string' ? request.body.password : '';
  if (name.length < 1 || name.length > 120) {
    return response.status(400).json({ error: 'Name must be between 1 and 120 characters.' });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({ error: 'Enter a valid email address.' });
  }
  if (password.length < 12 || password.length > 128) {
    return response.status(400).json({ error: 'Password must be between 12 and 128 characters.' });
  }

  try {
    const id = randomBytes(16).toString('hex');
    const passwordHash = await hashPassword(password);
    await pool.query(
      'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, passwordHash, 'user']
    );
    const [[row]] = await pool.query(
      'SELECT id, name, email, avatar_url, role, created_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    await setCustomerSession(response, id);
    response.status(201).json({ user: publicUser(row) });
  } catch (error) {
    if (error?.code === 'ER_DUP_ENTRY') {
      return response.status(409).json({ error: 'An account with this email already exists.' });
    }
    next(error);
  }
});

app.post('/api/auth/login', requireAuthRequest, requireDatabase, authLimit, async (request, response, next) => {
  const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : '';
  const password = typeof request.body?.password === 'string' ? request.body.password : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length > 128) {
    return response.status(401).json({ error: 'Email or password is incorrect.' });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, avatar_url, role, created_at, password_hash FROM users WHERE email = ? AND role = 'user' LIMIT 1",
      [email]
    );
    const row = rows[0];
    const valid = await verifyPassword(password, row?.password_hash || `scrypt$${'0'.repeat(32)}$${'0'.repeat(128)}`);
    if (!row || !row.password_hash || !valid) {
      return response.status(401).json({ error: 'Email or password is incorrect.' });
    }
    await setCustomerSession(response, row.id);
    response.json({ user: publicUser(row) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/auth/session', requireDatabase, loadOptionalCustomer, (request, response) => {
  response.json({ user: request.customer });
});

app.post('/api/auth/logout', requireAuthRequest, requireDatabase, requireCustomer, async (request, response, next) => {
  try {
    await pool.query('DELETE FROM auth_sessions WHERE id = ?', [request.customerSessionId]);
    response.clearCookie(customerSessionCookie, {
      httpOnly: true,
      secure: production,
      sameSite: 'strict',
      path: '/',
    });
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.get('/api/auth/google', requireGoogleOAuth, requireDatabase, authLimit, (_request, response) => {
  const state = randomBytes(32).toString('base64url');
  const nonce = randomBytes(32).toString('base64url');
  response.cookie(oauthStateCookie, state, oauthCookieOptions(10 * 60 * 1000));
  response.cookie(oauthNonceCookie, nonce, oauthCookieOptions(10 * 60 * 1000));
  const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authorizationUrl.search = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    nonce,
    prompt: 'select_account',
  }).toString();
  response.redirect(302, authorizationUrl.toString());
});

app.get('/api/auth/google/callback', requireGoogleOAuth, requireDatabase, authLimit, async (request, response, next) => {
  response.clearCookie(oauthStateCookie, oauthCookieOptions(0));
  response.clearCookie(oauthNonceCookie, oauthCookieOptions(0));

  const state = typeof request.query.state === 'string' ? request.query.state : '';
  const expectedState = readCookie(request, oauthStateCookie);
  const nonce = readCookie(request, oauthNonceCookie);
  const suppliedState = Buffer.from(state);
  const storedState = Buffer.from(expectedState || '');
  if (!state || !expectedState || suppliedState.length !== storedState.length || !timingSafeEqual(suppliedState, storedState)) {
    return response.status(400).json({ error: 'Google sign-in could not be verified. Please try again.' });
  }
  if (typeof request.query.code !== 'string' || !request.query.code || !nonce) {
    return response.status(400).json({ error: 'Google sign-in did not complete. Please try again.' });
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: request.query.code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenResponse.ok) {
      return response.status(401).json({ error: 'Google sign-in could not be completed. Please try again.' });
    }
    const tokenData = await tokenResponse.json();
    if (typeof tokenData.id_token !== 'string') {
      return response.status(401).json({ error: 'Google sign-in could not be completed. Please try again.' });
    }

    const tokenInfoUrl = new URL('https://oauth2.googleapis.com/tokeninfo');
    tokenInfoUrl.searchParams.set('id_token', tokenData.id_token);
    const infoResponse = await fetch(tokenInfoUrl);
    if (!infoResponse.ok) {
      return response.status(401).json({ error: 'Google sign-in could not be verified. Please try again.' });
    }
    const identity = await infoResponse.json();
    const verifiedEmail = identity.email_verified === true || identity.email_verified === 'true';
    const validIssuer = identity.iss === 'accounts.google.com' || identity.iss === 'https://accounts.google.com';
    const validExpiration = Number.isFinite(Number(identity.exp)) && Number(identity.exp) > Math.floor(Date.now() / 1000);
    if (
      identity.aud !== process.env.GOOGLE_CLIENT_ID ||
      !validIssuer ||
      !verifiedEmail ||
      identity.nonce !== nonce ||
      !validExpiration ||
      typeof identity.sub !== 'string' ||
      typeof identity.email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.email)
    ) {
      return response.status(401).json({ error: 'Google sign-in could not be verified. Please try again.' });
    }

    const email = identity.email.trim().toLowerCase();
    const suppliedName = typeof identity.name === 'string' ? identity.name.trim().replace(/\s+/g, ' ') : '';
    const name = (suppliedName || email.split('@')[0]).slice(0, 120);
    const avatarUrl = typeof identity.picture === 'string' && identity.picture.startsWith('https://')
      ? identity.picture.slice(0, 2048)
      : null;
    let [rows] = await pool.query(
      "SELECT id, name, email, avatar_url, role, created_at FROM users WHERE email = ? AND role = 'user' LIMIT 1",
      [email]
    );
    if (!rows.length) {
      const id = randomBytes(16).toString('hex');
      try {
        await pool.query(
          'INSERT INTO users (id, name, email, avatar_url, role) VALUES (?, ?, ?, ?, ?)',
          [id, name, email, avatarUrl, 'user']
        );
        [rows] = await pool.query(
          'SELECT id, name, email, avatar_url, role, created_at FROM users WHERE id = ? LIMIT 1',
          [id]
        );
      } catch (error) {
        if (error?.code !== 'ER_DUP_ENTRY') throw error;
        [rows] = await pool.query(
          "SELECT id, name, email, avatar_url, role, created_at FROM users WHERE email = ? AND role = 'user' LIMIT 1",
          [email]
        );
      }
    }
    if (!rows.length) {
      return response.status(401).json({ error: 'Google sign-in could not be completed. Please try again.' });
    }
    await setCustomerSession(response, rows[0].id);
    response.redirect(303, '/');
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/login', requireDatabase, requireSameOrigin, async (request, response) => {
  const address = request.ip || 'unknown';
  const attempt = loginAttempts.get(address);
  if (attempt && attempt.blockedUntil > Date.now()) {
    return response.status(429).json({ error: 'Too many login attempts. Try again in a few minutes.' });
  }

  const provided = typeof request.body?.password === 'string' ? request.body.password : '';
  const expectedHash = createHmac('sha256', 'admin-password-check').update(process.env.ADMIN_PASSWORD).digest();
  const providedHash = createHmac('sha256', 'admin-password-check').update(provided).digest();
  const valid = timingSafeEqual(expectedHash, providedHash);

  if (!valid) {
    const failures = (attempt?.failures || 0) + 1;
    loginAttempts.set(address, {
      failures: failures >= 5 ? 0 : failures,
      blockedUntil: failures >= 5 ? Date.now() + 5 * 60 * 1000 : 0,
    });
    return response.status(401).json({ error: 'Incorrect admin password.' });
  }

  loginAttempts.delete(address);
  const now = Math.floor(Date.now() / 1000);
  const token = signSession({ role: 'Owner', iat: now, exp: now + sessionTtlSeconds });
  response.cookie(sessionCookie, token, {
    httpOnly: true,
    secure: production,
    sameSite: 'strict',
    maxAge: sessionTtlSeconds * 1000,
    path: '/',
  });
  response.json({ role: 'Owner' });
});

app.get('/api/admin/session', requireDatabase, (request, response) => {
  const token = request.get('cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${sessionCookie}=`))
    ?.slice(sessionCookie.length + 1);
  response.json({ role: verifySession(token) ? 'Owner' : null });
});

app.post('/api/admin/logout', requireSameOrigin, (_request, response) => {
  response.clearCookie(sessionCookie, { httpOnly: true, secure: production, sameSite: 'strict', path: '/' });
  response.status(204).end();
});

app.post(
  '/api/admin/uploads',
  requireDatabase,
  requireSameOrigin,
  requireAdmin,
  (request, response, next) => {
    imageUpload.single('image')(request, response, (error) => {
      if (error) {
        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
          return response.status(413).json({ error: 'Image must be 5 MB or smaller.' });
        }
        return response.status(400).json({
          error: error instanceof Error ? error.message : 'Image upload failed.',
        });
      }
      next();
    });
  },
  (request, response) => {
    if (!request.file) {
      return response.status(400).json({ error: 'Select an image to upload.' });
    }
    response.status(201).json({ url: `/uploads/${request.file.filename}` });
  }
);

app.post(
  '/api/admin/video-uploads',
  requireDatabase,
  requireSameOrigin,
  requireAdmin,
  (request, response, next) => {
    videoUpload.single('video')(request, response, (error) => {
      if (error) {
        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
          return response.status(413).json({ error: 'Video must be 50 MB or smaller.' });
        }
        return response.status(400).json({
          error: error instanceof Error ? error.message : 'Video upload failed.',
        });
      }
      next();
    });
  },
  (request, response) => {
    if (!request.file) {
      return response.status(400).json({ error: 'Select a video to upload.' });
    }
    response.status(201).json({ url: `/uploads/${request.file.filename}` });
  }
);

app.get('/api/catalog', requireDatabase, async (_request, response, next) => {
  try {
    const [products, categories] = await Promise.all([
      pool.query('SELECT id, data FROM catalog_products ORDER BY id'),
      pool.query('SELECT id, data FROM catalog_categories ORDER BY id'),
    ]);
    response.json({
      products: products[0].map((row) => ({ ...row.data, id: row.id })),
      categories: categories[0].map((row) => ({ ...row.data, id: row.id })),
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/settings', requireDatabase, async (_request, response, next) => {
  try {
    const [rows] = await pool.query('SELECT data FROM business_settings WHERE id = 1');
    response.json({ settings: rows.length ? rows[0].data : null });
  } catch (error) {
    next(error);
  }
});

app.get('/api/homepage-banners', requireDatabase, async (_request, response, next) => {
  try {
    const [rows] = await pool.query('SELECT data FROM homepage_banners WHERE id = 1');
    const savedHomepage = rows[0]?.data;
    response.json({
      banners: Array.isArray(savedHomepage) ? savedHomepage : savedHomepage?.banners ?? null,
      dealProductIds: Array.isArray(savedHomepage?.dealProductIds) ? savedHomepage.dealProductIds : [],
    });
  } catch (error) {
    next(error);
  }
});

app.put('/api/homepage-banners', requireDatabase, requireSameOrigin, requireAdmin, async (request, response, next) => {
  const banners = request.body?.banners;
  const dealProductIds = request.body?.dealProductIds ?? [];
  if (!Array.isArray(banners) || banners.length > 100) {
    return response.status(400).json({ error: 'Homepage banners must be an array of at most 100 items.' });
  }
  if (!Array.isArray(dealProductIds) || dealProductIds.length > 100 ||
      !dealProductIds.every((id) => typeof id === 'string' && id.length > 0 && id.length <= 191)) {
    return response.status(400).json({ error: 'Deal products must be a list of at most 100 product IDs.' });
  }
  const validBanners = banners.every((banner) =>
    banner &&
    typeof banner === 'object' &&
    !Array.isArray(banner) &&
    typeof banner.id === 'string' && banner.id.length > 0 && banner.id.length <= 191 &&
    typeof banner.eyebrow === 'string' && banner.eyebrow.length <= 160 &&
    typeof banner.title === 'string' && banner.title.length > 0 && banner.title.length <= 200 &&
    typeof banner.subtitle === 'string' && banner.subtitle.length <= 240 &&
    typeof banner.description === 'string' && banner.description.length <= 1000 &&
    typeof banner.image === 'string' && banner.image.length > 0 && banner.image.length <= 2000 &&
    (banner.mobileImage === undefined || (typeof banner.mobileImage === 'string' && banner.mobileImage.length <= 2000)) &&
    ['category', 'product'].includes(banner.linkType) &&
    typeof banner.linkId === 'string' && banner.linkId.length > 0 && banner.linkId.length <= 191
  );
  if (!validBanners) {
    return response.status(400).json({ error: 'Every banner must include valid text, image, and category or product link fields.' });
  }

  try {
    await pool.query(
      'INSERT INTO homepage_banners (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)',
      [JSON.stringify({ banners, dealProductIds })]
    );
    response.json({ saved: true });
  } catch (error) {
    next(error);
  }
});

app.put('/api/settings', requireDatabase, requireSameOrigin, requireAdmin, async (request, response, next) => {
  const settings = request.body?.settings;
  const textFields = [
    'whatsappNumber',
    'alternateWhatsapp',
    'upiId',
    'bankName',
    'accountNo',
    'ifscCode',
    'shippingNotes',
    'storeName',
    'businessAddress',
  ];
  const validTextFields = settings &&
    typeof settings === 'object' &&
    !Array.isArray(settings) &&
    textFields.every((field) => typeof settings[field] === 'string' && settings[field].length <= 1000);
  const whatsappDigits = typeof settings?.whatsappNumber === 'string'
    ? settings.whatsappNumber.replace(/\D/g, '')
    : '';
  const alternateWhatsappDigits = typeof settings?.alternateWhatsapp === 'string'
    ? settings.alternateWhatsapp.replace(/\D/g, '')
    : '';
  if (!validTextFields ||
      whatsappDigits.length < 10 ||
      whatsappDigits.length > 15 ||
      (alternateWhatsappDigits.length > 0 &&
        (alternateWhatsappDigits.length < 10 || alternateWhatsappDigits.length > 15)) ||
      !Number.isFinite(settings.minOrderValue) ||
      settings.minOrderValue < 0) {
    return response.status(400).json({ error: 'Business settings contain invalid values.' });
  }

  try {
    await pool.query(
      'INSERT INTO business_settings (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)',
      [JSON.stringify(settings)]
    );
    response.json({ saved: true });
  } catch (error) {
    next(error);
  }
});

function isRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value, maxLength = 500) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

app.post('/api/orders', requireDatabase, limitPublicSubmissions, async (request, response, next) => {
  const order = request.body;
  if (!isRecord(order) ||
      !isNonEmptyString(order.customerName, 120) ||
      !isNonEmptyString(order.storeName, 160) ||
      !isNonEmptyString(order.whatsapp, 30) ||
      !isNonEmptyString(order.destination, 160) ||
      !isNonEmptyString(order.pincode, 20) ||
      !Array.isArray(order.items) ||
      order.items.length < 1 ||
      order.items.length > 100 ||
      !order.items.every((item) =>
        isRecord(item) &&
        isNonEmptyString(item.sku, 100) &&
        isNonEmptyString(item.title, 300) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        Number.isFinite(item.unitPrice) &&
        item.unitPrice >= 0 &&
        item.unitPrice <= 100000000 &&
        isNonEmptyString(item.unitLabel, 30)
      )) {
    return response.status(400).json({ error: 'Order details are incomplete or invalid.' });
  }

  try {
    const id = randomBytes(16).toString('hex');
    const orderNo = `AD-${new Date().getFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`;
    const createdAt = new Date().toISOString();
    const subtotal = order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const discountRate = subtotal >= 50000 ? 0.15 : subtotal >= 25000 ? 0.1 : 0;
    const discount = Math.round(subtotal * discountRate);
    const gst = Math.round((subtotal - discount) * 0.18);
    const savedOrder = {
      ...order,
      id,
      orderNo,
      date: createdAt,
      status: 'New (Awaiting WhatsApp)',
      subtotal,
      discount,
      gst,
      total: subtotal - discount + gst,
      notes: typeof order.notes === 'string' ? order.notes.slice(0, 2000) : '',
    };
    await pool.query('INSERT INTO customer_orders (id, data) VALUES (?, ?)', [id, JSON.stringify(savedOrder)]);
    response.status(201).json({ order: savedOrder });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/orders', requireDatabase, requireAdmin, async (_request, response, next) => {
  try {
    const [rows] = await pool.query('SELECT data FROM customer_orders ORDER BY created_at DESC');
    response.json({ orders: rows.map((row) => row.data) });
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/orders', requireDatabase, requireSameOrigin, requireAdmin, async (request, response, next) => {
  const orders = request.body?.orders;
  if (!Array.isArray(orders) || orders.length > 10000 ||
      !orders.every((order) => isRecord(order) && isNonEmptyString(order.id, 64))) {
    return response.status(400).json({ error: 'Orders must be an array of saved order records.' });
  }
  try {
    for (const order of orders) {
      await pool.query(
        'UPDATE customer_orders SET data = ? WHERE id = ?',
        [JSON.stringify(order), order.id]
      );
    }
    response.json({ saved: true });
  } catch (error) {
    next(error);
  }
});

app.post('/api/quotes', requireDatabase, limitPublicSubmissions, async (request, response, next) => {
  const quote = request.body;
  if (!isRecord(quote) ||
      !isNonEmptyString(quote.customerName, 120) ||
      !isNonEmptyString(quote.storeName, 160) ||
      !isNonEmptyString(quote.whatsapp, 30) ||
      !isNonEmptyString(quote.city, 160) ||
      !isNonEmptyString(quote.area, 100) ||
      !isNonEmptyString(quote.storeType, 160) ||
      !Array.isArray(quote.fixtures) ||
      quote.fixtures.length < 1 ||
      quote.fixtures.length > 20) {
    return response.status(400).json({ error: 'Quote request details are incomplete or invalid.' });
  }

  try {
    const id = randomBytes(16).toString('hex');
    const quoteNo = `QT-${new Date().getFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`;
    const savedQuote = {
      ...quote,
      id,
      quoteNo,
      date: new Date().toISOString(),
      status: 'Pending Review',
      notes: typeof quote.notes === 'string' ? quote.notes.slice(0, 4000) : '',
    };
    await pool.query('INSERT INTO customer_quotes (id, data) VALUES (?, ?)', [id, JSON.stringify(savedQuote)]);
    response.status(201).json({ quote: savedQuote });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/quotes', requireDatabase, requireAdmin, async (_request, response, next) => {
  try {
    const [rows] = await pool.query('SELECT data FROM customer_quotes ORDER BY created_at DESC');
    response.json({ quotes: rows.map((row) => row.data) });
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/quotes', requireDatabase, requireSameOrigin, requireAdmin, async (request, response, next) => {
  const quotes = request.body?.quotes;
  if (!Array.isArray(quotes) || quotes.length > 10000 ||
      !quotes.every((quote) => isRecord(quote) && isNonEmptyString(quote.id, 64))) {
    return response.status(400).json({ error: 'Quotes must be an array of saved quote records.' });
  }
  try {
    for (const quote of quotes) {
      await pool.query(
        'UPDATE customer_quotes SET data = ? WHERE id = ?',
        [JSON.stringify(quote), quote.id]
      );
    }
    response.json({ saved: true });
  } catch (error) {
    next(error);
  }
});

app.put('/api/catalog', requireDatabase, requireSameOrigin, requireAdmin, async (request, response, next) => {
  const { products, categories } = request.body ?? {};
  if (!Array.isArray(products) || !Array.isArray(categories)) {
    return response.status(400).json({ error: 'Products and categories must both be arrays.' });
  }
  if (products.length > 5000 || categories.length > 500) {
    return response.status(413).json({ error: 'Catalog exceeds the allowed size.' });
  }

  const validRecords = (records) => records.every((record) =>
    record &&
    typeof record.id === 'string' &&
    record.id.length > 0 &&
    record.id.length <= 191 &&
    typeof record === 'object' &&
    !Array.isArray(record)
  );
  if (!validRecords(products) || !validRecords(categories)) {
    return response.status(400).json({ error: 'Every catalog item must be an object with a valid string id.' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    for (const [table, records] of [
      ['catalog_products', products],
      ['catalog_categories', categories],
    ]) {
      if (records.length) {
        await connection.query(
          `INSERT INTO ${table} (id, data) VALUES ? ON DUPLICATE KEY UPDATE data = VALUES(data)`,
          [records.map(({ id, ...data }) => [id, JSON.stringify(data)])]
        );
      }
      if (records.length) {
        await connection.query(
          `DELETE FROM ${table} WHERE id NOT IN (${records.map(() => '?').join(',')})`,
          records.map((record) => record.id)
        );
      } else {
        await connection.query(`DELETE FROM ${table}`);
      }
    }
    await connection.commit();
    response.json({ saved: true });
  } catch (error) {
    if (connection) await connection.rollback();
    next(error);
  } finally {
    connection?.release();
  }
});

app.use('/api', (error, _request, response, _next) => {
  console.error('API request failed:', error);
  response.status(500).json({ error: 'The server could not complete this request.' });
});

app.use('/api', (request, response) => {
  response.status(404).json({ error: `API route not found: ${request.method} ${request.path}` });
});

const buildDirectory = path.join(rootDirectory, 'dist');
if (existsSync(buildDirectory)) {
  app.use(express.static(buildDirectory));
  app.get('*', (_request, response) => response.sendFile(path.join(buildDirectory, 'index.html')));
} else if (!production) {
  app.get('/', (_request, response) => {
    response.status(200).send('All Display API is running. Start Vite on port 3000 for the storefront.');
  });
}

app.listen(port, () => {
  console.log(`All Display API listening on port ${port}`);
});

if (pool) {
  schemaReady = pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(254) NOT NULL UNIQUE,
      avatar_url VARCHAR(2048) NULL,
      role VARCHAR(32) NOT NULL DEFAULT 'user',
      password_hash VARCHAR(255) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX users_role_idx (role)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `).then(() => pool.query(`
    CREATE TABLE IF NOT EXISTS auth_sessions (
      id CHAR(64) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      expires_at BIGINT UNSIGNED NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX auth_sessions_user_id_idx (user_id),
      INDEX auth_sessions_expires_at_idx (expires_at)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `)).then(() => pool.query(`
    CREATE TABLE IF NOT EXISTS catalog_products (
      id VARCHAR(191) PRIMARY KEY,
      data JSON NOT NULL
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `)).then(() => pool.query(`
    CREATE TABLE IF NOT EXISTS catalog_categories (
      id VARCHAR(191) PRIMARY KEY,
      data JSON NOT NULL
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `)).then(() => pool.query(`
    CREATE TABLE IF NOT EXISTS business_settings (
      id TINYINT UNSIGNED PRIMARY KEY,
      data JSON NOT NULL
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `)).then(() => pool.query(`
    CREATE TABLE IF NOT EXISTS homepage_banners (
      id TINYINT UNSIGNED PRIMARY KEY,
      data JSON NOT NULL
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `)).then(() => pool.query(`
    CREATE TABLE IF NOT EXISTS customer_orders (
      id VARCHAR(64) PRIMARY KEY,
      data JSON NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX customer_orders_created_at_idx (created_at)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `)).then(() => pool.query(`
    CREATE TABLE IF NOT EXISTS customer_quotes (
      id VARCHAR(64) PRIMARY KEY,
      data JSON NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX customer_quotes_created_at_idx (created_at)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `)).then(() => true).catch((error) => {
    console.error('Could not initialize catalog tables:', error.message);
    return false;
  });
}

setInterval(() => {
  const now = Date.now();
  for (const [address, attempt] of loginAttempts) {
    if (!attempt.blockedUntil || attempt.blockedUntil < now) loginAttempts.delete(address);
  }
}, 10 * 60 * 1000).unref();

setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of submissionAttempts) {
    const recent = timestamps.filter((timestamp) => now - timestamp < 15 * 60 * 1000);
    if (recent.length) submissionAttempts.set(key, recent);
    else submissionAttempts.delete(key);
  }
}, 15 * 60 * 1000).unref();

setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of customerAuthAttempts) {
    const recent = timestamps.filter((timestamp) => now - timestamp < 15 * 60 * 1000);
    if (recent.length) customerAuthAttempts.set(key, recent);
    else customerAuthAttempts.delete(key);
  }
}, 15 * 60 * 1000).unref();

if (pool) {
  setInterval(() => {
    pool.query('DELETE FROM auth_sessions WHERE expires_at <= UNIX_TIMESTAMP()')
      .catch((error) => console.error('Could not clean expired authentication sessions:', error.message));
  }, 60 * 60 * 1000).unref();
}

process.on('SIGTERM', async () => {
  if (pool) await pool.end();
  process.exit(0);
});
