import { Product, ProjectReel, Review, CartItem } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'ad-tpr-650',
    code: 'AD-TPR-650',
    title: 'All Display Heavy Triple Pipe Garment Rack',
    description: 'Dimensions: 6ft (H) × 5ft (W) × 1.5ft base. Triple welded center rail for maximum density hanging.',
    price: 3250,
    originalPrice: 4500,
    unit: 'unit',
    rating: 4.9,
    reviewCount: 48,
    loadCapacity: '>100kg Heavy Duty',
    category: 'Floor Stands & Bumper Racks',
    finish: 'Matte Black Powder Coat',
    structuralProfile: 'Triple Pipe Island Hanging Rack',
    dispatchReadiness: 'Same-Day Hyderabad Dispatch',
    stockStatus: 'Ranigunj In Stock',
    moq: 'MOQ: 1 Unit',
    badge: 'Best Seller for Boutiques',
    badgeType: 'primary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxpxhNjDNvX32IpSokZdxw6cUs5SdgSnKLVt1U1pm9sFwx6e4wn4NBPpaIB4yjbzZXVFtkPXCmgU4GhDc91mC92FqzpXevZgSy68M5A8mWAcG2NBhYyEFXQYPP5rFgx7YQRt4TO95lC-KXNS6ex4k0bob98fo-2tqur0o05SqvxmV03yS4CUcVVFz1fwB7qXAAZQQouwob3NyBRoD0N75CWJOARbsNrDAVOPNAzOET0j7WEZ3Lznhw',
    finishes: [
      { name: 'Matte Black Powder Coat', color: '#1A1C20' },
      { name: 'Brushed Champagne Gold PVD', color: '#D4AF37' },
      { name: 'Mirror Chrome Finish', color: '#E0E2E5' }
    ]
  },
  {
    id: 'ad-arc-700',
    code: 'AD-ARC-700',
    title: 'Luxury Arch PVD Gold Single Bar Dress Stand',
    description: 'Dimensions: 5.5ft (H) × 4ft (W) × 1.3ft base. Smooth curved arch contour designed for bridal wear & evening gowns.',
    price: 4100,
    originalPrice: 5600,
    unit: 'unit',
    rating: 4.9,
    reviewCount: 31,
    loadCapacity: '50 kg – 100 kg',
    category: 'Gold Luxury Boutique Fixtures',
    finish: 'Brushed Champagne Gold PVD',
    structuralProfile: 'Minimalist Single Bar Studio Stand',
    dispatchReadiness: 'Same-Day Hyderabad Dispatch',
    stockStatus: 'PVD Electroplated',
    moq: 'MOQ: 1 Unit',
    badge: 'Luxury Boutique Pick',
    badgeType: 'secondary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCetuei0F7kSeHMJpAlZLJlEt4ZKllTrm7a_7Vi2J8rR2GPeKo2PBSRUXNc8RZrePn1SG9les_u8fXcd5qWdGTjY1t3-pyqYm-5SYRtJzPggLV4gbKULgD4CHDPJTTVjrXkffgSdCWbP222b6rxD4DzPRmjvIDZD-IKtQqhggZfe6eWOLaGbGVJJBQ-IxXlnhTksR9lsT2nZQ6e8ZHFvz36BuckdTvq3CJ4n9Ora0FMb2Il8l-cwyLH',
    finishes: [
      { name: 'Brushed Titanium Gold', color: '#D4AF37' },
      { name: 'Rose Gold Finish', color: '#B76E79' }
    ]
  },
  {
    id: 'ad-4wy-410',
    code: 'AD-4WY-410',
    title: 'Heavy Duty 4-Way Stepped Bumper Stand',
    description: 'Independent telescopic arm extension from 48 inches to 72 inches. Welded weighted cross-base for tip-proof stability.',
    price: 2450,
    originalPrice: 3200,
    unit: 'unit',
    rating: 4.8,
    reviewCount: 42,
    loadCapacity: '50 kg – 100 kg',
    category: 'Floor Stands & Bumper Racks',
    finish: 'Mirror Chrome Finish',
    structuralProfile: '4-Way Stepped Waterfall Stand',
    dispatchReadiness: 'Same-Day Hyderabad Dispatch',
    stockStatus: 'Ready Dispatch',
    moq: 'MOQ: 2 Units',
    badge: 'High Density Display',
    badgeType: 'neutral',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1WSHFffRkgPMDDEGz8N_rpSK-fBwS3ucd3Es2COVjvJ-avBjgXH5NOwPsf95LQgCHdybDK3jnHwGeUEeyW3efexrWEjx-S3LkJCX6dDzswsQunKeXUuK6_TYg4Sf5G41FWWNYGAELNp-IojHD4JOr2wJxWRiVV1mK-3MncOKmb0z1Mfxh80UC58fQ1qknGsGeHc_mMHkozfTFSnQ9byf9WSQYLNn8JuItntTsG8daT9L2n5S6TkWX',
    finishes: [
      { name: 'Commercial Chrome', color: '#E0E2E5' },
      { name: 'Matte Black', color: '#1A1C20' }
    ]
  },
  {
    id: 'ad-dbl-520',
    code: 'AD-DBL-520',
    title: 'Double Tier Straight Rail Garment Stand',
    description: 'Dimensions: 7ft (H) × 4ft (W). Engineered specifically for display pairs: tops above and folded trousers/skirts below.',
    price: 2800,
    originalPrice: 3800,
    unit: 'unit',
    rating: 4.7,
    reviewCount: 24,
    loadCapacity: '>100kg Heavy Duty',
    category: 'Floor Stands & Bumper Racks',
    finish: 'Matte Black Powder Coat',
    structuralProfile: 'Heavy Duty Bumper Perimeter Stand',
    dispatchReadiness: 'Same-Day Hyderabad Dispatch',
    stockStatus: 'Depot Ready',
    moq: 'MOQ: 1 Unit',
    badge: 'Two-Level Hanging',
    badgeType: 'neutral',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEv3-xnZ0oN_ucmq5lyhCVfllBBErSb7ZrzzCZl7zrlVw51CPUt62KVlQFEiUMLre8SKb-bd235PB4rTH_jB7Ey1VMv6Yi0uu9yzejdQYhziN_HaLBZ_5OddQ5mHasFv_FKd_5M8Bx-crddaH5XkEtjEJrsXVBNQcELA9DYCbrh4Fivm-IMjpehWMGKJbPrRH9zy363aLGX9gummL-mI3Ys9p7-4-lwtTc0a3WKOUYJcUWxMHanGbT',
    finishes: [
      { name: 'Matte Black', color: '#1A1C20' },
      { name: 'Gloss White', color: '#FFFFFF' }
    ]
  },
  {
    id: 'ad-rev-360',
    code: 'AD-REV-360',
    title: 'Circular Revolving 36-Pin Garment Display',
    description: 'Heavy Japanese industrial ball bearing ring. Holds up to 72 hangers for dupattas, kidswear, or innerwear merchandising.',
    price: 3600,
    originalPrice: 4800,
    unit: 'unit',
    rating: 4.8,
    reviewCount: 39,
    loadCapacity: '50 kg – 100 kg',
    category: 'Floor Stands & Bumper Racks',
    finish: 'Brushed Champagne Gold PVD',
    structuralProfile: 'Circular 360° Revolving Stand',
    dispatchReadiness: 'Same-Day Hyderabad Dispatch',
    stockStatus: 'Begum Bazaar Stock',
    moq: 'MOQ: 1 Unit',
    badge: '360° Smooth Bearing',
    badgeType: 'neutral',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0HLBsQ2x8AJzXEoJVqvzyV-5OpiH4flGKype5qElMKXwG-3WsQxOmA2-L329LsDifDj5sx-Tr2iAjnj7kMMMFe4vTTIFFI-vH4VFRjQBIuMbauQK9EdQO00-0aJLbN2wSWDYkyjba3wyrliIGQa1QFfaVWFPrf4mZTvCxsQQzBN1ipMs4Ye1BNAd2p7Tx4M_ymLAVAioaS9o1F3Oh2drZiy3aTOJqNtM0pXQscIrX3oT0VVv70T30',
    finishes: [
      { name: 'Brushed Gold', color: '#D4AF37' },
      { name: 'Mirror Chrome', color: '#E0E2E5' }
    ]
  },
  {
    id: 'ad-zrk-180',
    code: 'AD-ZRK-180',
    title: 'Industrial Z-Rack on Heavy Castor Wheels',
    description: 'Z-shaped nestable base for compact space-saving storage when idle. 3-inch locking polyurethane industrial castors.',
    price: 2150,
    originalPrice: 2900,
    unit: 'unit',
    rating: 4.9,
    reviewCount: 52,
    loadCapacity: '>100kg Heavy Duty',
    category: 'Floor Stands & Bumper Racks',
    finish: 'Mirror Chrome Finish',
    structuralProfile: 'Heavy Duty Bumper Perimeter Stand',
    dispatchReadiness: 'Same-Day Hyderabad Dispatch',
    stockStatus: 'In Stock',
    moq: 'MOQ: 2 Units',
    badge: 'Nesting Base',
    badgeType: 'neutral',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGZrsyV4bJ9YmBpaVFelpKwG4xNHd3AbYpX2FXmaNf1zrD-9mwPQ8w27l-kAmUq_qMvnhggNEnzD0CC7Ue3AtKde1IDvtOc2hbgOAiZDXBpYJxFmC52pu7lwlhhW3kaCJH77WPzQ23sCeGwlGJQwW9vQ2gtoq2g22Fd3kikAL-QV1_Li2hjgKGJFTr5QRi7iSntcdPbZHqMzct4lADY2Tv7NEZzK6goRkhOKOfxE0S7diKblfp1H64',
    finishes: [
      { name: 'Galvanized Chrome', color: '#E0E2E5' },
      { name: 'Industrial Black', color: '#1A1C20' }
    ]
  },
  {
    id: 'ad-wtf-290',
    code: 'AD-WTF-290',
    title: 'Stepped Waterfall Faceout Island Stand',
    description: '7-ball precision welded downward slant arms. Ensures merchandise faces forward toward showroom shoppers.',
    price: 2900,
    originalPrice: 3950,
    unit: 'unit',
    rating: 4.7,
    reviewCount: 29,
    loadCapacity: '50 kg – 100 kg',
    category: 'Floor Stands & Bumper Racks',
    finish: 'Matte Black Powder Coat',
    structuralProfile: '4-Way Stepped Waterfall Stand',
    dispatchReadiness: 'Same-Day Hyderabad Dispatch',
    stockStatus: 'Ready Dispatch',
    moq: 'MOQ: 1 Unit',
    badge: 'Faceout Display',
    badgeType: 'neutral',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5RjeTR39pmLpyYfm2yvAljgNw7vH035iHKATa6of3ZFvQyrWNruUQC1ovp3DySQrt5LIhlmAzLyhse9rsN8iSTobXcUnHesg2Vi-IbNSMWkojVI2fvrnldeeBmkfjLBg3pcuEDoeq3mzMDgrVBaNh8xisumC3vB1j1x_KcKgwTs8vvz3e1IVO3f0uYtimM4x2kE-XtwC1sA5XlzF1j4GcwcUcuEXTdObq-Bl7WWUxiBYOX0nuu_vP',
    finishes: [
      { name: 'Matte Black', color: '#1A1C20' },
      { name: 'Champagne Gold', color: '#D4AF37' }
    ]
  },
  {
    id: 'ad-wod-880',
    code: 'AD-WOD-880',
    title: 'Combination Wood Shelf & Metal Rack',
    description: 'Seasoned solid natural teak wood shelf module paired with electroplated titanium gold frame. For folded and hung garments.',
    price: 4800,
    originalPrice: 6500,
    unit: 'unit',
    rating: 4.9,
    reviewCount: 36,
    loadCapacity: '>100kg Heavy Duty',
    category: 'Floor Stands & Bumper Racks',
    finish: 'Natural Teak & Mild Steel',
    structuralProfile: 'Minimalist Single Bar Studio Stand',
    dispatchReadiness: 'Custom Made-to-Order (4 Days)',
    stockStatus: 'Architectural Series',
    moq: 'MOQ: 1 Unit',
    badge: 'Hybrid Wood + Metal',
    badgeType: 'secondary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNq2KS12teHoayxRigubLabkcosY2o8mKpmqqljySVKBPQOhYLK30KBFBvnSccV3W0FOQrTLZMXwTz3IeSu11nlQEbj8no1ya02pFc0sEEyLOYL6ujraEzbOca-S1U43n3FujjlSZ7PVbAg6yXi7WEabuedpKp-I26M6nOjr9ufzPWRUCc-degs9KQO3llxun3Bsc6yGNWM-i16kMiFZ3ggPNBRw0zGqVhFd5SHhHtlhL358dmwgL-',
    finishes: [
      { name: 'Natural Teak', color: '#8C5E3C' },
      { name: 'Titanium Gold', color: '#D4AF37' }
    ]
  }
];

