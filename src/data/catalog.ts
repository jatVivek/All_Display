import { Product, ProjectReel, Review } from '../types';

export const INITIAL_PRODUCTS: Product[] = [];

export const TOP_SELLING_HOMEPAGE: Product[] = [];

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
      racksInstalled: '24 Trays & Busts',
      capacity: 'Full Bridal Suite',
      finishType: 'Peacock Teal Velvet'
    },
    clientQuote: 'All Display displays transformed our glass showcase into a high-end luxury counter.'
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
