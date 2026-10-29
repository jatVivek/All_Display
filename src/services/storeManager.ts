import { HomepageBanner, Product, CartItem, ProjectReel } from '../types';
import { INITIAL_PRODUCTS, PROJECT_REELS, TOP_SELLING_HOMEPAGE } from '../data/catalog';

type AdminRole = 'Owner' | 'Staff';

export interface AdminOrder {
  id: string;
  orderNo: string;
  customerName: string;
  storeName: string;
  whatsapp: string;
  destination: string;
  pincode: string;
  date: string;
  status: 'New (Awaiting WhatsApp)' | 'Confirmed' | 'Payment pending' | 'Paid' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: {
    sku: string;
    title: string;
    finish: string;
    quantity: number;
    unitPrice: number;
    unitLabel: string;
  }[];
  subtotal: number;
  discount: number;
  gst: number;
  total: number;
  notes: string;
  trackingNo?: string;
  customerEmail?: string;
}

export interface AdminQuote {
  id: string;
  quoteNo: string;
  customerName: string;
  storeName: string;
  whatsapp: string;
  city: string;
  area: string;
  storeType: string;
  notes: string;
  date: string;
  status: 'Pending Review' | 'Priced' | 'Converted to Order';
  fixtures?: string[];
  finish?: string;
  timeline?: string;
  gstin?: string;
  attachmentName?: string | null;
}

export interface AdminCustomer {
  id: string;
  name: string;
  storeName: string;
  whatsapp: string;
  city: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
}

export interface RegisteredCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  orderCount?: number;
  totalSpent?: number;
  lastOrderDate?: string | null;
}

export interface AdminSettings {
  whatsappNumber: string;
  alternateWhatsapp: string;
  upiId: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  minOrderValue: number;
  shippingNotes: string;
  storeName: string;
  brandName?: string;
  businessAddress: string;
  brandTagline?: string;
  logoUrl?: string;
  headerNotice?: string;
  supportEmail?: string;
  supportPhone?: string;
  showroomAddress?: string;
  siteUrl?: string;
  instagramUrl?: string;
  requirementImages?: Record<string, string>;
  updatedAt?: number;
}

export interface AdminCategory {
  id: string;
  name: string;
  description: string;
  image?: string;
  parentId?: string | null; // null for Level 1 Root Category; parent Category ID for Level 2 Sub-Category; parent Sub-Category ID for Level 3 Child Category
  level?: 1 | 2 | 3; // 1 = Category, 2 = Sub-Category, 3 = Child Category
  createdAt?: string;
  sortOrder?: number;
}

export const INITIAL_CATEGORIES: AdminCategory[] = [
  {
    id: 'cat-1',
    name: 'Display Bust',
    description: 'Velvet and leatherette portrait busts for necklaces and bridal sets.',
    image: '/assets/vinayak/cat_bust.png',
    level: 1,
  },
  {
    id: 'cat-2',
    name: 'Display Cards',
    description: 'Earring cards, necklace tags, barcode cards and jewelry packaging.',
    image: '/assets/vinayak/cat_card.png',
    level: 1,
  },
  {
    id: 'cat-3',
    name: 'Display Stand',
    description: 'Tiered wooden & metal stands for earrings, chains and pendants.',
    image: '/assets/vinayak/cat_stand.png',
    level: 1,
  },
  {
    id: 'cat-4',
    name: 'Display Tray',
    description: 'Stackable velvet trays, ring pads, and flat counter showcase inserts.',
    image: '/assets/vinayak/cat_tray.png',
    level: 1,
  },
  {
    id: 'cat-5',
    name: 'Bangle & Bracelet Display Stand',
    description: 'Single and multi-tier cylinders for bangles, watches, and bracelets.',
    image: '/assets/vinayak/cat_stand.png',
    level: 1,
  },
  {
    id: 'cat-6',
    name: 'Storage Box',
    description: 'Velvet gift boxes, organizer chests, and acrylic storage boxes.',
    image: '/assets/vinayak/cat_box.png',
    level: 1,
  },
  {
    id: 'cat-7',
    name: 'Mannequin Stand',
    description: 'Full form mannequin busts, sculpted heads, and torso models.',
    image: '/assets/vinayak/cat_mannequin.png',
    level: 1,
  },
  {
    id: 'cat-8',
    name: 'Packaging Tools',
    description: 'Tape dispensers, clear wonder tapes, barcode sticker rolls, and sealers.',
    image: '/assets/vinayak/cat_bag.png',
    level: 1,
  },
  {
    id: 'cat-9',
    name: 'Jewellery Display Cloth',
    description: 'Seamless suede and velvet counter fabrics for showcase flatlays.',
    image: '/assets/vinayak/prod_suede_velvet.png',
    level: 1,
  },
];

const INITIAL_HOMEPAGE_BANNERS: HomepageBanner[] = [
  {
    id: 'banner-main',
    eyebrow: 'Direct Manufacturer • Feel Khana Depot, Hyderabad',
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
    description: 'Same-day dispatches across Telangana, Andhra Pradesh, and express courier shipping PAN India.',
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

const isLegacyStarterBanner = (banners: HomepageBanner[]) =>
  banners.length === 1 &&
  banners[0].id === 'banner-main' &&
  (banners[0].title.includes('Heavy-Duty Display Racks') || banners[0].title.includes('Heavy-duty racks'));

const STORAGE_KEYS = {
  PRODUCTS: 'alldisplay_store_products_v4',
  CUSTOM_PRODUCTS: 'alldisplay_store_custom_products_v1',
  DELETED_PRODUCT_IDS: 'alldisplay_store_deleted_prod_ids_v1',
  CATALOG_CLEARED: 'alldisplay_store_catalog_cleared_v1',
  CATEGORIES: 'alldisplay_store_categories_v3',
  CUSTOM_CATEGORIES: 'alldisplay_store_custom_categories_v1',
  DELETED_CATEGORY_IDS: 'alldisplay_store_deleted_cat_ids_v1',
  CATEGORIES_CLEARED: 'alldisplay_store_categories_cleared_v1',
  ORDERS: 'alldisplay_store_orders_v3',
  QUOTES: 'alldisplay_store_quotes_v3',
  CUSTOMERS: 'alldisplay_store_customers_v1',
  SETTINGS: 'alldisplay_store_settings_v4',
  HOMEPAGE: 'alldisplay_store_homepage_v3',
  HOMEPAGE_DEALS: 'alldisplay_store_homepage_deals_v3',
  WISHLIST: 'alldisplay_store_wishlist_v3',
};

const DEFAULT_SETTINGS: AdminSettings = {
  whatsappNumber: '917396127273',
  alternateWhatsapp: '917396127273',
  upiId: 'alldisplay@icici',
  bankName: 'HDFC Bank - Feel Khana Branch, Hyderabad',
  accountNo: '50200049210081',
  ifscCode: 'HDFC0000231',
  minOrderValue: 500,
  shippingNotes: 'Global shipping available. Safe doorstep delivery across India from Hyderabad warehouse.',
  storeName: 'All Display',
  brandName: 'All Display',
  businessAddress: '15-8-397, Feel Khana, Hyderabad 500012, Telangana, India',
  showroomAddress: '15-8-397, Feel Khana, Hyderabad 500012, Telangana, India',
  brandTagline: 'Jewellery Display, Trays & Packaging Solutions',
  logoUrl: '/assets/logo.png',
  headerNotice: 'Direct Factory Wholesale • Feel Khana Depot, Hyderabad • Same-Day Dispatch Across India',
  supportEmail: 'contact@alldisplay.com',
  supportPhone: '+91 73961 27273',
  siteUrl: 'https://all-display.vercel.app',
  instagramUrl: 'https://www.instagram.com/all_display_?cplk=MXNpcGN3cno4MHI0Nw==',
};

export const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ord-seed-1001',
    orderNo: 'AD-ORD-1001',
    customerName: 'Ganesh Singh',
    storeName: 'Ganesh Jewellers & Gems',
    customerEmail: 'ganeshsingh@yopmail.com',
    whatsapp: '9462247004',
    destination: 'Jaipur, Rajasthan',
    pincode: '302003',
    date: '2026-10-26 14:30',
    status: 'Delivered',
    trackingNo: 'DELHIVERY-98421094',
    items: [
      {
        sku: 'AD-FL-001',
        title: 'Royal Velvet Necklace Display Bust',
        finish: 'Midnight Black Velvet',
        quantity: 12,
        unitPrice: 1250,
        unitLabel: 'piece',
      },
      {
        sku: 'AD-FL-003',
        title: 'Rotating Hexagonal Glass Display Pillar',
        finish: 'Champagne Gold Brass',
        quantity: 2,
        unitPrice: 18500,
        unitLabel: 'unit',
      },
    ],
    subtotal: 52000,
    discount: 2600,
    gst: 8892,
    total: 58292,
    notes: 'Express surface delivery requested for showroom inauguration.',
  },
  {
    id: 'ord-seed-1002',
    orderNo: 'AD-ORD-1002',
    customerName: 'Meenakshi Sharma',
    storeName: 'Meenakshi Designer Jewellers',
    customerEmail: 'testboutique@alldisplay.com',
    whatsapp: '9876543210',
    destination: 'Hyderabad, Telangana',
    pincode: '500034',
    date: '2026-10-27 11:15',
    status: 'Shipped',
    trackingNo: 'BLUEDART-88371902',
    items: [
      {
        sku: 'AD-ST-002',
        title: 'Tiered Velvet Bangle & Bracelet Organizer',
        finish: 'Crimson Red Velvet',
        quantity: 20,
        unitPrice: 850,
        unitLabel: 'piece',
      },
      {
        sku: 'AD-FL-001',
        title: 'Royal Velvet Necklace Display Bust',
        finish: 'Emerald Green Velvet',
        quantity: 10,
        unitPrice: 1250,
        unitLabel: 'piece',
      },
    ],
    subtotal: 29500,
    discount: 1475,
    gst: 5045,
    total: 33070,
    notes: 'Direct courier dispatch from Feel Khana depot.',
  },
  {
    id: 'ord-seed-1003',
    orderNo: 'AD-ORD-1003',
    customerName: 'K. Venkatesh',
    storeName: 'Venkatesh Jewellers',
    customerEmail: 'qa_member_1793204745296@alldisplay.com',
    whatsapp: '9840112233',
    destination: 'Chennai, Tamil Nadu',
    pincode: '600017',
    date: '2026-10-28 16:45',
    status: 'New (Awaiting WhatsApp)',
    items: [
      {
        sku: 'AD-RC-001',
        title: 'Heavy-Duty Stainless Steel Display Rack',
        finish: 'Brushed Titanium Silver',
        quantity: 4,
        unitPrice: 14200,
        unitLabel: 'unit',
      },
      {
        sku: 'AD-FL-002',
        title: 'Modular Ring Showcase Podium',
        finish: 'Midnight Black Velvet',
        quantity: 15,
        unitPrice: 1450,
        unitLabel: 'set',
      },
    ],
    subtotal: 78550,
    discount: 3928,
    gst: 13432,
    total: 88054,
    notes: 'Confirmed proforma requirement for festival counter redesign.',
  },
  {
    id: 'ord-seed-1004',
    orderNo: 'AD-ORD-1004',
    customerName: 'Rajesh Tribhovandas',
    storeName: 'Tribhovandas Heritage Jewellers',
    customerEmail: 'orders@tribhovandasjewels.in',
    whatsapp: '9820011223',
    destination: 'Zaveri Bazaar, Mumbai, Maharashtra',
    pincode: '400002',
    date: '2026-10-29 09:20',
    status: 'Payment pending',
    items: [
      {
        sku: 'AD-FL-001',
        title: 'Royal Velvet Necklace Display Bust',
        finish: 'Royal Ivory Velvet',
        quantity: 24,
        unitPrice: 1250,
        unitLabel: 'piece',
      },
    ],
    subtotal: 30000,
    discount: 1500,
    gst: 5130,
    total: 33630,
    notes: 'Awaiting NEFT / RTGS transfer confirmation.',
  },
];