export const TOP_SELLING_HOMEPAGE: Product[] = [
  {
    id: 'ad-tpr-739',
    code: 'AD-TPR-739',
    title: 'Triple Pipe Rack System (Heavy Duty 1.6mm)',
    description: 'High-load commercial ERW pipe frame with 8mm tempered glass tier and lower hanging rod.',
    price: 5450,
    originalPrice: 7800,
    unit: 'unit',
    rating: 4.8,
    reviewCount: 48,
    loadCapacity: '140 kg certified safe display capacity',
    category: 'Floor Stands & Bumper Racks',
    finish: 'Matte Black',
    structuralProfile: 'Triple Pipe Island Hanging Rack',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'Ranigunj Warehouse (84 Units Ready)',
    moq: 'MOQ: 1 Unit',
    badge: 'NO COD',
    badgeType: 'primary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXybVXMlvZGeKYb_0JXEtHxZmiY36LraReoSDO2Auwjuyr6Nr9AmLN02CqnVSfW5qty_u1k1zBD3_8xhryMVP33uzyGFfJT-Irp_zV2RwgYU3JRLGf_A_X5jCoLJ4YtNB_MLXGfONPve3BhVwvtJJNkGZE4FJ2H53n7H1J-0lWZWLhZREwRq9q-GBEXPajJREpKLmpuAXp1s4ZoBzc79alpLRtJ6Es_FBOpz6L-smTtuCpCvs9H85f',
    finishes: [
      { name: 'Matte Black', color: '#1A1C20' },
      { name: 'PVD Gold', color: '#D4AF37' },
      { name: 'Gloss White', color: '#EAEBED' }
    ]
  },
  {
    id: 'ad-wch-dutti',
    code: 'AD-WCH-520',
    title: 'Dutti Style Slotted Channel Rack System',
    description: 'Flush architectural wall slot channel system with cantilever glass shelf brackets and forward arms.',
    price: 260,
    originalPrice: 380,
    unit: 'ft',
    rating: 4.8,
    reviewCount: 35,
    loadCapacity: '90 kg per span',
    category: 'Wall Systems & Channels',
    finish: 'Matte Black Powder Coat',
    structuralProfile: 'Wall Slotted Channel',
    dispatchReadiness: 'Ready Dispatch',
    stockStatus: 'In Stock',
    moq: 'MOQ: 10 Ft',
    badge: 'Dutti Style',
    badgeType: 'neutral',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVNvkNuZowrWf1dlKaQ9PAhnG5XqL-culdoxgiC6AXE0ZUt6YD6LDBRmHv9ZIR5XxNLNIwARAPWWxDQPa2mSvIEyBOmuRSDMz0vnZ9Rg8bMazkPUP3Lp1sL7tgBMRO-gN2Cv3nrmxs2Jjvuv6xUCTsZNEAtxsGSEh8vbDOKTIOV1bbYPjsB1jBo_-S2IjbM9JN0LQFLvXzCOKCZYHG2w6ApnZref1PMgulE-M47pn9XZIYqEwLy-xT',
    finishes: [
      { name: 'Matte Black', color: '#1A1C20' },
      { name: 'Brushed Gold', color: '#D4AF37' }
    ]
  },
  {
    id: 'ad-wsh-145',
    code: 'AD-WSH-145',
    title: 'Self and Hanging Teak Wood Shelf Rod',
    description: 'Wall mounted solid natural teak wood plank shelf with industrial matte black iron pipe hanging rod.',
    price: 2150,
    originalPrice: 3200,
    unit: 'unit',
    rating: 4.9,
    reviewCount: 62,
    loadCapacity: '60 kg continuous',
    category: 'Self & Hanging Rods',
    finish: 'Natural Teak & Mild Steel',
    structuralProfile: 'Wall Mounted Rod',
    dispatchReadiness: 'Ready Dispatch',
    stockStatus: 'Depot Ready',
    moq: 'MOQ: 1 Unit',
    badge: 'Trending',
    badgeType: 'secondary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZAb6dC9wseZhTD1es6eKfy7a6YaIm5dCB0OiQfQhcorOJulbUp20RZfyYVFfuiERhjvTiZZ9_ln6o1szmyIVb_Azc3CgBxpHjDjzVfaVT69x_QFy4apXDIl_grvEGM9pWES1O8UcHcihDOufp3nOvavuESkRtdXKsrpAwuDMoqXy_Ob5KfAPfJfVyh4EXEqGQND3E_D7Xur2jq15p6UAvqis2hKeHwMn0RZT-zBv0QlGcw89qDQKt',
    finishes: [
      { name: 'Natural Teak', color: '#8C5E3C' },
      { name: 'Industrial Black', color: '#1A1C20' }
    ]
  },
  {
    id: 'ad-bds-260',
    code: 'AD-BDS-260',
    title: 'Bumper Exhibition Rolling Stand (Double Tier)',
    description: 'Heavy duty portable exhibition clothing rack on 3-inch locking polyurethane industrial castors.',
    price: 3400,
    originalPrice: 4500,
    unit: 'unit',
    rating: 4.9,
    reviewCount: 29,
    loadCapacity: '150 kg roll load',
    category: 'Floor Stands & Bumper Racks',
    finish: 'Industrial Slate Steel',
    structuralProfile: 'Heavy Duty Bumper Perimeter Stand',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'Ranigunj Stock',
    moq: 'MOQ: 1 Unit',
    badge: '150kg Load',
    badgeType: 'success',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjsvmXZlohMZptyHS-gMam8Ct3W1nVaqsr_mc0zz2CFqebliYcutec3B9BqZlE6DXkvhqWI7GDLzzMYlG39q8zVA9hzToMg32UZPukc45kD7EsyTvVHGXhV2FwJETW4HGVdCH5tsOWaHksqiYH8uqi33EAjJs1Z1xhpkTxYcv-L-yfmtMf0mvfHtQanYLYdLU0NxlKlIok4FYgainzT43AvDWJaPz25hj292y3bKucJBicVMNTHk09',
    finishes: [
      { name: 'Industrial Black', color: '#1A1C20' },
      { name: 'Mirror Chrome', color: '#E0E2E5' }
    ]
  }
];

