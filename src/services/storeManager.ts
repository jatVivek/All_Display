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
  requirementImages?: Record<string, string>;
  updatedAt?: number;
}

export interface AdminCategory {
  id: string;
  name: string;
  description: string;
  image?: string;
  createdAt?: string;
  sortOrder?: number;
}

const INITIAL_CATEGORIES: AdminCategory[] = [
  { id: 'cat-1', name: 'Display Bust', description: 'Velvet and leatherette portrait busts for necklaces and bridal sets.', image: '/assets/vinayak/cat_bust.png' },
  { id: 'cat-2', name: 'Display Cards', description: 'Earring cards, necklace tags, barcode cards and jewelry packaging.', image: '/assets/vinayak/cat_card.png' },
  { id: 'cat-3', name: 'Display Stand', description: 'Tiered wooden & metal stands for earrings, chains and pendants.', image: '/assets/vinayak/cat_stand.png' },
  { id: 'cat-4', name: 'Display Tray', description: 'Stackable velvet trays, ring pads, and flat counter showcase inserts.', image: '/assets/vinayak/cat_tray.png' },
  { id: 'cat-5', name: 'Bangle & Bracelet Display Stand', description: 'Single and multi-tier cylinders for bangles, watches, and bracelets.', image: '/assets/vinayak/cat_stand.png' },
  { id: 'cat-6', name: 'Storage Box', description: 'Velvet gift boxes, organizer chests, and acrylic storage boxes.', image: '/assets/vinayak/cat_box.png' },
  { id: 'cat-7', name: 'Mannequin Stand', description: 'Full form mannequin busts, sculpted heads, and torso models.', image: '/assets/vinayak/cat_mannequin.png' },
  { id: 'cat-8', name: 'Packaging Tools', description: 'Tape dispensers, clear wonder tapes, barcode sticker rolls, and sealers.', image: '/assets/vinayak/cat_bag.png' },
  { id: 'cat-9', name: 'Jewellery Display Cloth', description: 'Seamless suede and velvet counter fabrics for showcase flatlays.', image: '/assets/vinayak/prod_suede_velvet.png' },
];

