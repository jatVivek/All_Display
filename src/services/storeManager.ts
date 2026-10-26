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
}

export interface AdminCategory {
  id: string;
  name: string;
  description: string;
}

const INITIAL_CATEGORIES: AdminCategory[] = [
  { id: 'cat-1', name: 'Display Bust', description: 'Velvet and leatherette portrait busts for necklaces and bridal sets.' },
  { id: 'cat-2', name: 'Display Cards', description: 'Earring cards, necklace tags, barcode cards and jewelry packaging.' },
  { id: 'cat-3', name: 'Display Stand', description: 'Tiered wooden & metal stands for earrings, chains and pendants.' },
  { id: 'cat-4', name: 'Display Tray', description: 'Stackable velvet trays, ring pads, and flat counter showcase inserts.' },
  { id: 'cat-5', name: 'Bangle & Bracelet Display Stand', description: 'Single and multi-tier cylinders for bangles, watches, and bracelets.' },
  { id: 'cat-6', name: 'Storage Box', description: 'Velvet gift boxes, organizer chests, and acrylic storage boxes.' },
  { id: 'cat-7', name: 'Mannequin Stand', description: 'Full form mannequin busts, sculpted heads, and torso models.' },
  { id: 'cat-8', name: 'Packaging Tools', description: 'Tape dispensers, clear wonder tapes, barcode sticker rolls, and sealers.' },
  { id: 'cat-9', name: 'Jewellery Display Cloth', description: 'Seamless suede and velvet counter fabrics for showcase flatlays.' },
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
  PRODUCTS: 'vinayak_store_products_v2',
  ORDERS: 'vinayak_store_orders_v2',
  QUOTES: 'vinayak_store_quotes_v2',
  SETTINGS: 'vinayak_store_settings_v2',
  HOMEPAGE: 'vinayak_store_homepage_v2',
  HOMEPAGE_DEALS: 'vinayak_store_homepage_deals_v2',
  CATEGORIES: 'vinayak_store_categories_v2',
  WISHLIST: 'vinayak_store_wishlist_v2',
};