export const PROJECT_REELS: ProjectReel[] = [
  {
    id: 'aura-couture-jubilee',
    title: 'Aura Couture Studio, Jubilee Hills',
    client: 'Aura Couture Designer Studio',
    location: 'Road No. 36, Jubilee Hills, Hyderabad',
    area: '1,200 sq.ft',
    duration: '0:45s Reel',
    reelLikes: '184 Likes',
    category: 'bridal',
    categoryLabel: 'Luxury Bridal & Couture',
    description: 'Engineered for heavy Zardozi bridal lehengas weighing up to 22kg each. Completed turnkey fixture installation in 96 hours from our Hyderabad depot.',
    turnkeyTime: 'Turnkey: 4 Days',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCQ8ql1AJw3Lrf8uGZ-252f70TGDyEPJ6t3t_xryChqmTTRw1FiJS3Ze9Us-vmG2fZaPHzuxe70NoKEWlSgjUKmOAR1lyZcTagSxSRQr1qMIkb2bQtPI2-txQXfhvhXejLtSoG0BwH3Cwjgjd_fevp5bkUPqS5yxNl5erx0C7bskpXMXT9zUltiFdStiLdV9ADPqw2snrP8zW3oc2vIRpniXu-3Fpjn8uKt5nrlmltE7quTtWSWMCr',
    specs: {
      floorUnits: '18 Brushed PVD Gold Arched Racks',
      wallSlotChannels: '60 running ft + Tempered Glass',
      special: '4 Tailored Velvet Bridal Forms'
    },
    finishes: [
      { name: 'Brushed Architectural Gold', color: '#D4AF37' },
      { name: 'Ivory Velvet', color: '#F5F2EB' }
    ],
    finishLabel: 'PVD Gold Finish'
  },
  {
    id: 'urban-thread-hitec',
    title: "Urban Thread Men's Casuals, Hitec City",
    client: 'Urban Thread Apparel',
    location: 'Madhapur Hitec City, Hyderabad',
    area: '850 sq.ft',
    duration: '1:12m Reel',
    reelLikes: '97 Likes',
    category: 'streetwear',
    categoryLabel: "Men's Streetwear & Heavy Denim",
    description: 'High-density store layout optimizing 850 sq.ft. Uses heavy-duty triple pipe racks for multi-tier display of shirts, heavy wash denim, and utility cargo trousers.',
    turnkeyTime: 'Zero Sag @ 150kg',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiZpk8-izM0KvUQ9rURmtxr2hCIzuS9xko81CFG_fl8z2fPOK4jn481yvHYVCYvKlrZCuUh_pfaml9VCp_daMWkW1dPltAQUipkbJDFYTvCegl7-2vtkc7bE1SjeFUreuDd-Z__-BCEOrsJVvoHJfQQzZVdYudvZEoKtjoKcPJrwtxh6Fq7D17dNJHyvrAxx2v6B0c-aE2wCM1ZlZKNi4paLP1cfZPu7O6zO7HfDLFs46MVmC98odr',
    specs: {
      floorUnits: '12 Matte Black Heavy Duty Triple Racks',
      wallSlotChannels: '30ft Double Slotted Channel + Rods',
      special: '600 Heavy-Shoulder Rubberized Hangers'
    },
    finishes: [
      { name: 'Matte Industrial Slate', color: '#1A1C20' },
      { name: 'Brushed Steel', color: '#76777B' }
    ],
    finishLabel: 'Commercial Matte Finish'
  },
  {
    id: 'sri-balaji-begum-bazaar',
    title: 'Sri Balaji Saree Wholesalers, Begum Bazaar',
    client: 'Sri Balaji Wholesale Depot',
    location: 'Near Fish Market Complex, Begum Bazaar, Hyderabad',
    area: '2,800 sq.ft',
    duration: '1:40m Full Walkthrough',
    reelLikes: '342 Likes',
    category: 'wholesale',
    categoryLabel: 'High Volume Wholesale Depot',
    description: 'Engineered for extreme continuous weight. Capable of supporting over 4,500 folded Kanchipuram and Banarasi sarees without horizontal bar deflection.',
    turnkeyTime: '2.0mm ERW Steel Build',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-L3WcQDXjlVJwnD62QuII6hvZNVXQHP0d77lRnxkINhJ2bGntNtpx7cPMmA_qdmTd59KlGOxkgIojDNZ809kOFGZd7_h1zJdWmOhlUC_siqXs-u8yY-JNhkKQ7ZnYtIVoeGyIrZv2meIN_epsEob8-s-Vpgt-crETo0fduO2HdMA-xnP0ljhrqfJwV_DOwX1CKkkGBhnblhnoHHzNHdlGOwxKFmiMXt9KrpD6vMnNTSMobG4KldG0',
    specs: {
      floorUnits: 'Tiered 4-Step Saree Stands (2.0mm Gauge)',
      wallSlotChannels: '16 Lockable Industrial Caster Stands',
      special: 'Tested up to 320kg per bay'
    },
    finishes: [
      { name: 'High-Gloss Off-White', color: '#FFFFFF' },
      { name: 'Matte Black', color: '#1A1C20' }
    ],
    finishLabel: 'Powder Coated'
  },
  {
    id: 'velvet-trunk-himayatnagar',
    title: 'The Velvet Trunk, Himayatnagar',
    client: 'The Velvet Trunk Kids & Contemporary',
    location: 'Street #3, Himayatnagar, Hyderabad',
    area: '600 sq.ft',
    duration: '0:38s Reel',
    reelLikes: '76 Likes',
    category: 'boutiques',
    categoryLabel: 'Kids & Contemporary Boutique',
    description: 'Warm architectural synthesis pairing matte black industrial curved brackets with solid lacquered rubberwood shelving planks for children and ethnic party-wear.',
    turnkeyTime: 'Curved Arch Rails',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpKOJVdQq7_OZvaSBCGrrN5gT9by9wm6azg6E_GAVq8SMsfu07KOdz3ihitwP0rTg7TQ6EUb5ke2oGyIYShu1paFxjbgMPaWW3MLTwDpLCGKIrH4O6JpkZ6yZQm9JcLBHnDqDqAeKZGrsK_Y7hDqQUZI0A_fM7aPF9sis5Lnr_6GJ5M6AaZkx06_plAmTYmZajvY-ZCeyhg7wuwp7VM21OXbeRH6PHWnFH-5aEBDAELuGpPyD9KZr2',
    specs: {
      floorUnits: '24 Oiled Wood Wall Racks',
      wallSlotChannels: 'Industrial Flange Pipe Assemblies',
      special: '4 Toddler & Teen Flexible Forms'
    },
    finishes: [
      { name: 'Lacquered Teak', color: '#8C5E3C' },
      { name: 'Matte Black', color: '#1A1C20' }
    ],
    finishLabel: 'Wood + Steel Combo'
  },
  {
    id: 'pvd-gold-banjara-hills',
    title: 'PVD Gold Boutique, Banjara Hills Road #10',
    client: 'Vogue & Heritage Pret',
    location: 'Road #10, Banjara Hills, Hyderabad',
    area: '1,500 sq.ft',
    duration: '0:52s Reel',
    reelLikes: '215 Likes',
    category: 'boutiques',
    categoryLabel: 'Haute Couture & Indo-Western',
    description: 'Exclusively customized with electro-deposited Titanium Gold (PVD), guaranteeing zero tarnishing, fingerprint-resistance, and 10+ years anti-chip durability.',
    turnkeyTime: 'Mirror Brass Tone',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8zEd9IazgeWHZGo-cH34gyxdaogQjFUIlIkassN-aH0S_Ke3zfesEImiJgtDInJO5lPcGXZs8TkOR915UYgu6QPi1V15vUWN4llHphmWfYUjY4jAxSQASPBKEJ-AIkPBjmBi5JwmhWgaJjh7xoqXV1e-3t5ZYfXpcRpCHmhVyWa-EtMhxNRaTx-5Ihwiol6nwIAr2EPVFGCBXV1kGqebhKpxz2UKuD13Kjb7AWHPX0GnujBjKVeck',
    specs: {
      floorUnits: '8 Gold Bumper Double Stands',
      wallSlotChannels: '45 running ft Mirror Gold Channels',
      special: 'Swivel Gold Hangers (400 Units)'
    },
    finishes: [
      { name: 'Titanium PVD Gold', color: '#D4AF37' },
      { name: 'Mirror Chrome', color: '#E0E2E5' }
    ],
    finishLabel: 'PVD Electroplated'
  },
  {
    id: 'ranigunj-stress-test',
    title: 'Weld Integrity & Load Stress Test',
    client: 'Ranigunj Central Quality Laboratory',
    location: 'Ranigunj Wholesale Unit, Secunderabad',
    area: 'Factory Test Floor',
    duration: 'Stress Test Reel',
    reelLikes: '540 Likes',
    category: 'wholesale',
    categoryLabel: 'Quality Assurance Proof',
    description: 'Recorded directly at our Ranigunj wholesale unit. Two staff members (combined weight: 160kg) hang from the crossbar of our stock AD-TPR rack with zero joint failure.',
    turnkeyTime: '0.0mm at 160kg distributed load',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnYEJ8lLidPjRZuGBaVxElmnog9g8xrl3kCAFrz7olAkqd-zfvE0B7M3UQ7eNC6fOkeqlVNziesqkS28DrN-JaT9fyuD_2_5zI_x_iTA170yjibh7G9D5ujEg3OdoXKCTQe6r_bCwEaqGak7rnjaDeIxlLc5U_DNP_ZAGHXgAPlmq_MpuNaMkuBOswQzLK69ooZwQrPsRTZg4D9-a4k3SexHILUv0_c8isXCLzrHZi4iufRfWnhPam',
    specs: {
      floorUnits: '1.6mm - 2.0mm Heavy ERW Steel',
      wallSlotChannels: 'Full Perimeter CO2 MIG Welding',
      special: 'Certified Zero Joint Fracture'
    },
    finishes: [
      { name: 'Matte Black', color: '#1A1C20' }
    ],
    finishLabel: 'Structural Grade',
    badgeText: 'Stress Test'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Sunita K. Rao',
    initials: 'SK',
    role: 'Studio Founder',
    location: 'Jubilee Hills, Hyderabad',
    rating: 5,
    text: '“We opened our designer bridal boutique on Road No. 36 Jubilee Hills. All Display delivered 20 brushed gold arched racks and slotted channels within 3 days. The PVD gold finish doesn\'t chip even with heavy heavy lehengas. Excellent Ranigunj dispatch.”'
  },
  {
    id: 'rev-2',
    author: 'Vamsi Krishna Reddy',
    initials: 'VR',
    role: 'Denim Depot',
    location: 'MG Road, Vijayawada',
    rating: 5,
    text: '“We were skeptical about 100% prepaid payment without COD, but they gave us a live video call showing our 14 triple pipe racks packed in bubble wrap and wooden crates before loading the transport lorry to Vijayawada. Reached safely in 24 hours.”'
  },
  {
    id: 'rev-3',
    author: 'Mohammed Arif',
    initials: 'MA',
    role: 'Arif Menswear',
    location: 'Begum Bazaar Wholesale, Hyderabad',
    rating: 5,
    text: '“Their Begum Bazaar depot is the best wholesale spot for cloth store fixtures in Hyderabad. The heavy gauge steel does not bend like generic local fabrication. All 8 tailor dummies and 800 wooden hangers arrived in immaculate condition.”'
  }
];

