import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AppIcon } from '../components/AppIcon';
import { ActiveView, HomepageBanner, Product } from '../types';
import { storeManager } from '../services/storeManager';
import { getWhatsAppLink } from '../utils/whatsapp';

interface HomeViewProps {
  setActiveView: (view: ActiveView, path?: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct?: (product: Product) => void;
  onToast: (msg: string) => void;
  onOpenBannerTarget: (banner: HomepageBanner) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveView,
  onAddToCart,
  onSelectProduct,
  onToast,
  onOpenBannerTarget
}) => {
  const [products, setProducts] = useState<Product[]>(() => storeManager.getProducts());
  const [homepageBanners, setHomepageBanners] = useState(() => storeManager.getHomepageBanners());
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => storeManager.getWishlist());
  const [settings, setSettings] = useState(() => storeManager.getSettings());
  const [categories, setCategories] = useState(() => storeManager.getCategories());

  const categoryScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setProducts(storeManager.getProducts());
      setHomepageBanners(storeManager.getHomepageBanners());
      setWishlistIds(storeManager.getWishlist());
      setSettings(storeManager.getSettings());
      setCategories(storeManager.getCategories());
    };
    window.addEventListener('alldisplay_catalog_updated', handleUpdate);
    window.addEventListener('alldisplay_data_updated', handleUpdate);
    window.addEventListener('vinayak_wishlist_updated', handleUpdate);
    window.addEventListener('vinayak_settings_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    const unsubscribe = storeManager.subscribe((state) => {
      setProducts(state.products);
      setHomepageBanners(state.homepageBanners);
      setWishlistIds(storeManager.getWishlist());
      setSettings(state.settings);
      setCategories(state.categories);
    });

    return () => {
      window.removeEventListener('alldisplay_catalog_updated', handleUpdate);
      window.removeEventListener('alldisplay_data_updated', handleUpdate);
      window.removeEventListener('vinayak_wishlist_updated', handleUpdate);
      window.removeEventListener('vinayak_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      unsubscribe();
    };
  }, []);

  const brandName = settings.brandName || settings.storeName || 'All Display';

  // Auto-rotate uniform multi-banner carousel every 5.5s unless hovered
  useEffect(() => {
    if (homepageBanners.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % homepageBanners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [homepageBanners.length, isPaused]);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Auto-scroll categories smoothly every 3.2s unless hovered or user is touching
  useEffect(() => {
    if (isCategoryHovered) return;

    const interval = setInterval(() => {
      const container = categoryScrollRef.current;
      if (!container) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (maxScrollLeft <= 10) return; // All items fit on screen without scroll

      // When reaching or near the end, loop smoothly back to beginning
      if (container.scrollLeft >= maxScrollLeft - 15) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const step = container.clientWidth > 640 ? 220 : 140;
        container.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isCategoryHovered]);

  // Default category images fallback map
  const defaultCategoryIcons: Record<string, string> = {
    'Display Bust': '/assets/vinayak/cat_bust.png',
    'Display Cards': '/assets/vinayak/cat_card.png',
    'Display Stand': '/assets/vinayak/cat_stand.png',
    'Display Tray': '/assets/vinayak/cat_tray.png',
    'Storage Box': '/assets/vinayak/cat_box.png',
    'Mannequin Stand': '/assets/vinayak/cat_mannequin.png',
    'Packaging Tools': '/assets/vinayak/cat_bag.png',
  };

  const initialCatIds = useMemo(() => new Set(['cat-1', 'cat-2', 'cat-3', 'cat-4', 'cat-5', 'cat-6', 'cat-7', 'cat-8', 'cat-9']), []);

  // Issue #5: Filter categories to only those with at least 1 product (Newest categories first)
  const activeCategoriesList = useMemo(() => {
    return categories
      .map((cat) => {
        const count = products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;
        const isNew = !initialCatIds.has(cat.id) && Boolean(cat.createdAt || (cat.id.startsWith('cat-') && cat.id.length > 8));
        return {
          id: cat.id,
          title: cat.name,
          category: cat.name,
          icon: cat.image || defaultCategoryIcons[cat.name] || '/assets/vinayak/cat_stand.png',
          count: `${count} Item${count === 1 ? '' : 's'}`,
          itemCount: count,
          createdAt: cat.createdAt,
          isNew,
        };
      })
      .filter((cat) => cat.itemCount > 0);
  }, [categories, products, initialCatIds]);

  // All Products List
  const allProductsList = products;

  const activeBanner = homepageBanners[activeBannerIndex] || homepageBanners[0];

  return (
    <div className="w-full bg-white text-slate-900 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 sm:gap-10 pt-4 sm:pt-6">
        
        {/* 1. SHOP CATEGORIES CAROUSEL (Positioned First) */}
        {activeCategoriesList.length > 0 && (
          <section className="rounded-2xl sm:rounded-3xl border border-slate-100 bg-slate-50/60 p-4 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5 sm:mb-4">
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-orange-600">
                  Explore By Category
                </span>
                <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Shop Categories
                </h2>
              </div>
              
              {/* Scroll Navigation Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollCategories('left')}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
                  aria-label="Scroll left"
                >
                  <AppIcon name="chevron_left" className="text-sm sm:text-base" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCategories('right')}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
                  aria-label="Scroll right"
                >
                  <AppIcon name="chevron_right" className="text-sm sm:text-base" />
                </button>
              </div>
            </div>

            <div
              ref={categoryScrollRef}
              onMouseEnter={() => setIsCategoryHovered(true)}
              onMouseLeave={() => setIsCategoryHovered(false)}
              onTouchStart={() => setIsCategoryHovered(true)}
              onTouchEnd={() => setIsCategoryHovered(false)}
              className="flex items-center gap-3 sm:gap-6 overflow-x-auto pb-3 pt-3 px-2 scrollbar-none scroll-smooth"
            >
              {activeCategoriesList.map((cat, idx) => (
                <button
                  key={cat.id || idx}
                  type="button"
                  onClick={() => setActiveView('shop', `/shop?category=${encodeURIComponent(cat.category)}`)}
                  className="flex flex-col items-center gap-1.5 group shrink-0 min-w-[75px] sm:min-w-[110px] cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full p-1 bg-white border border-slate-200 group-hover:border-orange-500 group-hover:shadow-md transition-all duration-300 flex items-center justify-center overflow-hidden">
                      <img
                        src={cat.icon}
                        alt={cat.title}
                        className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                    </div>
                    {cat.isNew && (
                      <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md border-2 border-white z-20 pointer-events-none uppercase tracking-wider">
                        NEW
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-800 group-hover:text-orange-600 transition-colors text-center line-clamp-1">
                    {cat.title}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 -mt-1 font-medium">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 2. ALL PRODUCTS */}
        <section className="flex flex-col gap-4 sm:gap-6">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-orange-600">
                Wholesale &amp; Retail Catalog
              </span>
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                All Products
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('shop')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All in Shop</span>
              <AppIcon name="arrow_forward" className="text-xs sm:text-sm" />
            </button>
          </div>

          {allProductsList.length === 0 ? (
            <div className="bg-slate-50/70 border border-slate-100 rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-2">
              <AppIcon name="inventory_2" className="text-3xl text-slate-400" />
              <h3 className="font-bold text-sm text-slate-800">No Products in Catalog</h3>
              <p className="text-xs text-slate-500 max-w-sm">The product catalog has been cleared. Products created in the Admin panel will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {allProductsList.map((product) => {
                const discountPercent = product.originalPrice
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0;
                const inWishlist = wishlistIds.includes(product.id);

                return (
                  <article
                    key={product.id}
                    className="group bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-100 hover:border-orange-200 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
                    onClick={() => onSelectProduct ? onSelectProduct(product) : null}
                  >
                    {/* Image Area with Badge & Wishlist Heart */}
                    <div className="relative w-full aspect-square rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center mb-2 sm:mb-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-col gap-1 items-start">
                        {discountPercent > 0 && (
                          <div className="bg-orange-600 text-white text-[8px] sm:text-[9px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs">
                            {discountPercent}% OFF
                          </div>
                        )}
                        {product.videoUrl && (
                          <div className="flex items-center gap-1 bg-slate-900/85 backdrop-blur-xs text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                            <AppIcon name="videocam" className="text-orange-400 text-[10px]" />
                            <span>Video</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newState = storeManager.toggleWishlist(product);
                          onToast(newState ? `Saved ${product.title} to wishlist` : `Removed from wishlist`);
                        }}
                        className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-xs transition-colors cursor-pointer ${
                          inWishlist
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500'
                        }`}
                        title="Add to Wishlist"
                      >
                        <AppIcon name="favorite" className={`text-xs ${inWishlist ? 'text-rose-600 fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col gap-0.5 sm:gap-1 flex-1">
                      <div className="flex items-center gap-1 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider truncate">
                        <span className="text-orange-600 truncate">{product.category}</span>
                        {product.subCategory && (
                          <>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-500 truncate">{product.subCategory}</span>
                          </>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                        {product.title}
                      </h4>

                      {/* Pricing */}
                      <div className="mt-auto pt-1.5 sm:pt-2 flex items-baseline gap-1.5">
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (product.variations && product.variations.length > 0) {
                          if (onSelectProduct) onSelectProduct(product);
                        } else {
                          onAddToCart(product, 1);
                          onToast(`Added ${product.title} to Order List`);
                        }
                      }}
                      className="mt-2 sm:mt-3 w-full bg-slate-50 hover:bg-orange-600 text-slate-800 hover:text-white py-1.5 sm:py-2 px-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer border border-slate-200 hover:border-orange-600 truncate"
                    >
                      <AppIcon name={product.variations?.length ? 'tune' : 'shopping_bag'} className="text-xs shrink-0" />
                      <span className="truncate">{product.variations?.length ? 'Select Options' : 'Add to Cart'}</span>
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* 5. WHY CHOOSE ALL DISPLAY */}
        <section className="bg-slate-50/70 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="flex items-start gap-2.5 sm:gap-3.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <AppIcon name="factory" className="text-base sm:text-xl" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Direct Factory
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Manufacturer wholesale rates with zero intermediary markup.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <AppIcon name="local_shipping" className="text-base sm:text-xl" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Global Shipping
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Fast delivery across Telangana, Andhra Pradesh, all Indian states, &amp; export.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <AppIcon name="inventory_2" className="text-base sm:text-xl" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 uppercase tracking-wide">
                  5,000+ Ready
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Display busts, jewelry cards, trays, and tools in stock.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <AppIcon name="storefront" className="text-base sm:text-xl" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Feel Khana Depot
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Visit Hyderabad showroom or order online with WhatsApp.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 6. ABOUT ALL DISPLAY */}
        <section id="about-us" className="scroll-mt-24 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 flex flex-col gap-2.5 sm:gap-3">
            <span className="w-fit bg-orange-50 text-orange-600 border border-orange-200/60 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              About {brandName}
            </span>
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Trusted by 5,000+ Jewellers, Designers &amp; Boutique Brands
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Based in Feel Khana, Hyderabad, {brandName} is a premier manufacturer and wholesaler of luxury jewellery display systems, velvet busts, packaging boxes, tags, and packing machinery.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setActiveView('shop')}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-colors cursor-pointer"
              >
                Browse Catalog
              </button>
              <a
                href={getWhatsAppLink(`Hi ${brandName}, I have a requirement for custom jewellery packaging.`)}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <AppIcon name="chat" className="text-emerald-600 text-sm" />
                <span>Chat with Hyderabad Depot</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Showroom &amp; Warehouse
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {settings.showroomAddress || '15-8-397, Feel Khana, Hyderabad 500012, Telangana, India'}
            </p>
            <p className="text-xs text-slate-600">
              <strong className="text-slate-800">Phone:</strong> {settings.supportPhone || '+91 73961 27273'}<br />
              <strong className="text-slate-800">Email:</strong> {settings.supportEmail || 'contact@alldisplay.com'}
            </p>
          </div>
        </section>

        {/* 5. HOMEPAGE PROMOTIONAL BANNER (Positioned at the end of the page before footer) */}
        {homepageBanners.length > 0 && activeBanner && (
          <section
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-orange-50 via-amber-50/40 to-slate-50 border border-orange-100/70 p-4 sm:p-8 lg:p-10 shadow-xs group min-h-[320px] sm:min-h-[360px] lg:min-h-[400px] flex flex-col justify-between"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center flex-1">
              
              {/* Hero Copy */}
              <div className="lg:col-span-7 flex flex-col items-start gap-2.5 sm:gap-3.5">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/90 border border-orange-200/60 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-orange-600 shadow-2xs">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="truncate max-w-[240px] sm:max-w-none">{activeBanner.eyebrow || 'Wholesale & Retail Manufacturer'}</span>
                </div>

                <h2 className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] line-clamp-2">
                  {activeBanner.title}
                </h2>

                <p className="text-xs sm:text-sm lg:text-base text-slate-600 max-w-xl leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {activeBanner.subtitle || activeBanner.description}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onOpenBannerTarget(activeBanner)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-xs hover:shadow-sm transition-all cursor-pointer truncate"
                  >
                    <span>Explore Shop</span>
                    <AppIcon name="arrow_forward" className="text-sm" />
                  </button>

                  <a
                    href={getWhatsAppLink(`Hi ${brandName}, I would like to inquire about wholesale prices.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-full transition-colors cursor-pointer truncate"
                  >
                    <AppIcon name="chat" className="text-emerald-500 text-sm sm:text-base" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Trust Points */}
                <div className="hidden sm:flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-1">
                  <span className="flex items-center gap-1.5">
                    <AppIcon name="check_circle" className="text-emerald-500 text-sm" />
                    Same-Day Hyderabad Dispatch
                  </span>
                  <span className="flex items-center gap-1.5">
                    <AppIcon name="check_circle" className="text-emerald-500 text-sm" />
                    Direct Factory Pricing
                  </span>
                </div>
              </div>

              {/* Uniform Banner Image Frame (Universal Sizing & Aspect Ratio) */}
              <div className="lg:col-span-5 relative w-full">
                <div className="relative w-full h-44 sm:h-56 lg:h-72 rounded-2xl overflow-hidden bg-white shadow-md border border-slate-100">
                  <picture>
                    {activeBanner.mobileImage && (
                      <source media="(max-width: 767px)" srcSet={activeBanner.mobileImage} />
                    )}
                    <img
                      src={activeBanner.image || '/assets/vinayak/shop_banner.png'}
                      alt={activeBanner.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </picture>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xs p-2 sm:p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] sm:text-[11px] font-bold text-slate-900 truncate">Feel Khana Wholesale Depot</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-500">Ready Dispatch Hyderabad</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[9px] sm:text-[10px] font-bold shrink-0">
                      Ready Stock
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Uniform Slider Controls */}
            {homepageBanners.length > 1 && (
              <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-orange-200/40 flex items-center justify-between">
                {/* Dots */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {homepageBanners.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveBannerIndex(idx)}
                      className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                        activeBannerIndex === idx
                          ? 'w-5 sm:w-6 bg-orange-600'
                          : 'w-1.5 sm:w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Arrows */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveBannerIndex((prev) => (prev - 1 + homepageBanners.length) % homepageBanners.length)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                    aria-label="Previous banner"
                  >
                    <AppIcon name="arrow_back" className="text-xs sm:text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveBannerIndex((prev) => (prev + 1) % homepageBanners.length)}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                    aria-label="Next banner"
                  >
                    <AppIcon name="arrow_forward" className="text-xs sm:text-sm" />
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
};
