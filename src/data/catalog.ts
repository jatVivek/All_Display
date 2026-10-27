import { Product, ProjectReel, Review } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Premium 4 Layer Earrings Display Stand
  {
    id: 'vp-eds-401',
    code: 'VP-EDS-401',
    title: 'Premium 4 Layer Earrings Display Stand (size 11.5*11.5)',
    description: 'White wooden frame with multi-tier earring hang slots. Ideal for counters, pop-up exhibitions and retail boutique showcases. Smooth anti-scratch lacquer coating with precision pre-drilled holes for stud and dangle earrings.',
    price: 850,
    originalPrice: 950,
    unit: 'piece',
    rating: 4.9,
    reviewCount: 64,
    loadCapacity: 'Holds up to 48 Earring Pairs',
    category: 'Display Stand',
    finish: 'Pure Matte White Wood',
    structuralProfile: 'Tiered Counter Stand',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'In Stock (Chennai Depot)',
    moq: 'MOQ: 1 Unit',
    badge: 'Best Seller',
    badgeType: 'primary',
    image: '/assets/vinayak/prod_earring_stand.png',
    images: [
      '/assets/vinayak/prod_earring_stand.png',
      '/assets/vinayak/deal_left_banner.png',
      '/assets/vinayak/req_retail_shops.png'
    ],
    finishes: [
      { name: 'Matte White', color: '#F8FAFC' },
      { name: 'Natural Pine', color: '#E2C29D' },
      { name: 'Velvet Black', color: '#1E293B' }
    ],
    requirements: ['retail-shops', 'instagram-shop', 'new-jewellery'],
    material: 'Solid Wood',
    specs: {
      dimensions: '11.5 × 11.5 × 3.5 inches',
      weight: '480 grams',
      color: 'Matte White / Natural / Black'
    },
    variations: [
      {
        id: 'var-color',
        name: 'Wood Finish',
        options: [
          { id: 'opt-white', name: 'Pure Matte White Wood', price: 850, sku: 'VP-EDS-401-WHT', inStock: true },
          { id: 'opt-pine', name: 'Natural Honey Pine Wood', price: 890, sku: 'VP-EDS-401-PNE', inStock: true },
          { id: 'opt-black', name: 'Sleek Ebony Black Wood', price: 890, sku: 'VP-EDS-401-BLK', inStock: true }
        ]
      },
      {
        id: 'var-tier',
        name: 'Tier Height',
        options: [
          { id: 'opt-4t', name: '4-Layer Standard (48 Pairs)', price: 850, sku: 'VP-EDS-401-4L', inStock: true },
          { id: 'opt-6t', name: '6-Layer Exhibition Stand (72 Pairs)', price: 1150, originalPrice: 1350, sku: 'VP-EDS-401-6L', inStock: true }
        ]
      }
    ]
  },

  // 2. Premium Round Velvet Jewellery Display Tray
  {
    id: 'vp-vtr-102',
    code: 'VP-VTR-102',
    title: 'Premium Round Velvet Jewellery Display Tray',
    description: 'Ultra-soft plush velvet round stacking trays for rings, pendants, and delicate bridal ornaments with smooth raised perimeter. Perfect for counter presentation, luxury store showcases, and flatlay photography.',
    price: 450,
    originalPrice: 550,
    unit: 'tray',
    rating: 4.8,
    reviewCount: 42,
    loadCapacity: 'Cushioned Velvet Surface',
    category: 'Display Tray',
    finish: 'Plush Velvet Multicolour',
    structuralProfile: 'Stackable Circular Tray',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'In Stock',
    moq: 'MOQ: 1 Unit',
    badge: 'Popular',
    badgeType: 'secondary',
    image: '/assets/vinayak/prod_round_tray.png',
    images: [
      '/assets/vinayak/prod_round_tray.png',
      '/assets/vinayak/req_instagram_shop.png',
      '/assets/vinayak/shop_banner.png'
    ],
    finishes: [
      { name: 'Midnight Black', color: '#0F172A' },
      { name: 'Dusty Rose Pink', color: '#F472B6' },
      { name: 'Emerald Teal', color: '#0D9488' },
      { name: 'Oatmeal Beige', color: '#E2D9CC' }
    ],
    requirements: ['instagram-shop', 'retail-shops', 'new-jewellery'],
    material: 'Velvet',
    specs: {
      dimensions: '8 Inch Diameter × 1.2 Inch Depth',
      weight: '260 grams',
      color: 'Multicolor Velvet'
    },
    variations: [
      {
        id: 'var-color',
        name: 'Velvet Color',
        options: [
          { id: 'opt-teal', name: 'Emerald Teal Velvet', price: 450, sku: 'VP-VTR-102-TEA', inStock: true },
          { id: 'opt-pink', name: 'Dusty Rose Pink Velvet', price: 450, sku: 'VP-VTR-102-PNK', inStock: true },
          { id: 'opt-black', name: 'Midnight Obsidian Black', price: 450, sku: 'VP-VTR-102-BLK', inStock: true },
          { id: 'opt-beige', name: 'Oatmeal Champagne Beige', price: 470, sku: 'VP-VTR-102-BGE', inStock: true }
        ]
      },
      {
        id: 'var-insert',
        name: 'Tray Insert Layout',
        options: [
          { id: 'opt-flat', name: 'Flat Showcase Pad (Versatile)', price: 450, inStock: true },
          { id: 'opt-ring', name: '7-Row Ring Slot Pad', price: 490, inStock: true }
        ]
      }
    ]
  },

  // 3. Premium Velvet Necklace & Earrings Jewellery Display Bust
  {
    id: 'vp-nbd-205',
    code: 'VP-NBD-205',
    title: 'Premium Velvet Necklace & Earrings Jewellery Display Bust',
    description: 'Sculpted deep teal curved velvet display base with dedicated slots for heavy necklace set and matching drop earrings. Perfectly angles necklaces for counter displays and customer photos.',
    price: 450,
    originalPrice: 550,
    unit: 'set',
    rating: 4.9,
    reviewCount: 89,
    loadCapacity: 'Heavy Bridal Set Holder',
    category: 'Display Bust',
    finish: 'Royal Teal Velvet',
    structuralProfile: 'Contoured Display Plate',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'In Stock',
    moq: 'MOQ: 1 Unit',
    badge: 'Top Selling',
    badgeType: 'primary',
    image: '/assets/vinayak/prod_velvet_necklace.png',
    images: [
      '/assets/vinayak/prod_velvet_necklace.png',
      '/assets/vinayak/req_online_sellers.png',
      '/assets/vinayak/prod_10in_bust.png'
    ],
    finishes: [
      { name: 'Royal Teal', color: '#0F766E' },
      { name: 'Ruby Maroon', color: '#881337' },
      { name: 'Obsidian Black', color: '#1E293B' }
    ],
    requirements: ['retail-shops', 'instagram-shop', 'new-jewellery'],
    material: 'Velvet',
    specs: {
      dimensions: '10 × 8 × 4.5 inches',
      weight: '380 grams',
      color: 'Royal Teal'
    },
    variations: [
      {
        id: 'var-shade',
        name: 'Velvet Color',
        options: [
          { id: 'opt-teal', name: 'Royal Peacock Teal', price: 450, sku: 'VP-NBD-205-TEA', inStock: true },
          { id: 'opt-maroon', name: 'Bridal Crimson Maroon', price: 450, sku: 'VP-NBD-205-MRN', inStock: true },
          { id: 'opt-black', name: 'Jet Velvet Black', price: 450, sku: 'VP-NBD-205-BLK', inStock: true }
        ]
      }
    ]
  },

  // 4. 100 Pcs Pink Jewellery Display Cards with Hand Artwork
  {
    id: 'vp-pdc-301',
    code: 'VP-PDC-301',
    title: '100 Pcs Pink Jewellery Display Cards with Hand Artwork',
    description: 'Premium 350 GSM cardstock with aesthetic hand silhouette illustrations, precision pre-punched holes for earrings, rings, and delicate chain pendants.',
    price: 200,
    originalPrice: 300,
    unit: 'pack (100 pcs)',
    rating: 5.0,
    reviewCount: 112,
    loadCapacity: '350 GSM High-Grade Board',
    category: 'Display Cards',
    finish: 'Matte Pastel Finish',
    structuralProfile: 'Die-cut Jewelry Cards',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'In Stock',
    moq: 'MOQ: 1 Pack (100 Pcs)',
    badge: 'Pack of 100',
    badgeType: 'neutral',
    image: '/assets/vinayak/prod_pink_cards.png',
    images: [
      '/assets/vinayak/prod_pink_cards.png',
      '/assets/vinayak/prod_3x3_cards.png',
      '/assets/vinayak/prod_blue_steel_cards.png'
    ],
    finishes: [
      { name: 'Blush Pink', color: '#FBCFE8' },
      { name: 'Minimal White', color: '#FFFFFF' },
      { name: 'Kraft Brown', color: '#D97706' }
    ],
    requirements: ['online-sellers', 'instagram-shop', 'new-jewellery'],
    material: 'Paper / Board',
    specs: {
      dimensions: '3 × 3.5 inches',
      weight: '180 grams per pack of 100',
      color: 'Pastel Pink Art'
    },
    variations: [
      {
        id: 'var-qty',
        name: 'Pack Size',
        options: [
          { id: 'opt-100', name: '1 Pack (100 Pcs)', price: 200, originalPrice: 300, sku: 'VP-PDC-301-100', inStock: true },
          { id: 'opt-500', name: '5 Packs (500 Pcs Bulk - Save ₹100)', price: 900, originalPrice: 1200, sku: 'VP-PDC-301-500', inStock: true },
          { id: 'opt-1000', name: '10 Packs (1,000 Pcs Wholesale - Save ₹350)', price: 1650, originalPrice: 2200, sku: 'VP-PDC-301-1K', inStock: true }
        ]
      },
      {
        id: 'var-art',
        name: 'Artwork Style',
        options: [
          { id: 'opt-hand', name: 'Blush Pink Hand Silhouette', inStock: true },
          { id: 'opt-minimal', name: 'Minimal Ivory White Outline', inStock: true },
          { id: 'opt-kraft', name: 'Eco Kraft Bohemian Art', inStock: true }
        ]
      }
    ]
  },

  // 5. 1 Inch Tape Dispenser Machine Heavy Duty Desk
  {
    id: 'vp-tdm-501',
    code: 'VP-TDM-501',
    title: '1 Inch Tape Dispenser Machine Heavy Duty Desk',
    description: 'Cast iron weighted base non-slip tape cutter machine for high-speed e-commerce packing benches and dispatch desks. Features razor-sharp stainless steel serrated blade.',
    price: 120,
    originalPrice: 220,
    unit: 'piece',
    rating: 4.7,
    reviewCount: 38,
    loadCapacity: 'Heavy Weighted Anti-Skid Base',
    category: 'Packaging Tools',
    finish: 'Industrial Azure Blue',
    structuralProfile: 'Stationery Dispenser',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'In Stock',
    moq: 'MOQ: 1 Unit',
    badge: 'Heavy Duty',
    badgeType: 'secondary',
    image: '/assets/vinayak/prod_tape_dispenser.png',
    images: [
      '/assets/vinayak/prod_tape_dispenser.png',
      '/assets/vinayak/prod_wonder_tape.png'
    ],
    finishes: [
      { name: 'Azure Blue', color: '#0284C7' },
      { name: 'Slate Black', color: '#1E293B' }
    ],
    requirements: ['online-sellers', 'retail-shops'],
    material: 'Metal & ABS',
    specs: {
      dimensions: '8 × 3.5 × 4 inches',
      weight: '850 grams (Weighted Base)',
      color: 'Azure Blue'
    },
    variations: [
      {
        id: 'var-bundle',
        name: 'Packaging Bundle',
        options: [
          { id: 'opt-single', name: 'Dispenser Machine Only', price: 120, originalPrice: 220, sku: 'VP-TDM-501', inStock: true },
          { id: 'opt-bundle', name: 'Dispenser + 5 Wonder Tape Rolls Kit', price: 290, originalPrice: 420, sku: 'VP-TDM-501-KIT', inStock: true }
        ]
      }
    ]
  },

  // 6. 1 Inch Transparent Wonder Tape Roll – 150 Meter Clear
  {
    id: 'vp-wtr-502',
    code: 'VP-WTR-502',
    title: '1 Inch Transparent Wonder Tape Roll – 150 Meter Clear',
    description: 'High-tack acrylic adhesive clear packaging tape for jewelry boxes, tamper-evident mailers and polybags. Resists tearing and yellowing.',
    price: 40,
    originalPrice: 100,
    unit: 'roll',
    rating: 4.9,
    reviewCount: 230,
    loadCapacity: '150 Meter High Tensile',
    category: 'Packaging Tools',
    finish: 'Ultra Clear Gloss',
    structuralProfile: 'Adhesive Roll',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'Bulk Ready',
    moq: 'MOQ: 5 Rolls',
    badge: '150m Clear',
    badgeType: 'neutral',
    image: '/assets/vinayak/prod_wonder_tape.png',
    images: [
      '/assets/vinayak/prod_wonder_tape.png',
      '/assets/vinayak/prod_tape_dispenser.png'
    ],
    finishes: [
      { name: 'Crystal Clear', color: '#F8FAFC' }
    ],
    requirements: ['online-sellers', 'retail-shops'],
    material: 'Polymer Adhesive',
    specs: {
      dimensions: '1 Inch Width × 150 Meter Length',
      weight: '120 grams per roll',
      color: 'Crystal Clear'
    },
    variations: [
      {
        id: 'var-pack',
        name: 'Pack Slab',
        options: [
          { id: 'opt-single', name: 'Sample Roll (1 Roll)', price: 40, originalPrice: 100, sku: 'VP-WTR-502-1R', inStock: true },
          { id: 'opt-6roll', name: 'Pack of 6 Rolls (Save ₹30)', price: 210, originalPrice: 300, sku: 'VP-WTR-502-6R', inStock: true },
          { id: 'opt-36roll', name: 'Box of 36 Rolls Wholesale', price: 1190, originalPrice: 1600, sku: 'VP-WTR-502-36R', inStock: true }
        ]
      }
    ]
  },

  // 7. 1 Inch White Jewellery Price Sticker Roll
  {
    id: 'vp-psr-503',
    code: 'VP-PSR-503',
    title: '1 Inch White Jewellery Price Sticker Roll – Self Adhesive',
    description: 'Barcode & handwritten dumbbell price tags for rings, necklaces, and bangles. Non-damaging removable residue center fold design.',
    price: 250,
    originalPrice: 350,
    unit: 'roll (1000 tags)',
    rating: 4.8,
    reviewCount: 77,
    loadCapacity: '1,000 Dumbbell Tags / Roll',
    category: 'Packaging Tools',
    finish: 'Coated Gloss White',
    structuralProfile: 'Perforated Tag Roll',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'In Stock',
    moq: 'MOQ: 1 Roll',
    badge: 'Self Adhesive',
    badgeType: 'secondary',
    image: '/assets/vinayak/prod_price_sticker.png',
    images: [
      '/assets/vinayak/prod_price_sticker.png',
      '/assets/vinayak/prod_3x3_cards.png'
    ],
    finishes: [
      { name: 'Pure White', color: '#FFFFFF' },
      { name: 'Gold Trim', color: '#EAB308' }
    ],
    requirements: ['online-sellers', 'retail-shops', 'new-jewellery'],
    material: 'Coated Adhesive Paper',
    specs: {
      dimensions: 'Dumbbell Shape (1,000 Tags/Roll)',
      weight: '140 grams',
      color: 'Gloss White'
    },
    variations: [
      {
        id: 'var-roll',
        name: 'Quantity',
        options: [
          { id: 'opt-1roll', name: '1 Roll (1,000 Tags)', price: 250, originalPrice: 350, sku: 'VP-PSR-503-1', inStock: true },
          { id: 'opt-5roll', name: '5 Rolls Bundle (5,000 Tags)', price: 1100, originalPrice: 1500, sku: 'VP-PSR-503-5', inStock: true }
        ]
      }
    ]
  },

  // 8. 1 Meter Suede Velvet Jewellery Display Cloth
  {
    id: 'vp-vdc-108',
    code: 'VP-VDC-108',
    title: '1 Meter (55 × 38 Inch) Suede Velvet Jewellery Display Cloth',
    description: 'Seamless luxury suede velvet counter mat fabric for showroom glass display counters and flatlay social photography. Wrinkle-free and lint-resistant.',
    price: 250,
    originalPrice: 350,
    unit: 'meter',
    rating: 4.9,
    reviewCount: 56,
    loadCapacity: 'Anti-Crease Suede Texture',
    category: 'Jewellery Display Cloth',
    finish: 'Deep Maroon Crimson',
    structuralProfile: 'Cut Counter Cloth',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'In Stock',
    moq: 'MOQ: 1 Meter',
    badge: 'Suede Finish',
    badgeType: 'primary',
    image: '/assets/vinayak/prod_suede_velvet.png',
    images: [
      '/assets/vinayak/prod_suede_velvet.png',
      '/assets/vinayak/req_retail_shops.png'
    ],
    finishes: [
      { name: 'Wine Maroon', color: '#881337' },
      { name: 'Jet Black', color: '#0F172A' },
      { name: 'Steel Grey', color: '#64748B' }
    ],
    requirements: ['retail-shops', 'instagram-shop'],
    material: 'Suede Velvet Fabric',
    specs: {
      dimensions: '55 × 38 inches per meter',
      weight: '320 GSM Heavy Suede',
      color: 'Wine Maroon / Jet Black / Steel Grey'
    },
    variations: [
      {
        id: 'var-color',
        name: 'Fabric Color',
        options: [
          { id: 'opt-maroon', name: 'Royal Wine Maroon', price: 250, inStock: true },
          { id: 'opt-black', name: 'Showroom Jet Black', price: 250, inStock: true },
          { id: 'opt-grey', name: 'Minimal Steel Grey', price: 250, inStock: true }
        ]
      },
      {
        id: 'var-length',
        name: 'Cut Length',
        options: [
          { id: 'opt-1m', name: '1 Meter (55 × 38 in)', price: 250, inStock: true },
          { id: 'opt-3m', name: '3 Meters Counter Roll (Save ₹75)', price: 675, originalPrice: 750, inStock: true }
        ]
      }
    ]
  },

  // 9. 10 Inch Velvet Necklace Display Bust Stand
  {
    id: 'vp-vnb-209',
    code: 'VP-VNB-209',
    title: '10 Inch Velvet Necklace Display Bust Stand with Gold Trim',
    description: 'Ergonomic portrait jewelry bust mannequin covered in rich ocean teal velvet with solid wooden stabilizing pedestal and gold rim.',
    price: 380,
    originalPrice: 480,
    unit: 'piece',
    rating: 4.8,
    reviewCount: 94,
    loadCapacity: '10 Inch Counter Height',
    category: 'Display Bust',
    finish: 'Ocean Teal Velvet',
    structuralProfile: 'Freestanding Portrait Bust',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'In Stock',
    moq: 'MOQ: 1 Unit',
    badge: 'Showroom Grade',
    badgeType: 'secondary',
    image: '/assets/vinayak/prod_10in_bust.png',
    images: [
      '/assets/vinayak/prod_10in_bust.png',
      '/assets/vinayak/req_retail_shops.png'
    ],
    finishes: [
      { name: 'Ocean Teal', color: '#0F766E' },
      { name: 'Jet Black', color: '#0F172A' },
      { name: 'Ivory White', color: '#F8FAFC' }
    ],
    requirements: ['retail-shops', 'instagram-shop', 'new-jewellery'],
    material: 'Velvet',
    specs: {
      dimensions: '10 Inch Height × 7 Inch Width',
      weight: '420 grams',
      color: 'Ocean Teal Velvet'
    },
    variations: [
      {
        id: 'var-shade',
        name: 'Velvet Color',
        options: [
          { id: 'opt-teal', name: 'Ocean Teal Velvet', price: 380, sku: 'VP-VNB-209-TEA', inStock: true },
          { id: 'opt-black', name: 'Jet Velvet Black', price: 380, sku: 'VP-VNB-209-BLK', inStock: true },
          { id: 'opt-white', name: 'Ivory Pearl White', price: 390, sku: 'VP-VNB-209-WHT', inStock: true }
        ]
      }
    ]
  },

  // 10. 100 Pcs 3x3 Inch Jewellery & Earring Display Cards
  {
    id: 'vp-edc-302',
    code: 'VP-EDC-302',
    title: '100 Pcs 3x3 Inch Jewellery & Earring Display Cards',
    description: 'Delightful cartoon character illustrations ideal for kid and teenage jewelry brands, Korean style clips and studs. 350 GSM stiff board.',
    price: 180,
    originalPrice: 250,
    unit: 'pack (100 pcs)',
    rating: 4.7,
    reviewCount: 45,
    loadCapacity: 'Square 3x3 Cardboard',
    category: 'Display Cards',
    finish: 'Full Color Matte Print',
    structuralProfile: 'Square Cards',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'In Stock',
    moq: 'MOQ: 1 Pack',
    badge: 'Cute Dolls Print',
    badgeType: 'neutral',
    image: '/assets/vinayak/prod_3x3_cards.png',
    images: [
      '/assets/vinayak/prod_3x3_cards.png',
      '/assets/vinayak/prod_pink_cards.png'
    ],
    finishes: [
      { name: 'Multicolor Anime Art', color: '#F472B6' }
    ],
    requirements: ['online-sellers', 'instagram-shop'],
    material: 'Paper / Board',
    specs: {
      dimensions: '3 × 3 inches square',
      weight: '160 grams per pack of 100',
      color: 'Multicolor Anime Print'
    },
    variations: [
      {
        id: 'var-qty',
        name: 'Pack Quantity',
        options: [
          { id: 'opt-100', name: '100 Pieces Pack', price: 180, originalPrice: 250, sku: 'VP-EDC-302-1', inStock: true },
          { id: 'opt-500', name: '500 Pieces Pack (Save ₹100)', price: 800, originalPrice: 1050, sku: 'VP-EDC-302-5', inStock: true }
        ]
      }
    ]
  },

  // 11. 100 Pcs Blue Stainless Steel Earring Display Cards
  {
    id: 'vp-ssdc-303',
    code: 'VP-SSDC-303',
    title: '100 Pcs Blue Stainless Steel Earring Display Cards',
    description: 'Branded blue steel cardstock with pre-slotted grooves for heavy dangling jhumkas and luxury stainless steel hoops. Premium metallic sheen.',
    price: 220,
    originalPrice: 320,
    unit: 'pack (100 pcs)',
    rating: 4.8,
    reviewCount: 52,
    loadCapacity: 'Rigid Heavy Cardstock',
    category: 'Display Cards',
    finish: 'Sky Cyan Blue',
    structuralProfile: 'Earring Hanging Cards',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'In Stock',
    moq: 'MOQ: 1 Pack',
    badge: 'Stainless Steel',
    badgeType: 'secondary',
    image: '/assets/vinayak/prod_blue_steel_cards.png',
    images: [
      '/assets/vinayak/prod_blue_steel_cards.png',
      '/assets/vinayak/prod_elite_cards.png'
    ],
    finishes: [
      { name: 'Sky Cyan', color: '#0EA5E9' },
      { name: 'Rose Gold', color: '#FB7185' }
    ],
    requirements: ['online-sellers', 'retail-shops', 'new-jewellery'],
    material: 'Paper / Board',
    specs: {
      dimensions: '3.5 × 2.5 inches',
      weight: '170 grams per 100 pcs',
      color: 'Sky Cyan Blue'
    },
    variations: [
      {
        id: 'var-qty',
        name: 'Pack Size',
        options: [
          { id: 'opt-100', name: 'Pack of 100 Pcs', price: 220, originalPrice: 320, sku: 'VP-SSDC-303-1', inStock: true },
          { id: 'opt-500', name: 'Pack of 500 Pcs Bulk', price: 990, originalPrice: 1400, sku: 'VP-SSDC-303-5', inStock: true }
        ]
      }
    ]
  },

  // 12. 100 Pcs Elite Jewellery Display Gift Cards & Boxes
  {
    id: 'vp-edc-304',
    code: 'VP-EDC-304',
    title: '100 Pcs Elite Jewellery Display Gift Cards & Boxes',
    description: 'Foldable luxury drawer box style cards with silver foil crown logo branding and foam sponge insert. Creates an unboxing luxury experience.',
    price: 280,
    originalPrice: 380,
    unit: 'pack (100 pcs)',
    rating: 4.9,
    reviewCount: 68,
    loadCapacity: 'Foam Insert Support',
    category: 'Display Cards',
    finish: 'Snow White & Silver Foil',
    structuralProfile: 'Rigid Gift Cards',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'In Stock',
    moq: 'MOQ: 1 Pack',
    badge: 'Luxury Packaging',
    badgeType: 'primary',
    image: '/assets/vinayak/prod_elite_cards.png',
    images: [
      '/assets/vinayak/prod_elite_cards.png',
      '/assets/vinayak/prod_pink_cards.png'
    ],
    finishes: [
      { name: 'Pure White', color: '#FFFFFF' },
      { name: 'Pastel Lilac', color: '#C084FC' }
    ],
    requirements: ['online-sellers', 'instagram-shop', 'retail-shops'],
    material: 'Paper / Board',
    specs: {
      dimensions: '3.5 × 3.5 inches with cushion insert',
      weight: '240 grams per pack of 100',
      color: 'Pure White & Silver Foil'
    },
    variations: [
      {
        id: 'var-qty',
        name: 'Pack Quantity',
        options: [
          { id: 'opt-100', name: '100 Pieces', price: 280, originalPrice: 380, inStock: true },
          { id: 'opt-500', name: '500 Pieces Bulk', price: 1250, originalPrice: 1650, inStock: true }
        ]
      }
    ]
  },

  // 13. 2-Tier Solid Wood & Velvet Bangle & Bracelet Display Stand
  {
    id: 'vp-bds-405',
    code: 'VP-BDS-405',
    title: '2-Tier Solid Wood & Velvet Bangle & Bracelet Display Stand',
    description: 'Dual cylindrical velvet rods mounted on black coated hardwood pillars. Effortless slide-on design for bridal chuda and bracelets. Weighted stable base.',
    price: 650,
    originalPrice: 850,
    unit: 'piece',
    rating: 4.9,
    reviewCount: 88,
    loadCapacity: 'Holds 60+ Bangles',
    category: 'Bangle & Bracelet Display Stand',
    finish: 'Matte Black Lacquer Wood',
    structuralProfile: 'Double Cylinder Stand',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'In Stock',
    moq: 'MOQ: 1 Unit',
    badge: 'Instagram Hit',
    badgeType: 'primary',
    image: '/assets/vinayak/req_instagram_shop.png',
    images: [
      '/assets/vinayak/req_instagram_shop.png',
      '/assets/vinayak/prod_round_tray.png',
      '/assets/vinayak/req_retail_shops.png'
    ],
    finishes: [
      { name: 'Ebony Black', color: '#0F172A' },
      { name: 'Natural Oak', color: '#D97706' }
    ],
    requirements: ['instagram-shop', 'retail-shops', 'new-jewellery'],
    material: 'Solid Wood & Velvet',
    specs: {
      dimensions: '12 Inch Height × 10 Inch Cylinder Width',
      weight: '620 grams',
      color: 'Ebony Black Wood / Velvet'
    },
    variations: [
      {
        id: 'var-tier',
        name: 'Stand Tiers',
        options: [
          { id: 'opt-2t', name: '2-Tier (Holds 60 Bangles)', price: 650, originalPrice: 850, sku: 'VP-BDS-405-2T', inStock: true },
          { id: 'opt-3t', name: '3-Tier Grand Suite (Holds 90 Bangles)', price: 920, originalPrice: 1150, sku: 'VP-BDS-405-3T', inStock: true }
        ]
      },
      {
        id: 'var-color',
        name: 'Velvet Color',
        options: [
          { id: 'opt-black', name: 'Ebony Black Velvet', inStock: true },
          { id: 'opt-grey', name: 'Steel Grey Velvet', inStock: true }
        ]
      }
    ]
  },

  // 14. Ceramic Monstera Leaf Aesthetic Jewellery Display Dish
  {
    id: 'vp-ctd-109',
    code: 'VP-CTD-109',
    title: 'Ceramic Monstera Leaf Aesthetic Jewellery Display Dish',
    description: 'Textured porcelain leaf tray with gilded gold rim for aesthetic flat-lay product photography and counter trinket presentation.',
    price: 320,
    originalPrice: 450,
    unit: 'piece',
    rating: 5.0,
    reviewCount: 134,
    loadCapacity: 'Glazed Ceramic Surface',
    category: 'Display Tray',
    finish: 'Glazed Pearl White',
    structuralProfile: 'Sculptural Dish',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'In Stock',
    moq: 'MOQ: 1 Unit',
    badge: 'Photo Prop',
    badgeType: 'secondary',
    image: '/assets/vinayak/req_new_jewellery.png',
    images: [
      '/assets/vinayak/req_new_jewellery.png',
      '/assets/vinayak/req_instagram_shop.png'
    ],
    finishes: [
      { name: 'Pearl White', color: '#F8FAFC' },
      { name: 'Marble Gold', color: '#FEF08A' }
    ],
    requirements: ['instagram-shop', 'online-sellers', 'new-jewellery'],
    material: 'Ceramic',
    specs: {
      dimensions: '6.5 × 5 × 1.2 inches',
      weight: '210 grams',
      color: 'Pearl White with Gold Rim'
    },
    variations: [
      {
        id: 'var-rim',
        name: 'Rim Finish',
        options: [
          { id: 'opt-gold', name: 'Gilded Gold Rim', price: 320, inStock: true },
          { id: 'opt-pure', name: 'Minimal Pure White Ceramic', price: 290, inStock: true }
        ]
      }
    ]
  },

  // 15. Set of 4 Teal Blue Velvet Mannequin Display Busts
  {
    id: 'vp-mbs-210',
    code: 'VP-MBS-210',
    title: 'Set of 4 Teal Blue Velvet Mannequin Display Busts (Graduated Sizes)',
    description: 'Complete jewelry showroom set including 7", 9", 11", and 13" tall busts in matching midnight teal velvet. Perfect for layered necklace presentations.',
    price: 1450,
    originalPrice: 1950,
    unit: 'set of 4',
    rating: 4.9,
    reviewCount: 71,
    loadCapacity: 'Complete Showroom Set',
    category: 'Display Bust',
    finish: 'Midnight Teal Velvet',
    structuralProfile: 'Tiered Showroom Suite',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'In Stock',
    moq: 'MOQ: 1 Set',
    badge: 'Set of 4',
    badgeType: 'primary',
    image: '/assets/vinayak/req_retail_shops.png',
    images: [
      '/assets/vinayak/req_retail_shops.png',
      '/assets/vinayak/prod_10in_bust.png',
      '/assets/vinayak/prod_velvet_necklace.png'
    ],
    finishes: [
      { name: 'Midnight Teal', color: '#0F766E' },
      { name: 'Velvet Charcoal', color: '#1E293B' },
      { name: 'Burgundy Red', color: '#881337' }
    ],
    requirements: ['retail-shops', 'new-jewellery', 'instagram-shop'],
    material: 'Velvet',
    specs: {
      dimensions: 'Heights: 7", 9", 11", 13"',
      weight: '1.4 kg total set weight',
      color: 'Midnight Teal Velvet'
    },
    variations: [
      {
        id: 'var-shade',
        name: 'Velvet Color',
        options: [
          { id: 'opt-teal', name: 'Midnight Peacock Teal', price: 1450, sku: 'VP-MBS-210-TEA', inStock: true },
          { id: 'opt-black', name: 'Obsidian Velvet Black', price: 1450, sku: 'VP-MBS-210-BLK', inStock: true },
          { id: 'opt-burgundy', name: 'Royal Burgundy Red', price: 1450, sku: 'VP-MBS-210-RED', inStock: true }
        ]
      },
      {
        id: 'var-config',
        name: 'Configuration',
        options: [
          { id: 'opt-full', name: 'Complete 4-Piece Suite (7", 9", 11", 13")', price: 1450, originalPrice: 1950, inStock: true },
          { id: 'opt-single11', name: 'Single 11" Bust Only', price: 420, originalPrice: 550, inStock: true },
          { id: 'opt-single13', name: 'Single 13" Bust Only', price: 490, originalPrice: 620, inStock: true }
        ]
      }
    ]
  },

  // 16. Royal Purple Velvet Choker & Bridal Necklace Display Stand
  {
    id: 'vp-vnb-211',
    code: 'VP-VNB-211',
    title: 'Royal Purple Velvet Choker & Bridal Necklace Display Stand',
    description: 'Broad shoulder velvet bust with rear velcro chain fastener for heavy Kundan, Polki, and diamond statement necklaces.',
    price: 520,
    originalPrice: 680,
    unit: 'piece',
    rating: 4.9,
    reviewCount: 96,
    loadCapacity: 'Bridal Heavy Choker Fit',
    category: 'Display Bust',
    finish: 'Royal Velvet Purple',
    structuralProfile: 'Wide Shoulder Bust',
    dispatchReadiness: 'Same-Day Dispatch',
    stockStatus: 'In Stock',
    moq: 'MOQ: 1 Unit',
    badge: 'Bridal Pick',
    badgeType: 'secondary',
    image: '/assets/vinayak/req_online_sellers.png',
    images: [
      '/assets/vinayak/req_online_sellers.png',
      '/assets/vinayak/req_retail_shops.png'
    ],
    finishes: [
      { name: 'Royal Purple', color: '#6B21A8' },
      { name: 'Jet Black', color: '#0F172A' },
      { name: 'Champagne Gold', color: '#FDE047' }
    ],
    requirements: ['retail-shops', 'new-jewellery', 'online-sellers'],
    material: 'Velvet',
    specs: {
      dimensions: '11.5 Inch Height × 9 Inch Shoulder Width',
      weight: '490 grams',
      color: 'Royal Purple Velvet'
    },
    variations: [
      {
        id: 'var-shade',
        name: 'Velvet Shade',
        options: [
          { id: 'opt-purple', name: 'Deep Royal Purple', price: 520, inStock: true },
          { id: 'opt-black', name: 'Jewellery Jet Black', price: 520, inStock: true },
          { id: 'opt-champagne', name: 'Warm Champagne Gold', price: 550, inStock: true }
        ]
      }
    ]
  }
];

export const TOP_SELLING_HOMEPAGE: Product[] = INITIAL_PRODUCTS.slice(0, 4);

export const PROJECT_REELS: ProjectReel[] = [
  {
    id: 'reel-1',
    title: 'Velvet Presentation Suite for Boutique Counter',
    client: 'Sri Meenakshi Jewels',
    location: 'Sowcarpet, Chennai',
    area: 'Counter Setup',
    duration: '0:35',
    category: 'boutiques',
    categoryLabel: 'Boutique Display',
    description: 'Custom teal blue velvet bust and matching round trays installed at Sowcarpet bridal counter.',
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
    city: 'Chennai',
    rating: 5,
    date: '2 days ago',
    comment: 'The 4-layer earring stand and velvet necklace busts are top quality. Same day delivery from Sowcarpet depot.',
    verifiedWholesaleBuyer: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    helpfulCount: 14
  },
  {
    id: 'rev-2',
    author: 'Priya Sundaram',
    role: 'Online Jewellery Creator',
    storeName: 'Aura Silver Studio',
    city: 'Coimbatore',
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
