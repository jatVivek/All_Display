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
4. Install packages and start the app:

   ```sh
   npm install
   npm run dev
   ```

   Open `http://localhost:3000`. Vite proxies `/api` requests to Express on port `3001`. Express creates the catalog and business-settings tables automatically at startup; `schema.sql` is also provided if you want to create them manually.
5. Sign into `/admin` with the `ADMIN_PASSWORD` from `.env`.

On the first successful admin sign-in, if the MySQL catalog is empty, the app copies the catalog saved in this browser into MySQL. If this browser has no saved catalog yet, the sample catalog is used. Existing business settings saved in the admin browser are also copied to MySQL if no shared settings exist. Other devices subsequently read the shared catalog and business settings.

In the product editor, choose image files from the device or add an HTTP(S) image URL. Uploaded images are stored under `public/uploads` and their URLs are saved with the product record. Back up this folder along with the MySQL database; database backups alone do not include the image files.

## Deploying

Build the frontend with `npm run build`, then start the app with `NODE_ENV=production npm start`. The same Node process serves the `dist` files and `/api` routes. Configure all environment variables on the hosting provider, including `MYSQL_SSL=true` when required by its managed database. Never expose the MySQL password or session secret to browser code or use a `VITE_` prefix for them.

Deploy Node.js and MySQL on hosting that supports both; a static-only host cannot run the Express API. Use HTTPS in production so the admin session cookie is marked secure.

## Scope

Products, categories, business settings, submitted orders, and submitted custom quotes use shared MySQL storage. Order/quote statuses and order tracking notes are shared as well. The shopping cart stays in the customer’s browser.