export const INITIAL_CART: CartItem[] = [
  {
    id: 'cart-1',
    productId: 'ad-tpr-739',
    sku: 'AD-TPR-739',
    title: 'AD-TPR-739 Triple Pipe Rack System',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFQkP_VXAoHUz4TnO60Bt_oJOV7G5TsS0isispZNz0iKrfmTSpBsYomjoxCaVmk2wTjJEuciJa--j-seQc6RXCqlkyjrLZB8hfJL_nVc7m7u1PMFQDD-1NJ1vH48zDbcr8_SaivvTkSeNY4CjVD6b7-zXqKriNLcp_IESTMFrNNLrrv4-WSjAcsCfM__5ohdwxuMFpRtmVlp81V18LJQFbYd8Q4_QII2QV70isqyYLrps6cWgiFoJY',
    unitPrice: 3850,
    quantity: 4,
    moq: 2,
    unitLabel: 'Unit',
    finish: 'Matte Black',
    sizeOrSpec: '6.5ft (4 Tiers + Glass Deck)',
    gauge: '1.6mm Commercial Gauge',
    packingType: 'Heavy Crated Packing'
  },
  {
    id: 'cart-2',
    productId: 'ad-wch-520',
    sku: 'AD-WCH-520',
    title: 'AD-WCH-520 Slotted Wall Channel System',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVNvkNuZowrWf1dlKaQ9PAhnG5XqL-culdoxgiC6AXE0ZUt6YD6LDBRmHv9ZIR5XxNLNIwARAPWWxDQPa2mSvIEyBOmuRSDMz0vnZ9Rg8bMazkPUP3Lp1sL7tgBMRO-gN2Cv3nrmxs2Jjvuv6xUCTsZNEAtxsGSEh8vbDOKTIOV1bbYPjsB1jBo_-S2IjbM9JN0LQFLvXzCOKCZYHG2w6ApnZref1PMgulE-M47pn9XZIYqEwLy-xT',
    unitPrice: 520,
    quantity: 10,
    moq: 5,
    unitLabel: 'Ft',
    finish: 'Industrial Black + Teak Shelf',
    sizeOrSpec: 'Slotted Post & Rod Fixture',
    gauge: 'Wall Anchor Kits Incl.',
    packingType: 'Precision Slotting',
    isLinear: true
  },
  {
    id: 'cart-3',
    productId: 'ad-mf-880',
    sku: 'AD-MF-880',
    title: 'AD-MF-880 Abstract Fiberglass Mannequin',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANKdoF2fJzGaZ2PkgUR5MBdFVxCvnBmmBU_Kb4p1F4G_EwXokdEU7shOQMhrvEZKqShMqLhYp3J-gJ5zBsovdz1EPxRAYpIa5Hx1tTEuJkYA24crSZgCS1P1TDgfAn-E6jAZeseFqnfjZ7RyoqU48Tx_8wD35xIvoaNaPyEdiPPovNq-9xit2xaZgiplP71oFkS4nZmYIRAMSAGqY7yNZ3H2FMMYU1u3pQ8lvm5qIpD9z0CJ93rqqE',
    unitPrice: 5200,
    quantity: 2,
    moq: 1,
    unitLabel: 'Unit',
    finish: 'Matte Off-White Finish',
    sizeOrSpec: 'Detachable Magnetic Fittings',
    gauge: 'Heavy Glass Base Included',
    packingType: 'Shock-Proof Bubble Wrap'
  }
];

