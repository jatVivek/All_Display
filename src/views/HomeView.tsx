import { AppIcon } from '../components/AppIcon';
import React, { useState, useEffect } from 'react';
import { ActiveView, HomepageBanner, Product } from '../types';
import { storeManager } from '../services/storeManager';
import { getWhatsAppLink, getWhatsAppNumber } from '../utils/whatsapp';

interface HomeViewProps {
  setActiveView: (view: ActiveView) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToast: (msg: string) => void;
  onOpenBannerTarget: (banner: HomepageBanner) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveView,
  onAddToCart,
  onToast,
  onOpenBannerTarget
}) => {
  const [bumperQty, setBumperQty] = useState(1);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryStoreType, setInquiryStoreType] = useState('Boutique & Designer Wear');
  const [inquiryArea, setInquiryArea] = useState('650');
  const [inquiryCity, setInquiryCity] = useState('');
  const [products, setProducts] = useState<Product[]>(() => storeManager.getProducts());
  const [categories, setCategories] = useState(() => storeManager.getCategories());
  const [homepageBanners, setHomepageBanners] = useState(() => storeManager.getHomepageBanners());
  const [dealProductIds, setDealProductIds] = useState(() => storeManager.getHomepageDealProductIds());
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setProducts(storeManager.getProducts());
      setCategories(storeManager.getCategories());
      setHomepageBanners(storeManager.getHomepageBanners());
      setDealProductIds(storeManager.getHomepageDealProductIds());
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
  useEffect(() => {
    if (activeBannerIndex >= homepageBanners.length) setActiveBannerIndex(0);
  }, [activeBannerIndex, homepageBanners.length]);
  useEffect(() => {
    const banner = homepageBanners[activeBannerIndex];
    if (!banner?.image) return;

    const desktopPreload = document.createElement('link');
    desktopPreload.rel = 'preload';
    desktopPreload.as = 'image';
    desktopPreload.href = banner.image;
    desktopPreload.fetchPriority = 'high';
    document.head.appendChild(desktopPreload);

    const mobilePreload = banner.mobileImage ? document.createElement('link') : null;
    if (mobilePreload && banner.mobileImage) {
      mobilePreload.rel = 'preload';
      mobilePreload.as = 'image';
      mobilePreload.href = banner.mobileImage;
      mobilePreload.media = '(max-width: 767px)';
      mobilePreload.fetchPriority = 'high';
      document.head.appendChild(mobilePreload);
    }

    return () => {
      desktopPreload.remove();
      mobilePreload?.remove();
    };
  }, [activeBannerIndex, homepageBanners]);
  const categoryScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text =
      `Hi All Display Hyderabad, I would like an itemized wholesale quotation & elevation guidance:\n` +
      `• Name/Firm: ${inquiryName || 'Store Owner'}\n` +
      `• Store Type: ${inquiryStoreType}\n` +
      `• Floor Area: ${inquiryArea} sq.ft\n` +
      `• Delivery City/Pin: ${inquiryCity || 'Hyderabad'}\n` +
      `Please provide CAD rack layout guidance and ex-depot proforma rates.`;
    window.open(getWhatsAppLink(text), '_blank');
    onToast('Inquiry generated! Opening WhatsApp sales desk...');
  };

  // Clean, single set of 6 primary categories with isolated product imagery
  const categoryArtwork = [
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
  const coreCategories = categories.map((category, index) => ({
    ...categoryArtwork[index % categoryArtwork.length],
    id: category.id,
    title: category.name,
    subtitle: category.description,
    img: products.find((product) => product.category === category.name)?.image ??
      categoryArtwork[index % categoryArtwork.length].img
  }));

  return (
    <div className="w-full bg-[#fdf9f3] text-[#1c1c18] pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-5 pt-3 sm:gap-6 sm:pt-4">

        {homepageBanners.length > 0 && (() => {
          const banner = homepageBanners[activeBannerIndex];
          const targetLabel = banner.linkType === 'category'
            ? categories.find((category) => category.id === banner.linkId)?.name
            : products.find((product) => product.id === banner.linkId)?.title;
          return (
            <section className="w-full overflow-hidden rounded-2xl border border-[#e6e2dc] bg-white shadow-[0_16px_40px_-24px_rgba(28,28,24,0.28)] sm:rounded-3xl">
              <div className="grid h-[clamp(260px,54svh,380px)] grid-cols-[minmax(0,1.65fr)_minmax(0,0.8fr)] sm:h-[min(65vh,540px)] sm:min-h-[350px] sm:max-h-[560px] sm:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                <div className="relative z-10 flex min-w-0 flex-col items-start justify-center overflow-hidden p-3 min-[380px]:p-4 sm:p-8 lg:p-10 xl:p-12">
                  {banner.eyebrow && (
                    <p className="mb-1.5 max-w-full truncate text-[clamp(7px,2vw,9px)] font-bold uppercase tracking-[0.12em] text-[#775a00] sm:mb-3 sm:text-xs sm:tracking-[0.22em]">
                      {banner.eyebrow}
                    </p>
                  )}
                  <h1 className="line-clamp-3 max-w-[15ch] font-serif text-[clamp(1.1rem,5.8vw,1.8rem)] leading-[1.04] tracking-[-0.025em] text-[#1c1c18] min-[380px]:text-[clamp(1.25rem,5.8vw,2rem)] sm:line-clamp-3 sm:text-5xl sm:leading-[1.02] sm:tracking-[-0.03em] lg:text-[clamp(2.8rem,4vw,3.5rem)]">
                    {banner.title}
                  </h1>
                  {banner.subtitle && (
                    <p className="mt-1.5 line-clamp-2 max-w-[32rem] text-[clamp(9px,2.7vw,11px)] font-semibold leading-[1.3] text-[#45474b] min-[380px]:mt-2 sm:mt-4 sm:text-lg sm:leading-relaxed">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.description && (
                    <p className="mt-1 hidden max-w-[32rem] text-sm leading-6 text-[#76777b] sm:mt-2 sm:line-clamp-2 sm:block sm:text-base sm:leading-7">
                      {banner.description}
                    </p>
                  )}
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
                    <button
                      onClick={() => onOpenBannerTarget(banner)}
                      className="inline-flex min-h-11 items-center gap-1 rounded-full bg-[#1a1c20] px-3 py-2.5 text-[10px] font-bold leading-tight text-white shadow-[0_8px_20px_-10px_rgba(26,28,32,0.65)] transition-colors hover:bg-[#775a00] cursor-pointer min-[380px]:px-4 min-[380px]:text-[11px] sm:gap-2 sm:px-6 sm:py-3.5 sm:text-sm"
                    >
                      <span>{banner.linkType === 'product' ? 'View Product' : 'Shop Collection'}</span>
                      <AppIcon name="arrow_forward" className="text-[14px] sm:text-[18px]" />
                    </button>
                    <a
                      href={getWhatsAppLink(`Hi All Display, I am interested in ${banner.title} wholesale rates.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="hidden min-h-11 items-center gap-2 rounded-full border border-[#d8d1c6] px-5 py-3 text-sm font-semibold text-[#45474b] transition-colors hover:border-[#775a00] hover:text-[#775a00] sm:inline-flex"
                    >
                      Request a quote
                    </a>
                  </div>
                  {homepageBanners.length > 1 && (
                    <div className="mt-4 flex items-center gap-2.5 sm:mt-7" aria-label="Homepage banners">
                      {homepageBanners.map((item, index) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveBannerIndex(index)}
                          className={`flex h-5 items-center justify-center rounded-full transition-all cursor-pointer sm:h-6 ${index === activeBannerIndex ? 'w-8 bg-[#775a00]' : 'w-5 bg-transparent hover:bg-[#f1ede7] sm:w-6'}`}
                          aria-label={`Show banner ${index + 1}`}
                          aria-current={index === activeBannerIndex}
                        >
                          <span className={`h-2 rounded-full transition-all ${index === activeBannerIndex ? 'w-4 bg-white' : 'w-2 bg-[#b8ae9d]'}`} />
                        </button>
                      ))}
                      <span className="ml-1 text-[10px] font-medium text-[#76777b] sm:text-xs">
                        {String(activeBannerIndex + 1).padStart(2, '0')} / {String(homepageBanners.length).padStart(2, '0')}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onOpenBannerTarget(banner)}
                  className="group relative min-h-0 overflow-hidden border-l border-white/50 bg-[#f1ede7] text-left cursor-pointer"
                  aria-label={`Open ${targetLabel || banner.title}`}
                >
                  <picture className="absolute inset-0">
                    {banner.mobileImage && <source media="(max-width: 767px)" srcSet={banner.mobileImage} />}
                    <img
                      src={banner.image}
                      alt={banner.title}
                      fetchPriority="high"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    />
                  </picture>
                  <span className="absolute inset-0 border border-white/20"></span>
                  <span className="absolute inset-0 bg-gradient-to-t from-[#1a1c20]/55 via-transparent to-transparent"></span>
                  <span className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
                    <span className="rounded-full border border-white/30 bg-[#1a1c20]/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                      {targetLabel || 'Featured collection'}
                    </span>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm transition-colors group-hover:bg-white/25">
                      <AppIcon name="arrow_outward" className="text-[20px]" />
                    </span>
                  </span>
                </button>
              </div>
            </section>
          );
        })()}

        {dealProductIds.length > 0 && (
          <section className="flex flex-col gap-4" aria-labelledby="deal-of-the-day-heading">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#775a00]">Handpicked for your store</span>
                <h2 id="deal-of-the-day-heading" className="font-serif text-xl sm:text-2xl font-bold text-[#000102]">Deal of the Day</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('shop')}
                className="text-xs font-bold text-[#775a00] hover:text-[#000102] flex items-center gap-1"
              >
                Shop all products <AppIcon name="arrow_forward" className="text-[16px]" />
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {dealProductIds.map((id) => products.find((product) => product.id === id))
                .filter((product): product is Product => Boolean(product))
                .map((product) => (
                  <article key={product.id} className="bg-white rounded-2xl p-3 sm:p-4 border border-[#e6e2dc] shadow-sm flex flex-col gap-3">
                    <img src={product.image} alt={product.title} className="w-full aspect-[4/3] object-cover rounded-xl bg-[#f7f3ed]" />
                    {product.videoUrl && (
                      <video src={product.videoUrl} controls preload="none" playsInline aria-label={`${product.title} product video`} className="w-full rounded-xl bg-black" />
                    )}
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-[#1c1c18] line-clamp-2">{product.title}</h3>
                      <p className="mt-1 text-xs font-bold text-[#775a00]">₹{product.price.toLocaleString('en-IN')} / {product.unit}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart(product);
                        onToast(`Added ${product.code} to order list`);
                      }}
                      className="mt-auto w-full bg-[#1a1c20] hover:bg-[#2A2D34] text-white py-2 rounded-lg text-xs font-semibold"
                    >
                      Add to Order
                    </button>
                  </article>
                ))}
            </div>
          </section>
        )}

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
                  <AppIcon name="chevron_left" className="text-[16px]" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCategories('right')}
                  className="w-7 h-7 rounded-full bg-white border border-[#e6e2dc] shadow-sm flex items-center justify-center text-[#1c1c18] active:bg-[#f1ede7] transition-colors"
                  aria-label="Scroll right"
                >
                  <AppIcon name="chevron_right" className="text-[16px]" />
                </button>
              </div>

              <button
                onClick={() => setActiveView('racks-floor-stands')}
                className="text-xs font-bold text-[#775a00] hover:text-[#000102] flex items-center gap-1 transition-colors shrink-0"
              >
                <span className="hidden sm:inline">View Full Catalog</span>
                <span className="sm:hidden">Catalog</span>
                <AppIcon name="arrow_forward" className="text-[16px]" />
              </button>
            </div>
          </div>

          {/* Left-to-Right Horizontal Sliding Container */}
          <div
            ref={categoryScrollRef}
            className="flex lg:grid lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto lg:overflow-visible pb-2 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 scrollbar-none snap-x snap-mandatory scroll-smooth touch-pan-x"
          >
            {coreCategories.map((cat) => (
              <div
                key={cat.id}
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
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#775a00]">High-Volume Stock Items</span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#000102]">
                Most Selling Products
              </h2>
            </div>
            <button
              onClick={() => setActiveView('shop')}
              className="text-xs font-bold text-[#775a00] hover:text-[#000102] flex items-center gap-1 transition-colors"
            >
              <span>All Products</span>
              <AppIcon name="arrow_forward" className="text-[16px]" />
            </button>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-[#e6e2dc] shadow-sm flex flex-col items-center gap-3">
              <AppIcon name="inventory_2" className="text-[40px] text-[#76777b]" />
              <h3 className="font-serif text-lg font-bold text-[#1c1c18]">Catalog is currently empty</h3>
              <p className="text-xs text-[#76777b] max-w-md">
                All product and category data has been cleared. Add products via the Admin Panel (Owner Mode) to display them dynamically here.
              </p>
              <button
                onClick={() => setActiveView('racks-floor-stands')}
                className="mt-2 bg-[#1a1c20] text-[#ffdf98] px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Shop Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.slice(0, 16).map((product, index) => (
                <div key={product.id} className={`bg-[#ffffff] rounded-2xl p-3 sm:p-4 border border-[#e6e2dc] flex-col justify-between shadow-sm hover:shadow-md transition-shadow group ${index >= 8 ? 'hidden lg:flex' : 'flex'}`}>
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
                    {product.videoUrl && (
                      <video src={product.videoUrl} controls preload="none" playsInline aria-label={`${product.title} product video`} className="w-full rounded-xl bg-black" />
                    )}

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
                      <AppIcon name="add_shopping_cart" className="text-[16px]" />
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
                <AppIcon name="local_shipping" className="text-[22px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-white">Pan-India Freight</span>
                <span className="text-[11px] text-[#c6c6cb]">AP, TG, KA, TN daily lorries</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#25D366] shrink-0">
                <AppIcon name="videocam" className="text-[22px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-white">Live Video Proof</span>
                <span className="text-[11px] text-[#c6c6cb]">Crate inspection on WhatsApp</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#fece57] shrink-0">
                <AppIcon name="receipt_long" className="text-[22px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-white">18% GST Input Credit</span>
                <span className="text-[11px] text-[#c6c6cb]">Official B2B tax invoice</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#fece57] shrink-0">
                <AppIcon name="factory" className="text-[22px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs text-white">Direct Factory Rates</span>
                <span className="text-[11px] text-[#c6c6cb]">Zero middleman commission</span>
              </div>
            </div>

          </div>
        </section>

        {/* Contact and wholesale inquiry */}
        <section
          id="about-us"
          className="scroll-mt-24 bg-[#ffffff] rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-[#e6e2dc] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-7 flex flex-col gap-3">
            <span className="w-fit bg-[#ffdf98]/40 text-[#775a00] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              About All Display
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#000102] leading-tight">
              Retail display solutions, built for everyday business.
            </h2>
            <p className="text-sm text-[#45474b] leading-relaxed">
              All Display supplies retail fixtures and store fittings to boutiques, apparel stores, and retailers across India. From our Hyderabad wholesale operation, we help businesses find practical display products for their space, merchandising, and budget.
            </p>
            <button
              onClick={() => setActiveView('shop')}
              className="w-fit bg-[#1a1c20] hover:bg-[#2A2D34] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors"
            >
              Explore the Shop
            </button>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            {[
              ['Retail-ready range', 'Fixtures for a variety of store formats'],
              ['Wholesale support', 'Practical help choosing products'],
              ['Hyderabad base', 'Serving retailers across India'],
              ['Made to fit', 'Options for different layouts and needs'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-xl bg-[#f7f3ed] border border-[#e6e2dc] p-4">
                <h3 className="text-xs font-bold text-[#000102]">{title}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-[#76777b]">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact-us" className="scroll-mt-24 bg-[#ffffff] rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-[#e6e2dc] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Simple Heading & Direct WhatsApp CTA */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <span className="w-fit bg-[#ffdf98]/40 text-[#775a00] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Contact Us · Direct Wholesale Desk
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#000102] leading-tight">
              Need an Itemized Store Quotation?
            </h2>
            <p className="text-xs sm:text-sm text-[#45474b] leading-relaxed">
              Send your carpet dimensions or rough hand sketch. Our Ranigunj technical desk calculates your exact rack count, channel lengths, and tiered wholesale cost within 2 hours.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href={getWhatsAppLink('Hi All Display, I have a store plan to quote with wholesale rates.')}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <AppIcon name="chat" className="text-[18px]" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`tel:+${getWhatsAppNumber(true)}`}
                className="bg-[#f7f3ed] hover:bg-[#ebe8e2] text-[#000102] px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#e6e2dc]"
              >
                <AppIcon name="phone" className="text-[16px] text-[#775a00]" />
                <span>Call Showroom Lead</span>
              </a>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-[#76777b] pt-1">
              <span>Contact our Ranigunj Unit</span>
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
                <AppIcon name="send" className="text-[16px] text-[#fece57]" />
                <span>Send Estimate Request</span>
              </button>
            </form>
          </div>

        </section>

      </div>
    </div>
  );
};