export interface CentralStoreState {
  products: Product[];
  categories: AdminCategory[];
  homepageBanners: HomepageBanner[];
  homepageDealProductIds: string[];
  orders: AdminOrder[];
  quotes: AdminQuote[];
  customers: RegisteredCustomer[];
  settings: AdminSettings;
  catalogSyncStatus: 'local' | 'connecting' | 'connected' | 'error';
  catalogSyncError: string | null;
}

type StoreListener = (state: CentralStoreState) => void;

/**
 * Generates an always-new, guaranteed unique SKU code that does not collide
 * with any existing product in the catalog.
 */
export function generateUniqueSku(products: { code?: string }[], prefix?: string): string {
  const existingCodes = new Set(
    (products || [])
      .map(p => (p && typeof p.code === 'string' ? p.code.trim().toUpperCase() : ''))
      .filter(Boolean)
  );

  let hasAdNew = false;
  let maxSeq = 0;

  for (const p of products || []) {
    const c = (p && typeof p.code === 'string' ? p.code.trim().toUpperCase() : '');
    if (c.startsWith('AD-NEW-')) hasAdNew = true;

    // Look for numbers in code (e.g. AD-NEW-001 -> 1, AD-002 -> 2, AD-FS-101 -> 101)
    const matches = c.match(/(\d+)/g);
    if (matches) {
      for (const m of matches) {
        const val = parseInt(m, 10);
        if (!isNaN(val) && val > maxSeq && val < 100000) {
          maxSeq = val;
        }
      }
    }
  }

  const basePrefix = prefix
    ? (prefix.endsWith('-') ? prefix.toUpperCase() : `${prefix.toUpperCase()}-`)
    : (hasAdNew ? 'AD-NEW-' : 'AD-');

  let candidateNum = maxSeq + 1;
  while (true) {
    const padded = String(candidateNum).padStart(3, '0');
    const candidate = `${basePrefix}${padded}`;
    if (!existingCodes.has(candidate.toUpperCase())) {
      return candidate;
    }
    candidateNum++;
  }
}

export function isBannedProductGlobal(p: any): boolean {
  if (!p || typeof p !== 'object' || typeof p.id !== 'string') return true;
  if (p.id.startsWith('vp-') || p.id.startsWith('prod-test-')) return true;
  if (p.code === 'AD-VS-450') return true;
  if (typeof p.title === 'string' && p.title.toLowerCase().includes('royal emerald suede portrait necklace bust')) return true;
  return false;
}

export function isBannedCategoryGlobal(c: any): boolean {
  if (!c || typeof c !== 'object' || typeof c.id !== 'string') return true;
  if (c.id.startsWith('cat-test-') || c.id === 'cat-necklaces' || c.id === 'cat-portrait-busts' || c.id === 'cat-suede-busts') return true;
  return false;
}

export function sanitizeProductGlobal(p: Product): Product {
  if (!p || typeof p !== 'object') return p;
  if (!p.variations || p.variations.length === 0) {
    if (p.finishes) {
      const { finishes: _f, ...rest } = p;
      return rest as Product;
    }
  }
  return p;
}

class CentralStoreService {
  private listeners: Set<StoreListener> = new Set();
  private apiConfigured = false;
  private adminAuthenticated = false;
  private state: CentralStoreState = {
    products: this.loadProducts(),
    categories: this.loadCategories(),
    homepageBanners: this.loadHomepageBanners(),
    homepageDealProductIds: this.loadHomepageDealProductIds(),
    orders: this.loadOrders(),
    quotes: this.loadQuotes(),
    customers: this.loadCustomers(),
    settings: this.loadSettings(),
    catalogSyncStatus: 'connecting',
    catalogSyncError: null,
  };

  constructor() {
    window.addEventListener('storage', this.handleStorageChange);
    void this.refreshCatalog();
    window.setInterval(() => {
      if (this.apiConfigured) {
        void this.loadSharedCatalog();
        void this.loadSharedSettings();
        void this.loadSharedHomepageBanners();
        if (this.adminAuthenticated) void this.loadOperationalData();
      }
    }, 15000);
  }

