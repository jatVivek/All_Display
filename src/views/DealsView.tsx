import React, { useState, useEffect, useMemo } from 'react';
import { Product, ActiveView } from '../types';
import { storeManager } from '../services/storeManager';
import { AppIcon } from '../components/AppIcon';
import { getWhatsAppLink } from '../utils/whatsapp';

interface DealsViewProps {
  setActiveView: (view: ActiveView, path?: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
  onToast: (msg: string) => void;
}

export const DealsView: React.FC<DealsViewProps> = ({
  setActiveView,
  onAddToCart,
  onSelectProduct,
  onToast,
}) => {
  const [products, setProducts] = useState<Product[]>(() => storeManager.getProducts());
  const [dealProductIds, setDealProductIds] = useState<string[]>(() => storeManager.getHomepageDealProductIds());
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => storeManager.getWishlist());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'discount' | 'price-low' | 'price-high' | 'featured'>('discount');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Countdown timer logic to midnight IST
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 11,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Calculate remaining time until midnight tonight
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = Math.max(0, midnight.getTime() - now.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen for updates from store / admin
  useEffect(() => {
    const handleUpdate = () => {
      setProducts(storeManager.getProducts());
      setDealProductIds(storeManager.getHomepageDealProductIds());
      setWishlistIds(storeManager.getWishlist());
    };
    window.addEventListener('alldisplay_catalog_updated', handleUpdate);
    window.addEventListener('alldisplay_data_updated', handleUpdate);
    window.addEventListener('vinayak_wishlist_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('alldisplay_catalog_updated', handleUpdate);
      window.removeEventListener('alldisplay_data_updated', handleUpdate);
      window.removeEventListener('vinayak_wishlist_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Collect all deal products: explicitly assigned dealProductIds + products on sale
  const allDeals = useMemo(() => {
    const directDeals = dealProductIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));

    const discountedProducts = products.filter(
      (p) => p.originalPrice && p.originalPrice > p.price && !dealProductIds.includes(p.id)
    );

    const combined = [...directDeals, ...discountedProducts];
    // Fallback if no deals configured
    if (combined.length === 0) {
      return products.slice(0, 8);
    }
    return combined;
  }, [products, dealProductIds]);

  // Featured Hero Deal (first direct deal or highest discounted)
  const spotlightDeal = useMemo(() => {
    if (allDeals.length === 0) return null;
    return allDeals[0];
  }, [allDeals]);

  // Available categories in deals
  const categories = useMemo(() => {
    const set = new Set<string>();
    allDeals.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [allDeals]);

  // Filtered & Sorted Deals
  const filteredDeals = useMemo(() => {
    let list = allDeals.slice();

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (sortBy === 'discount') {
      list.sort((a, b) => {
        const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
        return discB - discA;
      });
    } else if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [allDeals, selectedCategory, sortBy]);

  const handleQtyChange = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleAddDealToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const qty = quantities[product.id] || 1;
    onAddToCart(product, qty);
    onToast(`Added ${qty}x ${product.title} to order list!`);
  };

  const handleToggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = storeManager.toggleWishlist(product);
    onToast(newState ? `Saved ${product.title} to wishlist` : `Removed from wishlist`);
  };

  const spotlightDiscount = spotlightDeal?.originalPrice
    ? Math.round(((spotlightDeal.originalPrice - spotlightDeal.price) / spotlightDeal.originalPrice) * 100)
    : 25;

  const spotlightSavings = spotlightDeal?.originalPrice
    ? spotlightDeal.originalPrice - spotlightDeal.price
    : 150;

  return (
    <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 pb-20">
      
      {/* 1. BREADCRUMBS & TOP PROMO TICKER */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav className="flex items-center gap-2 text-slate-500">
            <button
              onClick={() => setActiveView('home')}
              className="hover:text-orange-600 transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="font-bold text-slate-800">Deals of the Day</span>
          </nav>

          {/* Flash sale live indicator */}
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200/80 text-rose-700 px-3 py-1 rounded-full font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
            <span>Direct Wholesale Flash Rates • Sowcarpet Depot Dispatch</span>
          </div>
        </div>
      </div>

      {/* 2. HERO DEALS HEADER & COUNTDOWN */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          <div className="flex flex-col gap-3 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center justify-center md:justify-start gap-2">
              <span className="bg-orange-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                🔥 Exclusive Daily Flash
              </span>
              <span className="text-orange-400 font-bold text-xs uppercase tracking-wider">
                Direct Factory Dispatches
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Deal Of The Day <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
                Special Wholesale Offers
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Grab premium velvet necklace busts, tiered earring stands, stackable trays, and branded packaging cards at limited-time clearance rates. Available while depot stock lasts.
            </p>
          </div>

          {/* Interactive Countdown Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 sm:p-6 text-center flex flex-col items-center gap-3 shrink-0 shadow-2xl">
            <span className="text-[11px] uppercase font-bold tracking-widest text-orange-300">
              Today's Deals Expire In
            </span>

            <div className="flex items-center gap-2 sm:gap-3 text-slate-900">
              <div className="flex flex-col items-center bg-white rounded-2xl p-2 sm:p-3 min-w-[56px] sm:min-w-[64px] shadow-sm">
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Hours</span>
              </div>
              <span className="text-xl font-bold text-white">:</span>
              <div className="flex flex-col items-center bg-white rounded-2xl p-2 sm:p-3 min-w-[56px] sm:min-w-[64px] shadow-sm">
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Mins</span>
              </div>
              <span className="text-xl font-bold text-white">:</span>
              <div className="flex flex-col items-center bg-white rounded-2xl p-2 sm:p-3 min-w-[56px] sm:min-w-[64px] shadow-sm">
                <span className="text-xl sm:text-2xl font-black text-orange-600">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Secs</span>
              </div>
            </div>

            <span className="text-[10px] text-slate-300">
              Refreshed every 24 Hours • Sowcarpet Depot, Chennai
            </span>
          </div>

        </div>
      </section>

      {/* 3. SPOTLIGHT DEAL CARD */}
      {spotlightDeal && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-orange-200/80 shadow-xl flex flex-col lg:flex-row items-center gap-6 sm:gap-10">
            
            {/* Spotlight Image & Badge */}
            <div className="relative w-full lg:w-5/12 aspect-square max-h-[360px] rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-4 shrink-0">
              <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md z-10">
                {spotlightDiscount}% OFF • SAVE ₹{spotlightSavings}
              </span>
              <button
                type="button"
                onClick={(e) => handleToggleWishlist(spotlightDeal, e)}
                className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-colors z-10 cursor-pointer ${
                  wishlistIds.includes(spotlightDeal.id)
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-white text-slate-400 hover:text-rose-500'
                }`}
                title="Save to Wishlist"
              >
                <AppIcon name="favorite" className={`text-base ${wishlistIds.includes(spotlightDeal.id) ? 'fill-current' : ''}`} />
              </button>
              <img
                src={spotlightDeal.image}
                alt={spotlightDeal.title}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Spotlight Information */}
            <div className="flex flex-col gap-4 flex-1 text-left w-full">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-orange-100 text-orange-700 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg">
                  {spotlightDeal.category}
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  SKU: {spotlightDeal.code || spotlightDeal.id}
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200/60">
                  Ready Stock • Same-Day Dispatch
                </span>
              </div>

              <h2
                onClick={() => onSelectProduct(spotlightDeal)}
                className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 hover:text-orange-600 transition-colors cursor-pointer"
              >
                {spotlightDeal.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {spotlightDeal.description ||
                  'Professional jewellery presentation model engineered with heavy-duty core and luxury anti-fade velvet. Perfect for live showroom counters and catalog photography.'}
              </p>

              {/* Price Breakdown */}
              <div className="flex flex-wrap items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  ₹{spotlightDeal.price.toLocaleString('en-IN')}
                </span>
                {spotlightDeal.originalPrice && (
                  <span className="text-base sm:text-lg text-slate-400 line-through">
                    ₹{spotlightDeal.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Factory Wholesale Rate
                </span>
                {spotlightDeal.moq && (
                  <span className="text-xs text-slate-500 font-medium">
                    MOQ: {spotlightDeal.moq}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleAddDealToCart(spotlightDeal)}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <AppIcon name="add_shopping_cart" className="text-base" />
                  <span>Add Deal To Order</span>
                </button>

                <a
                  href={getWhatsAppLink(
                    `Hi Vinayak Packaging, I would like to order the Deal of the Day: ${spotlightDeal.title} (SKU: ${spotlightDeal.code || spotlightDeal.id}) at ₹${spotlightDeal.price}. Please share invoice details.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <AppIcon name="chat" className="text-base" />
                  <span>WhatsApp Instant Order</span>
                </a>

                <button
                  type="button"
                  onClick={() => onSelectProduct(spotlightDeal)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl transition-colors cursor-pointer"
                >
                  View Full Details
                </button>
              </div>

            </div>

          </div>
        </section>
      )}

      {/* 4. FILTER & SORT TOOLBAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 mr-2 shrink-0">Filter Deals:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown & Count */}
          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-800">{filteredDeals.length}</strong> active deals
            </span>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="discount">Highest Discount (%)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

        </div>
      </section>

      {/* 5. ALL DEALS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredDeals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3 border border-slate-200">
            <AppIcon name="sell" className="text-4xl text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No deals found for this category</h3>
            <p className="text-xs text-slate-500">
              Try switching category filter above to view deals across all display and packaging products.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-2 bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-orange-700 transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredDeals.map((product) => {
              const discountPercent = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 20;
              const inWishlist = wishlistIds.includes(product.id);
              const qty = quantities[product.id] || 1;

              return (
                <article
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group bg-white rounded-2xl p-3 sm:p-4 border border-slate-100 hover:border-orange-200 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Image Frame */}
                  <div className="relative aspect-square w-full rounded-xl bg-slate-50 overflow-hidden mb-3 p-2 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Discount Badge */}
                    <div className="absolute top-2 left-2 bg-rose-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                      {discountPercent}% OFF
                    </div>

                    {/* Wishlist Heart */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(product, e)}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-xs transition-colors cursor-pointer ${
                        inWishlist
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500'
                      }`}
                      title={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
                    >
                      <AppIcon name="favorite" className={`text-xs ${inWishlist ? 'text-rose-600 fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-[10px] text-orange-600 uppercase font-bold tracking-wider truncate">
                      {product.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                      {product.title}
                    </h3>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 mt-auto pt-2">
                      <span className="text-sm sm:text-base font-black text-slate-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Add Button */}
                  <div className="pt-3 border-t border-slate-100 mt-2 flex items-center gap-2">
                    <div
                      className="flex items-center border border-slate-200 rounded-lg overflow-hidden shrink-0 bg-slate-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleQtyChange(product.id, -1)}
                        className="w-6 h-7 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-black text-slate-900">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(product.id, 1)}
                        className="w-6 h-7 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleAddDealToCart(product, e)}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-1.5 px-2 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <AppIcon name="add_shopping_cart" className="text-xs" />
                      <span>Add</span>
                    </button>
                  </div>

                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. WHOLESALE CARTON DISCOUNTS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
              Bulk Carton Tier Pricing
            </span>
            <h3 className="text-xl sm:text-3xl font-black tracking-tight">
              Buying for Multiple Showrooms or Export?
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 max-w-xl leading-relaxed">
              Get an extra 5% to 15% discount on bulk cartons, custom logo laser-engraving, and safe sea/air cargo packaging directly from Sowcarpet depot.
            </p>
          </div>

          <a
            href={getWhatsAppLink('Hi Vinayak Packaging, I would like to inquire about bulk carton wholesale discounts and custom logo engraving.')}
            target="_blank"
            rel="noreferrer"
            className="bg-white text-orange-600 hover:bg-orange-50 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <AppIcon name="chat" className="text-base text-emerald-600" />
            <span>Chat With Wholesale Desk</span>
          </a>
        </div>
      </section>

    </div>
  );
};
