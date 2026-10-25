import 'dotenv/config';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import multer from 'multer';
import mysql from 'mysql2/promise';

const app = express();
const port = Number(process.env.PORT || 3001);
const production = process.env.NODE_ENV === 'production';
const sessionCookie = 'alldisplay_admin_session';
const sessionTtlSeconds = 8 * 60 * 60;
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

const loginAttempts = new Map();
const submissionAttempts = new Map();

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
    CREATE TABLE IF NOT EXISTS catalog_products (
      id VARCHAR(191) PRIMARY KEY,
      data JSON NOT NULL
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `).then(() => pool.query(`
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

process.on('SIGTERM', async () => {
  if (pool) await pool.end();
  process.exit(0);
});