  private handleStorageChange = (event: StorageEvent) => {
    if (event.storageArea && event.storageArea !== window.localStorage) return;

    if (event.key === null || event.key === STORAGE_KEYS.PRODUCTS || event.key === STORAGE_KEYS.CUSTOM_PRODUCTS) {
      this.state = { ...this.state, products: this.loadProducts() };
    }
    if (event.key === null || event.key === STORAGE_KEYS.CATEGORIES || event.key === STORAGE_KEYS.CUSTOM_CATEGORIES) {
      this.state = { ...this.state, categories: this.loadCategories() };
    }
    if (event.key === null || event.key === STORAGE_KEYS.HOMEPAGE) {
      this.state = { ...this.state, homepageBanners: this.loadHomepageBanners() };
    }
    if (event.key === null || event.key === STORAGE_KEYS.HOMEPAGE_DEALS) {
      this.state = { ...this.state, homepageDealProductIds: this.loadHomepageDealProductIds() };
    }
    if (event.key === null || event.key === STORAGE_KEYS.ORDERS) {
      this.state = { ...this.state, orders: this.loadOrders() };
    }
    if (event.key === null || event.key === STORAGE_KEYS.QUOTES) {
      this.state = { ...this.state, quotes: this.loadQuotes() };
    }
    if (event.key === null || event.key === STORAGE_KEYS.CUSTOMERS) {
      this.state = { ...this.state, customers: this.loadCustomers() };
    }
    if (event.key === null || event.key === STORAGE_KEYS.SETTINGS) {
      this.state = { ...this.state, settings: this.loadSettings() };
    }

    this.notify();
  };

