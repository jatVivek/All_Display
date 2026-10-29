# Node.js, Express, and MySQL setup

The Express server serves the catalog API and the built React app from one origin. Admin passwords, session signing keys, and MySQL credentials remain on the server.

## Local development setup

1. Install Node.js 22 or newer and MySQL.
2. Create the database and a restricted application user in MySQL:

   ```sql
   CREATE DATABASE alldisplay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'alldisplay'@'localhost' IDENTIFIED BY 'USE_A_LONG_RANDOM_DATABASE_PASSWORD';
   GRANT SELECT, INSERT, UPDATE, DELETE, CREATE ON alldisplay.* TO 'alldisplay'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. Copy `.env.example` to `.env` in the project root and set the MySQL connection details. Set `ADMIN_PASSWORD` to a unique password of at least 16 characters and `SESSION_SECRET` to at least 32 random characters. For example, generate the session secret with `openssl rand -hex 32`.

   Customer accounts can sign up and sign in with `POST /api/auth/signup` and `POST /api/auth/login`; their HTTP-only session is checked by `GET /api/auth/session` and required by `POST /api/auth/logout`. POST requests require `X-Auth-Request: 1`. Passwords must be 12–128 characters. The server stores scrypt password hashes and assigns the non-admin `user` role; signup never accepts a role from the request. Sessions are signed and also stored in `auth_sessions`, so logout revokes the server-side session immediately.

   Google sign-in is optional. To enable it, configure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI` in `.env`. In Google Cloud Console, create an OAuth web application and add the exact redirect URI (for local development, `http://localhost:3001/api/auth/google/callback`) as an authorized redirect URI. Set the URI to your public HTTPS callback address in production. Start the authorization-code flow at `GET /api/auth/google`; Google returns to the callback, which exchanges the code and verifies the token audience, issuer, verified email, and nonce. If any Google variable is absent, the endpoint clearly reports that Google sign-in is disabled.
4. Install packages and start the app:

   ```sh
   npm install
   npm run dev
   ```

   Open `http://localhost:3000`. Vite proxies `/api` requests to Express on port `3001`. Express creates the users, auth-sessions, catalog, business-settings, and homepage-banner tables automatically at startup; `schema.sql` is also provided if you want to create them manually.
5. Sign into `/admin` with the `ADMIN_PASSWORD` from `.env`.

On first use, the server seeds the sample catalog into MySQL only when both catalog tables are empty. It records that initialization in `catalog_state`; after that, the shared catalog is authoritative, including when products or categories are intentionally empty. It will not refill a catalog from local or bundled sample data after an admin deletes items. Existing business settings saved in the admin browser are copied to MySQL if no shared settings exist. Other devices subsequently read the shared catalog and business settings.

In the product editor, choose image files from the device or add an HTTP(S) image URL. Product videos can also be uploaded (MP4, WebM, or MOV, up to 50 MB) or linked by URL. Uploaded media is stored under `public/uploads` and its URL is saved with the product record. Back up this folder along with the MySQL database; database backups alone do not include uploaded images or videos.

## Deploying

Build the frontend with `npm run build`, then start the app with `NODE_ENV=production npm start`. The same Node process serves the `dist` files and `/api` routes. For Vercel, provision a managed MySQL-compatible database (for example TiDB Cloud, PlanetScale, Railway, Aiven, or AWS RDS), then add its connection URI as the server-only `DATABASE_URL` project environment variable for Production and redeploy. Also configure a unique `ADMIN_PASSWORD` of at least 16 characters and a random `SESSION_SECRET` of at least 32 characters.

The API reports an unhealthy status and rejects operations that would otherwise be saved only to ephemeral serverless memory when durable storage or strong admin secrets are missing. Deploy Node.js and MySQL on hosting that supports both; a static-only host cannot run the Express API. Configure `MYSQL_SSL=true` when required by the managed database and use HTTPS in production so the admin session cookie is marked secure. Never expose the MySQL password or session secret to browser code or use a `VITE_` prefix for them.

## Scope

Customer accounts, products, categories, business settings, homepage banners and deal-of-the-day product selections, submitted orders, and submitted custom quotes use shared MySQL storage. Customer records contain a normalized id, name, email, avatar URL, role, and creation timestamp; credentials are stored separately as a scrypt hash. Homepage banners can be added and linked to categories or products from the Homepage Banners section in `/admin`; each banner can also have separate desktop and mobile images. Admins can choose which products appear in the storefront’s Deal of the Day section. Order/quote statuses and order tracking notes are shared as well. The shopping cart stays in the customer’s browser.
