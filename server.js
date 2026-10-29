import 'dotenv/config';
import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import multer from 'multer';
import mysql from 'mysql2/promise';

const app = express();
const port = Number(process.env.PORT || 3001);
const production = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
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
const uploadDirectory = process.env.VERCEL ? '/tmp/uploads' : path.join(rootDirectory, 'public', 'uploads');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (production ? '' : 'Admin123456');
const SESSION_SECRET = process.env.SESSION_SECRET || (production ? '' : 'b5bc5ae7de4729b601e432c196e061e4bdb13f514ee5aa991160d10e2ce207b4');

// Live Database Configuration (URI Connection String & Cloud Environment Variables)
function getDatabaseConfig() {
  const uri = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.JAWSDB_URL || process.env.CLEARDB_DATABASE_URL;
  let host = process.env.MYSQL_HOST || process.env.DB_HOST || '';
  let port = Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306);
  let user = process.env.MYSQL_USER || process.env.DB_USER || '';
  let password = process.env.MYSQL_PASSWORD ?? process.env.DB_PASSWORD ?? '';
  let database = process.env.MYSQL_DATABASE || process.env.DB_NAME || '';
  let ssl = undefined;

  if (uri) {
    try {
      const parsedUrl = new URL(uri.replace(/^mysql2:/, 'mysql:'));
      host = parsedUrl.hostname || host;
      port = parsedUrl.port ? Number(parsedUrl.port) : port;
      user = parsedUrl.username ? decodeURIComponent(parsedUrl.username) : user;
      password = parsedUrl.password ? decodeURIComponent(parsedUrl.password) : password;
      const dbPath = parsedUrl.pathname.replace(/^\//, '');
      if (dbPath) database = dbPath;

      const sslQuery = parsedUrl.searchParams.get('ssl') || parsedUrl.searchParams.get('sslmode');
      if (sslQuery) {
        ssl = { rejectUnauthorized: false };
      }
    } catch (e) {
      console.warn('Could not parse database URI string, falling back to individual env variables:', e.message);
    }
  }

  // Handle SSL flag for cloud providers (TiDB Cloud, PlanetScale, AWS RDS, Railway, Aiven, Supabase)
  const sslEnv = (process.env.MYSQL_SSL || process.env.DB_SSL || '').toLowerCase();
  if (sslEnv === 'true' || sslEnv === 'required' || sslEnv === '1' || (!sslEnv && uri && uri.includes('ssl'))) {
    ssl = {
      rejectUnauthorized: process.env.MYSQL_SSL_REJECT_UNAUTHORIZED === 'true',
    };
  } else if (sslEnv === 'false' || sslEnv === '0') {
    ssl = undefined;
  }

  // Custom CA cert support (if provided in base64 or raw PEM string)
  if (process.env.MYSQL_CA_CERT) {
    let ca = process.env.MYSQL_CA_CERT;
    if (ca.startsWith('base64:')) {
      ca = Buffer.from(ca.slice(7), 'base64').toString('utf8');
    }
    ssl = { ca, rejectUnauthorized: true };
  }

  return {
    host,
    port,
    user,
    password,
    database,
    ssl,
    waitForConnections: true,
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT ? Number(process.env.MYSQL_CONNECTION_LIMIT) : (process.env.VERCEL ? 3 : 10),
    queueLimit: 0,
    connectTimeout: 15000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    charset: 'utf8mb4',
  };
}

const dbConfig = getDatabaseConfig();
const mysqlConfigured = Boolean(dbConfig.host && dbConfig.user && dbConfig.database);
let schemaReady = Promise.resolve();
const pool = mysqlConfigured ? mysql.createPool(dbConfig) : null;

app.disable('x-powered-by');

// Live Environment CORS & Security Headers
const allowedOrigins = [
  'https://all-display.vercel.app',
  process.env.SITE_URL,
  process.env.BASE_URL,
  process.env.VITE_BASE_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean);

app.use((request, response, next) => {
  const origin = request.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || !production)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Request, X-Auth-Request, X-Customer-Token, X-Admin-Token');
  }
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', (req, res, next) => {
  const filePath = path.join(uploadDirectory, path.basename(req.path));
  if (existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  return res.redirect('/assets/logo.png');
});

try {
  mkdirSync(uploadDirectory, { recursive: true });
} catch {
  // Read-only filesystem in serverless environments
}

const SEED_USERS = [
  {
    id: "d0fbfac540ac2306cbb183b61e634d95",
    name: "Ganesh Singh",
    email: "ganeshsingh@yopmail.com",
    phone: "9462247004",
    avatar_url: null,
    role: "user",
    created_at: "2026-10-26T08:45:47.000Z",
    password_hash: null,
  },
  {
    id: "93531d58d74d174e69394e6dacf29a7f",
    name: "Meenakshi Jewellers",
    email: "testboutique@alldisplay.com",
    phone: "9876543210",
    avatar_url: null,
    role: "user",
    created_at: "2026-10-27T10:22:45.777Z",
    password_hash: "scrypt$c2cd3cd5ae0cf0797214945c71c36b16$87dd1ca99d46b766518e6c4e1b878b6e9678125fe361a20ccdfa72a0547bf3682ab9df35c9558b6224ff98e752d12ce3042147d9d36d6bb47c4725cee86040fe",
  },
  {
    id: "c18a99478fbe3d2e11894a7391a8c3e2",
    name: "Tribhovandas Heritage Jewellers",
    email: "orders@tribhovandasjewels.in",
    phone: "9820011223",
    avatar_url: null,
    role: "user",
    created_at: "2026-10-29T09:15:00.000Z",
    password_hash: null,
  },
];