  public sortNewestProductsFirst(list: Product[]): Product[] {
    return [...list].sort((a, b) => {
      const orderA = typeof a.sortOrder === 'number' ? a.sortOrder : 999999;
      const orderB = typeof b.sortOrder === 'number' ? b.sortOrder : 999999;
      if (orderA !== orderB) return orderA - orderB;

      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.id.startsWith('prod-') ? Number(a.id.replace('prod-', '')) || 0 : 0);
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.id.startsWith('prod-') ? Number(b.id.replace('prod-', '')) || 0 : 0);
      if (timeA > 0 || timeB > 0) {
        if (timeA !== timeB) return timeB - timeA;
      }
      return 0;
    });
  }

  public sortNewestCategoriesFirst(list: AdminCategory[]): AdminCategory[] {
    return [...list].sort((a, b) => {
      const orderA = typeof a.sortOrder === 'number' ? a.sortOrder : 999999;
      const orderB = typeof b.sortOrder === 'number' ? b.sortOrder : 999999;
      if (orderA !== orderB) return orderA - orderB;

      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.id.startsWith('cat-') ? Number(a.id.replace('cat-', '')) || 0 : 0);
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.id.startsWith('cat-') ? Number(b.id.replace('cat-', '')) || 0 : 0);
      if (timeA > 0 || timeB > 0) {
        if (timeA !== timeB) return timeB - timeA;
      }
      return 0;
    });
  }

  public isBannedProduct = (p: any): boolean => isBannedProductGlobal(p);

  public isBannedCategory = (c: any): boolean => isBannedCategoryGlobal(c);

  public sanitizeProduct = (p: Product): Product => sanitizeProductGlobal(p);

  /**
   * Generates a guaranteed-new and unique SKU code that does not collide
   * with any existing product in the catalog.
   */
  public generateUniqueSku = (prefix?: string): string => {
    return generateUniqueSku(this.state?.products || [], prefix);
  };

  public loadCustomProducts(): Product[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_PRODUCTS);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed
            .map((p) => sanitizeProductGlobal(p))
            .filter((p) => !isBannedProductGlobal(p));
        }
      }
    } catch {}
    return [];
  }

  public saveCustomProducts(custom: Product[]): void {
    try {
      const sanitized = custom.map((p) => sanitizeProductGlobal(p));
      localStorage.setItem(STORAGE_KEYS.CUSTOM_PRODUCTS, JSON.stringify(sanitized));
    } catch (e) {
      console.warn('Could not persist custom products locally:', e);
    }
  }

  public loadDeletedProductIds(): Set<string> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DELETED_PRODUCT_IDS);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return new Set(parsed);
      }
    } catch {}
    return new Set();
  }

  public saveDeletedProductIds(deleted: Set<string>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DELETED_PRODUCT_IDS, JSON.stringify(Array.from(deleted)));
    } catch {}
  }

  public loadCustomCategories(): AdminCategory[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_CATEGORIES);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed.filter((c) => !isBannedCategoryGlobal(c));
      }
    } catch {}
    return [];
  }

  public saveCustomCategories(custom: AdminCategory[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(custom.filter((c) => !isBannedCategoryGlobal(c))));
    } catch (e) {
      console.warn('Could not persist custom categories locally:', e);
    }
  }

  public loadDeletedCategoryIds(): Set<string> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DELETED_CATEGORY_IDS);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return new Set(parsed);
      }
    } catch {}
    return new Set();
  }

  public saveDeletedCategoryIds(deleted: Set<string>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DELETED_CATEGORY_IDS, JSON.stringify(Array.from(deleted)));
    } catch {}
  }

  private loadProducts(): Product[] {
    const custom = this.loadCustomProducts();
    const deleted = this.loadDeletedProductIds();

    let base: Product[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          base = parsed.filter((p) => !isBannedProductGlobal(p));
        }
      }
    } catch {}

    const map = new Map<string, Product>();
    // Custom added/edited products have highest priority
    custom.forEach((p) => {
      if (!deleted.has(p.id) && !isBannedProductGlobal(p)) {
        map.set(p.id, p);
      }
    });
    base.forEach((p) => {
      if (!map.has(p.id) && !deleted.has(p.id) && !isBannedProductGlobal(p)) {
        map.set(p.id, p);
      }
    });

    if (map.size === 0) {
      INITIAL_PRODUCTS.forEach((p) => {
        if (!deleted.has(p.id) && !isBannedProductGlobal(p)) {
          map.set(p.id, p);
        }
      });
      try {
        localStorage.removeItem(STORAGE_KEYS.CATALOG_CLEARED);
      } catch {}
    }

    return this.sortNewestProductsFirst(Array.from(map.values()));
  }

  private loadCategories(): AdminCategory[] {
    const custom = this.loadCustomCategories();
    const deleted = this.loadDeletedCategoryIds();

    let base: AdminCategory[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          base = parsed.filter((c) => !isBannedCategoryGlobal(c));
        }
      }
    } catch {}

    const map = new Map<string, AdminCategory>();
    custom.forEach((c) => {
      if (!deleted.has(c.id) && !isBannedCategoryGlobal(c)) {
        map.set(c.id, c);
      }
    });
    base.forEach((c) => {
      if (!map.has(c.id) && !deleted.has(c.id) && !isBannedCategoryGlobal(c)) {
        map.set(c.id, c);
      }
    });

    if (map.size === 0) {
      INITIAL_CATEGORIES.forEach((c) => {
        if (!deleted.has(c.id) && !isBannedCategoryGlobal(c)) {
          map.set(c.id, c);
        }
      });
      try {
        localStorage.removeItem(STORAGE_KEYS.CATEGORIES_CLEARED);
      } catch {}
    }

    return this.sortNewestCategoriesFirst(Array.from(map.values()));
  }

  private loadHomepageBanners(): HomepageBanner[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HOMEPAGE);
      if (stored !== null) {
        const banners: HomepageBanner[] = JSON.parse(stored);
        return isLegacyStarterBanner(banners) ? INITIAL_HOMEPAGE_BANNERS : banners;
      }
    } catch {}
    return INITIAL_HOMEPAGE_BANNERS;
  }

  private loadHomepageDealProductIds(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HOMEPAGE_DEALS);
      if (stored !== null) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every((id) => typeof id === 'string')) {
          const cleaned = parsed.filter((id) => !id.startsWith('vp-'));
          return cleaned;
        }
      }
    } catch {}
    return [];
  }

  private loadOrders(): AdminOrder[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ORDERS;
  }

  private loadQuotes(): AdminQuote[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUOTES);
      if (stored !== null) return JSON.parse(stored);
    } catch {}
    return [];
  }

  private loadCustomers(): RegisteredCustomer[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'd0fbfac540ac2306cbb183b61e634d95',
        name: 'Ganesh Singh',
        email: 'ganeshsingh@yopmail.com',
        phone: '9462247004',
        avatarUrl: null,
        role: 'user',
        createdAt: '2026-10-26T08:45:47.000Z',
        orderCount: 1,
        totalSpent: 58292,
        lastOrderDate: '2026-10-26 14:30',
      },
      {
        id: '93531d58d74d174e69394e6dacf29a7f',
        name: 'Meenakshi Jewellers',
        email: 'testboutique@alldisplay.com',
        phone: '9876543210',
        avatarUrl: null,
        role: 'user',
        createdAt: '2026-10-27T10:22:45.777Z',
        orderCount: 1,
        totalSpent: 33070,
        lastOrderDate: '2026-10-27 11:15',
      },
      {
        id: '147fc7d09c65a1ee2fbdf9972ce4a8eb',
        name: 'Venkatesh Jewellers',
        email: 'qa_member_1793204745296@alldisplay.com',
        phone: '9840112233',
        avatarUrl: null,
        role: 'user',
        createdAt: '2026-10-28T16:25:45.379Z',
        orderCount: 1,
        totalSpent: 88054,
        lastOrderDate: '2026-10-28 16:45',
      },
      {
        id: 'c18a99478fbe3d2e11894a7391a8c3e2',
        name: 'Tribhovandas Heritage Jewellers',
        email: 'orders@tribhovandasjewels.in',
        phone: '9820011223',
        avatarUrl: null,
        role: 'user',
        createdAt: '2026-10-29T09:15:00.000Z',
        orderCount: 1,
        totalSpent: 33630,
        lastOrderDate: '2026-10-29 09:20',
      },
    ];
  }

  public sanitizeSettings(raw: any): AdminSettings {
    const fallback = DEFAULT_SETTINGS;
    if (!raw || typeof raw !== 'object') return fallback;

    let brand = raw.brandName || raw.storeName || fallback.brandName;
    if (typeof brand === 'string') {
      brand = brand.replace(/vinayak(\s+packaging)?/gi, 'All Display').trim() || 'All Display';
    } else {
      brand = 'All Display';
    }

    let logo = raw.logoUrl;
    if (!logo || typeof logo !== 'string' || logo.startsWith('/uploads/') || logo.includes('vinayak/logo.png') || logo.includes('logo_alldisplay.svg')) {
      logo = '/assets/logo.png';
    }

    let upiId = raw.upiId || fallback.upiId;
    if (typeof upiId === 'string' && /vinayak/i.test(upiId)) {
      upiId = 'alldisplay@icici';
    }

    let supportEmail = raw.supportEmail || fallback.supportEmail;
    if (typeof supportEmail === 'string' && /vinayak/i.test(supportEmail)) {
      supportEmail = 'contact@alldisplay.com';
    }

    let whatsappNumber = raw.whatsappNumber;
    if (typeof whatsappNumber === 'string') {
      const digits = whatsappNumber.replace(/\D/g, '');
      if (digits.includes('9462247004')) {
        whatsappNumber = fallback.whatsappNumber;
      } else {
        whatsappNumber = digits.length === 10 ? `91${digits}` : (digits || fallback.whatsappNumber);
      }
    } else {
      whatsappNumber = fallback.whatsappNumber;
    }

    let alternateWhatsapp = raw.alternateWhatsapp;
    if (typeof alternateWhatsapp === 'string' && alternateWhatsapp.trim()) {
      const altDigits = alternateWhatsapp.replace(/\D/g, '');
      if (altDigits.includes('9462247004')) {
        alternateWhatsapp = fallback.alternateWhatsapp;
      } else {
        alternateWhatsapp = altDigits.length === 10 ? `91${altDigits}` : (altDigits || whatsappNumber);
      }
    } else {
      alternateWhatsapp = whatsappNumber || fallback.alternateWhatsapp;
    }

    let supportPhone = raw.supportPhone || fallback.supportPhone;
    if (typeof supportPhone === 'string' && supportPhone.includes('94622')) {
      supportPhone = fallback.supportPhone;
    }

    let businessAddress = raw.businessAddress || fallback.businessAddress;
    if (typeof businessAddress === 'string' && (businessAddress.includes('Sowcarpet') || businessAddress.includes('Perumal Mudali'))) {
      businessAddress = fallback.businessAddress;
    }

    let showroomAddress = raw.showroomAddress || fallback.showroomAddress;
    if (typeof showroomAddress === 'string' && (showroomAddress.includes('Sowcarpet') || showroomAddress.includes('Perumal Mudali'))) {
      showroomAddress = fallback.showroomAddress;
    }

    let headerNotice = raw.headerNotice || fallback.headerNotice;
    if (typeof headerNotice === 'string' && headerNotice.includes('Sowcarpet')) {
      headerNotice = fallback.headerNotice;
    }

    let instagramUrl = raw.instagramUrl || fallback.instagramUrl;

    return {
      ...fallback,
      ...raw,
      storeName: brand,
      brandName: brand,
      logoUrl: logo,
      upiId,
      supportEmail,
      whatsappNumber,
      alternateWhatsapp,
      supportPhone,
      businessAddress,
      showroomAddress,
      headerNotice,
      instagramUrl,
      updatedAt: typeof raw.updatedAt === 'number' ? raw.updatedAt : undefined,
    };
  }

  private loadSettings(): AdminSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        return this.sanitizeSettings(parsed);
      }
    } catch {}
    return DEFAULT_SETTINGS;
  }

  public getState(): CentralStoreState {
    return this.state;
  }

  public subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    // Broadcast window events for components using window event listeners
    window.dispatchEvent(new Event('alldisplay_catalog_updated'));
    window.dispatchEvent(new Event('alldisplay_data_updated'));
    // Notify all active state subscribers instantly
    this.listeners.forEach((listener) => listener(this.state));
  }

  private async loadSharedCatalog() {
    try {
      const catalog = await this.apiRequest<{ products: Product[]; categories: AdminCategory[]; catalogCleared?: boolean }>('/api/catalog');
      const customProducts = this.loadCustomProducts();
      const deletedProducts = this.loadDeletedProductIds();
      const customCategories = this.loadCustomCategories();
      const deletedCategories = this.loadDeletedCategoryIds();

      if (catalog && Array.isArray(catalog.products)) {
        // 1. Process categories with full deletedCategories filter
        const rawServerCategories = Array.isArray(catalog.categories) ? catalog.categories : [];
        const cleanServerCategories = rawServerCategories.filter(c => c && !isBannedCategoryGlobal(c) && !deletedCategories.has(c.id));

        const catMap = new Map<string, AdminCategory>();
        customCategories.forEach((c) => {
          if (!deletedCategories.has(c.id) && !isBannedCategoryGlobal(c)) catMap.set(c.id, c);
        });
        cleanServerCategories.forEach((c) => {
          if (!catMap.has(c.id) && !deletedCategories.has(c.id) && !isBannedCategoryGlobal(c)) {
            catMap.set(c.id, c);
          }
        });
        // Include in-memory categories from current session
        this.state.categories.forEach((c) => {
          if (c && !catMap.has(c.id) && !deletedCategories.has(c.id) && !isBannedCategoryGlobal(c)) {
            catMap.set(c.id, c);
          }
        });
        if (catMap.size === 0 && catalog.catalogCleared !== true) {
          INITIAL_CATEGORIES.forEach((c) => {
            if (!deletedCategories.has(c.id) && !isBannedCategoryGlobal(c)) {
              catMap.set(c.id, c);
            }
          });
        }
        const sortedCategories = this.sortNewestCategoriesFirst(Array.from(catMap.values()));

        if (sortedCategories.length === 0) {
          try {
            localStorage.setItem(STORAGE_KEYS.CATEGORIES_CLEARED, '1');
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify([]));
          } catch {}
        } else {
          try {
            localStorage.removeItem(STORAGE_KEYS.CATEGORIES_CLEARED);
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(sortedCategories));
            this.saveCustomCategories(sortedCategories);
          } catch {}
        }

        // If server had categories that were deleted locally, sync server immediately
        const missingOnServerCategories = cleanServerCategories.length < rawServerCategories.length;
        if (missingOnServerCategories && this.adminAuthenticated) {
          void this.persistCatalog();
        }

        // 2. Process products with full deletedProducts filter and customProducts merge
        const rawServerProducts = Array.isArray(catalog.products) ? catalog.products : [];
        const cleanServerProducts = rawServerProducts.filter(p => p && !isBannedProductGlobal(p) && !deletedProducts.has(p.id));

        // Merge server products with local custom products and in-memory products so products NEVER disappear
        const prodMap = new Map<string, Product>();
        customProducts.forEach((p) => {
          if (!deletedProducts.has(p.id) && !isBannedProductGlobal(p)) {
            prodMap.set(p.id, p);
          }
        });
        cleanServerProducts.forEach((p) => {
          if (!prodMap.has(p.id) && !deletedProducts.has(p.id) && !isBannedProductGlobal(p)) {
            prodMap.set(p.id, p);
          }
        });
        // Include in-memory products from current session
        this.state.products.forEach((p) => {
          if (p && !prodMap.has(p.id) && !deletedProducts.has(p.id) && !isBannedProductGlobal(p)) {
            prodMap.set(p.id, p);
          }
        });

        if (prodMap.size === 0 && catalog.catalogCleared !== true) {
          INITIAL_PRODUCTS.forEach((p) => {
            if (!deletedProducts.has(p.id) && !isBannedProductGlobal(p)) {
              prodMap.set(p.id, p);
            }
          });
        }

        const sortedProducts = this.sortNewestProductsFirst(Array.from(prodMap.values()));

        if (sortedProducts.length === 0) {
          try {
            localStorage.setItem(STORAGE_KEYS.CATALOG_CLEARED, '1');
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
          } catch {}
        } else {
          try {
            localStorage.removeItem(STORAGE_KEYS.CATALOG_CLEARED);
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(sortedProducts));
            this.saveCustomProducts(sortedProducts);
          } catch {}
        }

        this.state = {
          ...this.state,
          products: sortedProducts,
          categories: sortedCategories,
          catalogSyncStatus: 'connected',
          catalogSyncError: null,
        };
        this.notify();

        // If server is missing custom items (e.g. cold lambda worker), sync them to server immediately!
        const serverProdIds = new Set(cleanServerProducts.map(p => p.id));
        const missingOnServer = sortedProducts.some(p => !serverProdIds.has(p.id));
        if (missingOnServer && sortedProducts.length > 0) {
          void this.persistCatalog();
        }
      }
    } catch (error) {
      if (this.apiConfigured) {
        this.setCatalogSyncError(error instanceof Error ? error.message : 'Unable to load the shared catalog.');
      }
    }
  }

  private async loadSharedSettings() {
    try {
      const { settings: cloudSettings } = await this.apiRequest<{ settings: AdminSettings | null }>('/api/settings');
      if (cloudSettings && Object.keys(cloudSettings).length > 0) {
        const localSettings = this.state.settings;
        const sanitizedCloud = this.sanitizeSettings(cloudSettings);

        // Conflict resolution: only overwrite local settings if cloud settings are newer!
        const localTime = typeof localSettings.updatedAt === 'number' ? localSettings.updatedAt : 0;
        const cloudTime = typeof sanitizedCloud.updatedAt === 'number' ? sanitizedCloud.updatedAt : 0;

        if (localTime > 0 && cloudTime < localTime) {
          // Local settings are newer than cloud! Push local to cloud instead of letting stale cloud wipe local
          if (this.adminAuthenticated) {
            void this.apiRequest('/api/settings', {
              method: 'PUT',
              headers: { 'X-Admin-Request': '1' },
              body: JSON.stringify({ settings: localSettings }),
            }).catch(() => null);
          }
          return;
        }

        this.state = { ...this.state, settings: sanitizedCloud };
        try {
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(sanitizedCloud));
        } catch {}
        this.notify();
      }
    } catch (error) {
      this.setCatalogSyncError(error instanceof Error ? error.message : 'Unable to load shared business settings.');
    }
  }

  private async loadSharedHomepageBanners() {
    try {
      const { banners, dealProductIds } = await this.apiRequest<{
        banners: HomepageBanner[] | null;
        dealProductIds: string[] | null;
      }>('/api/homepage-banners');
      if (banners && banners.length > 0) {
        const homepageBanners = isLegacyStarterBanner(banners)
          ? (this.state.homepageBanners.length > 0 ? this.state.homepageBanners : INITIAL_HOMEPAGE_BANNERS)
          : banners;
        this.state = { ...this.state, homepageBanners };
        try {
          localStorage.setItem(STORAGE_KEYS.HOMEPAGE, JSON.stringify(homepageBanners));
        } catch {}
      }
      if (Array.isArray(dealProductIds)) {
        const cleanedDeals = dealProductIds.filter((id) => typeof id === 'string' && !id.startsWith('vp-'));
        const finalDeals = cleanedDeals;
        this.state = { ...this.state, homepageDealProductIds: finalDeals };
        try {
          localStorage.setItem(STORAGE_KEYS.HOMEPAGE_DEALS, JSON.stringify(finalDeals));
        } catch {}
      }
      this.notify();
    } catch (error) {
      this.setCatalogSyncError(error instanceof Error ? error.message : 'Unable to load homepage banners.');
    }
  }

  private mergeOrders(localList: AdminOrder[], remoteList: AdminOrder[]): AdminOrder[] {
    const map = new Map<string, AdminOrder>();
    for (const o of (localList || [])) {
      if (o && (o.id || o.orderNo)) {
        map.set(o.id || o.orderNo, o);
      }
    }
    for (const o of (remoteList || [])) {
      if (o && (o.id || o.orderNo)) {
        const key = o.id || o.orderNo;
        const existing = map.get(key);
        map.set(key, {
          ...(existing || {}),
          ...o,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }

  private mergeCustomers(localList: RegisteredCustomer[], remoteList: RegisteredCustomer[]): RegisteredCustomer[] {
    const map = new Map<string, RegisteredCustomer>();
    for (const c of (localList || [])) {
      if (c && c.email) map.set(c.email.toLowerCase(), c);
    }
    for (const c of (remoteList || [])) {
      if (c && c.email) {
        const emailLower = c.email.toLowerCase();
        const existing = map.get(emailLower);
        map.set(emailLower, {
          ...(existing || {}),
          ...c,
          phone: c.phone || existing?.phone || '',
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  private async loadOperationalData() {
    try {
      if (this.state.orders.length > 0) {
        await fetch('/api/admin/orders/sync', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Request': '1',
          },
          body: JSON.stringify({ orders: this.state.orders }),
        }).catch(() => {});
      }
      if (this.state.customers.length > 0) {
        await fetch('/api/admin/customers/sync', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Request': '1',
          },
          body: JSON.stringify({ customers: this.state.customers }),
        }).catch(() => {});
      }

      const [ordersRes, quotesRes, customersRes] = await Promise.all([
        this.apiRequest<{ orders: AdminOrder[] }>('/api/admin/orders').catch(() => ({ orders: this.state.orders })),
        this.apiRequest<{ quotes: AdminQuote[] }>('/api/admin/quotes').catch(() => ({ quotes: this.state.quotes })),
        this.apiRequest<{ customers: RegisteredCustomer[] }>('/api/admin/customers').catch(() => ({ customers: this.state.customers })),
      ]);

      const serverOrders = Array.isArray(ordersRes.orders) ? ordersRes.orders : [];
      const mergedOrders = this.mergeOrders(this.state.orders, serverOrders);

      const serverQuotes = Array.isArray(quotesRes.quotes) ? quotesRes.quotes : [];
      const mergedQuotes = serverQuotes.length > 0 ? serverQuotes : this.state.quotes;

      const serverCustomers = Array.isArray(customersRes.customers) ? customersRes.customers : [];
      const mergedCustomers = this.mergeCustomers(this.state.customers, serverCustomers);

      this.state = {
        ...this.state,
        orders: mergedOrders,
        quotes: mergedQuotes,
        customers: mergedCustomers,
      };
      try {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mergedOrders));
        localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(mergedQuotes));
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(mergedCustomers));
      } catch {}
      this.notify();
    } catch (error) {
      this.setCatalogSyncError(error instanceof Error ? error.message : 'Unable to load operational data.');
    }
  }

  private async refreshCatalog() {
    try {
      const savedToken = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('alldisplay_admin_token') : null)
        || (typeof localStorage !== 'undefined' ? localStorage.getItem('alldisplay_admin_token') : null);
      if (savedToken) {
        this.adminAuthenticated = true;
        void this.getAdminRole();
      }
      const status = await this.apiRequest<{ configured: boolean; connected: boolean; mode?: string }>('/api/health');
      this.apiConfigured = true;
      if (status.connected) {
        this.state = { ...this.state, catalogSyncStatus: 'connected', catalogSyncError: null };
      } else {
        this.state = { ...this.state, catalogSyncStatus: 'local', catalogSyncError: null };
      }
      await Promise.allSettled([
        this.loadSharedCatalog(),
        this.loadSharedSettings(),
        this.loadSharedHomepageBanners(),
      ]);
      this.notify();
    } catch {
      this.apiConfigured = false;
      this.state = { ...this.state, catalogSyncStatus: 'local', catalogSyncError: null };
      this.notify();
    }
  }

  private async apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('alldisplay_admin_token') : null)
      || (typeof localStorage !== 'undefined' ? localStorage.getItem('alldisplay_admin_token') : null);
    const response = await fetch(url, {
      ...options,
      credentials: 'same-origin',
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { 'X-Admin-Token': token } : {}),
        ...options.headers,
      },
    });
    const contentType = response.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
    const isJson = contentType === 'application/json' || contentType?.endsWith('+json') === true;
    if (!response.ok) {
      const result = isJson ? await response.json().catch(() => null) : null;
      throw new Error(result?.error || `Request failed (${response.status}) for ${url}.`);
    }
    if (response.status === 204) return undefined as T;
    if (!isJson) {
      throw new Error(`Expected JSON from ${url}, but received ${contentType || 'an unknown content type'}.`);
    }
    try {
      return await response.json() as T;
    } catch {
      throw new Error(`Invalid JSON response from ${url}.`);
    }
  }

  private setCatalogSyncError(message: string) {
    this.state = {
      ...this.state,
      catalogSyncStatus: 'error',
      catalogSyncError: message,
    };
    this.notify();
  }

  private async persistCatalog(): Promise<boolean> {
    if (!this.apiConfigured) return true;
    try {
      await this.apiRequest('/api/catalog', {
        method: 'PUT',
        headers: { 'X-Admin-Request': '1' },
        body: JSON.stringify({
          products: this.state.products,
          categories: this.state.categories,
          catalogCleared: this.state.products.length === 0,
        }),
      });
      this.state = { ...this.state, catalogSyncStatus: 'connected', catalogSyncError: null };
      this.notify();
      return true;
    } catch (error) {
      this.setCatalogSyncError(error instanceof Error ? error.message : 'Unable to save shared catalog.');
      return false;
    }
  }

  private async migrateLocalCatalogIfCloudIsEmpty() {
    // Never auto-migrate or restore initial/deleted products to the cloud
    return;
  }

  public async signInAdmin(password: string): Promise<AdminRole> {
    const res = await this.apiRequest<{ role: AdminRole; token?: string }>('/api/admin/login', {
      method: 'POST',
      headers: { 'X-Admin-Request': '1' },
      body: JSON.stringify({ password }),
    });
    if (res?.token) {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('alldisplay_admin_token', res.token);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('alldisplay_admin_token', res.token);
      }
    }
    this.apiConfigured = true;
    this.adminAuthenticated = true;
    try {
      await this.migrateLocalCatalogIfCloudIsEmpty();
    } catch (e) {
      console.warn('Catalog migration deferred:', e);
    }
    await Promise.allSettled([
      this.loadSharedCatalog(),
      this.migrateLocalSettingsIfCloudIsEmpty(),
      this.loadSharedHomepageBanners(),
      this.loadOperationalData(),
    ]);
    return res?.role || 'Owner';
  }

  private async migrateLocalSettingsIfCloudIsEmpty() {
    try {
      const { settings } = await this.apiRequest<{ settings: AdminSettings | null }>('/api/settings');
      if (settings && Object.keys(settings).length > 0) {
        const sanitized = this.sanitizeSettings(settings);
        const localTime = typeof this.state.settings.updatedAt === 'number' ? this.state.settings.updatedAt : 0;
        const cloudTime = typeof sanitized.updatedAt === 'number' ? sanitized.updatedAt : 0;

        if (localTime === 0 || cloudTime >= localTime) {
          this.state = { ...this.state, settings: sanitized };
          try {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(sanitized));
          } catch {}
          this.notify();
          return;
        }
      }
      await this.apiRequest('/api/settings', {
        method: 'PUT',
        headers: { 'X-Admin-Request': '1' },
        body: JSON.stringify({ settings: this.state.settings }),
      });
    } catch (e) {
      console.warn('Settings migration deferred:', e);
    }
  }

  public async getAdminRole(): Promise<AdminRole | null> {
    try {
      const session = await this.apiRequest<{ role: AdminRole | null }>('/api/admin/session');
      if (!session.role) return null;
      this.adminAuthenticated = true;
      this.apiConfigured = true;
      try {
        await this.migrateLocalCatalogIfCloudIsEmpty();
      } catch (e) {
        console.warn('Catalog migration deferred:', e);
      }
      await Promise.allSettled([
        this.loadSharedCatalog(),
        this.migrateLocalSettingsIfCloudIsEmpty(),
        this.loadSharedHomepageBanners(),
        this.loadOperationalData(),
      ]);
      return session.role;
    } catch {
      return null;
    }
  }

  public async signOutAdmin() {
    this.adminAuthenticated = false;
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('alldisplay_admin_token');
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('alldisplay_admin_token');
    }
    await this.apiRequest('/api/admin/logout', {
      method: 'POST',
      headers: { 'X-Admin-Request': '1' },
    });
  }

  // Products CRUD
  public getProducts(): Product[] {
    return this.state.products;
  }

  public async saveProducts(products: Product[]): Promise<boolean> {
    if (products.length === 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.CATALOG_CLEARED, '1');
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
        localStorage.removeItem(STORAGE_KEYS.CUSTOM_PRODUCTS);
      } catch {}
      this.state = { ...this.state, products: [] };
      this.notify();
      return this.persistCatalog();
    } else {
      try {
        localStorage.removeItem(STORAGE_KEYS.CATALOG_CLEARED);
      } catch {}
    }

    const sanitized = products
      .map((p) => sanitizeProductGlobal(p))
      .filter((p) => !isBannedProductGlobal(p));
    const sorted = this.sortNewestProductsFirst(sanitized);

    // Enforce SKU code uniqueness across all products (never allow repeated SKUs)
    const seenSkus = new Set<string>();
    const indexed = sorted.map((p, index) => {
      let currentCode = (p.code || '').trim().toUpperCase();
      if (!currentCode) {
        currentCode = generateUniqueSku(sorted);
      } else if (seenSkus.has(currentCode)) {
        // Disambiguate duplicate SKU
        const base = currentCode;
        let suffix = 2;
        while (seenSkus.has(`${base}-${suffix}`)) {
          suffix++;
        }
        currentCode = `${base}-${suffix}`;
      }
      seenSkus.add(currentCode);
      return {
        ...p,
        code: currentCode,
        sortOrder: index,
        createdAt: p.createdAt || (p.id.startsWith('prod-') ? new Date(Number(p.id.replace('prod-', '')) || Date.now()).toISOString() : undefined)
      };
    });

    const deleted = this.loadDeletedProductIds();
    let deletedChanged = false;
    indexed.forEach(p => {
      if (deleted.has(p.id)) {
        deleted.delete(p.id);
        deletedChanged = true;
      }
    });
    if (deletedChanged) {
      this.saveDeletedProductIds(deleted);
    }

    // Identify and persist any custom products safely to dedicated storage key
    const custom = indexed.filter(p => !isBannedProductGlobal(p));
    this.saveCustomProducts(custom);

    this.state = { ...this.state, products: indexed };
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(indexed));
    } catch (e) {
      console.warn('Could not store full catalog in localStorage, custom products preserved safely:', e);
    }
    this.notify();
    return this.persistCatalog();
  }

  public clearProducts(): Promise<boolean> {
    const allIds = new Set(this.state.products.map(p => p.id));
    const deleted = this.loadDeletedProductIds();
    allIds.forEach(id => deleted.add(id));
    this.saveDeletedProductIds(deleted);
    return this.saveProducts([]);
  }

  public async restoreDefaultCatalog(): Promise<boolean> {
    try {
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_PRODUCTS);
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.DELETED_PRODUCT_IDS);
      localStorage.removeItem(STORAGE_KEYS.DELETED_CATEGORY_IDS);
      localStorage.removeItem(STORAGE_KEYS.CATALOG_CLEARED);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES_CLEARED);
    } catch {}
    this.state = {
      ...this.state,
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
    };
    const prodSaved = await this.saveProducts(INITIAL_PRODUCTS);
    const catSaved = await this.saveCategories(INITIAL_CATEGORIES);
    this.notify();
    return prodSaved && catSaved;
  }

  public deleteProduct(id: string): Promise<boolean> {
    const custom = this.loadCustomProducts().filter(p => p.id !== id);
    this.saveCustomProducts(custom);

    const deleted = this.loadDeletedProductIds();
    deleted.add(id);
    this.saveDeletedProductIds(deleted);

    const updated = this.state.products.filter(p => p.id !== id);
    return this.saveProducts(updated);
  }

  // Categories CRUD
  public getCategories(): AdminCategory[] {
    return this.state.categories;
  }

  public getHomepageBanners(): HomepageBanner[] {
    return this.state.homepageBanners;
  }

  public getHomepageDealProductIds(): string[] {
    return this.state.homepageDealProductIds;
  }

  public async saveHomepageBanners(banners: HomepageBanner[], dealProductIds = this.state.homepageDealProductIds): Promise<boolean> {
    const cleanedDeals = Array.isArray(dealProductIds)
      ? dealProductIds.filter((id) => typeof id === 'string' && !id.startsWith('vp-'))
      : this.state.homepageDealProductIds;

    // 1. Immediately persist locally so admin edits are never reverted or lost
    this.state = { ...this.state, homepageBanners: banners, homepageDealProductIds: cleanedDeals };
    try {
      localStorage.setItem(STORAGE_KEYS.HOMEPAGE, JSON.stringify(banners));
      localStorage.setItem(STORAGE_KEYS.HOMEPAGE_DEALS, JSON.stringify(cleanedDeals));
    } catch (error) {
      console.error('Could not save homepage banners locally:', error);
    }
    window.dispatchEvent(new CustomEvent('alldisplay_deals_updated', { detail: { dealProductIds: cleanedDeals } }));
    window.dispatchEvent(new CustomEvent('alldisplay_data_updated'));
    this.notify();

    // 2. Sync to cloud API if connected
    if (this.apiConfigured) {
      try {
        await this.apiRequest('/api/homepage-banners', {
          method: 'PUT',
          headers: { 'X-Admin-Request': '1' },
          body: JSON.stringify({ banners, dealProductIds: cleanedDeals }),
        });
        this.state = { ...this.state, catalogSyncStatus: 'connected', catalogSyncError: null };
      } catch (error) {
        console.warn('Could not sync homepage banners to cloud server, preserved locally:', error);
      }
    }
    return true;
  }

  public async saveHomepageDealProductIds(dealProductIds: string[]): Promise<boolean> {
    return this.saveHomepageBanners(this.state.homepageBanners, dealProductIds);
  }

  public async saveCategories(categories: AdminCategory[]): Promise<boolean> {
    if (categories.length === 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES_CLEARED, '1');
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify([]));
        localStorage.removeItem(STORAGE_KEYS.CUSTOM_CATEGORIES);
        const deleted = this.loadDeletedCategoryIds();
        INITIAL_CATEGORIES.forEach(c => deleted.add(c.id));
        this.saveDeletedCategoryIds(deleted);
      } catch {}
      this.state = { ...this.state, categories: [] };
      this.notify();
      return this.persistCatalog();
    } else {
      try {
        localStorage.removeItem(STORAGE_KEYS.CATEGORIES_CLEARED);
      } catch {}
    }

    const sorted = this.sortNewestCategoriesFirst(categories);
    const indexed = sorted.map((c, index) => ({
      ...c,
      sortOrder: index,
      createdAt: c.createdAt || (c.id.startsWith('cat-') ? new Date(Number(c.id.replace('cat-', '')) || Date.now()).toISOString() : undefined)
    }));

    const deleted = this.loadDeletedCategoryIds();
    let deletedChanged = false;
    indexed.forEach(c => {
      if (deleted.has(c.id)) {
        deleted.delete(c.id);
        deletedChanged = true;
      }
    });
    if (deletedChanged) {
      this.saveDeletedCategoryIds(deleted);
    }

    const custom = indexed.filter(c => !isBannedCategoryGlobal(c));
    this.saveCustomCategories(custom);

    this.state = { ...this.state, categories: indexed };
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(indexed));
    } catch (e) {
      console.warn('Could not store categories in localStorage, custom categories preserved safely:', e);
    }
    this.notify();
    return this.persistCatalog();
  }

  public deleteCategory(id: string): Promise<boolean> {
    // Find all descendant categories to cascade delete
    const allCategories = this.state.categories;
    const idsToDelete = new Set<string>([id]);
    
    // Add subcategories of this category
    allCategories.forEach(c => {
      if (c.parentId && idsToDelete.has(c.parentId)) {
        idsToDelete.add(c.id);
      }
    });
    // Add child categories of those subcategories
    allCategories.forEach(c => {
      if (c.parentId && idsToDelete.has(c.parentId)) {
        idsToDelete.add(c.id);
      }
    });

    const custom = this.loadCustomCategories().filter(c => !idsToDelete.has(c.id));
    this.saveCustomCategories(custom);

    const deleted = this.loadDeletedCategoryIds();
    idsToDelete.forEach(deletedId => deleted.add(deletedId));
    this.saveDeletedCategoryIds(deleted);

    const updated = this.state.categories.filter(c => !idsToDelete.has(c.id));
    return this.saveCategories(updated);
  }

  public clearCategories(): Promise<boolean> {
    const allIds = new Set(this.state.categories.map(c => c.id));
    const deleted = this.loadDeletedCategoryIds();
    allIds.forEach(id => deleted.add(id));
    this.saveDeletedCategoryIds(deleted);
    return this.saveCategories([]);
  }

  public getRootCategories(): AdminCategory[] {
    return this.getCategories().filter(c => !c.parentId || (c.level || 1) === 1);
  }

  public getSubCategories(parentCategoryId?: string): AdminCategory[] {
    return this.getCategories().filter(c => {
      const isSub = c.level === 2;
      if (!isSub) return false;
      return parentCategoryId ? c.parentId === parentCategoryId : true;
    });
  }

  public getChildCategories(parentSubCategoryId?: string): AdminCategory[] {
    return this.getCategories().filter(c => {
      const isChild = c.level === 3;
      if (!isChild) return false;
      return parentSubCategoryId ? c.parentId === parentSubCategoryId : true;
    });
  }

  // Wishlist Management
  public getWishlist(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((item: any) => {
          if (typeof item === 'string') {
            return item.startsWith('[object') ? null : item;
          }
          if (item && typeof item === 'object' && typeof item.id === 'string') {
            return item.id;
          }
          return null;
        })
        .filter((id): id is string => Boolean(id));
    } catch {
      return [];
    }
  }

  public isInWishlist(productOrId: string | { id: string }): boolean {
    if (!productOrId) return false;
    const id = typeof productOrId === 'string' ? productOrId : productOrId.id;
    if (!id || typeof id !== 'string') return false;
    return this.getWishlist().includes(id);
  }

  public toggleWishlist(productOrId: string | { id: string }): boolean {
    if (!productOrId) return false;
    const id = typeof productOrId === 'string' ? productOrId : productOrId.id;
    if (!id || typeof id !== 'string') return false;

    const list = this.getWishlist();
    const index = list.indexOf(id);
    let isNowInWishlist = false;
    if (index > -1) {
      list.splice(index, 1);
      isNowInWishlist = false;
    } else {
      list.push(id);
      isNowInWishlist = true;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    } catch {}
    window.dispatchEvent(new CustomEvent('vinayak_wishlist_updated', { detail: { productId: id, isNowInWishlist, list } }));
    window.dispatchEvent(new CustomEvent('alldisplay_wishlist_updated', { detail: { productId: id, isNowInWishlist, list } }));
    this.notify();
    return isNowInWishlist;
  }

  public clearWishlist(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.WISHLIST);
    } catch {}
    window.dispatchEvent(new CustomEvent('vinayak_wishlist_updated', { detail: { list: [] } }));
    window.dispatchEvent(new CustomEvent('alldisplay_wishlist_updated', { detail: { list: [] } }));
    this.notify();
  }

  // Orders
  public getOrders(): AdminOrder[] {
    return this.state.orders;
  }

  public async saveOrders(orders: AdminOrder[]): Promise<boolean> {
    if (this.apiConfigured && this.adminAuthenticated) {
      try {
        await this.apiRequest('/api/admin/orders', {
          method: 'PUT',
          headers: { 'X-Admin-Request': '1' },
          body: JSON.stringify({ orders }),
        });
      } catch (error) {
        this.setCatalogSyncError(error instanceof Error ? error.message : 'Unable to save orders.');
        return false;
      }
    }
    this.state = { ...this.state, orders };
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {}
    this.notify();
    return true;
  }

  public async refreshOrders(): Promise<void> {
    try {
      if (this.state.orders.length > 0) {
        await fetch('/api/admin/orders/sync', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Request': '1',
          },
          body: JSON.stringify({ orders: this.state.orders }),
        }).catch(() => {});
      }
      const res = await this.apiRequest<{ orders: AdminOrder[] }>('/api/admin/orders');
      if (Array.isArray(res.orders)) {
        const merged = this.mergeOrders(this.state.orders, res.orders);
        this.state = { ...this.state, orders: merged };
        try {
          localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(merged));
        } catch {}
        this.notify();
      }
    } catch {}
  }

  public async createOrder(order: Omit<AdminOrder, 'id' | 'orderNo' | 'date' | 'status' | 'subtotal' | 'discount' | 'gst' | 'total'>): Promise<AdminOrder> {
    let savedOrder: AdminOrder;
    try {
      const res = await this.apiRequest<{ order: AdminOrder }>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(order),
      });
      savedOrder = res.order;
    } catch {
      const id = `ord-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      const orderNo = `AD-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const subtotal = order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      const discountRate = subtotal >= 50000 ? 0.15 : subtotal >= 25000 ? 0.1 : 0;
      const discount = Math.round(subtotal * discountRate);
      const gst = Math.round((subtotal - discount) * 0.18);
      savedOrder = {
        ...order,
        id,
        orderNo,
        date: new Date().toISOString(),
        status: 'New (Awaiting WhatsApp)',
        subtotal,
        discount,
        gst,
        total: subtotal - discount + gst,
        notes: order.notes || '',
      };
    }
    const updatedOrders = [savedOrder, ...this.state.orders.filter((o) => o.id !== savedOrder.id)];
    this.state = { ...this.state, orders: updatedOrders };
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));
    } catch {}
    this.notify();
    return savedOrder;
  }

  // Quotes
  public getQuotes(): AdminQuote[] {
    return this.state.quotes;
  }

  public async saveQuotes(quotes: AdminQuote[]): Promise<boolean> {
    if (this.apiConfigured && this.adminAuthenticated) {
      try {
        await this.apiRequest('/api/admin/quotes', {
          method: 'PUT',
          headers: { 'X-Admin-Request': '1' },
          body: JSON.stringify({ quotes }),
        });
      } catch (error) {
        this.setCatalogSyncError(error instanceof Error ? error.message : 'Unable to save quote requests.');
        return false;
      }
    }
    this.state = { ...this.state, quotes };
    try {
      localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
    } catch {}
    this.notify();
    return true;
  }

  public async createQuote(quote: Omit<AdminQuote, 'id' | 'quoteNo' | 'date' | 'status'>): Promise<AdminQuote> {
    const { quote: savedQuote } = await this.apiRequest<{ quote: AdminQuote }>('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(quote),
    });
    this.state = { ...this.state, quotes: [savedQuote, ...this.state.quotes] };
    this.notify();
    return savedQuote;
  }

  // Customers
  public getRegisteredCustomers(): RegisteredCustomer[] {
    const orders = this.state.orders;
    return this.state.customers.map((user) => {
      const userOrders = orders.filter((o) => {
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

      const totalSpent = userOrders.reduce((sum, o) => sum + (Number(o.total) || 0), user.totalSpent || 0);
      const lastOrder = [...userOrders].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())[0];

      return {
        ...user,
        orderCount: Math.max(userOrders.length, user.orderCount || 0),
        totalSpent,
        lastOrderDate: lastOrder?.date || user.lastOrderDate || null,
      };
    });
  }

  public async saveRegisteredCustomer(
    user: { id: string; name: string; email: string; avatarUrl?: string | null; role?: 'user' | 'admin'; createdAt?: string; phone?: string },
    phone?: string
  ): Promise<boolean> {
    if (!user || !user.email) return false;
    const existingIndex = this.state.customers.findIndex((c) => c.email.toLowerCase() === user.email.toLowerCase());
    const newRecord: RegisteredCustomer = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: phone || user.phone || (existingIndex >= 0 ? this.state.customers[existingIndex].phone : ''),
      avatarUrl: user.avatarUrl || null,
      role: user.role || 'user',
      createdAt: user.createdAt || (existingIndex >= 0 ? this.state.customers[existingIndex].createdAt : new Date().toISOString()),
      orderCount: existingIndex >= 0 ? this.state.customers[existingIndex].orderCount : 0,
      totalSpent: existingIndex >= 0 ? this.state.customers[existingIndex].totalSpent : 0,
    };

    let updatedList: RegisteredCustomer[];
    if (existingIndex >= 0) {
      updatedList = [...this.state.customers];
      updatedList[existingIndex] = { ...updatedList[existingIndex], ...newRecord };
    } else {
      updatedList = [newRecord, ...this.state.customers];
    }

    this.state = { ...this.state, customers: updatedList };
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updatedList));
    } catch {}
    this.notify();

    // Sync to backend
    try {
      await fetch('/api/admin/customers/sync', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Request': '1',
        },
        body: JSON.stringify({ customers: [newRecord] }),
      });
    } catch {}

    return true;
  }

  public async refreshCustomers(): Promise<void> {
    try {
      if (this.state.customers.length > 0) {
        await fetch('/api/admin/customers/sync', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Request': '1',
          },
          body: JSON.stringify({ customers: this.state.customers }),
        }).catch(() => {});
      }
      const res = await this.apiRequest<{ customers: RegisteredCustomer[] }>('/api/admin/customers');
      if (Array.isArray(res.customers)) {
        const merged = this.mergeCustomers(this.state.customers, res.customers);
        this.state = { ...this.state, customers: merged };
        try {
          localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(merged));
        } catch {}
        this.notify();
      }
    } catch (e) {
      console.warn('Could not refresh customers from server:', e);
    }
  }

  // Settings
  public getSettings(): AdminSettings {
    return this.state.settings;
  }

  public async saveSettings(settings: AdminSettings): Promise<boolean> {
    const timestamp = Date.now();
    const sanitized = this.sanitizeSettings({ ...settings, updatedAt: timestamp });

    // 1. Immediately persist locally so admin changes are never lost or reverted
    this.state = { ...this.state, settings: sanitized };
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(sanitized));
    } catch {}
    window.dispatchEvent(new CustomEvent('vinayak_settings_updated', { detail: { settings: sanitized } }));
    window.dispatchEvent(new CustomEvent('alldisplay_settings_updated', { detail: { settings: sanitized } }));
    window.dispatchEvent(new CustomEvent('alldisplay_data_updated', { detail: { settings: sanitized } }));
    this.notify();

    // 2. Sync to cloud API if connected
    if (this.apiConfigured) {
      try {
        await this.apiRequest('/api/settings', {
          method: 'PUT',
          headers: { 'X-Admin-Request': '1' },
          body: JSON.stringify({ settings: sanitized }),
        });
        this.state = { ...this.state, catalogSyncStatus: 'connected', catalogSyncError: null };
      } catch (error) {
        console.warn('Could not sync settings to cloud server, preserved locally:', error);
      }
    }
    return true;
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    return this.apiRequest('/api/auth/change-password', {
      method: 'POST',
      headers: { 'X-Auth-Request': '1' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  public async getDatabaseInfo(): Promise<{
    configured: boolean;
    connected: boolean;
    host: string | null;
    database: string | null;
    user: string | null;
    mode: string;
  }> {
    return this.apiRequest('/api/admin/db-info', {
      headers: { 'X-Admin-Request': '1' },
    });
  }

  public async testDatabaseConnection(connectionUrl?: string): Promise<{ success: boolean; message?: string; error?: string }> {
    return this.apiRequest('/api/admin/test-db', {
      method: 'POST',
      headers: { 'X-Admin-Request': '1' },
      body: JSON.stringify({ connectionUrl }),
    });
  }

  public async resetAllData(): Promise<boolean> {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.HOMEPAGE);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.DELETED_PRODUCT_IDS);
    localStorage.removeItem(STORAGE_KEYS.DELETED_CATEGORY_IDS);
    localStorage.setItem(STORAGE_KEYS.CATALOG_CLEARED, '1');
    this.state = {
      ...this.state,
      settings: DEFAULT_SETTINGS,
      products: [],
      categories: INITIAL_CATEGORIES,
    };
    if (!await this.saveProducts([])) return false;
    if (!await this.saveCategories(INITIAL_CATEGORIES)) return false;
    if (!await this.saveSettings(DEFAULT_SETTINGS)) return false;
    this.state = {
      ...this.state,
      products: [],
      categories: INITIAL_CATEGORIES,
      settings: DEFAULT_SETTINGS,
    };
    this.notify();
    window.location.reload();
    return true;
  }
}

export const storeManager = new CentralStoreService();