const INITIAL_HOMEPAGE_BANNERS: HomepageBanner[] = [
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

const isLegacyStarterBanner = (banners: HomepageBanner[]) =>
  banners.length === 1 &&
  banners[0].id === 'banner-main' &&
  (banners[0].title.includes('Heavy-Duty Display Racks') || banners[0].title.includes('Heavy-duty racks'));

const STORAGE_KEYS = {
  PRODUCTS: 'alldisplay_store_products_v4',
  CUSTOM_PRODUCTS: 'alldisplay_store_custom_products_v1',
  DELETED_PRODUCT_IDS: 'alldisplay_store_deleted_prod_ids_v1',
  CATEGORIES: 'alldisplay_store_categories_v3',
  CUSTOM_CATEGORIES: 'alldisplay_store_custom_categories_v1',
  DELETED_CATEGORY_IDS: 'alldisplay_store_deleted_cat_ids_v1',
  ORDERS: 'alldisplay_store_orders_v3',
  QUOTES: 'alldisplay_store_quotes_v3',
  SETTINGS: 'alldisplay_store_settings_v4',
  HOMEPAGE: 'alldisplay_store_homepage_v3',
  HOMEPAGE_DEALS: 'alldisplay_store_homepage_deals_v3',
  WISHLIST: 'alldisplay_store_wishlist_v3',
};

const DEFAULT_SETTINGS: AdminSettings = {
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
  showroomAddress: '29, Perumal Mudali St, Sowcarpet, George Town, Chennai, Tamil Nadu 600001',
  brandTagline: 'Jewellery Display, Trays & Packaging Solutions',
  logoUrl: '/assets/logo_alldisplay.svg',
  headerNotice: 'Direct Factory Wholesale • Sowcarpet Depot, Chennai • Same-Day Dispatch Across India',
  supportEmail: 'contact@alldisplay.com',
  supportPhone: '+91 94622 47004',
  siteUrl: 'https://all-display.vercel.app',
};

export interface CentralStoreState {
  products: Product[];
  categories: AdminCategory[];
  homepageBanners: HomepageBanner[];
  homepageDealProductIds: string[];
  orders: AdminOrder[];
  quotes: AdminQuote[];
  settings: AdminSettings;
  catalogSyncStatus: 'local' | 'connecting' | 'connected' | 'error';
  catalogSyncError: string | null;
}

type StoreListener = (state: CentralStoreState) => void;

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
    settings: this.loadSettings(),
    catalogSyncStatus: 'connecting',
    catalogSyncError: null,
  };

  constructor() {
    window.addEventListener('storage', this.handleStorageChange);
    void this.refreshCatalog();
    window.setInterval(() => {
      if (this.apiConfigured && this.state.catalogSyncStatus === 'connected') {
        void this.loadSharedCatalog();
        void this.loadSharedSettings();
        void this.loadSharedHomepageBanners();
        if (this.adminAuthenticated) void this.loadOperationalData();
      }
    }, 15000);
  }

  private handleStorageChange = (event: StorageEvent) => {
    if (event.storageArea && event.storageArea !== window.localStorage) return;

    if (!this.apiConfigured && (event.key === null || event.key === STORAGE_KEYS.PRODUCTS)) {
      this.state = { ...this.state, products: this.loadProducts() };
    }
    if (!this.apiConfigured && (event.key === null || event.key === STORAGE_KEYS.CATEGORIES)) {
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

  public loadCustomProducts(): Product[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_PRODUCTS);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  }

  public saveCustomProducts(custom: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_PRODUCTS, JSON.stringify(custom));
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
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  }

  public saveCustomCategories(custom: AdminCategory[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(custom));
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

    let base = INITIAL_PRODUCTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 100) base = parsed;
      }
    } catch {}

    const map = new Map<string, Product>();
    // Custom added/edited products have highest priority
    custom.forEach((p) => {
      if (!deleted.has(p.id)) map.set(p.id, p);
    });
    base.forEach((p) => {
      if (!map.has(p.id) && !deleted.has(p.id)) {
        map.set(p.id, p);
      }
    });

    return this.sortNewestProductsFirst(Array.from(map.values()));
  }

  private loadCategories(): AdminCategory[] {
    const custom = this.loadCustomCategories();
    const deleted = this.loadDeletedCategoryIds();

    let base = INITIAL_CATEGORIES;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) base = parsed;
      }
    } catch {}

    const map = new Map<string, AdminCategory>();
    custom.forEach((c) => {
      if (!deleted.has(c.id)) map.set(c.id, c);
    });
    base.forEach((c) => {
      if (!map.has(c.id) && !deleted.has(c.id)) {
        map.set(c.id, c);
      }
    });

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
          if (cleaned.length > 0) return cleaned;
        }
      }
    } catch {}
    return ['ad-prod-001', 'ad-prod-002', 'ad-prod-003', 'ad-prod-004'];
  }

  private loadOrders(): AdminOrder[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored !== null) return JSON.parse(stored);
    } catch {}
    return [];
  }

  private loadQuotes(): AdminQuote[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUOTES);
      if (stored !== null) return JSON.parse(stored);
    } catch {}
    return [];
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
    if (!logo || typeof logo !== 'string' || logo.startsWith('/uploads/') || logo.includes('vinayak/logo.png')) {
      logo = '/assets/logo_alldisplay.svg';
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
      whatsappNumber = digits.length === 10 ? `91${digits}` : (digits || fallback.whatsappNumber);
    } else {
      whatsappNumber = fallback.whatsappNumber;
    }

    let alternateWhatsapp = raw.alternateWhatsapp;
    if (typeof alternateWhatsapp === 'string' && alternateWhatsapp.trim()) {
      const altDigits = alternateWhatsapp.replace(/\D/g, '');
      alternateWhatsapp = altDigits.length === 10 ? `91${altDigits}` : (altDigits || whatsappNumber);
    } else {
      alternateWhatsapp = whatsappNumber || fallback.alternateWhatsapp;
    }

    const supportPhone = raw.supportPhone || fallback.supportPhone;

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
      const catalog = await this.apiRequest<{ products: Product[]; categories: AdminCategory[] }>('/api/catalog');
      const customProducts = this.loadCustomProducts();
      const deletedProducts = this.loadDeletedProductIds();
      const customCategories = this.loadCustomCategories();
      const deletedCategories = this.loadDeletedCategoryIds();

      if (catalog && Array.isArray(catalog.products) && catalog.products.length >= 100) {
        // Merge server products with local custom products so custom products NEVER disappear
        const prodMap = new Map<string, Product>();
        customProducts.forEach((p) => {
          if (!deletedProducts.has(p.id)) prodMap.set(p.id, p);
        });
        catalog.products.forEach((p) => {
          if (!prodMap.has(p.id) && !deletedProducts.has(p.id)) {
            prodMap.set(p.id, p);
          }
        });

        const catMap = new Map<string, AdminCategory>();
        customCategories.forEach((c) => {
          if (!deletedCategories.has(c.id)) catMap.set(c.id, c);
        });
        (catalog.categories || []).forEach((c) => {
          if (!catMap.has(c.id) && !deletedCategories.has(c.id)) {
            catMap.set(c.id, c);
          }
        });

        const sortedProducts = this.sortNewestProductsFirst(Array.from(prodMap.values()));
        const sortedCategories = this.sortNewestCategoriesFirst(Array.from(catMap.values()));

        this.state = {
          ...this.state,
          products: sortedProducts,
          categories: sortedCategories,
          catalogSyncStatus: 'connected',
          catalogSyncError: null,
        };
        try {
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(sortedProducts));
          localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(sortedCategories));
        } catch {}
        this.notify();

        // If server is missing custom items, sync them to server
        const serverProdIds = new Set(catalog.products.map(p => p.id));
        const missingOnServer = customProducts.some(p => !serverProdIds.has(p.id));
        if (missingOnServer) {
          void this.persistCatalog();
        }
      } else if (catalog && (!catalog.products || catalog.products.length < 100)) {
        // Automatically sync the full catalog to shared backend
        void this.persistCatalog();
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
        const finalDeals = cleanedDeals.length > 0 ? cleanedDeals : ['ad-prod-001', 'ad-prod-002', 'ad-prod-003', 'ad-prod-004'];
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

  private async loadOperationalData() {
    try {
      const [orders, quotes] = await Promise.all([
        this.apiRequest<{ orders: AdminOrder[] }>('/api/admin/orders'),
        this.apiRequest<{ quotes: AdminQuote[] }>('/api/admin/quotes'),
      ]);
      this.state = { ...this.state, orders: orders.orders, quotes: quotes.quotes };
      this.notify();
    } catch (error) {
      this.setCatalogSyncError(error instanceof Error ? error.message : 'Unable to load orders and quote requests.');
    }
  }

  private async refreshCatalog() {
    try {
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
    const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('alldisplay_admin_token') : null;
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
    const catalog = await this.apiRequest<{ products: Product[]; categories: AdminCategory[] }>('/api/catalog');
    if (catalog.products.length || catalog.categories.length) return;

    const readLocal = <T,>(key: string, fallback: T): T => {
      const stored = localStorage.getItem(key);
      if (stored === null) return fallback;
      try {
        return JSON.parse(stored) as T;
      } catch {
        return fallback;
      }
    };
    this.state = {
      ...this.state,
      products: readLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS),
      categories: readLocal(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES),
    };
    if (!await this.persistCatalog()) {
      throw new Error(this.state.catalogSyncError || 'Could not migrate the local catalog.');
    }
  }

  public async signInAdmin(password: string): Promise<AdminRole> {
    const res = await this.apiRequest<{ role: AdminRole; token?: string }>('/api/admin/login', {
      method: 'POST',
      headers: { 'X-Admin-Request': '1' },
      body: JSON.stringify({ password }),
    });
    if (res?.token && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('alldisplay_admin_token', res.token);
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
    const sorted = this.sortNewestProductsFirst(products);
    const indexed = sorted.map((p, index) => ({
      ...p,
      sortOrder: index,
      createdAt: p.createdAt || (p.id.startsWith('prod-') ? new Date(Number(p.id.replace('prod-', '')) || Date.now()).toISOString() : undefined)
    }));

    // Identify and persist any custom products safely to dedicated storage key
    const initialIds = new Set(INITIAL_PRODUCTS.map(p => p.id));
    const custom = indexed.filter(p => !initialIds.has(p.id) || p.createdAt || p.id.startsWith('prod-'));
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
    return this.saveProducts([]);
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
    const sorted = this.sortNewestCategoriesFirst(categories);
    const indexed = sorted.map((c, index) => ({
      ...c,
      sortOrder: index,
      createdAt: c.createdAt || (c.id.startsWith('cat-') ? new Date(Number(c.id.replace('cat-', '')) || Date.now()).toISOString() : undefined)
    }));

    const initialCatIds = new Set(INITIAL_CATEGORIES.map(c => c.id));
    const custom = indexed.filter(c => !initialCatIds.has(c.id) || c.createdAt || c.id.startsWith('cat-'));
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
    const custom = this.loadCustomCategories().filter(c => c.id !== id);
    this.saveCustomCategories(custom);

    const deleted = this.loadDeletedCategoryIds();
    deleted.add(id);
    this.saveDeletedCategoryIds(deleted);

    const updated = this.state.categories.filter(c => c.id !== id);
    return this.saveCategories(updated);
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

  public async createOrder(order: Omit<AdminOrder, 'id' | 'orderNo' | 'date' | 'status' | 'subtotal' | 'discount' | 'gst' | 'total'>): Promise<AdminOrder> {
    const { order: savedOrder } = await this.apiRequest<{ order: AdminOrder }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
    this.state = { ...this.state, orders: [savedOrder, ...this.state.orders] };
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
    this.state = {
      ...this.state,
      settings: DEFAULT_SETTINGS,
    };
    if (!await this.saveProducts(INITIAL_PRODUCTS)) return false;
    if (!await this.saveCategories(INITIAL_CATEGORIES)) return false;
    if (!await this.saveSettings(DEFAULT_SETTINGS)) return false;
    this.state = {
      ...this.state,
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      settings: DEFAULT_SETTINGS,
    };
    this.notify();
    window.location.reload();
    return true;
  }
}

export const storeManager = new CentralStoreService();