const SEED_ORDERS = [
  {
    id: "ord-seed-1001",
    orderNo: "AD-ORD-1001",
    customerName: "Ganesh Singh",
    storeName: "Ganesh Jewellers & Gems",
    customerEmail: "ganeshsingh@yopmail.com",
    whatsapp: "9462247004",
    destination: "Jaipur, Rajasthan",
    pincode: "302003",
    date: "2026-10-26 14:30",
    status: "Delivered",
    trackingNo: "DELHIVERY-98421094",
    items: [
      {
        sku: "AD-FL-001",
        title: "Royal Velvet Necklace Display Bust",
        finish: "Midnight Black Velvet",
        quantity: 12,
        unitPrice: 1250,
        unitLabel: "piece"
      },
      {
        sku: "AD-FL-003",
        title: "Rotating Hexagonal Glass Display Pillar",
        finish: "Champagne Gold Brass",
        quantity: 2,
        unitPrice: 18500,
        unitLabel: "unit"
      }
    ],
    subtotal: 52000,
    discount: 2600,
    gst: 8892,
    total: 58292,
    notes: "Express surface delivery requested for showroom inauguration."
  },
  {
    id: "ord-seed-1002",
    orderNo: "AD-ORD-1002",
    customerName: "Meenakshi Sharma",
    storeName: "Meenakshi Designer Jewellers",
    customerEmail: "testboutique@alldisplay.com",
    whatsapp: "9876543210",
    destination: "Hyderabad, Telangana",
    pincode: "500034",
    date: "2026-10-27 11:15",
    status: "Shipped",
    trackingNo: "BLUEDART-88371902",
    items: [
      {
        sku: "AD-ST-002",
        title: "Tiered Velvet Bangle & Bracelet Organizer",
        finish: "Crimson Red Velvet",
        quantity: 20,
        unitPrice: 850,
        unitLabel: "piece"
      },
      {
        sku: "AD-FL-001",
        title: "Royal Velvet Necklace Display Bust",
        finish: "Emerald Green Velvet",
        quantity: 10,
        unitPrice: 1250,
        unitLabel: "piece"
      }
    ],
    subtotal: 29500,
    discount: 1475,
    gst: 5045,
    total: 33070,
    notes: "Direct courier dispatch from Feel Khana depot."
  },
  {
    id: "ord-seed-1003",
    orderNo: "AD-ORD-1003",
    customerName: "K. Venkatesh",
    storeName: "Venkatesh Jewellers",
    customerEmail: "qa_member_1793204745296@alldisplay.com",
    whatsapp: "9840112233",
    destination: "Chennai, Tamil Nadu",
    pincode: "600017",
    date: "2026-10-28 16:45",
    status: "New (Awaiting WhatsApp)",
    items: [
      {
        sku: "AD-RC-001",
        title: "Heavy-Duty Stainless Steel Display Rack",
        finish: "Brushed Titanium Silver",
        quantity: 4,
        unitPrice: 14200,
        unitLabel: "unit"
      },
      {
        sku: "AD-FL-002",
        title: "Modular Ring Showcase Podium",
        finish: "Midnight Black Velvet",
        quantity: 15,
        unitPrice: 1450,
        unitLabel: "set"
      }
    ],
    subtotal: 78550,
    discount: 3928,
    gst: 13432,
    total: 88054,
    notes: "Confirmed proforma requirement for festival counter redesign."
  },
  {
    id: "ord-seed-1004",
    orderNo: "AD-ORD-1004",
    customerName: "Rajesh Tribhovandas",
    storeName: "Tribhovandas Heritage Jewellers",
    customerEmail: "orders@tribhovandasjewels.in",
    whatsapp: "9820011223",
    destination: "Zaveri Bazaar, Mumbai, Maharashtra",
    pincode: "400002",
    date: "2026-10-29 09:20",
    status: "Payment pending",
    items: [
      {
        sku: "AD-FL-001",
        title: "Royal Velvet Necklace Display Bust",
        finish: "Royal Ivory Velvet",
        quantity: 24,
        unitPrice: 1250,
        unitLabel: "piece"
      }
    ],
    subtotal: 30000,
    discount: 1500,
    gst: 5130,
    total: 33630,
    notes: "Awaiting NEFT / RTGS transfer confirmation."
  }
];

// Standalone in-memory fallback store when cloud MySQL is not yet configured or connecting
const memoryStore = {
  settings: null,
  banners: null,
  dealProductIds: [],
  products: [],
  categories: [],
  orders: [...SEED_ORDERS],
  quotes: [],
  users: [...SEED_USERS],
  sessions: new Map(),
  catalogCleared: false,
};

function isBannedProduct(p) {
  if (!p || typeof p !== 'object' || typeof p.id !== 'string') return true;
  if (p.id.startsWith('vp-') || p.id.startsWith('prod-test-')) return true;
  if (p.code === 'AD-VS-450') return true;
  if (typeof p.title === 'string' && p.title.toLowerCase().includes('royal emerald suede portrait necklace bust')) return true;
  return false;
}

function isBannedCategory(c) {
  if (!c || typeof c !== 'object' || typeof c.id !== 'string') return true;
  if (c.id.startsWith('cat-test-') || c.id === 'cat-necklaces' || c.id === 'cat-portrait-busts' || c.id === 'cat-suede-busts') return true;
  return false;
}

const catalogDiskCachePath = path.join(uploadDirectory, 'catalog_cache.json');
const catalogSeedPath = path.join(rootDirectory, 'public', 'uploads', 'catalog_cache.json');
function loadDiskCatalog() {
  try {
    const targetPath = existsSync(catalogDiskCachePath) ? catalogDiskCachePath : (existsSync(catalogSeedPath) ? catalogSeedPath : null);
    if (targetPath) {
      const raw = readFileSync(targetPath, 'utf-8');
      const data = JSON.parse(raw);
      if (data?.catalogCleared === true && (!Array.isArray(data?.products) || data.products.length === 0) && (!Array.isArray(data?.categories) || data.categories.length === 0)) {
        memoryStore.products = [];
        memoryStore.categories = [];
        memoryStore.catalogCleared = true;
        return;
      }
      if (Array.isArray(data?.products)) {
        memoryStore.products = data.products.filter(p => !isBannedProduct(p));
      }
      if (Array.isArray(data?.categories)) {
        memoryStore.categories = data.categories.filter(c => !isBannedCategory(c));
      }
      memoryStore.catalogCleared = Boolean(data?.catalogCleared);
    }
  } catch {}
}
function saveDiskCatalog() {
  try {
    const payload = JSON.stringify({
      products: memoryStore.products,
      categories: memoryStore.categories,
      catalogCleared: memoryStore.catalogCleared === true,
    }, null, 2);
    writeFileSync(catalogDiskCachePath, payload);
    if (catalogSeedPath !== catalogDiskCachePath) {
      try { writeFileSync(catalogSeedPath, payload); } catch {}
    }
  } catch {}
}
loadDiskCatalog();

const usersDiskCachePath = path.join(uploadDirectory, 'users_cache.json');
const usersSeedPath = path.join(rootDirectory, 'public', 'uploads', 'users_cache.json');
function loadDiskUsers() {
  try {
    const targetPath = existsSync(usersDiskCachePath) ? usersDiskCachePath : (existsSync(usersSeedPath) ? usersSeedPath : null);
    if (targetPath) {
      const raw = readFileSync(targetPath, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data) && data.length > 0) {
        const existingIds = new Set(memoryStore.users.map((u) => u.id));
        const existingEmails = new Set(memoryStore.users.map((u) => u.email.toLowerCase()));
        for (const user of data) {
          if (user && user.id && user.email) {
            const emailLower = user.email.toLowerCase();
            if (!existingIds.has(user.id) && !existingEmails.has(emailLower)) {
              memoryStore.users.push(user);
              existingIds.add(user.id);
              existingEmails.add(emailLower);
            }
          }
        }
      }
    }
  } catch {}
  if (memoryStore.users.length === 0) {
    memoryStore.users.push(...SEED_USERS);
  }
}
function saveDiskUsers() {
  try {
    writeFileSync(usersDiskCachePath, JSON.stringify(memoryStore.users));
  } catch {}
}
loadDiskUsers();

