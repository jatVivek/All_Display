import { Product, CartItem, ProjectReel } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CART, PROJECT_REELS, TOP_SELLING_HOMEPAGE } from '../data/catalog';

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

const STORAGE_KEYS = {
  PRODUCTS: 'alldisplay_admin_products',
  ORDERS: 'alldisplay_admin_orders',
  QUOTES: 'alldisplay_admin_quotes',
  SETTINGS: 'alldisplay_admin_settings',
  HOMEPAGE: 'alldisplay_admin_homepage',
  CATEGORIES: 'alldisplay_admin_categories',
};

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ord-1',
    orderNo: 'AD-HYD-8492',
    customerName: 'Rajesh Kalyan',
    storeName: 'Kalyan Silks Boutique',
    whatsapp: '9849023456',
    destination: 'Vijayawada, AP',
    pincode: '520002',
    date: '2026-10-24 14:20',
    status: 'New (Awaiting WhatsApp)',
    items: [
      { sku: 'AD-TPR-739', title: 'Commercial Triple Pipe Rack System', finish: 'Matte Black', quantity: 4, unitPrice: 8400, unitLabel: 'Bay' },
      { sku: 'AD-SGC-102', title: 'Brushed Gold Slotted Wall Channel', finish: 'PVD Gold', quantity: 12, unitPrice: 1250, unitLabel: 'Pcs' }
    ],
    subtotal: 48600,
    discount: 4860,
    gst: 7873,
    total: 51613,
    notes: 'Urgent delivery before Dasara festival opening.'
  }
];

const INITIAL_QUOTES: AdminQuote[] = [
  {
    id: 'q-1',
    quoteNo: 'QT-2026-901',
    customerName: 'Maheshwari Textiles',
    storeName: 'Maheshwari Megastore',
    whatsapp: '9700112233',
    city: 'Karimnagar',
    area: '1800 sq.ft',
    storeType: 'Multi-brand Saree & Readymades',
    notes: 'Need full store CAD elevation plan for center island pipe racks and perimeter wall channels.',
    date: '2026-10-24 10:15',
    status: 'Pending Review'
  }
];

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
  orders: AdminOrder[];
  quotes: AdminQuote[];
  settings: AdminSettings;
}

type StoreListener = (state: CentralStoreState) => void;

class CentralStoreService {
  private listeners: Set<StoreListener> = new Set();
  private state: CentralStoreState = {
    products: this.loadProducts(),
    categories: this.loadCategories(),
    orders: this.loadOrders(),
    quotes: this.loadQuotes(),
    settings: this.loadSettings(),
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

  private loadOrders(): AdminOrder[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored !== null) return JSON.parse(stored);
    } catch {}
    return INITIAL_ORDERS;
  }

  private loadQuotes(): AdminQuote[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUOTES);
      if (stored !== null) return JSON.parse(stored);
    } catch {}
    return INITIAL_QUOTES;
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

  // Products CRUD
  public getProducts(): Product[] {
    return this.state.products;
  }

  public saveProducts(products: Product[]) {
    this.state = { ...this.state, products };
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {}
    this.notify();
  }

  public clearProducts() {
    this.saveProducts([]);
  }

  public deleteProduct(id: string) {
    const updated = this.state.products.filter(p => p.id !== id);
    this.saveProducts(updated);
  }

  // Categories CRUD
  public getCategories(): AdminCategory[] {
    return this.state.categories;
  }

  public saveCategories(categories: AdminCategory[]) {
    this.state = { ...this.state, categories };
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch {}
    this.notify();
  }

  public deleteCategory(id: string) {
    const updated = this.state.categories.filter(c => c.id !== id);
    this.saveCategories(updated);
  }

  // Orders
  public getOrders(): AdminOrder[] {
    return this.state.orders;
  }

  public saveOrders(orders: AdminOrder[]) {
    this.state = { ...this.state, orders };
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {}
    this.notify();
  }

  // Quotes
  public getQuotes(): AdminQuote[] {
    return this.state.quotes;
  }

  public saveQuotes(quotes: AdminQuote[]) {
    this.state = { ...this.state, quotes };
    try {
      localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
    } catch {}
    this.notify();
  }

  // Settings
  public getSettings(): AdminSettings {
    return this.state.settings;
  }

  public saveSettings(settings: AdminSettings) {
    this.state = { ...this.state, settings };
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {}
    this.notify();
  }

  public resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.QUOTES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.HOMEPAGE);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    Object.keys(localStorage).forEach((key) => {
      if (key.includes('alldisplay')) {
        localStorage.removeItem(key);
      }
    });
    this.state = {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      orders: INITIAL_ORDERS,
      quotes: INITIAL_QUOTES,
      settings: DEFAULT_SETTINGS,
    };
    this.notify();
    window.location.reload();
  }
}

export const storeManager = new CentralStoreService();
