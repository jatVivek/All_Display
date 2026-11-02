import { Product, ProjectReel, Review } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    "id": "prod-1793198422071-1",
    "code": "AD-LVN-01",
    "title": "Emerald Green Velvet Bust (12 inch)",
    "description": "Emerald Green Velvet Bust (12 inch) - Wholesale jewellery display item. Superior craftsmanship and immediate dispatch.",
    "price": 1850,
    "originalPrice": 2200,
    "unit": "Pieces",
    "rating": 4.8,
    "reviewCount": 24,
    "loadCapacity": "Standard Load",
    "category": "Luxury Velvet Necklaces",
    "finish": "Standard Finish",
    "structuralProfile": "Standard",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "2 Pcs",
    "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    "videoUrl": "",
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
    ],
    "finishes": [
      {
        "name": "Midnight Black",
        "color": "#0F172A"
      },
      {
        "name": "Emerald Teal",
        "color": "#0D9488"
      },
      {
        "name": "Royal Maroon",
        "color": "#881337"
      },
      {
        "name": "Pure White",
        "color": "#F8FAFC"
      }
    ],
    "requirements": [
      "instagram-shop",
      "new-jewellery"
    ],
    "material": "Velvet",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "300 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [],
    "sortOrder": 0,
    "createdAt": "2026-11-02T06:40:29.743Z"
  },
  {
    "id": "prod-1793198422071-2",
    "code": "AD-LVN-02",
    "title": "Midnight Black Tiered Velvet Earring Stand",
    "description": "Midnight Black Tiered Velvet Earring Stand - Wholesale jewellery display item. Superior craftsmanship and immediate dispatch.",
    "price": 1200,
    "originalPrice": 1500,
    "unit": "Pieces",
    "rating": 4.8,
    "reviewCount": 24,
    "loadCapacity": "Standard Load",
    "category": "Luxury Velvet Necklaces",
    "finish": "Standard Finish",
    "structuralProfile": "Standard",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "5 Pcs",
    "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
    "videoUrl": "",
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
    ],
    "finishes": [
      {
        "name": "Midnight Black",
        "color": "#0F172A"
      },
      {
        "name": "Emerald Teal",
        "color": "#0D9488"
      },
      {
        "name": "Royal Maroon",
        "color": "#881337"
      },
      {
        "name": "Pure White",
        "color": "#F8FAFC"
      }
    ],
    "requirements": [
      "instagram-shop",
      "new-jewellery"
    ],
    "material": "Velvet",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "300 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [],
    "sortOrder": 1,
    "createdAt": "2026-11-02T06:40:29.743Z"
  }
];

export const TOP_SELLING_HOMEPAGE: Product[] = INITIAL_PRODUCTS;

export const PROJECT_REELS: ProjectReel[] = [
  {
    id: 'reel-1',
    title: 'Velvet Presentation Suite for Boutique Counter',
    client: 'Sri Meenakshi Jewels',
    location: 'Feel Khana, Hyderabad',
    area: 'Counter Setup',
    duration: '0:35',
    category: 'boutiques',
    categoryLabel: 'Boutique Display',
    description: 'Custom teal blue velvet bust and matching round trays installed at Feel Khana bridal counter.',
    turnkeyTime: 'Same-Day Dispatch',
    image: '/assets/vinayak/prod_velvet_necklace.png',
    metrics: {
      reach: '18.4K Views',
      saves: '1.2K Saves',
      shares: '430 Shares'
    }
  },
  {
    id: 'reel-2',
    title: 'High-Density Display Cards & Barcode Tags Dispatch',
    client: 'Hyderabad Wholesale Packaging Desk',
    location: 'Feel Khana Warehouse',
    area: 'Dispatch Floor',
    duration: '0:28',
    category: 'showrooms',
    categoryLabel: 'Express Dispatch',
    description: 'Daily bulk sorting of 50,000+ jewellery cards and barcode ribbons across pan-India orders.',
    turnkeyTime: 'In Stock Dispatch',
    image: '/assets/vinayak/deal_left_banner.png',
    metrics: {
      reach: '14.1K Views',
      saves: '980 Saves',
      shares: '310 Shares'
    }
  },
  {
    id: 'reel-3',
    title: 'Modern Acrylic & Wooden Showroom Installation',
    client: 'Navkar Designer Studio',
    location: 'Secunderabad, Telangana',
    area: 'Showroom Window',
    duration: '0:42',
    category: 'boutiques',
    categoryLabel: 'Complete Showroom',
    description: 'Complete showcase transformation with tiered acrylic displays and anti-scratch velvet linings.',
    turnkeyTime: '48h Setup',
    image: '/assets/vinayak/req_instagram_shop.png',
    metrics: {
      reach: '22.8K Views',
      saves: '2.1K Saves',
      shares: '670 Shares'
    }
  }
];

export const CLIENT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Rajesh V.',
    role: 'Store Proprietor',
    storeName: 'Kaveri Jewellery Works',
    city: 'Hyderabad',
    rating: 5,
    date: '2 days ago',
    comment: 'The 4-layer earring stand and velvet necklace busts are top quality. Same day delivery from Feel Khana depot.',
    verifiedWholesaleBuyer: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    helpfulCount: 14
  },
  {
    id: 'rev-2',
    author: 'Priya Sundaram',
    role: 'Online Jewellery Creator',
    storeName: 'Aura Silver Studio',
    city: 'Hyderabad',
    rating: 5,
    date: '1 week ago',
    comment: 'Ordered 500 pcs pink display cards and tape dispenser. Very fast shipping, premium cardstock!',
    verifiedWholesaleBuyer: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    helpfulCount: 22
  }
];

export const REVIEWS = CLIENT_REVIEWS;
export const INITIAL_CATALOG_PRODUCTS = INITIAL_PRODUCTS;