const settingsDiskCachePath = path.join(uploadDirectory, 'settings_cache.json');
const settingsSeedPath = path.join(rootDirectory, 'public', 'uploads', 'settings_cache.json');
function loadDiskSettings() {
  try {
    const targetPath = existsSync(settingsDiskCachePath) ? settingsDiskCachePath : (existsSync(settingsSeedPath) ? settingsSeedPath : null);
    if (targetPath) {
      const raw = readFileSync(targetPath, 'utf-8');
      const data = JSON.parse(raw);
      if (data && typeof data === 'object') {
        memoryStore.settings = sanitizeSettingsObject(data);
      }
    }
  } catch {}
}
function saveDiskSettings() {
  try {
    if (memoryStore.settings) {
      writeFileSync(settingsDiskCachePath, JSON.stringify(memoryStore.settings));
    }
  } catch {}
}
loadDiskSettings();

const ordersDiskCachePath = path.join(uploadDirectory, 'orders_cache.json');
const ordersSeedPath = path.join(rootDirectory, 'public', 'uploads', 'orders_cache.json');
function loadDiskOrders() {
  try {
    const targetPath = existsSync(ordersDiskCachePath) ? ordersDiskCachePath : (existsSync(ordersSeedPath) ? ordersSeedPath : null);
    if (targetPath) {
      const raw = readFileSync(targetPath, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data) && data.length > 0) {
        const existingIds = new Set(memoryStore.orders.map((o) => o.id));
        for (const order of data) {
          if (order && order.id && !existingIds.has(order.id)) {
            memoryStore.orders.push(order);
            existingIds.add(order.id);
          }
        }
      }
    }
  } catch {}
  if (memoryStore.orders.length === 0) {
    memoryStore.orders.push(...SEED_ORDERS);
  }
}
function saveDiskOrders() {
  try {
    const payload = JSON.stringify(memoryStore.orders);
    writeFileSync(ordersDiskCachePath, payload);
    if (ordersSeedPath !== ordersDiskCachePath) {
      try { writeFileSync(ordersSeedPath, payload); } catch {}
    }
  } catch {}
}
loadDiskOrders();

const quotesDiskCachePath = path.join(uploadDirectory, 'quotes_cache.json');
function loadDiskQuotes() {
  try {
    if (existsSync(quotesDiskCachePath)) {
      const raw = readFileSync(quotesDiskCachePath, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) memoryStore.quotes = data;
    }
  } catch {}
}
function saveDiskQuotes() {
  try {
    writeFileSync(quotesDiskCachePath, JSON.stringify(memoryStore.quotes));
  } catch {}
}
loadDiskQuotes();

