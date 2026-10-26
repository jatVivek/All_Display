export type ActiveView = 
  | 'home' 
  | 'shop'
  | 'contact'
  | 'about'
  | 'racks-floor-stands' 
  | 'pdp' 
  | 'shop-setup-projects' 
  | 'quote-cart' 
  | 'custom-quote'
  | 'wall-systems-channels'
  | 'mannequins-forms'
  | 'luxury-gold-fixtures'
  | 'hangers-accessories'
  | 'account'
  | 'admin';

export interface ProductVariationOption {
  id: string;
  name: string; // e.g. "Teal Blue", "Beige Velvet", "10 Inch", "Pack of 100"
  price?: number; // optional price override for this option
  originalPrice?: number;
  sku?: string;
  image?: string;
  inStock?: boolean;
}

export interface ProductVariation {
  id: string;
  name: string; // e.g. "Color / Finish", "Size", "Pack Size"
  options: ProductVariationOption[];
}

export interface Product {
  id: string;
  code: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  unit: string;
  rating?: number;
  reviewCount?: number;
  loadCapacity: string;
  category: string;
  finish: string;
  structuralProfile: string;
  dispatchReadiness: string;
  stockStatus: string;
  moq: string;
  badge?: string;
  badgeType?: 'primary' | 'secondary' | 'neutral' | 'success';
  image: string;
  images?: string[];
  videoUrl?: string;
  finishes: { name: string; color: string }[];
  variations?: ProductVariation[];
  requirements?: string[]; // e.g. ['online-sellers', 'instagram-shop', 'retail-shops', 'new-jewellery']
  material?: string;
  specs?: {
    height?: string;
    width?: string;
    depth?: string;
    steelAlloy?: string;
    gauge?: string;
    dimensions?: string;
    weight?: string;
    color?: string;
  };
}

export interface HomepageBanner {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  mobileImage?: string;
  linkType: 'category' | 'product';
  linkId: string;
}

export interface CartItem {
  id: string;
  productId: string;
  sku: string;
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
  moq: number;
  unitLabel: string;
  finish: string;
  sizeOrSpec: string;
  gauge: string;
  packingType: string;
  selectedVariations?: Record<string, string>;
  isLinear?: boolean;
}

export interface ConsigneeDetails {
  storeName: string;
  ownerName: string;
  whatsapp: string;
  destination: string;
  pincode: string;
  launchDate: string;
  notes: string;
}

export interface ProjectReel {
  id: string;
  title: string;
  client: string;
  location: string;
  area: string;
  duration: string;
  reelLikes?: string;
  category: 'bridal' | 'streetwear' | 'boutiques' | 'wholesale' | 'wall-channel';
  categoryLabel: string;
  description: string;
  turnkeyTime: string;
  image: string;
  metrics: {
    racksInstalled: string;
    capacity: string;
    finishType: string;
  };
  clientQuote: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  storeName: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verifiedWholesaleBuyer: boolean;
  avatar: string;
  helpfulCount: number;
}
