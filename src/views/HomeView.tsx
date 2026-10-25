import React, { useState, useEffect } from 'react';
import { ActiveView, Product, ProjectReel } from '../types';
import { TOP_SELLING_HOMEPAGE, PROJECT_REELS } from '../data/catalog';
import { storeManager } from '../services/storeManager';

interface HomeViewProps {
  setActiveView: (view: ActiveView) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onOpenReel: (reel: ProjectReel) => void;
  onToast: (msg: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveView,
  onAddToCart,
  onOpenReel,
  onToast
}) => {
  const [bumperQty, setBumperQty] = useState(1);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryStoreType, setInquiryStoreType] = useState('Boutique & Designer Wear');
  const [inquiryArea, setInquiryArea] = useState('650');
  const [inquiryCity, setInquiryCity] = useState('');
  const [products, setProducts] = useState<Product[]>(() => storeManager.getProducts());

  useEffect(() => {
    const handleUpdate = () => {
      setProducts(storeManager.getProducts());
    };
    window.addEventListener('alldisplay_catalog_updated', handleUpdate);
    window.addEventListener('alldisplay_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('alldisplay_catalog_updated', handleUpdate);
      window.removeEventListener('alldisplay_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);
  const categoryScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hi All Display Hyderabad, I would like an itemized wholesale quotation & elevation guidance:\n` +
      `• Name/Firm: ${inquiryName || 'Store Owner'}\n` +
      `• Store Type: ${inquiryStoreType}\n` +
      `• Floor Area: ${inquiryArea} sq.ft\n` +
      `• Delivery City/Pin: ${inquiryCity || 'Hyderabad'}\n` +
      `Please provide CAD rack layout guidance and ex-depot proforma rates.`
    );
    window.open(`https://wa.me/917396127273?text=${text}`, '_blank');
    onToast('Inquiry generated! Opening WhatsApp sales desk...');
  };

  // Clean, single set of 6 primary categories with isolated product imagery
  const coreCategories = [
    {
      title: 'Floor Stands & Racks',
      subtitle: 'Heavy-Duty Bumper & Islands',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjsvmXZlohMZptyHS-gMam8Ct3W1nVaqsr_mc0zz2CFqebliYcutec3B9BqZlE6DXkvhqWI7GDLzzMYlG39q8zVA9hzToMg32UZPukc45kD7EsyTvVHGXhV2FwJETW4HGVdCH5tsOWaHksqiYH8uqi33EAjJs1Z1xhpkTxYcv-L-yfmtMf0mvfHtQanYLYdLU0NxlKlIok4FYgainzT43AvDWJaPz25hj292y3bKucJBicVMNTHk09',
      view: 'racks-floor-stands' as ActiveView
    },
    {
      title: 'Slotted Wall Channels',
      subtitle: 'Concealed Posts & Brackets',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVNvkNuZowrWf1dlKaQ9PAhnG5XqL-culdoxgiC6AXE0ZUt6YD6LDBRmHv9ZIR5XxNLNIwARAPWWxDQPa2mSvIEyBOmuRSDMz0vnZ9Rg8bMazkPUP3Lp1sL7tgBMRO-gN2Cv3nrmxs2Jjvuv6xUCTsZNEAtxsGSEh8vbDOKTIOV1bbYPjsB1jBo_-S2IjbM9JN0LQFLvXzCOKCZYHG2w6ApnZref1PMgulE-M47pn9XZIYqEwLy-xT',
      view: 'racks-floor-stands' as ActiveView
    },
    {
      title: 'Mannequins & Forms',
      subtitle: 'Fiberglass Tailor Dummies',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXZpozBvF2M16K3LwgNzQfsw9wgq0lPn2DqmVmaUI9NXtj9cDiAGfD5wgb21aV9Zo5npEMERJmicFhb_hNv-kdrr5L22iPAjtk7MmYnuxQBDltwi9PnO72RTP94RPeth9vdvzO9gUJ5SIWhJIYAQQJ42TEtP8JN6dlb96_qPvnmZSrovrSWXZdRAYmNi44JtT2UAmCv-wG5dR_4kWgnUAUliz2YaHmA7dKe9nH2j_kKV0jsJDXbokV',
      view: 'racks-floor-stands' as ActiveView
    },
    {
      title: 'Teak Shelves & Rods',
      subtitle: 'Wood Tops + Matte Black Pipes',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZAb6dC9wseZhTD1es6eKfy7a6YaIm5dCB0OiQfQhcorOJulbUp20RZfyYVFfuiERhjvTiZZ9_ln6o1szmyIVb_Azc3CgBxpHjDjzVfaVT69x_QFy4apXDIl_grvEGM9pWES1O8UcHcihDOufp3nOvavuESkRtdXKsrpAwuDMoqXy_Ob5KfAPfJfVyh4EXEqGQND3E_D7Xur2jq15p6UAvqis2hKeHwMn0RZT-zBv0QlGcw89qDQKt',
      view: 'racks-floor-stands' as ActiveView
    },
    {
      title: 'PVD Gold Fixtures',
      subtitle: 'Titanium Coated Luxury Rails',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCetuei0F7kSeHMJpAlZLJlEt4ZKllTrm7a_7Vi2J8rR2GPeKo2PBSRUXNc8RZrePn1SG9les_u8fXcd5qWdGTjY1t3-pyqYm-5SYRtJzPggLV4gbKULgD4CHDPJTTVjrXkffgSdCWbP222b6rxD4DzPRmjvIDZD-IKtQqhggZfe6eWOLaGbGVJJBQ-IxXlnhTksR9lsT2nZQ6e8ZHFvz36BuckdTvq3CJ4n9Ora0FMb2Il8l-cwyLH',
      view: 'racks-floor-stands' as ActiveView
    },
    {
      title: 'Hangers & Accessories',
      subtitle: 'Lotus Wood & Swivel Hangers',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3wT2dEWWiX7L8L83-7jR0xWJ_y9d_5Y3oA5-nUo9z0Xg9',
      fallbackImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeyRngn-txXSiqRPu1Qj0Mbwcq5KMUMOg8k6Zy1VnwfiSd9ghatzp9o9deTDByF_ZkrrWaUZCHHpefZmTX4_ua9pivSn_z65FjayJFW5nO0bvkuQjK0tKRKQDATBAtSoOG010HECGDjCBhYHEwMV64NYVY890XdAPlRlIC7KJ6A4VMuLMhVluJ0KiWSDQzZvemOLCSRr2-0k4uReE14dxNJemMx-hIJeuUijVVJqjUi8mPVXd1kF0n',
      view: 'racks-floor-stands' as ActiveView
    }
  ];

  return (
    <div className="w-full bg-[#fdf9f3] text-[#1c1c18] pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-10 pt-4">

        {/* 1. CLEAN SINGLE FULL-WIDTH HERO BANNER (Decluttered: no side dark boxes) */}
        <section className="w-full bg-[#ffffff] rounded-2xl lg:rounded-3xl p-6 lg:p-10 shadow-sm border border-[#e6e2dc] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 bg-[#1a1c20] text-white px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider w-fit shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                <span>Hyderabad Factory Direct • B2B Wholesale</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#000102] tracking-tight leading-tight">
                Heavy-Duty Display Stands &amp; Racks
              </h1>

              <p className="font-serif italic text-lg sm:text-xl text-[#775a00] font-semibold">
                Showcase Style • Organise Store • Elevate Sales
              </p>

              <p className="text-xs sm:text-sm text-[#45474b] max-w-xl leading-relaxed">
                Direct factory manufacturing in Ranigunj &amp; Begum Bazaar. Engineered with 1.6mm–2.0mm ERW steel, PVD gold electroplating, and boltless 10-minute assembly. Over 180+ South India showrooms fitted.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveView('racks-floor-stands')}
                  className="bg-[#000102] hover:bg-[#2A2D34] text-white px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Explore Catalog</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
                <a
                  href="https://wa.me/917396127273?text=Hi%20All%20Display,%20I%20am%20interested%20in%20Heavy-Duty%20Display%20Stands%20and%20Racks%20wholesale%20rates."
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>WhatsApp Quotation (+91 73961 27273)</span>
                </a>
              </div>

              {/* Trust Features Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-2 border-t border-[#e6e2dc]/80">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-[#000102] font-semibold text-xs">
                    <span className="material-symbols-outlined text-[16px] text-[#775a00]">architecture</span>
                    <span>1.6mm - 2.0mm ERW</span>
                  </div>
                  <span className="text-[10px] text-[#76777b]">Structural Steel Gauge</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-[#000102] font-semibold text-xs">
                    <span className="material-symbols-outlined text-[16px] text-[#775a00]">inventory_2</span>
                    <span>150+ Stock SKUs</span>
                  </div>
                  <span className="text-[10px] text-[#76777b]">Ranigunj Warehouse</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-[#000102] font-semibold text-xs">
                    <span className="material-symbols-outlined text-[16px] text-[#775a00]">local_shipping</span>
                    <span>Pan-India Safe</span>
                  </div>
                  <span className="text-[10px] text-[#76777b]">Direct Lorry Freight</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-[#000102] font-semibold text-xs">
                    <span className="material-symbols-outlined text-[16px] text-[#775a00]">videocam</span>
                    <span>Live Video Proof</span>
                  </div>
                  <span className="text-[10px] text-[#76777b]">Crate Inspection Call</span>
                </div>
              </div>
            </div>

            {/* Right Showcase Image Card (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div 
                onClick={() => setActiveView('pdp')}
                className="relative aspect-[4/3.8] rounded-2xl overflow-hidden bg-[#f7f3ed] border border-[#e6e2dc] shadow-md group cursor-pointer"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXybVXMlvZGeKYb_0JXEtHxZmiY36LraReoSDO2Auwjuyr6Nr9AmLN02CqnVSfW5qty_u1k1zBD3_8xhryMVP33uzyGFfJT-Irp_zV2RwgYU3JRLGf_A_X5jCoLJ4YtNB_MLXGfONPve3BhVwvtJJNkGZE4FJ2H53n7H1J-0lWZWLhZREwRq9q-GBEXPajJREpKLmpuAXp1s4ZoBzc79alpLRtJ6Es_FBOpz6L-smTtuCpCvs9H85f"
                  alt="Triple pipe rack system showcase"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Top Badge */}
                <div className="absolute top-3 left-3 bg-[#1a1c20]/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow">
                  Flagship: Triple Pipe System (AD-TPR-739)
                </div>

                {/* Floating Bottom Info Pill */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-white/60 shadow-lg flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#775a00]">140kg Tested Load Capacity</div>
                    <div className="font-serif font-bold text-xs text-[#000102]">Modular Glass Shelves + Hanging Rod</div>
                  </div>
                  <span className="text-xs font-bold text-[#775a00] group-hover:underline flex items-center gap-0.5">
                    <span>Specs</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 2. HORIZONTAL SLIDING CATEGORY CAROUSEL (Manages vertical space on mobile) */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#775a00]">
                Commercial Fixture Collections
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#000102]">
                Shop by Fixture Category
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Left/Right slide navigation buttons on mobile & tablet */}
              <div className="flex lg:hidden items-center gap-1.5 mr-1">
                <button
                  type="button"
                  onClick={() => scrollCategories('left')}
                  className="w-7 h-7 rounded-full bg-white border border-[#e6e2dc] shadow-sm flex items-center justify-center text-[#1c1c18] active:bg-[#f1ede7] transition-colors"
                  aria-label="Scroll left"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollCategories('right')}
                  className="w-7 h-7 rounded-full bg-white border border-[#e6e2dc] shadow-sm flex items-center justify-center text-[#1c1c18] active:bg-[#f1ede7] transition-colors"
                  aria-label="Scroll right"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>

              <button
                onClick={() => setActiveView('racks-floor-stands')}
                className="text-xs font-bold text-[#775a00] hover:text-[#000102] flex items-center gap-1 transition-colors shrink-0"
              >
                <span className="hidden sm:inline">View Full Catalog</span>
                <span className="sm:hidden">Catalog</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Left-to-Right Horizontal Sliding Container */}
          <div
            ref={categoryScrollRef}
            className="flex lg:grid lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto lg:overflow-visible pb-2 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 scrollbar-none snap-x snap-mandatory scroll-smooth touch-pan-x"
          >
            {coreCategories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => setActiveView(cat.view)}
                className="w-[140px] sm:w-[160px] lg:w-auto shrink-0 lg:shrink snap-start bg-[#ffffff] rounded-xl p-3 border border-[#e6e2dc] shadow-sm hover:shadow-md hover:border-[#775a00]/50 transition-all cursor-pointer group flex flex-col items-center text-center gap-2"
              >
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-[#f7f3ed] border border-[#e6e2dc] p-1 flex items-center justify-center shrink-0">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    onError={(e) => {
                      if (cat.fallbackImg) {
                        (e.target as HTMLImageElement).src = cat.fallbackImg;
                      }
                    }}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-108 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col gap-0.5 w-full">
                  <h3 className="font-semibold text-xs text-[#000102] group-hover:text-[#775a00] transition-colors leading-tight line-clamp-1">
                    {cat.title}
                  </h3>
                  <span className="text-[10px] text-[#76777b] leading-tight line-clamp-1">
                    {cat.subtitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. CLEAN 4-COLUMN TOP SELLING PRODUCTS (Promo card removed for uniform look) */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#775a00]">
                High-Volume Stock Items
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#000102]">
                Top Selling Products
              </h2>
            </div>
            <button
              onClick={() => setActiveView('racks-floor-stands')}
              className="text-xs font-bold text-[#775a00] hover:text-[#000102] flex items-center gap-1 transition-colors"
            >
              <span>Explore All Racks</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-[#e6e2dc] shadow-sm flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-[40px] text-[#76777b]">inventory_2</span>
              <h3 className="font-serif text-lg font-bold text-[#1c1c18]">Catalog is currently empty</h3>
              <p className="text-xs text-[#76777b] max-w-md">
                All product and category data has been cleared. Add products via the Admin Panel (Owner Mode) to display them dynamically here.
              </p>
              <button
                onClick={() => setActiveView('racks-floor-stands')}
                className="mt-2 bg-[#1a1c20] text-[#ffdf98] px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Go to Catalog / Admin
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="bg-[#ffffff] rounded-2xl p-4 border border-[#e6e2dc] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex flex-col gap-2">
                    <div 
                      onClick={() => setActiveView('pdp')}
                      className="relative aspect-[4/4.5] rounded-xl overflow-hidden bg-[#f7f3ed] cursor-pointer"
                    >
                      {product.badge && (
                        <span className="absolute top-2 left-2 z-10 bg-[#000102] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                          {product.badge}
                        </span>
                      )}
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex items-center gap-1 text-[#ffb800] text-xs">
                      {'★★★★★'.split('').map((s, i) => (
                        <span key={i}>{s}</span>
                      ))}
                      <span className="text-[#76777b] text-[11px]">({product.reviewCount || 35} Reviews)</span>
                    </div>

                    <h3 
                      onClick={() => setActiveView('pdp')}
                      className="font-bold text-xs text-[#000102] line-clamp-2 cursor-pointer hover:text-[#775a00] transition-colors"
                    >
                      {product.title}
                    </h3>

                    <div className="flex items-baseline gap-2">
                      {product.originalPrice && (
                        <span className="text-[#76777b] line-through text-xs">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                      <span className="font-bold text-sm text-[#000102]">₹{product.price.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-[#775a00] font-semibold">/ {product.unit}</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => {
                        onAddToCart(product, 1);
                        onToast(`Added ${product.code} to order list`);
                      }}
                      className="w-full bg-[#1a1c20] hover:bg-[#2A2D34] text-white py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                      <span>+ Add to Order</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. SLIM HORIZONTAL TRUST & LOGISTICS STRIP (Condensed from bulky orange block) */}
        <section className="w-full bg-[#1a1c20] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#fece57] shrink-0">
                <span className="material-symbols-outlined text-[22px]">local_shipping</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-white">Pan-India Freight</span>
                <span className="text-[11px] text-[#c6c6cb]">AP, TG, KA, TN daily lorries</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#25D366] shrink-0">
                <span className="material-symbols-outlined text-[22px]">videocam</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-white">Live Video Proof</span>
                <span className="text-[11px] text-[#c6c6cb]">Crate inspection on WhatsApp</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#fece57] shrink-0">
                <span className="material-symbols-outlined text-[22px]">receipt_long</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-white">18% GST Input Credit</span>
                <span className="text-[11px] text-[#c6c6cb]">Official B2B tax invoice</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#fece57] shrink-0">
                <span className="material-symbols-outlined text-[22px]">factory</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-white">Direct Factory Rates</span>
                <span className="text-[11px] text-[#c6c6cb]">Zero middleman commission</span>
              </div>
            </div>

          </div>
        </section>

        {/* 5. REAL STORE SETUPS & INSTAGRAM VIDEO PROOFS (Unique store photos only here) */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1a1c20] text-[#ffdf98] flex items-center justify-center font-bold text-sm ring-2 ring-[#775a00]/30 shrink-0">
                AD
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#000102]">Real Store Setups &amp; Video Proofs</h2>
                  <span className="hidden sm:inline bg-[#f1ede7] text-[#76777b] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    @all_display_ • 9,153 Followers
                  </span>
                </div>
                <span className="text-[11px] text-[#76777b]">
                  Watch real shop walkthroughs filmed in Jubilee Hills, Banjara Hills, Begum Bazaar &amp; Hitec City
                </span>
              </div>
            </div>

            <a
              href="https://instagram.com/all_display_"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#E1306C] hover:underline"
            >
              <span>Follow @all_display_</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROJECT_REELS.slice(0, 4).map((reel) => (
              <div
                key={reel.id}
                onClick={() => onOpenReel(reel)}
                className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm group cursor-pointer border border-[#e6e2dc]"
              >
                <img
                  src={reel.image}
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25 flex flex-col justify-between p-4">
                  <div className="flex justify-between items-center">
                    <span className="bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">
                      {reel.location.split(',')[0]}
                    </span>
                    <span className="bg-[#E1306C] text-white px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-[12px]">play_arrow</span>
                      <span>{reel.duration}</span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 text-white">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-1 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                    </div>
                    <span className="font-semibold text-xs leading-tight line-clamp-1">
                      {reel.title}
                    </span>
                    <span className="text-[10px] text-white/70">
                      {reel.categoryLabel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CONDENSED QUICK BULK INQUIRY (Simplified 2-column layout) */}
        <section className="bg-[#ffffff] rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-[#e6e2dc] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Simple Heading & Direct WhatsApp CTA */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <span className="w-fit bg-[#ffdf98]/40 text-[#775a00] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Direct Wholesale Desk
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#000102] leading-tight">
              Need an Itemized Store Quotation?
            </h2>
            <p className="text-xs sm:text-sm text-[#45474b] leading-relaxed">
              Send your carpet dimensions or rough hand sketch. Our Ranigunj technical desk calculates your exact rack count, channel lengths, and tiered wholesale cost within 2 hours.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href="https://wa.me/917396127273?text=Hi%20All%20Display,%20I%20have%20a%20store%20plan%20to%20quote%20with%20wholesale%20rates."
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Chat on WhatsApp (+91 73961 27273)</span>
              </a>

              <a
                href="tel:+919849023456"
                className="bg-[#f7f3ed] hover:bg-[#ebe8e2] text-[#000102] px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#e6e2dc]"
              >
                <span className="material-symbols-outlined text-[16px] text-[#775a00]">phone</span>
                <span>Call Showroom Lead</span>
              </a>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-[#76777b] pt-1">
              <span>Ranigunj Unit: +91 73961 27273</span>
              <span>•</span>
              <span>Begum Bazaar: +91 98490 23456</span>
            </div>
          </div>

          {/* Right Compact Form */}
          <div className="lg:col-span-6 bg-[#f7f3ed] p-5 sm:p-6 rounded-2xl border border-[#e6e2dc] shadow-inner flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#e6e2dc]">
              <span className="text-xs font-bold text-[#000102]">Quick Wholesale Estimate Form</span>
              <span className="text-[10px] text-[#775a00] font-semibold">Reply in ~45 Mins</span>
            </div>

            <form onSubmit={handleInquirySubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Store Owner / Architect Name *"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="bg-white border border-[#c6c6cb] rounded-lg px-3 py-2 text-xs text-[#1c1c18] focus:outline-none focus:border-[#000102]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <select
                  value={inquiryStoreType}
                  onChange={(e) => setInquiryStoreType(e.target.value)}
                  className="bg-white border border-[#c6c6cb] rounded-lg px-3 py-2 text-xs text-[#1c1c18] focus:outline-none focus:border-[#000102]"
                >
                  <option>Boutique &amp; Designer Wear</option>
                  <option>Men's Casuals &amp; Denim</option>
                  <option>Bridal &amp; Heavy Sarees</option>
                  <option>Kidswear &amp; Multi-brand</option>
                  <option>Wholesale Warehouse Depot</option>
                </select>

                <input
                  type="text"
                  placeholder="Floor Area (e.g. 850 sq.ft)"
                  value={inquiryArea}
                  onChange={(e) => setInquiryArea(e.target.value)}
                  className="bg-white border border-[#c6c6cb] rounded-lg px-3 py-2 text-xs text-[#1c1c18] focus:outline-none focus:border-[#000102]"
                />
              </div>

              <input
                type="text"
                placeholder="Delivery City / Pincode (e.g. Vijayawada 520002)"
                value={inquiryCity}
                onChange={(e) => setInquiryCity(e.target.value)}
                className="bg-white border border-[#c6c6cb] rounded-lg px-3 py-2 text-xs text-[#1c1c18] focus:outline-none focus:border-[#000102]"
              />

              <button
                type="submit"
                className="mt-1 w-full bg-[#1a1c20] hover:bg-[#2A2D34] text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#fece57]">send</span>
                <span>Send Estimate Request</span>
              </button>
            </form>
          </div>

        </section>

      </div>
    </div>
  );
};