const DEFAULT_SETTINGS: AdminSettings = {
  whatsappNumber: '919462247004',
  alternateWhatsapp: '919462247004',
  upiId: 'vinayakpackaging@icici',
  bankName: 'HDFC Bank - Sowcarpet Branch, Chennai',
  accountNo: '50200049210081',
  ifscCode: 'HDFC0000231',
  minOrderValue: 500,
  shippingNotes: 'Global shipping available. Safe doorstep delivery across India from Chennai warehouse.',
  storeName: 'Vinayak Packaging',
  brandName: 'Vinayak Packaging',
  businessAddress: '29, Perumal Mudali St, Sowcarpet, George Town, Chennai, Tamil Nadu 600001',
  showroomAddress: '29, Perumal Mudali St, Sowcarpet, George Town, Chennai, Tamil Nadu 600001',
  brandTagline: 'Jewellery Display, Trays & Packaging Solutions',
  logoUrl: '/assets/vinayak/logo.png',
  headerNotice: 'Direct Factory Wholesale • Sowcarpet Depot, Chennai • Same-Day Dispatch Across India',
  supportEmail: 'contact@www.vinayakpack.com',
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
      if (this.apiConfigured) {
        void this.loadSharedCatalog();
        void this.loadSharedSettings();
        void this.loadSharedHomepageBanners();
        if (this.adminAuthenticated) void this.loadOperationalData();
      }
    }, 10000);
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

  private loadProducts(): Product[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored !== null) return JSON.parse(stored);
    } catch {}
    return INITIAL_PRODUCTS;
  }

  private loadCategories(): AdminCategory[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored !== null) return JSON.parse(stored);
    } catch {}
    return INITIAL_CATEGORIES;
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
        if (Array.isArray(parsed) && parsed.every((id) => typeof id === 'string')) return parsed;
      }
    } catch {}
    return ['vp-eds-401', 'vp-vtr-102', 'vp-nbd-205', 'vp-pdc-301'];
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

  private loadSettings(): AdminSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored !== null) return JSON.parse(stored);
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
      this.state = {
        ...this.state,
        products: catalog.products,
        categories: catalog.categories,
        catalogSyncStatus: 'connected',
        catalogSyncError: null,
      };
      this.notify();
    } catch (error) {
      if (this.apiConfigured) {
        this.setCatalogSyncError(error instanceof Error ? error.message : 'Unable to load the shared catalog.');
      }
    }
  }

  private async loadSharedSettings() {
    try {
      const { settings } = await this.apiRequest<{ settings: AdminSettings | null }>('/api/settings');
      if (settings) {
        const brand = settings.brandName || settings.storeName || 'Vinayak Packaging';
        const normalized: AdminSettings = {
          ...settings,
          storeName: brand,
          brandName: brand,
        };
        this.state = { ...this.state, settings: normalized };
        try {
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(normalized));
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
      if (banners) {
        const homepageBanners = isLegacyStarterBanner(banners) ? INITIAL_HOMEPAGE_BANNERS : banners;
        this.state = { ...this.state, homepageBanners };
        try {
          localStorage.setItem(STORAGE_KEYS.HOMEPAGE, JSON.stringify(homepageBanners));
        } catch {}
      }
      if (dealProductIds) {
        this.state = { ...this.state, homepageDealProductIds: dealProductIds };
        try {
          localStorage.setItem(STORAGE_KEYS.HOMEPAGE_DEALS, JSON.stringify(dealProductIds));
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
      const status = await this.apiRequest<{ configured: boolean; connected: boolean }>('/api/health');
      this.apiConfigured = status.configured;
      if (!status.configured) {
        this.state = { ...this.state, catalogSyncStatus: 'local', catalogSyncError: null };
        this.notify();
      } else if (status.connected) {
        await Promise.all([this.loadSharedCatalog(), this.loadSharedSettings(), this.loadSharedHomepageBanners()]);
      } else {
        this.setCatalogSyncError('The server is configured but cannot connect to MySQL.');
      }
    } catch {
      this.apiConfigured = false;
      this.state = { ...this.state, catalogSyncStatus: 'local', catalogSyncError: null };
      this.notify();
    }
  }

  private async apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, {
      ...options,
      credentials: 'same-origin',
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
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
    await this.apiRequest('/api/admin/login', {
      method: 'POST',
      headers: { 'X-Admin-Request': '1' },
      body: JSON.stringify({ password }),
    });
    this.apiConfigured = true;
    this.adminAuthenticated = true;
    await this.migrateLocalCatalogIfCloudIsEmpty();
    await Promise.all([
      this.loadSharedCatalog(),
      this.migrateLocalSettingsIfCloudIsEmpty(),
      this.loadSharedHomepageBanners(),
      this.loadOperationalData(),
    ]);
    return 'Owner';
  }

  private async migrateLocalSettingsIfCloudIsEmpty() {
    const { settings } = await this.apiRequest<{ settings: AdminSettings | null }>('/api/settings');
    if (settings) {
      this.state = { ...this.state, settings };
      this.notify();
      return;
    }
    await this.apiRequest('/api/settings', {
      method: 'PUT',
      headers: { 'X-Admin-Request': '1' },
      body: JSON.stringify({ settings: this.state.settings }),
    });
  }

  public async getAdminRole(): Promise<AdminRole | null> {
    if (!this.apiConfigured) await this.refreshCatalog();
    if (!this.apiConfigured) return null;
    const session = await this.apiRequest<{ role: AdminRole | null }>('/api/admin/session');
    if (!session.role) return null;
    this.adminAuthenticated = true;
    await this.migrateLocalCatalogIfCloudIsEmpty();
    await Promise.all([
      this.loadSharedCatalog(),
      this.migrateLocalSettingsIfCloudIsEmpty(),
      this.loadSharedHomepageBanners(),
      this.loadOperationalData(),
    ]);
    return session.role;
  }

  public async signOutAdmin() {
    this.adminAuthenticated = false;
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
    this.state = { ...this.state, products };
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {}
    this.notify();
    return this.persistCatalog();
  }

  public clearProducts(): Promise<boolean> {
    return this.saveProducts([]);
  }

  public deleteProduct(id: string): Promise<boolean> {
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
    if (this.apiConfigured) {
      try {
        await this.apiRequest('/api/homepage-banners', {
          method: 'PUT',
          headers: { 'X-Admin-Request': '1' },
          body: JSON.stringify({ banners, dealProductIds }),
        });
      } catch (error) {
        this.setCatalogSyncError(error instanceof Error ? error.message : 'Unable to save homepage banners.');
        return false;
      }
    }
    this.state = { ...this.state, homepageBanners: banners, homepageDealProductIds: dealProductIds };
    try {
      localStorage.setItem(STORAGE_KEYS.HOMEPAGE, JSON.stringify(banners));
      localStorage.setItem(STORAGE_KEYS.HOMEPAGE_DEALS, JSON.stringify(dealProductIds));
    } catch (error) {
      console.error('Could not save homepage banners locally:', error);
      return false;
    }
    this.notify();
    return true;
  }

  public async saveCategories(categories: AdminCategory[]): Promise<boolean> {
    this.state = { ...this.state, categories };
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch {}
    this.notify();
    return this.persistCatalog();
  }

  public deleteCategory(id: string): Promise<boolean> {
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
    this.notify();
    return isNowInWishlist;
  }

  public clearWishlist(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.WISHLIST);
    } catch {}
    window.dispatchEvent(new CustomEvent('vinayak_wishlist_updated', { detail: { list: [] } }));
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
    const brand = settings.brandName || settings.storeName || 'Vinayak Packaging';
    const normalizedSettings: AdminSettings = {
      ...settings,
      storeName: brand,
      brandName: brand,
    };

    if (this.apiConfigured) {
      try {
        await this.apiRequest('/api/settings', {
          method: 'PUT',
          headers: { 'X-Admin-Request': '1' },
          body: JSON.stringify({ settings: normalizedSettings }),
        });
      } catch (error) {
        this.setCatalogSyncError(error instanceof Error ? error.message : 'Unable to save shared business settings.');
        return false;
      }
    }
    this.state = { ...this.state, settings: normalizedSettings };
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(normalizedSettings));
    } catch {}
    window.dispatchEvent(new CustomEvent('vinayak_settings_updated', { detail: { settings: normalizedSettings } }));
    window.dispatchEvent(new CustomEvent('alldisplay_data_updated', { detail: { settings: normalizedSettings } }));
    this.notify();
    return true;
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
