import mysql from 'mysql2/promise';
import { INITIAL_PRODUCTS } from './src/data/catalog.js';

async function seed() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'alldisplay',
    password: '42b9274dce854855f9f798fb4bbca96e121474b6d87a5a52',
    database: 'alldisplay',
  });

  console.log('Connected to MySQL. Updating catalog_products with variations and requirements...');

  await connection.query('DELETE FROM catalog_products;');
  for (const prod of INITIAL_PRODUCTS) {
    await connection.query(
      'INSERT INTO catalog_products (id, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)',
      [prod.id, JSON.stringify(prod)]
    );
  }
  console.log(`Inserted ${INITIAL_PRODUCTS.length} enriched products.`);

  // Update business_settings
  const settings = {
    whatsappNumber: '919462247004',
    alternateWhatsapp: '919462247004',
    upiId: 'alldisplay@icici',
    bankName: 'HDFC Bank - Sowcarpet Branch, Chennai',
    accountNo: '50200049210081',
    ifscCode: 'HDFC0000231',
    minOrderValue: 500,
    shippingNotes: 'Global shipping available. Safe doorstep delivery across India from Chennai warehouse.',
    storeName: 'All Display',
    brandName: 'All Display',
    businessAddress: '29, Perumal Mudali St, Sowcarpet, George Town, Chennai, Tamil Nadu 600001',
    brandTagline: 'Jewellery Display, Trays & Packaging Solutions',
    logoUrl: '/assets/logo_alldisplay.svg',
    headerNotice: 'Direct Factory Wholesale • Sowcarpet Depot, Chennai • Same-Day Dispatch Across India',
    supportEmail: 'contact@alldisplay.com',
    supportPhone: '+91 94622 47004',
  };

  await connection.query(
    'INSERT INTO business_settings (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)',
    [JSON.stringify(settings)]
  );
  console.log('Updated business_settings with dynamic logo, tagline, and contact info.');

  // Update homepage_banners
  const banners = [
    {
      id: 'banner-main',
      eyebrow: 'Direct Manufacturer • Sowcarpet Depot, Chennai',
      title: 'Jewellery Displays & Packaging That Make Every Piece Stand Out',
      subtitle: 'Lightweight, elegant velvet busts, counter trays, and custom printed packaging.',
      description: 'Serving over 5,000+ retail jewellers, boutique owners, and online creators across India with factory-direct rates.',
      image: '/assets/vinayak/shop_banner.png',
      mobileImage: '/assets/vinayak/req_retail_shops.png',
      linkType: 'category',
      linkId: 'cat-1',
    },
    {
      id: 'banner-cards-tools',
      eyebrow: 'Fast Dispatch • High-Speed Packaging Desk',
      title: 'High-Grade Display Cards, Wonder Tapes & Packaging Tools',
      subtitle: 'From barcode dumbbell tags to heavy duty cast iron tape dispensers.',
      description: 'Same-day dispatches across Tamil Nadu and express courier shipping PAN India.',
      image: '/assets/vinayak/deal_left_banner.png',
      mobileImage: '/assets/vinayak/req_online_sellers.png',
      linkType: 'category',
      linkId: 'cat-2',
    },
    {
      id: 'banner-boutique',
      eyebrow: 'Curated Boutique Suites • Velvet & Wood',
      title: 'Transform Your Showroom & Instagram Flatlays',
      subtitle: 'Premium round velvet stacking trays, monstera dishes, and multi-tier earring stands.',
      description: 'Designed specifically for high-conversion counter presentation and catalog social photography.',
      image: '/assets/vinayak/req_instagram_shop.png',
      mobileImage: '/assets/vinayak/req_new_jewellery.png',
      linkType: 'category',
      linkId: 'cat-3',
    },
  ];

  await connection.query(
    'INSERT INTO homepage_banners (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)',
    [JSON.stringify(banners)]
  );
  console.log('Updated homepage_banners with 3 multi-device banners.');

  await connection.end();
}

seed().catch(console.error);