export const STANDARDS_CATALOG_TABLE = [
  {
    model: 'Triple Pipe Floor System',
    code: 'AD-TPR-01',
    dimensions: '5ft (L) x 18" (W) x 7ft (H)',
    load: '120 kg distributed',
    finish: 'Matte White / Black',
    priceSample: 4250,
    priceBulk: 3650,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANfcLHGi4lVreYel-BlwuM1pTvecfJv9nRNnM84e7Lelj0I_G-hjEMMpM3vpIr8Z3G2MCtXoxZE_RV2KspORksfRx8tw2rZ6S1M0CGG05erGzLdqA0fK9RpjTseAMI866FNs2JlsKXroVKXTvk6xAz4zVplfqNerAMfjScu5PfztG_kD80xzxzTff1EUKaTXAN85t4oFgSFplDvB_rwr5BsDY4du6353WdCJyl0AikHpbLk1W3TwcF'
  },
  {
    model: 'PVD Brushed Gold Wall Channel',
    code: 'AD-GWC-08',
    dimensions: '8ft Length (1.5mm Gauge)',
    load: '90 kg per span',
    finish: 'Brushed Champagne Gold',
    priceSample: 1850,
    priceBulk: 1450,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClT6ge6RN12UIi2RPVOANrMrDgqsYuTP7Ls5jY1AC5IyDOy62CkKre7woNRLE1b5Q2X5URkJbb2cOmLgTtmA_Zll6rTYfA1udmKC6Fp0Ussb5LDs9-jq0F5wiDGzsY2A1O9ac3zG9G2X0Oz9rYXBqy4waXfeT2Dxu2U4LVMMn713ljJsdQ_jVd5UJRYuoD41fzms9Ox-G4HgOqcjl__CgxabBUt6NZDMXZwyu5Bse_KcejpmuzeIFD'
  },
  {
    model: 'Bumper Exhibition Trolley Rack',
    code: 'AD-BUM-24',
    dimensions: '4.5ft (L) x 20" (W) x 5.5ft (H)',
    load: '150 kg roll load',
    finish: 'Industrial Slate Steel',
    priceSample: 3400,
    priceBulk: 2850,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiQf3OvWoegDvH-m2yt1aDU8yvyqpoecTKbSZJDwX4A8bPR19PPCM4o2ABBmYmoVI2eaGXDzf0ELqxF5T1n7oNrlELnQwSdFiH9PWzdi8LsORyGW_5cG6r8BTtTA5v3I_9RxEmS8smmDid0UzTQ-VUthqdf4jrTRNaAacfRKyIi7hlkkF0fr_C8TJbjp4GyNyS6uhNmrYJq2GSQDNBtuEKfvT-kgzweIEfAuOqKIWPYSEbh0rKlKtc'
  },
  {
    model: 'Fiberglass Headless Mannequin',
    code: 'AD-MNQ-03',
    dimensions: 'Male / Female 5.9ft',
    load: 'Tempered Glass Stand',
    finish: 'Matte Chalk White',
    priceSample: 5200,
    priceBulk: 4400,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEqCcjy_fYK3Cw7gryoeOyyDmLx8_L27fTn5TgzFm-4mQUyTUdcBdaxLtdJxklBXMHNPOLCAYM_sCNW7FNGXLoL9_GP-BcQaz-PM2AwuDDuNP5x4z5vyRPA3RvOf5nFpsBQ6Cyb6Nk1p8PYC3D6uBn6tmZDl8mSnXue-iLR_zTpRjBDCa5XHAbpNKx4qIbxMRCSxAR9kJWcf4Cjmkpbv-pJIyWwPdZn8nSVsl62ygi7f5hyIJVIrH9'
  }
];
