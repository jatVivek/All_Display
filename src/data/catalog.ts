import { Product, ProjectReel, Review } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    "id": "ad-prod-001",
    "code": "AD-DB-001",
    "title": "Royal Velvet Portrait Necklace Bust (10 Inch)",
    "description": "Royal Velvet Portrait Necklace Bust (10 Inch). Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 170,
    "originalPrice": 210,
    "unit": "piece",
    "rating": 4.8,
    "reviewCount": 34,
    "loadCapacity": "Shoulder Bust Standard Load",
    "category": "Display Bust",
    "finish": "Velvet Standard Finish",
    "structuralProfile": "Shoulder Bust",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "image": "/assets/vinayak/prod_10in_bust.png",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "images": [
      "/assets/vinayak/prod_10in_bust.png",
      "/assets/vinayak/prod_velvet_necklace.png",
      "/assets/vinayak/cat_bust.png"
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
      "weight": "281 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-001",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-001",
            "name": "Midnight Black",
            "price": 170,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-001",
            "name": "Emerald Teal",
            "price": 170,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-001",
            "name": "Royal Maroon",
            "price": 190,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-001",
            "name": "Pure White",
            "price": 170,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-002",
    "code": "AD-DB-002",
    "title": "Grand Bridal Choker & Rani Haar Velvet Suite (14 Inch)",
    "description": "Grand Bridal Choker & Rani Haar Velvet Suite (14 Inch). Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 210,
    "originalPrice": 260,
    "unit": "piece",
    "rating": 5,
    "reviewCount": 53,
    "loadCapacity": "Neckline Stand Standard Load",
    "category": "Display Bust",
    "finish": "Leatherette Standard Finish",
    "structuralProfile": "Neckline Stand",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "image": "/assets/vinayak/prod_velvet_necklace.png",
    "images": [
      "/assets/vinayak/prod_velvet_necklace.png",
      "/assets/vinayak/cat_bust.png",
      "/assets/vinayak/req_online_sellers.png"
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
      "new-jewellery",
      "retail-shops"
    ],
    "material": "Leatherette",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "312 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-002",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-002",
            "name": "Midnight Black",
            "price": 210,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-002",
            "name": "Emerald Teal",
            "price": 210,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-002",
            "name": "Royal Maroon",
            "price": 230,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-002",
            "name": "Pure White",
            "price": 210,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-015",
    "code": "AD-DC-015",
    "title": "Custom Matte Pink Stud & Dangle Earring Cards (Pack of 100)",
    "description": "Custom Matte Pink Stud & Dangle Earring Cards (Pack of 100). Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 830,
    "originalPrice": 1040,
    "unit": "pack",
    "rating": 4.6,
    "reviewCount": 60,
    "loadCapacity": "Hanging Card Standard Load",
    "category": "Display Cards",
    "finish": "350 GSM Cardstock Standard Finish",
    "structuralProfile": "Hanging Card",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Pack (100 Pcs)",
    "badge": "Hot Wholesale",
    "badgeType": "success",
    "image": "/assets/vinayak/prod_3x3_cards.png",
    "images": [
      "/assets/vinayak/prod_3x3_cards.png",
      "/assets/vinayak/prod_blue_steel_cards.png",
      "/assets/vinayak/prod_elite_cards.png"
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
      "retail-shops",
      "online-sellers",
      "instagram-shop"
    ],
    "material": "350 GSM Cardstock",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "715 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-015",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-015",
            "name": "Midnight Black",
            "price": 830,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-015",
            "name": "Emerald Teal",
            "price": 830,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-015",
            "name": "Royal Maroon",
            "price": 850,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-015",
            "name": "Pure White",
            "price": 830,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-016",
    "code": "AD-DC-016",
    "title": "Blue Steel Velvet-Finish Earring & Pendant Display Cards (Pack of 100)",
    "description": "Blue Steel Velvet-Finish Earring & Pendant Display Cards (Pack of 100). Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 870,
    "originalPrice": 1090,
    "unit": "pack",
    "rating": 4.8,
    "reviewCount": 79,
    "loadCapacity": "Earring Tag Standard Load",
    "category": "Display Cards",
    "finish": "Recycled Kraft Board Standard Finish",
    "structuralProfile": "Earring Tag",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Pack (100 Pcs)",
    "image": "/assets/vinayak/prod_blue_steel_cards.png",
    "images": [
      "/assets/vinayak/prod_blue_steel_cards.png",
      "/assets/vinayak/prod_elite_cards.png",
      "/assets/vinayak/prod_pink_cards.png"
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
      "online-sellers",
      "instagram-shop"
    ],
    "material": "Recycled Kraft Board",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "746 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-016",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-016",
            "name": "Midnight Black",
            "price": 870,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-016",
            "name": "Emerald Teal",
            "price": 870,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-016",
            "name": "Royal Maroon",
            "price": 890,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-016",
            "name": "Pure White",
            "price": 870,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-029",
    "code": "AD-DS-029",
    "title": "Premium 4-Layer Wooden Earring Display Stand (48 Pairs)",
    "description": "Premium 4-Layer Wooden Earring Display Stand (48 Pairs). Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 1480,
    "originalPrice": 1850,
    "unit": "piece",
    "rating": 4.9,
    "reviewCount": 86,
    "loadCapacity": "Tiered Counter Stand Standard Load",
    "category": "Display Stand",
    "finish": "Solid Pine Wood Standard Finish",
    "structuralProfile": "Tiered Counter Stand",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "image": "/assets/vinayak/prod_earring_stand.png",
    "images": [
      "/assets/vinayak/prod_earring_stand.png",
      "/assets/vinayak/cat_stand.png",
      "/assets/vinayak/deal_left_banner.png"
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
    "material": "Solid Pine Wood",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "499 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-029",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-029",
            "name": "Midnight Black",
            "price": 1480,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-029",
            "name": "Emerald Teal",
            "price": 1480,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-029",
            "name": "Royal Maroon",
            "price": 1500,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-029",
            "name": "Pure White",
            "price": 1480,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-030",
    "code": "AD-DS-030",
    "title": "6-Tier Rotating Counter Earring Tree Carousel",
    "description": "6-Tier Rotating Counter Earring Tree Carousel. Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 1530,
    "originalPrice": 1910,
    "unit": "piece",
    "rating": 4.6,
    "reviewCount": 105,
    "loadCapacity": "Rotating Carousel Standard Load",
    "category": "Display Stand",
    "finish": "Powder Coated Metal Standard Finish",
    "structuralProfile": "Rotating Carousel",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "badge": "Best Seller",
    "badgeType": "neutral",
    "image": "/assets/vinayak/cat_stand.png",
    "images": [
      "/assets/vinayak/cat_stand.png",
      "/assets/vinayak/deal_left_banner.png",
      "/assets/vinayak/req_retail_shops.png"
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
      "new-jewellery",
      "retail-shops",
      "online-sellers"
    ],
    "material": "Powder Coated Metal",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "530 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-030",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-030",
            "name": "Midnight Black",
            "price": 1530,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-030",
            "name": "Emerald Teal",
            "price": 1530,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-030",
            "name": "Royal Maroon",
            "price": 1550,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-030",
            "name": "Pure White",
            "price": 1530,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-043",
    "code": "AD-TR-043",
    "title": "Premium Round Velvet Flatlay Presentation Tray (8 Inch)",
    "description": "Premium Round Velvet Flatlay Presentation Tray (8 Inch). Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 340,
    "originalPrice": 430,
    "unit": "piece",
    "rating": 4.7,
    "reviewCount": 112,
    "loadCapacity": "Stackable Circular Tray Standard Load",
    "category": "Display Tray",
    "finish": "Plush Velvet Standard Finish",
    "structuralProfile": "Stackable Circular Tray",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "image": "/assets/vinayak/prod_round_tray.png",
    "images": [
      "/assets/vinayak/prod_round_tray.png",
      "/assets/vinayak/cat_tray.png",
      "/assets/vinayak/req_instagram_shop.png"
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
      "retail-shops",
      "online-sellers"
    ],
    "material": "Plush Velvet",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "283 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-043",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-043",
            "name": "Midnight Black",
            "price": 340,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-043",
            "name": "Emerald Teal",
            "price": 340,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-043",
            "name": "Royal Maroon",
            "price": 360,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-043",
            "name": "Pure White",
            "price": 340,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-044",
    "code": "AD-TR-044",
    "title": "24-Compartment Velvet Ring & Earring Showcase Insert Tray",
    "description": "24-Compartment Velvet Ring & Earring Showcase Insert Tray. Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 390,
    "originalPrice": 490,
    "unit": "piece",
    "rating": 4.9,
    "reviewCount": 131,
    "loadCapacity": "24-Grid Compartment Tray Standard Load",
    "category": "Display Tray",
    "finish": "PU Leatherette Standard Finish",
    "structuralProfile": "24-Grid Compartment Tray",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "image": "/assets/vinayak/cat_tray.png",
    "images": [
      "/assets/vinayak/cat_tray.png",
      "/assets/vinayak/req_instagram_shop.png",
      "/assets/vinayak/shop_banner.png"
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
      "online-sellers",
      "instagram-shop"
    ],
    "material": "PU Leatherette",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "314 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-044",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-044",
            "name": "Midnight Black",
            "price": 390,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-044",
            "name": "Emerald Teal",
            "price": 390,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-044",
            "name": "Royal Maroon",
            "price": 410,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-044",
            "name": "Pure White",
            "price": 390,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-057",
    "code": "AD-BS-057",
    "title": "Single Tier Velvet Bangle & Watch Display Roll (12 Inch)",
    "description": "Single Tier Velvet Bangle & Watch Display Roll (12 Inch). Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 1000,
    "originalPrice": 1250,
    "unit": "piece",
    "rating": 5,
    "reviewCount": 138,
    "loadCapacity": "Single Cylinder Roll Standard Load",
    "category": "Bangle & Bracelet Display Stand",
    "finish": "Velvet Cylinder Standard Finish",
    "structuralProfile": "Single Cylinder Roll",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "badge": "Hot Wholesale",
    "badgeType": "secondary",
    "image": "/assets/vinayak/cat_stand.png",
    "images": [
      "/assets/vinayak/cat_stand.png",
      "/assets/vinayak/prod_earring_stand.png",
      "/assets/vinayak/req_instagram_shop.png"
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
      "new-jewellery",
      "retail-shops"
    ],
    "material": "Velvet Cylinder",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "717 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-057",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-057",
            "name": "Midnight Black",
            "price": 1000,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-057",
            "name": "Emerald Teal",
            "price": 1000,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-057",
            "name": "Royal Maroon",
            "price": 1020,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-057",
            "name": "Pure White",
            "price": 1000,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-058",
    "code": "AD-BS-058",
    "title": "Double Tier Velvet Stepped Bangle Holder Stand",
    "description": "Double Tier Velvet Stepped Bangle Holder Stand. Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 1050,
    "originalPrice": 1310,
    "unit": "piece",
    "rating": 4.7,
    "reviewCount": 157,
    "loadCapacity": "2-Tier Bangle Ramp Standard Load",
    "category": "Bangle & Bracelet Display Stand",
    "finish": "PU Leatherette Standard Finish",
    "structuralProfile": "2-Tier Bangle Ramp",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "image": "/assets/vinayak/prod_earring_stand.png",
    "images": [
      "/assets/vinayak/prod_earring_stand.png",
      "/assets/vinayak/req_instagram_shop.png",
      "/assets/vinayak/req_new_jewellery.png"
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
      "new-jewellery",
      "retail-shops"
    ],
    "material": "PU Leatherette",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "748 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-058",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-058",
            "name": "Midnight Black",
            "price": 1050,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-058",
            "name": "Emerald Teal",
            "price": 1050,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-058",
            "name": "Royal Maroon",
            "price": 1070,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-058",
            "name": "Pure White",
            "price": 1050,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-070",
    "code": "AD-BX-070",
    "title": "Luxury Velvet Octagonal Engagement Ring Box with Golden Hinge",
    "description": "Luxury Velvet Octagonal Engagement Ring Box with Golden Hinge. Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 1610,
    "originalPrice": 2010,
    "unit": "piece",
    "rating": 4.6,
    "reviewCount": 145,
    "loadCapacity": "Magnetic Ring Box Standard Load",
    "category": "Storage Box",
    "finish": "Velvet Wrapped Cardboard Standard Finish",
    "structuralProfile": "Magnetic Ring Box",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "image": "/assets/vinayak/cat_box.png",
    "images": [
      "/assets/vinayak/cat_box.png",
      "/assets/vinayak/prod_round_tray.png",
      "/assets/vinayak/deal_left_banner.png"
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
      "new-jewellery",
      "retail-shops"
    ],
    "material": "Velvet Wrapped Cardboard",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "470 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-070",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-070",
            "name": "Midnight Black",
            "price": 1610,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-070",
            "name": "Emerald Teal",
            "price": 1610,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-070",
            "name": "Royal Maroon",
            "price": 1630,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-070",
            "name": "Pure White",
            "price": 1610,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-071",
    "code": "AD-BX-071",
    "title": "Clear Acrylic 5-Drawer Dustproof Jewellery Storage Organizer",
    "description": "Clear Acrylic 5-Drawer Dustproof Jewellery Storage Organizer. Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 1660,
    "originalPrice": 2080,
    "unit": "piece",
    "rating": 4.8,
    "reviewCount": 164,
    "loadCapacity": "Glass Showcase Chest Standard Load",
    "category": "Storage Box",
    "finish": "Acrylic Glass Standard Finish",
    "structuralProfile": "Glass Showcase Chest",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "image": "/assets/vinayak/prod_round_tray.png",
    "images": [
      "/assets/vinayak/prod_round_tray.png",
      "/assets/vinayak/deal_left_banner.png",
      "/assets/vinayak/req_new_jewellery.png"
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
      "retail-shops",
      "online-sellers"
    ],
    "material": "Acrylic Glass",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "501 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-071",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-071",
            "name": "Midnight Black",
            "price": 1660,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-071",
            "name": "Emerald Teal",
            "price": 1660,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-071",
            "name": "Royal Maroon",
            "price": 1680,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-071",
            "name": "Pure White",
            "price": 1660,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-083",
    "code": "AD-MN-083",
    "title": "Full Shoulder Velvet Mannequin Bust for Heavy Bridal Sets",
    "description": "Full Shoulder Velvet Mannequin Bust for Heavy Bridal Sets. Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 420,
    "originalPrice": 530,
    "unit": "piece",
    "rating": 4.7,
    "reviewCount": 152,
    "loadCapacity": "Full Form Torso Standard Load",
    "category": "Mannequin Stand",
    "finish": "Fiberglass Core Standard Finish",
    "structuralProfile": "Full Form Torso",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "image": "/assets/vinayak/cat_mannequin.png",
    "images": [
      "/assets/vinayak/cat_mannequin.png",
      "/assets/vinayak/cat_bust.png",
      "/assets/vinayak/req_retail_shops.png"
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
      "retail-shops",
      "online-sellers"
    ],
    "material": "Fiberglass Core",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "873 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-083",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-083",
            "name": "Midnight Black",
            "price": 420,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-083",
            "name": "Emerald Teal",
            "price": 420,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-083",
            "name": "Royal Maroon",
            "price": 440,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-083",
            "name": "Pure White",
            "price": 420,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-084",
    "code": "AD-MN-084",
    "title": "Sculpted Velvet Head & Neck Display for Maang Tikka & Earrings",
    "description": "Sculpted Velvet Head & Neck Display for Maang Tikka & Earrings. Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 470,
    "originalPrice": 590,
    "unit": "piece",
    "rating": 4.9,
    "reviewCount": 171,
    "loadCapacity": "Sculpted Head & Neck Standard Load",
    "category": "Mannequin Stand",
    "finish": "Velvet Fabric Standard Finish",
    "structuralProfile": "Sculpted Head & Neck",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "badge": "Best Seller",
    "badgeType": "primary",
    "image": "/assets/vinayak/cat_bust.png",
    "images": [
      "/assets/vinayak/cat_bust.png",
      "/assets/vinayak/req_retail_shops.png",
      "/assets/vinayak/prod_10in_bust.png"
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
      "online-sellers",
      "instagram-shop",
      "new-jewellery"
    ],
    "material": "Velvet Fabric",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "254 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-084",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-084",
            "name": "Midnight Black",
            "price": 470,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-084",
            "name": "Emerald Teal",
            "price": 470,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-084",
            "name": "Royal Maroon",
            "price": 490,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-084",
            "name": "Pure White",
            "price": 470,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-096",
    "code": "AD-TL-096",
    "title": "Heavy Duty 3-Inch Core Cast Iron Desktop Tape Dispenser",
    "description": "Heavy Duty 3-Inch Core Cast Iron Desktop Tape Dispenser. Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 1030,
    "originalPrice": 1290,
    "unit": "piece",
    "rating": 4.8,
    "reviewCount": 159,
    "loadCapacity": "Heavy Cast Dispenser Standard Load",
    "category": "Packaging Tools",
    "finish": "Cast Iron Standard Finish",
    "structuralProfile": "Heavy Cast Dispenser",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "badge": "Best Seller",
    "badgeType": "primary",
    "image": "/assets/vinayak/prod_tape_dispenser.png",
    "images": [
      "/assets/vinayak/prod_tape_dispenser.png",
      "/assets/vinayak/prod_wonder_tape.png",
      "/assets/vinayak/prod_price_sticker.png"
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
      "online-sellers",
      "instagram-shop",
      "new-jewellery"
    ],
    "material": "Cast Iron",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "626 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-096",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-096",
            "name": "Midnight Black",
            "price": 1030,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-096",
            "name": "Emerald Teal",
            "price": 1030,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-096",
            "name": "Royal Maroon",
            "price": 1050,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-096",
            "name": "Pure White",
            "price": 1030,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-097",
    "code": "AD-TL-097",
    "title": "Ultra Clear Wonder Tape Rolls for Jewellery Cards (Pack of 12)",
    "description": "Ultra Clear Wonder Tape Rolls for Jewellery Cards (Pack of 12). Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 1080,
    "originalPrice": 1350,
    "unit": "roll",
    "rating": 5,
    "reviewCount": 178,
    "loadCapacity": "Adhesive Roll Standard Load",
    "category": "Packaging Tools",
    "finish": "High-Grade Polycarbonate Standard Finish",
    "structuralProfile": "Adhesive Roll",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 5 Rolls",
    "image": "/assets/vinayak/prod_wonder_tape.png",
    "images": [
      "/assets/vinayak/prod_wonder_tape.png",
      "/assets/vinayak/prod_price_sticker.png",
      "/assets/vinayak/cat_bag.png"
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
    "material": "High-Grade Polycarbonate",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "657 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-097",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-097",
            "name": "Midnight Black",
            "price": 1080,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-097",
            "name": "Emerald Teal",
            "price": 1080,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-097",
            "name": "Royal Maroon",
            "price": 1100,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-097",
            "name": "Pure White",
            "price": 1080,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-109",
    "code": "AD-CL-109",
    "title": "Seamless Microfiber Suede Showcase Counter Mat (1 × 1.5 Meter)",
    "description": "Seamless Microfiber Suede Showcase Counter Mat (1 × 1.5 Meter). Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 1640,
    "originalPrice": 2050,
    "unit": "meter",
    "rating": 4.9,
    "reviewCount": 166,
    "loadCapacity": "Seamless Flatlay Mat Standard Load",
    "category": "Jewellery Display Cloth",
    "finish": "Microfiber Suede Standard Finish",
    "structuralProfile": "Seamless Flatlay Mat",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Piece",
    "image": "/assets/vinayak/prod_suede_velvet.png",
    "images": [
      "/assets/vinayak/prod_suede_velvet.png",
      "/assets/vinayak/prod_round_tray.png",
      "/assets/vinayak/shop_banner.png"
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
    "material": "Microfiber Suede",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "379 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-109",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-109",
            "name": "Midnight Black",
            "price": 1640,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-109",
            "name": "Emerald Teal",
            "price": 1640,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-109",
            "name": "Royal Maroon",
            "price": 1660,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-109",
            "name": "Pure White",
            "price": 1640,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-110",
    "code": "AD-CL-110",
    "title": "Deep Royal Velvet Countertop Showcase Flatlay Drape Cloth",
    "description": "Deep Royal Velvet Countertop Showcase Flatlay Drape Cloth. Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 1690,
    "originalPrice": 2110,
    "unit": "meter",
    "rating": 4.6,
    "reviewCount": 185,
    "loadCapacity": "Countertop Runner Standard Load",
    "category": "Jewellery Display Cloth",
    "finish": "Plush Royal Velvet Standard Finish",
    "structuralProfile": "Countertop Runner",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Piece",
    "image": "/assets/vinayak/prod_round_tray.png",
    "images": [
      "/assets/vinayak/prod_round_tray.png",
      "/assets/vinayak/shop_banner.png",
      "/assets/vinayak/prod_suede_velvet.png"
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
      "new-jewellery",
      "retail-shops"
    ],
    "material": "Plush Royal Velvet",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "410 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-110",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-110",
            "name": "Midnight Black",
            "price": 1690,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-110",
            "name": "Emerald Teal",
            "price": 1690,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-110",
            "name": "Royal Maroon",
            "price": 1710,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-110",
            "name": "Pure White",
            "price": 1690,
            "inStock": true
          }
        ]
      }
    ]
  }
];