const imageExtensions = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
]);
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
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
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (!videoExtensions.has(file.mimetype)) {
      callback(new Error('Choose an MP4, WebM, or MOV video.'));
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
  const signature = createHmac('sha256', SESSION_SECRET).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function verifySession(token) {
  if (!token || !SESSION_SECRET) return false;
  const [body, signature, extra] = token.split('.');
  if (!body || !signature || extra) return false;

  const expected = createHmac('sha256', SESSION_SECRET).update(body).digest();
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

function readCustomerToken(request) {
  return (
    request.get('x-customer-token') ||
    request.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    readCookie(request, customerSessionCookie) ||
    readCookie(request, 'vinayak_customer_session')
  );
}

function verifyCustomerSession(token) {
  if (!token || !SESSION_SECRET) return null;
  const [body, signature, extra] = token.split('.');
  if (!body || !signature || extra) return null;

  const expected = createHmac('sha256', SESSION_SECRET).update(body).digest();
  let supplied;
  try {
    supplied = Buffer.from(signature, 'base64url');
  } catch {
    return null;
  }
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (
      typeof payload.sub !== 'string' ||
      !/^[a-f0-9]{32}$/.test(payload.sub) ||
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
    phone: row.phone || undefined,
    avatarUrl: row.avatar_url || row.avatarUrl || null,
    role: row.role || 'user',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
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

function loadOptionalCustomer(request, response, next) {
  const token = readCustomerToken(request);
  const session = verifyCustomerSession(token);
  if (!session) {
    request.customer = null;
    return next();
  }
  request.customerSessionId = session.sid || null;

  if (!pool) {
    loadDiskUsers();
    const user = memoryStore.users.find((u) => u.id === session.sub && u.role === 'user');
    if (user) {
      request.customer = publicUser(user);
    } else {
      request.customer = {
        id: session.sub,
        name: session.name || 'Customer',
        email: session.email || '',
        phone: session.phone || undefined,
        avatarUrl: null,
        role: session.role || 'user',
        createdAt: session.iat ? new Date(session.iat * 1000).toISOString() : new Date().toISOString(),
      };
    }
    return next();
  }

  pool.query(
    `SELECT u.id, u.name, u.email, u.phone, u.avatar_url, u.role, u.created_at
     FROM users u
     WHERE u.id = ? AND u.role = 'user'
     LIMIT 1`,
    [session.sub]
  ).then(([rows]) => {
    if (rows.length) {
      request.customer = publicUser(rows[0]);
    } else {
      request.customer = {
        id: session.sub,
        name: session.name || 'Customer',
        email: session.email || '',
        phone: session.phone || undefined,
        avatarUrl: null,
        role: session.role || 'user',
        createdAt: session.iat ? new Date(session.iat * 1000).toISOString() : new Date().toISOString(),
      };
    }
    next();
  }).catch(() => {
    request.customer = {
      id: session.sub,
      name: session.name || 'Customer',
      email: session.email || '',
      phone: session.phone || undefined,
      avatarUrl: null,
      role: session.role || 'user',
      createdAt: session.iat ? new Date(session.iat * 1000).toISOString() : new Date().toISOString(),
    };
    next();
  });
}

function requireCustomer(request, response, next) {
  loadOptionalCustomer(request, response, () => {
    if (!request.customer) {
      return response.status(401).json({ error: 'Customer sign-in required.' });
    }
    next();
  });
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

async function setCustomerSession(response, userId, userObj) {
  const now = Math.floor(Date.now() / 1000);
  const sessionId = randomBytes(32).toString('hex');
  const expiresAt = now + customerSessionTtlSeconds;
  if (pool) {
    try {
      await pool.query(
        'INSERT INTO auth_sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
        [sessionId, userId, expiresAt]
      );
    } catch {}
  }
  memoryStore.sessions.set(sessionId, { userId, expiresAt });
  const token = signSession({
    sub: userId,
    sid: sessionId,
    name: userObj?.name || '',
    email: userObj?.email || '',
    phone: userObj?.phone || '',
    role: 'user',
    iat: now,
    exp: expiresAt,
  });
  const cookieOpts = {
    httpOnly: true,
    secure: production,
    sameSite: 'lax',
    maxAge: customerSessionTtlSeconds * 1000,
    path: '/',
  };
  response.cookie(customerSessionCookie, token, cookieOpts);
  response.cookie('vinayak_customer_session', token, cookieOpts);
  response.setHeader('X-Customer-Token', token);
  return token;
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

async function checkDatabaseReady() {
  if (!pool) return false;
  try {
    const ready = await schemaReady;
    if (ready) return true;
  } catch {}
  try {
    await pool.query('SELECT 1 FROM catalog_products LIMIT 1');
    return true;
  } catch {
    return false;
  }
}

async function requireDatabase(request, response, next) {
  if (!pool) {
    if (production) {
      return response.status(503).json({
        error: 'This operation is unavailable until persistent database storage is configured.',
      });
    }
    return next();
  }
  try {
    const ready = await checkDatabaseReady();
    if (!ready) {
      if (production) {
        return response.status(503).json({
          error: 'This operation is unavailable until persistent database storage is ready.',
        });
      }
      console.warn('MySQL schema initialization pending...');
    }
    next();
  } catch (err) {
    if (production) {
      return response.status(503).json({
        error: 'This operation is unavailable until persistent database storage is ready.',
      });
    }
    console.warn('MySQL check warning, proceeding:', err.message);
    next();
  }
}

function requireAdmin(request, response, next) {
  const token = request.cookies?.[sessionCookie] ?? request.get('cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${sessionCookie}=`) || part.startsWith('vinayak_admin_session='))
    ?.split('=')[1]
    ?? request.get('x-admin-token')
    ?? request.get('authorization')?.replace(/^Bearer\s+/i, '');

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
    return response.status(production ? 503 : 200).json({
      configured: false,
      connected: false,
      mode: 'standalone',
      error: production ? 'Persistent database storage is not configured.' : undefined,
    });
  }

  try {
    if (!await checkDatabaseReady()) throw new Error('MySQL catalog tables are unavailable.');
    await pool.query('SELECT 1');
    response.json({ configured: true, connected: true, mode: 'mysql' });
  } catch {
    response.status(503).json({ configured: true, connected: false, mode: 'standalone', error: 'Could not connect to MySQL.' });
  }
});

app.post('/api/auth/signup', requireAuthRequest, requireDatabase, authLimit, async (request, response, next) => {
  const name = typeof request.body?.name === 'string' ? request.body.name.trim().replace(/\s+/g, ' ') : '';
  const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : '';
  const phone = typeof request.body?.phone === 'string' ? request.body.phone.trim().replace(/[^\d+]/g, '') : '';
  const password = typeof request.body?.password === 'string' ? request.body.password : '';
  if (name.length < 1 || name.length > 120) {
    return response.status(400).json({ error: 'Name must be between 1 and 120 characters.' });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({ error: 'Enter a valid email address.' });
  }
  if (password.length < 6 || password.length > 128) {
    return response.status(400).json({ error: 'Password must be between 6 and 128 characters.' });
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/.test(password)) {
    return response.status(400).json({ error: 'Password must contain at least one uppercase letter, one lowercase letter, and one special character.' });
  }

  try {
    loadDiskUsers();
    const id = randomBytes(16).toString('hex');
    const passwordHash = await hashPassword(password);
    
    // Check if user already exists
    const existing = memoryStore.users.find((u) => u.email === email);
    if (existing) {
      return response.status(409).json({ error: 'An account with this email already exists.' });
    }

    const user = {
      id,
      name,
      email,
      phone: phone || null,
      avatar_url: null,
      role: 'user',
      created_at: new Date().toISOString(),
      password_hash: passwordHash,
    };
    memoryStore.users.push(user);
    saveDiskUsers();

    if (pool) {
      try {
        await pool.query(
          'INSERT INTO users (id, name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
          [id, name, email, phone || null, passwordHash, 'user']
        );
      } catch (err) {
        if (err?.code === 'ER_DUP_ENTRY') {
          return response.status(409).json({ error: 'An account with this email already exists.' });
        }
        if (err?.message?.includes('Unknown column')) {
          await pool.query(
            'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [id, name, email, passwordHash, 'user']
          ).catch((e) => console.warn('MySQL fallback user insert warning:', e.message));
        }
      }
    }

    const token = await setCustomerSession(response, id, user);
    return response.status(201).json({ user: publicUser(user), token });
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
    loadDiskUsers();
    let row = null;
    if (pool) {
      try {
        const [rows] = await pool.query(
          "SELECT id, name, email, phone, avatar_url, role, created_at, password_hash FROM users WHERE email = ? AND role = 'user' LIMIT 1",
          [email]
        );
        if (rows.length) row = rows[0];
      } catch (err) {
        if (err?.message?.includes('Unknown column')) {
          const [rows] = await pool.query(
            "SELECT id, name, email, avatar_url, role, created_at, password_hash FROM users WHERE email = ? AND role = 'user' LIMIT 1",
            [email]
          );
          if (rows.length) row = rows[0];
        }
      }
    }

    if (!row) {
      row = memoryStore.users.find((u) => u.email === email && u.role === 'user');
    }

    const valid = await verifyPassword(password, row?.password_hash || `scrypt$${'0'.repeat(32)}$${'0'.repeat(128)}`);
    if (!row || !row.password_hash || !valid) {
      return response.status(401).json({ error: 'Email or password is incorrect.' });
    }
    const token = await setCustomerSession(response, row.id, row);
    return response.json({ user: publicUser(row), token });
  } catch (error) {
    next(error);
  }
});

app.get('/api/auth/session', loadOptionalCustomer, (request, response) => {
  response.json({ user: request.customer });
});

app.post('/api/auth/logout', requireAuthRequest, async (request, response, next) => {
  try {
    const token = readCustomerToken(request);
    const session = verifyCustomerSession(token);
    if (session?.sid) {
      if (pool) {
        try {
          await pool.query('DELETE FROM auth_sessions WHERE id = ?', [session.sid]);
        } catch {}
      } else {
        memoryStore.sessions.delete(session.sid);
      }
    }
    const cookieOpts = {
      httpOnly: true,
      secure: production,
      sameSite: 'lax',
      path: '/',
    };
    response.clearCookie(customerSessionCookie, cookieOpts);
    response.clearCookie('vinayak_customer_session', cookieOpts);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/change-password', requireAuthRequest, requireCustomer, authLimit, async (request, response, next) => {
  const currentPassword = typeof request.body?.currentPassword === 'string' ? request.body.currentPassword : '';
  const newPassword = typeof request.body?.newPassword === 'string' ? request.body.newPassword : '';
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return response.status(400).json({ error: 'New password must be at least 6 characters.' });
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/.test(newPassword)) {
    return response.status(400).json({ error: 'New password must contain at least one uppercase letter, one lowercase letter, and one special character.' });
  }
  try {
    if (pool) {
      const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ? LIMIT 1', [request.customer.id]);
      if (!rows.length || !await verifyPassword(currentPassword, rows[0].password_hash)) {
        return response.status(401).json({ error: 'Current password is incorrect.' });
      }
      const newHash = await hashPassword(newPassword);
      await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, request.customer.id]);
    } else {
      const user = memoryStore.users.find((u) => u.id === request.customer.id);
      if (!user || !await verifyPassword(currentPassword, user.password_hash)) {
        return response.status(401).json({ error: 'Current password is incorrect.' });
      }
      user.password_hash = await hashPassword(newPassword);
    }
    response.json({ success: true, message: 'Password updated successfully!' });
  } catch (err) {
    next(err);
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

app.post('/api/admin/login', requireSameOrigin, async (request, response) => {
  if (production && (ADMIN_PASSWORD.length < 16 || SESSION_SECRET.length < 32)) {
    return response.status(503).json({
      error: 'Admin sign-in is unavailable until a strong ADMIN_PASSWORD and SESSION_SECRET are configured.',
    });
  }

  const address = request.ip || 'unknown';
  const attempt = loginAttempts.get(address);
  if (attempt && attempt.blockedUntil > Date.now()) {
    return response.status(429).json({ error: 'Too many login attempts. Try again in a few minutes.' });
  }

  const provided = typeof request.body?.password === 'string' ? request.body.password : '';
  const expectedHash1 = createHmac('sha256', 'admin-password-check').update(ADMIN_PASSWORD).digest();
  const providedHash = createHmac('sha256', 'admin-password-check').update(provided).digest();
  const valid = timingSafeEqual(expectedHash1, providedHash);

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
    sameSite: 'lax',
    maxAge: sessionTtlSeconds * 1000,
    path: '/',
  });
  response.json({ role: 'Owner', token });
});

app.get('/api/admin/session', (request, response) => {
  const token = request.cookies?.[sessionCookie] ?? request.get('cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${sessionCookie}=`))
    ?.slice(sessionCookie.length + 1)
    ?? request.get('x-admin-token')
    ?? request.get('authorization')?.replace(/^Bearer\s+/i, '');
  response.json({ role: verifySession(token) ? 'Owner' : null });
});

app.post('/api/admin/logout', requireSameOrigin, (_request, response) => {
  response.clearCookie(sessionCookie, { httpOnly: true, secure: production, sameSite: 'strict', path: '/' });
  response.status(204).end();
});

app.post(
  '/api/admin/uploads',
  requireSameOrigin,
  requireAdmin,
  requireDatabase,
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
    const mime = request.file.mimetype || 'image/webp';
    const base64 = request.file.buffer.toString('base64');
    const dataUrl = `data:${mime};base64,${base64}`;
    response.status(201).json({ url: dataUrl });
  }
);

app.post(
  '/api/admin/video-uploads',
  requireSameOrigin,
  requireAdmin,
  requireDatabase,
  (request, response, next) => {
    videoUpload.single('video')(request, response, (error) => {
      if (error) {
        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
          return response.status(413).json({ error: 'Video must be 25 MB or smaller.' });
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
    const mime = request.file.mimetype || 'video/mp4';
    const base64 = request.file.buffer.toString('base64');
    const dataUrl = `data:${mime};base64,${base64}`;
    response.status(201).json({ url: dataUrl });
  }
);

function sortNewestRecordsFirst(records, idPrefix = 'prod-') {
  if (!Array.isArray(records)) return [];
  return [...records].sort((a, b) => {
    // 1. Explicit sortOrder preserved from client unshift
    const orderA = typeof a.sortOrder === 'number' ? a.sortOrder : 999999;
    const orderB = typeof b.sortOrder === 'number' ? b.sortOrder : 999999;
    if (orderA !== orderB) return orderA - orderB;

    // 2. Newly added items (with createdAt or timestamp in id) appear first
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (typeof a.id === 'string' && a.id.startsWith(idPrefix) ? Number(a.id.replace(idPrefix, '')) || 0 : 0);
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (typeof b.id === 'string' && b.id.startsWith(idPrefix) ? Number(b.id.replace(idPrefix, '')) || 0 : 0);
    if (timeA > 0 || timeB > 0) {
      if (timeA !== timeB) return timeB - timeA;
    }
    return 0;
  });
}

app.get('/api/catalog', async (_request, response, next) => {
  response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.setHeader('Pragma', 'no-cache');
  response.setHeader('Expires', '0');

  if (!pool) {
    if ((!memoryStore.products || memoryStore.products.length < 10 || !memoryStore.products.some(p => p.subCategory)) && memoryStore.catalogCleared !== true) {
      loadDiskCatalog();
    }
    if ((!memoryStore.categories || memoryStore.categories.length < 30) && memoryStore.catalogCleared !== true) {
      loadDiskCatalog();
    }
    const filteredProducts = (memoryStore.products || []).filter(p => !isBannedProduct(p));
    const filteredCategories = (memoryStore.categories || []).filter(c => !isBannedCategory(c));
    return response.json({
      products: sortNewestRecordsFirst(filteredProducts, 'prod-'),
      categories: sortNewestRecordsFirst(filteredCategories, 'cat-'),
      catalogCleared: memoryStore.catalogCleared === true,
    });
  }
  try {
    const [products, categories] = await Promise.all([
      pool.query('SELECT id, data FROM catalog_products'),
      pool.query('SELECT id, data FROM catalog_categories'),
    ]);
    let parsedProducts = products[0].map((row) => {
      let data = row.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch {}
      }
      return { ...data, id: row.id };
    }).filter(p => !isBannedProduct(p));
    let parsedCategories = categories[0].map((row) => {
      let data = row.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch {}
      }
      return { ...data, id: row.id };
    }).filter(c => !isBannedCategory(c));

    // If database was wiped or has less than the catalog seed products, merge and re-seed from disk cache!
    if (parsedProducts.length < 10) {
      if ((!memoryStore.products || memoryStore.products.length === 0) && memoryStore.catalogCleared !== true) {
        loadDiskCatalog();
      }
      if (memoryStore.products && memoryStore.products.length > 0) {
        const seedProducts = memoryStore.products.filter(p => !isBannedProduct(p));
        const dbProductIds = new Set(parsedProducts.map(p => p.id));
        const missingSeed = seedProducts.filter(p => !dbProductIds.has(p.id));
        if (missingSeed.length > 0) {
          parsedProducts = [...parsedProducts, ...missingSeed];
          try {
            const insertPayload = missingSeed.map(({ id, ...data }, index) => [id, JSON.stringify({ ...data, sortOrder: index })]);
            if (insertPayload.length > 0) {
              pool.query('INSERT INTO catalog_products (id, data) VALUES ? ON DUPLICATE KEY UPDATE data = VALUES(data)', [insertPayload]).catch(() => {});
            }
          } catch {}
        }
      }
    }

    // Ensure products in database have subCategory and childCategory fields if missing
    if (parsedProducts.length > 0 && !parsedProducts.some(p => p.subCategory)) {
      if (!memoryStore.products || memoryStore.products.length === 0 || !memoryStore.products.some(p => p.subCategory)) {
        loadDiskCatalog();
      }
      const diskProductMap = new Map((memoryStore.products || []).map(p => [p.id, p]));
      let hasProductUpdates = false;
      parsedProducts = parsedProducts.map(p => {
        const diskP = diskProductMap.get(p.id);
        if (diskP && (!p.subCategory || !p.childCategory)) {
          hasProductUpdates = true;
          return {
            ...p,
            subCategory: p.subCategory || diskP.subCategory,
            childCategory: p.childCategory || diskP.childCategory
          };
        }
        return p;
      });
      if (hasProductUpdates) {
        try {
          const updatePayload = parsedProducts.map(({ id, ...data }, index) => [id, JSON.stringify({ ...data, sortOrder: index })]);
          if (updatePayload.length > 0) {
            pool.query('INSERT INTO catalog_products (id, data) VALUES ? ON DUPLICATE KEY UPDATE data = VALUES(data)', [updatePayload]).catch(() => {});
          }
        } catch {}
      }
    }

    // If database has fewer than the full categories hierarchy (63 categories), merge and re-seed from disk cache!
    if (parsedCategories.length < 30) {
      if (!memoryStore.categories || memoryStore.categories.length < 30) {
        loadDiskCatalog();
      }
      if (memoryStore.categories && memoryStore.categories.length > 0) {
        const seedCategories = memoryStore.categories.filter(c => !isBannedCategory(c));
        const dbCatIds = new Set(parsedCategories.map(c => c.id));
        const missingCats = seedCategories.filter(c => !dbCatIds.has(c.id));
        if (missingCats.length > 0) {
          parsedCategories = [...parsedCategories, ...missingCats];
          try {
            const insertCatPayload = missingCats.map(({ id, ...data }, index) => [id, JSON.stringify({ ...data, sortOrder: index })]);
            if (insertCatPayload.length > 0) {
              pool.query('INSERT INTO catalog_categories (id, data) VALUES ? ON DUPLICATE KEY UPDATE data = VALUES(data)', [insertCatPayload]).catch(() => {});
            }
          } catch {}
        }
      }
    }

    response.json({
      products: sortNewestRecordsFirst(parsedProducts, 'prod-'),
      categories: sortNewestRecordsFirst(parsedCategories, 'cat-'),
      catalogCleared: false,
    });
  } catch (error) {
    next(error);
  }
});

function sanitizeSettingsObject(settings) {
  if (!settings || typeof settings !== 'object') return settings;
  const brand = (settings.brandName || settings.storeName || 'All Display').toString();
  const cleanBrand = brand.replace(/vinayak(\s+packaging)?/gi, 'All Display').trim() || 'All Display';
  settings.storeName = cleanBrand;
  settings.brandName = cleanBrand;

  if (typeof settings.upiId === 'string' && /vinayak/i.test(settings.upiId)) {
    settings.upiId = 'alldisplay@icici';
  }
  if (typeof settings.supportEmail === 'string' && /vinayak/i.test(settings.supportEmail)) {
    settings.supportEmail = 'contact@alldisplay.com';
  }
  if (!settings.logoUrl || typeof settings.logoUrl !== 'string' || settings.logoUrl.startsWith('/uploads/') || settings.logoUrl.includes('vinayak/logo.png') || settings.logoUrl.includes('logo_alldisplay.svg')) {
    settings.logoUrl = '/assets/logo.png';
  }
  if (!settings.siteUrl) {
    settings.siteUrl = 'https://all-display.vercel.app/';
  }
  if (!settings.instagramUrl) {
    settings.instagramUrl = 'https://www.instagram.com/all_display_?cplk=MXNpcGN3cno4MHI0Nw==';
  }
  if (typeof settings.whatsappNumber === 'string') {
    const digits = settings.whatsappNumber.replace(/\D/g, '');
    if (digits.includes('9462247004')) {
      settings.whatsappNumber = '917396127273';
    } else if (digits.length >= 10 && digits.length <= 15) {
      settings.whatsappNumber = digits.length === 10 ? `91${digits}` : digits;
    }
  } else {
    settings.whatsappNumber = '917396127273';
  }
  if (typeof settings.alternateWhatsapp === 'string') {
    const altDigits = settings.alternateWhatsapp.replace(/\D/g, '');
    if (altDigits.includes('9462247004')) {
      settings.alternateWhatsapp = '917396127273';
    } else if (altDigits.length >= 10 && altDigits.length <= 15) {
      settings.alternateWhatsapp = altDigits.length === 10 ? `91${altDigits}` : altDigits;
    }
  } else {
    settings.alternateWhatsapp = settings.whatsappNumber || '917396127273';
  }
  if (!settings.supportPhone || settings.supportPhone.includes('94622')) {
    settings.supportPhone = '+91 73961 27273';
  }
  if (!settings.businessAddress || settings.businessAddress.includes('Sowcarpet') || settings.businessAddress.includes('Perumal Mudali')) {
    settings.businessAddress = '15-8-397, Feel Khana, Hyderabad 500012, Telangana, India';
  }
  if (!settings.showroomAddress || settings.showroomAddress.includes('Sowcarpet') || settings.showroomAddress.includes('Perumal Mudali')) {
    settings.showroomAddress = '15-8-397, Feel Khana, Hyderabad 500012, Telangana, India';
  }
  if (!settings.headerNotice || settings.headerNotice.includes('Sowcarpet')) {
    settings.headerNotice = 'Direct Factory Wholesale • Feel Khana Depot, Hyderabad • Same-Day Dispatch Across India';
  }
  if (!settings.bankName || settings.bankName.includes('Sowcarpet') || settings.bankName.includes('Chennai')) {
    settings.bankName = 'HDFC Bank - Feel Khana Branch, Hyderabad';
  }
  if (!settings.shippingNotes || settings.shippingNotes.includes('Chennai')) {
    settings.shippingNotes = 'Global shipping available. Safe doorstep delivery across India from Hyderabad warehouse.';
  }
  return settings;
}

app.get('/api/settings', async (_request, response, next) => {
  if (!pool) {
    if (!memoryStore.settings) {
      loadDiskSettings();
    }
    let settings = memoryStore.settings;
    if (typeof settings === 'string') {
      try { settings = JSON.parse(settings); } catch {}
    }
    if (settings && typeof settings === 'object') {
      settings = sanitizeSettingsObject(settings);
    }
    return response.json({ settings });
  }
  try {
    const [rows] = await pool.query('SELECT data FROM business_settings WHERE id = 1');
    let settings = rows.length ? rows[0].data : null;
    if (typeof settings === 'string') {
      try { settings = JSON.parse(settings); } catch {}
    }
    if (settings && typeof settings === 'object') {
      settings = sanitizeSettingsObject(settings);
    }
    response.json({ settings });
  } catch (error) {
    next(error);
  }
});

app.get('/api/homepage-banners', async (_request, response, next) => {
  if (!pool) {
    const memoryDeals = Array.isArray(memoryStore.dealProductIds)
      ? memoryStore.dealProductIds.filter((id) => typeof id === 'string' && !id.startsWith('vp-'))
      : [];
    return response.json({
      banners: memoryStore.banners,
      dealProductIds: memoryDeals,
    });
  }
  try {
    const [rows] = await pool.query('SELECT data FROM homepage_banners WHERE id = 1');
    let savedHomepage = rows[0]?.data;
    if (typeof savedHomepage === 'string') {
      try {
        savedHomepage = JSON.parse(savedHomepage);
      } catch {
        savedHomepage = null;
      }
    }
    const banners = Array.isArray(savedHomepage) ? savedHomepage : savedHomepage?.banners ?? null;
    let dealProductIds = Array.isArray(savedHomepage?.dealProductIds)
      ? savedHomepage.dealProductIds.filter((id) => typeof id === 'string' && !id.startsWith('vp-'))
      : [];
    response.json({
      banners,
      dealProductIds,
    });
  } catch (error) {
    next(error);
  }
});

app.put('/api/homepage-banners', requireSameOrigin, requireAdmin, requireDatabase, async (request, response, next) => {
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
    (banner.eyebrow === undefined || typeof banner.eyebrow === 'string') &&
    typeof banner.title === 'string' && banner.title.length > 0 && banner.title.length <= 250 &&
    (banner.subtitle === undefined || typeof banner.subtitle === 'string') &&
    (banner.description === undefined || typeof banner.description === 'string') &&
    typeof banner.image === 'string' && banner.image.length > 0 &&
    (banner.mobileImage === undefined || typeof banner.mobileImage === 'string') &&
    (!banner.linkType || ['category', 'product', 'none'].includes(banner.linkType)) &&
    (banner.linkId === undefined || banner.linkId === null || typeof banner.linkId === 'string')
  );
  if (!validBanners) {
    return response.status(400).json({ error: 'Every banner must include a title and an image.' });
  }

  if (!pool) {
    memoryStore.banners = banners;
    memoryStore.dealProductIds = dealProductIds;
    return response.json({ saved: true });
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

app.put('/api/settings', requireSameOrigin, requireAdmin, requireDatabase, async (request, response, next) => {
  let settings = request.body?.settings;
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
    return response.status(400).json({ error: 'Invalid settings format.' });
  }

  const whatsappDigits = typeof settings.whatsappNumber === 'string'
    ? settings.whatsappNumber.replace(/\D/g, '')
    : '';
  const alternateWhatsappDigits = typeof settings.alternateWhatsapp === 'string'
    ? settings.alternateWhatsapp.replace(/\D/g, '')
    : '';

  if (whatsappDigits && (whatsappDigits.length < 10 || whatsappDigits.length > 15)) {
    return response.status(400).json({ error: 'Enter a valid 10-digit WhatsApp number.' });
  }
  if (alternateWhatsappDigits && (alternateWhatsappDigits.length < 10 || alternateWhatsappDigits.length > 15)) {
    return response.status(400).json({ error: 'Enter a valid 10-digit Alternate WhatsApp number.' });
  }

  settings = sanitizeSettingsObject(settings);

  if (!pool) {
    memoryStore.settings = settings;
    saveDiskSettings();
    return response.json({ saved: true, settings });
  }

  try {
    await pool.query(
      'INSERT INTO business_settings (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)',
      [JSON.stringify(settings)]
    );
    memoryStore.settings = settings;
    saveDiskSettings();
    response.json({ saved: true, settings });
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
    if (!pool) {
      memoryStore.orders.unshift(savedOrder);
      saveDiskOrders();
      return response.status(201).json({ order: savedOrder });
    }
    await pool.query('INSERT INTO customer_orders (id, data) VALUES (?, ?)', [id, JSON.stringify(savedOrder)]);
    memoryStore.orders.unshift(savedOrder);
    saveDiskOrders();
    response.status(201).json({ order: savedOrder });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/orders', requireAdmin, async (_request, response, next) => {
  loadDiskOrders();
  if (!pool) {
    return response.json({ orders: memoryStore.orders });
  }
  try {
    const [rows] = await pool.query('SELECT data FROM customer_orders ORDER BY created_at DESC');
    const dbOrders = rows.map((row) => (typeof row.data === 'string' ? JSON.parse(row.data) : row.data));
    const map = new Map();
    for (const o of memoryStore.orders) if (o && o.id) map.set(o.id, o);
    for (const o of dbOrders) if (o && o.id) map.set(o.id, o);
    const combined = Array.from(map.values()).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    response.json({ orders: combined });
  } catch (error) {
    response.json({ orders: memoryStore.orders });
  }
});

app.put('/api/admin/orders/sync', requireSameOrigin, requireDatabase, async (request, response, next) => {
  try {
    const incoming = request.body?.orders;
    if (!Array.isArray(incoming)) {
      return response.status(400).json({ error: 'Expected an array of order records.' });
    }
    loadDiskOrders();
    const existingIds = new Set(memoryStore.orders.map((o) => o.id));
    let updated = false;
    for (const o of incoming) {
      if (!o || !o.id) continue;
      if (!existingIds.has(o.id)) {
        memoryStore.orders.unshift(o);
        existingIds.add(o.id);
        updated = true;
      }
    }
    if (updated) {
      saveDiskOrders();
    }
    if (pool) {
      try {
        for (const o of incoming) {
          if (!o || !o.id) continue;
          await pool.query(
            'INSERT INTO customer_orders (id, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = ?',
            [o.id, JSON.stringify(o), JSON.stringify(o)]
          );
        }
      } catch (err) {
        console.warn('MySQL customer_orders sync warning:', err.message);
      }
    }
    response.json({ saved: true, count: memoryStore.orders.length });
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/orders', requireSameOrigin, requireAdmin, requireDatabase, async (request, response, next) => {
  const orders = request.body?.orders;
  if (!Array.isArray(orders) || orders.length > 10000 ||
      !orders.every((order) => isRecord(order) && isNonEmptyString(order.id, 64))) {
    return response.status(400).json({ error: 'Orders must be an array of saved order records.' });
  }
  memoryStore.orders = orders;
  saveDiskOrders();
  if (pool) {
    try {
      for (const order of orders) {
        await pool.query(
          'INSERT INTO customer_orders (id, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = ?',
          [order.id, JSON.stringify(order), JSON.stringify(order)]
        );
      }
    } catch (err) {
      console.warn('MySQL customer_orders update warning:', err.message);
    }
  }
  return response.json({ saved: true });
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
    if (!pool) {
      memoryStore.quotes.unshift(savedQuote);
      saveDiskQuotes();
      return response.status(201).json({ quote: savedQuote });
    }
    await pool.query('INSERT INTO customer_quotes (id, data) VALUES (?, ?)', [id, JSON.stringify(savedQuote)]);
    response.status(201).json({ quote: savedQuote });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/quotes', requireAdmin, async (_request, response, next) => {
  if (!pool) {
    loadDiskQuotes();
    return response.json({ quotes: memoryStore.quotes });
  }
  try {
    const [rows] = await pool.query('SELECT data FROM customer_quotes ORDER BY created_at DESC');
    response.json({ quotes: rows.map((row) => row.data) });
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/quotes', requireSameOrigin, requireAdmin, requireDatabase, async (request, response, next) => {
  const quotes = request.body?.quotes;
  if (!Array.isArray(quotes) || quotes.length > 10000 ||
      !quotes.every((quote) => isRecord(quote) && isNonEmptyString(quote.id, 64))) {
    return response.status(400).json({ error: 'Quotes must be an array of saved quote records.' });
  }
  if (!pool) {
    memoryStore.quotes = quotes;
    saveDiskQuotes();
    return response.json({ saved: true });
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

app.get('/api/admin/customers', requireAdmin, async (_request, response, next) => {
  try {
    loadDiskUsers();
    let registeredUsers = [];
    if (pool) {
      try {
        const [rows] = await pool.query(
          "SELECT id, name, email, phone, avatar_url, role, created_at FROM users WHERE role = 'user' ORDER BY created_at DESC"
        );
        registeredUsers = rows.map((r) => {
          const memUser = memoryStore.users.find((u) => u.email.toLowerCase() === r.email.toLowerCase());
          return publicUser({ ...r, phone: r.phone || memUser?.phone || null });
        });
      } catch (err) {
        if (err?.message?.includes('Unknown column')) {
          const [rows] = await pool.query(
            "SELECT id, name, email, avatar_url, role, created_at FROM users WHERE role = 'user' ORDER BY created_at DESC"
          );
          registeredUsers = rows.map((r) => {
            const memUser = memoryStore.users.find((u) => u.email.toLowerCase() === r.email.toLowerCase());
            return publicUser({ ...r, phone: memUser?.phone || null });
          });
        } else {
          console.warn('MySQL customers query fallback to memory:', err.message);
        }
      }
    }

    // Merge in any users recorded in memory or seed cache
    const existingEmails = new Set(registeredUsers.map((u) => u.email.toLowerCase()));
    for (const memUser of memoryStore.users) {
      if (memUser && memUser.email && !existingEmails.has(memUser.email.toLowerCase())) {
        registeredUsers.push(publicUser(memUser));
        existingEmails.add(memUser.email.toLowerCase());
      }
    }

    // Load orders to compute stats per registered user
    loadDiskOrders();
    let orders = memoryStore.orders;
    if (pool) {
      try {
        const [rows] = await pool.query('SELECT data FROM customer_orders');
        const dbOrders = rows.map((r) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
        const map = new Map();
        for (const o of orders) if (o && o.id) map.set(o.id, o);
        for (const o of dbOrders) if (o && o.id) map.set(o.id, o);
        orders = Array.from(map.values());
      } catch {}
    }

    const customers = registeredUsers.map((user) => {
      const userOrders = (orders || []).filter((o) => {
        const emailMatch = Boolean(o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase());
        const userPhoneDigits = user.phone ? user.phone.replace(/\D/g, '') : '';
        const orderPhoneDigits = o.whatsapp ? o.whatsapp.replace(/\D/g, '') : '';
        const phoneMatch = Boolean(userPhoneDigits && orderPhoneDigits && (
          userPhoneDigits.endsWith(orderPhoneDigits.slice(-10)) ||
          orderPhoneDigits.endsWith(userPhoneDigits.slice(-10))
        ));
        const nameMatch = Boolean(o.customerName && user.name && o.customerName.toLowerCase().trim() === user.name.toLowerCase().trim());
        return emailMatch || phoneMatch || nameMatch;
      });

      const totalSpent = userOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const lastOrder = [...userOrders].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())[0];

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        avatarUrl: user.avatarUrl,
        role: user.role,
        createdAt: user.createdAt,
        orderCount: userOrders.length,
        totalSpent,
        lastOrderDate: lastOrder?.date || null,
      };
    });

    response.json({ customers });
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/customers/sync', requireSameOrigin, requireDatabase, async (request, response, next) => {
  try {
    const incoming = request.body?.customers;
    if (!Array.isArray(incoming)) {
      return response.status(400).json({ error: 'Expected an array of customer records.' });
    }
    loadDiskUsers();
    let updated = false;
    for (const c of incoming) {
      if (!c || !c.email) continue;
      const email = c.email.trim().toLowerCase();
      const existing = memoryStore.users.find((u) => u.email === email);
      if (!existing) {
        const newUser = {
          id: c.id || randomBytes(16).toString('hex'),
          name: c.name || 'Customer',
          email,
          phone: c.phone || null,
          avatar_url: c.avatarUrl || null,
          role: 'user',
          created_at: c.createdAt || new Date().toISOString(),
          password_hash: null,
        };
        memoryStore.users.push(newUser);
        updated = true;
      } else {
        if (c.phone && !existing.phone) {
          existing.phone = c.phone;
          updated = true;
        }
        if (c.name && (!existing.name || existing.name === 'Customer')) {
          existing.name = c.name;
          updated = true;
        }
      }
    }
    if (updated) {
      saveDiskUsers();
    }
    response.json({ success: true, count: memoryStore.users.length });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/db-info', requireAdmin, async (_request, response) => {
  response.json({
    configured: mysqlConfigured,
    connected: Boolean(pool),
    host: dbConfig.host || null,
    database: dbConfig.database || null,
    user: dbConfig.user ? `${dbConfig.user.slice(0, 3)}***` : null,
    mode: pool ? 'cloud_mysql' : 'standalone_memory',
  });
});

app.post('/api/admin/test-db', requireSameOrigin, requireAdmin, async (request, response) => {
  const { connectionUrl } = request.body || {};
  let testPool = null;
  try {
    if (connectionUrl) {
      testPool = mysql.createPool({
        uri: connectionUrl,
        waitForConnections: true,
        connectionLimit: 1,
        connectTimeout: 8000,
        ssl: { rejectUnauthorized: false },
      });
      await testPool.query('SELECT 1');
      await testPool.end();
      return response.json({ success: true, message: 'Database connection successful!' });
    }

    if (pool) {
      await pool.query('SELECT 1');
      return response.json({ success: true, message: 'Active server database connection is healthy!' });
    }

    return response.json({
      success: false,
      error: 'No database is currently configured on the server. Add DATABASE_URL to your Vercel project environment variables.',
    });
  } catch (error) {
    if (testPool) {
      try { await testPool.end(); } catch {}
    }
    return response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Database connection test failed.',
    });
  }
});

app.put('/api/catalog', requireSameOrigin, requireAdmin, requireDatabase, async (request, response, next) => {
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

  // Ensure SKU codes are unique across products (never allow repeated SKUs)
  const seenSkus = new Set();
  const uniqueProducts = products
    .filter(p => !isBannedProduct(p))
    .map(p => {
      let code = (p && typeof p.code === 'string' ? p.code.trim().toUpperCase() : '');
      if (!code) {
        code = `AD-${Date.now().toString(36).toUpperCase()}`;
      } else if (seenSkus.has(code)) {
        let suffix = 2;
        while (seenSkus.has(`${code}-${suffix}`)) {
          suffix++;
        }
        code = `${code}-${suffix}`;
      }
      seenSkus.add(code);
      return {
        ...p,
        code
      };
    });

  if (!pool) {
    memoryStore.products = uniqueProducts;
    memoryStore.categories = categories.filter(c => !isBannedCategory(c));
    memoryStore.catalogCleared = Boolean(request.body?.catalogCleared);
    saveDiskCatalog();
    return response.json({ saved: true });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    for (const [table, records] of [
      ['catalog_products', uniqueProducts],
      ['catalog_categories', categories],
    ]) {
      if (records.length) {
        await connection.query(
          `INSERT INTO ${table} (id, data) VALUES ? ON DUPLICATE KEY UPDATE data = VALUES(data)`,
          [records.map(({ id, ...data }, index) => [id, JSON.stringify({ ...data, sortOrder: index })])]
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

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`All Display API listening on port ${port}`);
  });
}

if (pool) {
  schemaReady = pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(254) NOT NULL UNIQUE,
      phone VARCHAR(64) NULL,
      avatar_url VARCHAR(2048) NULL,
      role VARCHAR(32) NOT NULL DEFAULT 'user',
      password_hash VARCHAR(255) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX users_role_idx (role)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `).then(() => pool.query('ALTER TABLE users ADD COLUMN phone VARCHAR(64) NULL').catch(() => {}))
  .then(() => pool.query(`
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

export default app;
