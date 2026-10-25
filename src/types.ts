export type ActiveView = 
  | 'home' 
  | 'racks-floor-stands' 
  | 'pdp' 
  | 'shop-setup-projects' 
  | 'quote-cart' 
  | 'custom-quote'
  | 'wall-systems-channels'
  | 'mannequins-forms'
  | 'luxury-gold-fixtures'
  | 'hangers-accessories'
  | 'admin';

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
  finishes: { name: string; color: string }[];
  specs?: {
    height?: string;
    width?: string;
    depth?: string;
    steelAlloy?: string;
    gauge?: string;
  };
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
  videoPreviewUrl?: string;
  specs: {
    floorUnits: string;
    wallSlotChannels: string;
    special: string;
  };
  finishes: { name: string; color: string }[];
  finishLabel: string;
  badgeText?: string;
}

export interface Review {
  id: string;
  author: string;
  initials: string;
  role: string;
  location: string;
  rating: number;
  text: string;
}
