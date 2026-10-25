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
  businessAddress: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  description: string;
}

const INITIAL_CATEGORIES: AdminCategory[] = [
  { id: 'cat-1', name: 'Floor Stands & Bumper Racks', description: 'Heavy-duty center island stands and multi-tier rolling racks.' },
  { id: 'cat-2', name: 'Wall Systems & Channels', description: 'Slotted wall upright channels, brackets, and glass support fittings.' },
  { id: 'cat-3', name: 'Mannequins & Dress Forms', description: 'Fiberglass tailor dummies, headless models, and magnetic torso forms.' },
  { id: 'cat-4', name: 'Gold Luxury Boutique Fixtures', description: 'Electroplated Titanium PVD gold arched racks and luxury display units.' },
  { id: 'cat-5', name: 'Hangers, Clips & Hooks', description: 'Lotus wood suit hangers, velvet hangers, and waterfall faceout hooks.' },
];

const INITIAL_HOMEPAGE_BANNERS: HomepageBanner[] = [
  {
    id: 'banner-main',
    eyebrow: 'Hyderabad Factory Direct • B2B Wholesale',
    title: 'Heavy-duty racks that make every piece easy to see',
    subtitle: 'Strong, stable display for busy retail floors.',
    description: 'Discover dependable garment racks built for everyday merchandising and fast store setup.',
    image: INITIAL_PRODUCTS.find((product) => product.id === 'ad-tpr-650')?.image ?? '',
    linkType: 'category',
    linkId: INITIAL_CATEGORIES[0].id,
  },
  {
    id: 'banner-gold',
    eyebrow: 'Boutique Collection • PVD Gold',
    title: 'Give premium collections a standout first impression',
    subtitle: 'Refined gold fixtures for your most considered displays.',
    description: 'Bring a polished finish to occasionwear, bridal and designer collections.',
    image: INITIAL_PRODUCTS.find((product) => product.id === 'ad-arc-700')?.image ?? '',
    linkType: 'product',
    linkId: 'ad-arc-700',
  },
  {
    id: 'banner-wall',
    eyebrow: 'Wall Systems • Made for Merchandising',
    title: 'Turn empty walls into high-impact displays',
    subtitle: 'A flexible wall system that makes every inch useful.',
    description: 'Pair slotted channels, shelves and hanging rails to shape your shop floor.',
    image: INITIAL_PRODUCTS.find((product) => product.id === 'ad-wch-dutti')?.image ?? '',
    linkType: 'product',
    linkId: 'ad-wch-dutti',
  },
];

const isLegacyStarterBanner = (banners: HomepageBanner[]) =>
  banners.length === 1 &&
  banners[0].id === 'banner-main' &&
  banners[0].title === 'Heavy-Duty Display Racks for Modern Retail Stores' &&
  banners[0].image === 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXybVXMlvZGeKYb_0JXEtHxZmiY36LraReoSDO2Auwjuyr6Nr9AmLN02CqnVSfW5qty_u1k1zBD3_8xhryMVP33uzyGFfJT-Irp_zV2RwgYU3JRLGf_A_X5jCoLJ4YtNB_MLXGfONPve3BhVwvtJJNkGZE4FJ2H53n7H1J-0lWZWLhZREwRq9q-GBEXPajJREpKLmpuAXp1s4ZoBzc79alpLRtJ6Es_FBOpz6L-smTtuCpCvs9H85f';

const STORAGE_KEYS = {
  PRODUCTS: 'alldisplay_admin_products',
  ORDERS: 'alldisplay_admin_orders',
  QUOTES: 'alldisplay_admin_quotes',
  SETTINGS: 'alldisplay_admin_settings',
  HOMEPAGE: 'alldisplay_admin_homepage',
  HOMEPAGE_DEALS: 'alldisplay_admin_homepage_deals',
  CATEGORIES: 'alldisplay_admin_categories',
};

const DEFAULT_SETTINGS: AdminSettings = {
  whatsappNumber: '917396127273',
  alternateWhatsapp: '919849023456',
  upiId: 'alldisplay@icici',
  bankName: 'ICICI Bank - Ranigunj Branch, Hyderabad',
  accountNo: '023105004921',
  ifscCode: 'ICIC0000231',
  minOrderValue: 5000,
  shippingNotes: 'All transport freight charges payable by consignee at destination transport depot.',
  storeName: 'All Display Wholesale Corporation',
  businessAddress: '1-2-345, Ranigunj Wholesale Fixture Market, Secunderabad, Hyderabad - 500003',
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
    return [];
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
        this.state = { ...this.state, settings };
        try {
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
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
    if (this.apiConfigured) {
      try {
        await this.apiRequest('/api/settings', {
          method: 'PUT',
          headers: { 'X-Admin-Request': '1' },
          body: JSON.stringify({ settings }),
        });
      } catch (error) {
        this.setCatalogSyncError(error instanceof Error ? error.message : 'Unable to save shared business settings.');
        return false;
      }
    }
    this.state = { ...this.state, settings };
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {}
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