export const TOP_SELLING_HOMEPAGE: Product[] = [
  {
    "id": "ad-prod-001",
    "code": "AD-DB-001",
    "title": "Royal Velvet Portrait Necklace Bust (10 Inch)",
    "description": "Royal Velvet Portrait Necklace Bust (10 Inch). Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 170,
    "originalPrice": 210,
    "unit": "piece",
    "rating": 4.8,
    "reviewCount": 34,
    "loadCapacity": "Shoulder Bust Standard Load",
    "category": "Display Bust",
    "finish": "Velvet Standard Finish",
    "structuralProfile": "Shoulder Bust",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "image": "/assets/vinayak/prod_10in_bust.png",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "images": [
      "/assets/vinayak/prod_10in_bust.png",
      "/assets/vinayak/prod_velvet_necklace.png",
      "/assets/vinayak/cat_bust.png"
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
      "weight": "281 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-001",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-001",
            "name": "Midnight Black",
            "price": 170,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-001",
            "name": "Emerald Teal",
            "price": 170,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-001",
            "name": "Royal Maroon",
            "price": 190,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-001",
            "name": "Pure White",
            "price": 170,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-002",
    "code": "AD-DB-002",
    "title": "Grand Bridal Choker & Rani Haar Velvet Suite (14 Inch)",
    "description": "Grand Bridal Choker & Rani Haar Velvet Suite (14 Inch). Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 210,
    "originalPrice": 260,
    "unit": "piece",
    "rating": 5,
    "reviewCount": 53,
    "loadCapacity": "Neckline Stand Standard Load",
    "category": "Display Bust",
    "finish": "Leatherette Standard Finish",
    "structuralProfile": "Neckline Stand",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "image": "/assets/vinayak/prod_velvet_necklace.png",
    "images": [
      "/assets/vinayak/prod_velvet_necklace.png",
      "/assets/vinayak/cat_bust.png",
      "/assets/vinayak/req_online_sellers.png"
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
      "new-jewellery",
      "retail-shops"
    ],
    "material": "Leatherette",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "312 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-002",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-002",
            "name": "Midnight Black",
            "price": 210,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-002",
            "name": "Emerald Teal",
            "price": 210,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-002",
            "name": "Royal Maroon",
            "price": 230,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-002",
            "name": "Pure White",
            "price": 210,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-015",
    "code": "AD-DC-015",
    "title": "Custom Matte Pink Stud & Dangle Earring Cards (Pack of 100)",
    "description": "Custom Matte Pink Stud & Dangle Earring Cards (Pack of 100). Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 830,
    "originalPrice": 1040,
    "unit": "pack",
    "rating": 4.6,
    "reviewCount": 60,
    "loadCapacity": "Hanging Card Standard Load",
    "category": "Display Cards",
    "finish": "350 GSM Cardstock Standard Finish",
    "structuralProfile": "Hanging Card",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Pack (100 Pcs)",
    "badge": "Hot Wholesale",
    "badgeType": "success",
    "image": "/assets/vinayak/prod_3x3_cards.png",
    "images": [
      "/assets/vinayak/prod_3x3_cards.png",
      "/assets/vinayak/prod_blue_steel_cards.png",
      "/assets/vinayak/prod_elite_cards.png"
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
      "retail-shops",
      "online-sellers",
      "instagram-shop"
    ],
    "material": "350 GSM Cardstock",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "715 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-015",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-015",
            "name": "Midnight Black",
            "price": 830,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-015",
            "name": "Emerald Teal",
            "price": 830,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-015",
            "name": "Royal Maroon",
            "price": 850,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-015",
            "name": "Pure White",
            "price": 830,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-016",
    "code": "AD-DC-016",
    "title": "Blue Steel Velvet-Finish Earring & Pendant Display Cards (Pack of 100)",
    "description": "Blue Steel Velvet-Finish Earring & Pendant Display Cards (Pack of 100). Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 870,
    "originalPrice": 1090,
    "unit": "pack",
    "rating": 4.8,
    "reviewCount": 79,
    "loadCapacity": "Earring Tag Standard Load",
    "category": "Display Cards",
    "finish": "Recycled Kraft Board Standard Finish",
    "structuralProfile": "Earring Tag",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Pack (100 Pcs)",
    "image": "/assets/vinayak/prod_blue_steel_cards.png",
    "images": [
      "/assets/vinayak/prod_blue_steel_cards.png",
      "/assets/vinayak/prod_elite_cards.png",
      "/assets/vinayak/prod_pink_cards.png"
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
      "online-sellers",
      "instagram-shop"
    ],
    "material": "Recycled Kraft Board",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "746 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-016",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-016",
            "name": "Midnight Black",
            "price": 870,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-016",
            "name": "Emerald Teal",
            "price": 870,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-016",
            "name": "Royal Maroon",
            "price": 890,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-016",
            "name": "Pure White",
            "price": 870,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-029",
    "code": "AD-DS-029",
    "title": "Premium 4-Layer Wooden Earring Display Stand (48 Pairs)",
    "description": "Premium 4-Layer Wooden Earring Display Stand (48 Pairs). Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 1480,
    "originalPrice": 1850,
    "unit": "piece",
    "rating": 4.9,
    "reviewCount": 86,
    "loadCapacity": "Tiered Counter Stand Standard Load",
    "category": "Display Stand",
    "finish": "Solid Pine Wood Standard Finish",
    "structuralProfile": "Tiered Counter Stand",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "image": "/assets/vinayak/prod_earring_stand.png",
    "images": [
      "/assets/vinayak/prod_earring_stand.png",
      "/assets/vinayak/cat_stand.png",
      "/assets/vinayak/deal_left_banner.png"
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
    "material": "Solid Pine Wood",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "499 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-029",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-029",
            "name": "Midnight Black",
            "price": 1480,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-029",
            "name": "Emerald Teal",
            "price": 1480,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-029",
            "name": "Royal Maroon",
            "price": 1500,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-029",
            "name": "Pure White",
            "price": 1480,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-030",
    "code": "AD-DS-030",
    "title": "6-Tier Rotating Counter Earring Tree Carousel",
    "description": "6-Tier Rotating Counter Earring Tree Carousel. Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 1530,
    "originalPrice": 1910,
    "unit": "piece",
    "rating": 4.6,
    "reviewCount": 105,
    "loadCapacity": "Rotating Carousel Standard Load",
    "category": "Display Stand",
    "finish": "Powder Coated Metal Standard Finish",
    "structuralProfile": "Rotating Carousel",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "badge": "Best Seller",
    "badgeType": "neutral",
    "image": "/assets/vinayak/cat_stand.png",
    "images": [
      "/assets/vinayak/cat_stand.png",
      "/assets/vinayak/deal_left_banner.png",
      "/assets/vinayak/req_retail_shops.png"
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
      "new-jewellery",
      "retail-shops",
      "online-sellers"
    ],
    "material": "Powder Coated Metal",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "530 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-030",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-030",
            "name": "Midnight Black",
            "price": 1530,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-030",
            "name": "Emerald Teal",
            "price": 1530,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-030",
            "name": "Royal Maroon",
            "price": 1550,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-030",
            "name": "Pure White",
            "price": 1530,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-043",
    "code": "AD-TR-043",
    "title": "Premium Round Velvet Flatlay Presentation Tray (8 Inch)",
    "description": "Premium Round Velvet Flatlay Presentation Tray (8 Inch). Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 340,
    "originalPrice": 430,
    "unit": "piece",
    "rating": 4.7,
    "reviewCount": 112,
    "loadCapacity": "Stackable Circular Tray Standard Load",
    "category": "Display Tray",
    "finish": "Plush Velvet Standard Finish",
    "structuralProfile": "Stackable Circular Tray",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "image": "/assets/vinayak/prod_round_tray.png",
    "images": [
      "/assets/vinayak/prod_round_tray.png",
      "/assets/vinayak/cat_tray.png",
      "/assets/vinayak/req_instagram_shop.png"
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
      "retail-shops",
      "online-sellers"
    ],
    "material": "Plush Velvet",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "283 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-043",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-043",
            "name": "Midnight Black",
            "price": 340,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-043",
            "name": "Emerald Teal",
            "price": 340,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-043",
            "name": "Royal Maroon",
            "price": 360,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-043",
            "name": "Pure White",
            "price": 340,
            "inStock": true
          }
        ]
      }
    ]
  },
  {
    "id": "ad-prod-044",
    "code": "AD-TR-044",
    "title": "24-Compartment Velvet Ring & Earring Showcase Insert Tray",
    "description": "24-Compartment Velvet Ring & Earring Showcase Insert Tray. Direct factory wholesale supplies for boutique owners, retail jewellers, and online ecommerce sellers. Superior craftsmanship, scratch-resistant coating, and immediate dispatch from Chennai Sowcarpet central depot.",
    "price": 390,
    "originalPrice": 490,
    "unit": "piece",
    "rating": 4.9,
    "reviewCount": 131,
    "loadCapacity": "24-Grid Compartment Tray Standard Load",
    "category": "Display Tray",
    "finish": "PU Leatherette Standard Finish",
    "structuralProfile": "24-Grid Compartment Tray",
    "dispatchReadiness": "Same-Day Dispatch",
    "stockStatus": "In Stock (Chennai Depot)",
    "moq": "MOQ: 1 Unit",
    "image": "/assets/vinayak/cat_tray.png",
    "images": [
      "/assets/vinayak/cat_tray.png",
      "/assets/vinayak/req_instagram_shop.png",
      "/assets/vinayak/shop_banner.png"
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
      "online-sellers",
      "instagram-shop"
    ],
    "material": "PU Leatherette",
    "specs": {
      "dimensions": "Standard Commercial Dimensions",
      "weight": "314 grams",
      "color": "Multicolor Options Available"
    },
    "variations": [
      {
        "id": "var-finish-ad-prod-044",
        "name": "Color / Finish",
        "options": [
          {
            "id": "opt-blk-ad-prod-044",
            "name": "Midnight Black",
            "price": 390,
            "inStock": true
          },
          {
            "id": "opt-teal-ad-prod-044",
            "name": "Emerald Teal",
            "price": 390,
            "inStock": true
          },
          {
            "id": "opt-mrn-ad-prod-044",
            "name": "Royal Maroon",
            "price": 410,
            "inStock": true
          },
          {
            "id": "opt-wht-ad-prod-044",
            "name": "Pure White",
            "price": 390,
            "inStock": true
          }
        ]
      }
    ]
  }
];

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

