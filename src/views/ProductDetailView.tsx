import React, { useState, useEffect, useMemo } from 'react';
import { AppIcon } from '../components/AppIcon';
import { ActiveView, Product, CartItem, ProductVariation } from '../types';
import { getWhatsAppLink } from '../utils/whatsapp';
import { storeManager } from '../services/storeManager';
import { INITIAL_PRODUCTS } from '../data/catalog';

interface ProductDetailViewProps {
  product?: Product | null;
  onNavigate: (view: ActiveView, path?: string) => void;
  onAddToCart: (item: Omit<CartItem, 'id'>, qty: number) => void;
  onSelectProduct?: (product: Product) => void;
  onOpenCad?: () => void;
  onOpenReel?: () => void;
}

const REQUIREMENT_LABELS: Record<string, string> = {
  'online-sellers': 'Online Sellers',
  'instagram-shop': 'Instagram Shop',
  'new-jewellery': 'New Jewellery Sellers',
  'retail-shops': 'Retail Shops'
};

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product: initialProduct,
  onNavigate,
  onAddToCart,
  onSelectProduct,
  onOpenCad,
  onOpenReel
}) => {
  // Fallback to initial catalog product if store not yet hydrated
  const allProducts = storeManager.getProducts().length > 0 ? storeManager.getProducts() : INITIAL_PRODUCTS;
  const currentProduct: Product = useMemo(() => {
    if (initialProduct) return initialProduct;
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/products/')) {
      const rawSlug = window.location.pathname.replace(/^\/products\//, '').replace(/\/+$/, '');
      const slug = decodeURIComponent(rawSlug).toLowerCase().trim();
      const match = allProducts.find((p) => 
        (p.code && p.code.toLowerCase().trim() === slug) ||
        (p.id && p.id.toLowerCase().trim() === slug) ||
        (p.title && p.title.toLowerCase().trim() === slug)
      );
      if (match) return match;
    }
    return allProducts[0] || INITIAL_PRODUCTS[0];
  }, [initialProduct, allProducts]);

  const [settings, setSettings] = useState(() => storeManager.getSettings());

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setSettings(storeManager.getSettings());
    };
    window.addEventListener('vinayak_settings_updated', handleSettingsUpdate);
    window.addEventListener('alldisplay_data_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('vinayak_settings_updated', handleSettingsUpdate);
      window.removeEventListener('alldisplay_data_updated', handleSettingsUpdate);
    };
  }, []);

  const brandName = settings.brandName || settings.storeName || 'All Display';

  // Gallery image selection
  const gallery = useMemo(() => {
    const list: string[] = [];
    if (currentProduct.image) list.push(currentProduct.image);
    if (currentProduct.images && Array.isArray(currentProduct.images)) {
      currentProduct.images.forEach(img => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'];
  }, [currentProduct]);

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isVideoActive, setIsVideoActive] = useState(false);

  // Reset active image & video, and scroll smoothly to the top of the product description
  useEffect(() => {
    setActiveImgIndex(0);
    setIsVideoActive(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentProduct.id]);

  // Video renderer helper supporting YouTube, Vimeo, and HTML5 video
  const renderVideoPlayer = (url: string, autoPlay = false) => {
    if (!url) return null;
    const trimmed = url.trim();
    const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${ytMatch[1]}${autoPlay ? '?autoplay=1' : ''}`}
          title="Product Video"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
    if (vimeoMatch) {
      return (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoMatch[3]}${autoPlay ? '?autoplay=1' : ''}`}
          title="Product Video"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    return (
      <video
        src={trimmed}
        controls
        autoPlay={autoPlay}
        playsInline
        className="w-full h-full object-contain bg-black"
      />
    );
  };

  // Selected variations state: map of variation id -> selected option id
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (currentProduct.variations && currentProduct.variations.length > 0) {
      currentProduct.variations.forEach(v => {
        if (v.options && v.options.length > 0) {
          initial[v.id] = v.options[0].id;
        }
      });
    }
    return initial;
  });

  // Reset variations when product changes
  useEffect(() => {
    const next: Record<string, string> = {};
    if (currentProduct.variations && currentProduct.variations.length > 0) {
      currentProduct.variations.forEach(v => {
        if (v.options && v.options.length > 0) {
          next[v.id] = v.options[0].id;
        }
      });
    }
    setSelectedVariations(next);
  }, [currentProduct.id]);

  // Selected Finish (fallback if no variations)
  const [selectedFinish, setSelectedFinish] = useState<string>(() => {
    return currentProduct.finish || 'Standard';
  });

  useEffect(() => {
    setSelectedFinish(currentProduct.finish || 'Standard');
  }, [currentProduct.id]);

  // Quantity state (MOQ aware)
  const moqNumber = useMemo(() => {
    const match = currentProduct.moq?.match(/\d+/);
    return match ? Math.max(1, parseInt(match[0], 10)) : 1;
  }, [currentProduct.moq]);

  const [quantity, setQuantity] = useState<number>(moqNumber);

  useEffect(() => {
    setQuantity(moqNumber);
  }, [moqNumber, currentProduct.id]);

  // Wishlist state
  const [inWishlist, setInWishlist] = useState(() => storeManager.isInWishlist(currentProduct.id));

  useEffect(() => {
    setInWishlist(storeManager.isInWishlist(currentProduct.id));
    const handleWishlistChange = () => {
      setInWishlist(storeManager.isInWishlist(currentProduct.id));
    };
    window.addEventListener('vinayak_wishlist_updated', handleWishlistChange);
    return () => window.removeEventListener('vinayak_wishlist_updated', handleWishlistChange);
  }, [currentProduct.id]);

  const handleToggleWishlist = () => {
    const state = storeManager.toggleWishlist(currentProduct);
    setInWishlist(state);
  };

  // Calculate dynamic unit price based on selected variation options
  const unitPrice = useMemo(() => {
    let price = currentProduct.price;
    if (currentProduct.variations && currentProduct.variations.length > 0) {
      currentProduct.variations.forEach(v => {
        const selectedOptId = selectedVariations[v.id];
        const opt = v.options.find(o => o.id === selectedOptId);
        if (opt && typeof opt.price === 'number') {
          // If option specifies absolute price
          price = opt.price;
        }
      });
    }
    return price;
  }, [currentProduct, selectedVariations]);

  // Tier bulk discount
  const discountMultiplier = useMemo(() => {
    if (quantity >= 25) return 0.85; // 15% off
    if (quantity >= 10) return 0.90; // 10% off
    if (quantity >= 5) return 0.95;  // 5% off
    return 1.0;
  }, [quantity]);

  const effectiveUnitPrice = Math.round(unitPrice * discountMultiplier);
  const totalPrice = effectiveUnitPrice * quantity;

  // Selected variation human-readable summary
  const selectedVariationsSummary = useMemo(() => {
    const parts: string[] = [];
    if (currentProduct.variations && currentProduct.variations.length > 0) {
      currentProduct.variations.forEach(v => {
        const optId = selectedVariations[v.id];
        const opt = v.options.find(o => o.id === optId);
        if (opt) parts.push(`${v.name}: ${opt.name}`);
      });
    }
    return parts.join(', ');
  }, [currentProduct, selectedVariations]);

  // Add to Cart
  const handleAddToCart = () => {
    const variationRecord: Record<string, string> = {};
    if (currentProduct.variations) {
      currentProduct.variations.forEach(v => {
        const optId = selectedVariations[v.id];
        const opt = v.options.find(o => o.id === optId);
        if (opt) variationRecord[v.name] = opt.name;
      });
    }

    onAddToCart({
      productId: currentProduct.id,
      sku: currentProduct.code,
      title: currentProduct.title,
      image: gallery[activeImgIndex] || currentProduct.image,
      unitPrice: effectiveUnitPrice,
      quantity,
      moq: moqNumber,
      unitLabel: currentProduct.unit,
      finish: selectedVariationsSummary || currentProduct.finish || 'Standard',
      sizeOrSpec: selectedVariationsSummary || currentProduct.structuralProfile || 'Standard',
      gauge: currentProduct.specs?.gauge || 'Factory Standard',
      packingType: 'Standard Protective Packaging',
      selectedVariations: variationRecord
    }, quantity);
  };

  // WhatsApp Inquiry link
  const whatsappUrl = useMemo(() => {
    const msg = `Hi ${brandName}, I'm interested in wholesale inquiry for:
*${currentProduct.title}* (Code: ${currentProduct.code})
- Specs/Variations: ${selectedVariationsSummary || 'Standard'}
- Quantity: ${quantity} ${currentProduct.unit}
- Calculated Price: ₹${totalPrice.toLocaleString('en-IN')} (₹${effectiveUnitPrice}/unit)
Please confirm stock availability and freight to my location.`;
    return getWhatsAppLink(msg);
  }, [brandName, currentProduct, selectedVariationsSummary, quantity, totalPrice, effectiveUnitPrice]);

  // Related products from the same category or overall
  const relatedProducts = useMemo(() => {
    const currentCat = (currentProduct.category || '').toLowerCase();
    const sameCategory = allProducts.filter(p => p.id !== currentProduct.id && (p.category || '').toLowerCase() === currentCat);
    const others = allProducts.filter(p => p.id !== currentProduct.id && (p.category || '').toLowerCase() !== currentCat);
    return [...sameCategory, ...others].slice(0, 4);
  }, [allProducts, currentProduct]);

  return (
    <div className="w-full bg-white pb-20">
      {/* Top Breadcrumb */}
      <div className="w-full border-b border-slate-100 bg-slate-50/70 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-orange-600 transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate('shop')}
              className="hover:text-orange-600 transition-colors"
            >
              Catalog
            </button>
            <span>/</span>
            <span className="text-slate-400">{currentProduct.category}</span>
            <span>/</span>
            <span className="text-slate-800 font-medium truncate max-w-xs">{currentProduct.title}</span>
          </nav>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Multi-Angle Image Gallery (5 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Main Stage Image / Video */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-xs flex items-center justify-center group">
              {isVideoActive && currentProduct.videoUrl ? (
                <div className="w-full h-full relative flex items-center justify-center bg-black">
                  {renderVideoPlayer(currentProduct.videoUrl, true)}

                  {/* Return to Photos Button */}
                  <button
                    type="button"
                    onClick={() => setIsVideoActive(false)}
                    className="absolute top-4 right-4 z-30 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-xs font-semibold backdrop-blur-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-md border border-white/20"
                    title="Return to image view"
                  >
                    <AppIcon name="close" className="text-sm" />
                    <span>View Photos</span>
                  </button>

                  <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-black/75 text-white text-[11px] font-medium backdrop-blur-xs flex items-center gap-1.5 z-20">
                    <AppIcon name="videocam" className="text-orange-400 text-xs" />
                    <span>Product Video</span>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={gallery[activeImgIndex] || currentProduct.image}
                    alt={currentProduct.title}
                    className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badges on Main Image */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                    {currentProduct.badge && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white shadow-xs">
                        {currentProduct.badge}
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500 text-white shadow-2xs">
                      {currentProduct.stockStatus || 'In Stock'}
                    </span>
                  </div>

                  {/* Wishlist Button on Image */}
                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer z-10 ${
                      inWishlist
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white border border-slate-200'
                    }`}
                    title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <AppIcon
                      name="favorite"
                      className={`text-xl ${inWishlist ? 'text-rose-600 fill-current' : ''}`}
                    />
                  </button>

                  {/* Prominent Watch Video Button on Main Image */}
                  {currentProduct.videoUrl && (
                    <button
                      type="button"
                      onClick={() => setIsVideoActive(true)}
                      className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-orange-600 text-white text-xs font-bold shadow-lg backdrop-blur-sm transition-all cursor-pointer group/vid border border-white/20 hover:scale-105"
                    >
                      <span className="w-5 h-5 rounded-full bg-orange-500 group-hover/vid:bg-white text-white group-hover/vid:text-orange-600 flex items-center justify-center transition-colors">
                        <AppIcon name="play_arrow" className="text-xs translate-x-0.5" />
                      </span>
                      <span>Watch Product Video</span>
                    </button>
                  )}

                  {/* Image/Media index counter */}
                  {(gallery.length > 1 || Boolean(currentProduct.videoUrl)) && (
                    <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-black/60 text-white text-[11px] font-medium backdrop-blur-xs">
                      {activeImgIndex + 1} / {gallery.length + (currentProduct.videoUrl ? 1 : 0)}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Thumbnail Strip (Images + Video) */}
            {(gallery.length > 1 || Boolean(currentProduct.videoUrl)) && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveImgIndex(idx);
                      setIsVideoActive(false);
                    }}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-slate-50 ${
                      !isVideoActive && activeImgIndex === idx
                        ? 'border-orange-500 ring-2 ring-orange-200'
                        : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain p-1.5"
                    />
                  </button>
                ))}

                {/* Video Thumbnail (Positioned directly beside product images) */}
                {currentProduct.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setIsVideoActive(true)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-slate-900 group ${
                      isVideoActive
                        ? 'border-orange-500 ring-2 ring-orange-200 opacity-100'
                        : 'border-slate-200 hover:border-orange-400 opacity-85 hover:opacity-100'
                    }`}
                    title="Play Product Demonstration Video"
                  >
                    <img
                      src={gallery[0] || currentProduct.image}
                      alt="Product Video Preview"
                      className="w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-white pointer-events-none">
                      <div className="w-8 h-8 rounded-full bg-orange-600 group-hover:bg-orange-500 text-white flex items-center justify-center shadow-md transition-all group-hover:scale-110">
                        <AppIcon name="play_arrow" className="text-sm translate-x-0.5" />
                      </div>
                      <span className="text-[9px] font-black tracking-wider uppercase bg-black/70 px-1.5 py-0.5 rounded text-orange-300">
                        VIDEO
                      </span>
                    </div>
                  </button>
                )}
              </div>
            )}

            {/* Wholesale Trust Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center gap-1">
                <AppIcon name="local_shipping" className="text-orange-500 text-lg" />
                <span className="text-[11px] font-bold text-slate-800">Fast Dispatch</span>
                <span className="text-[10px] text-slate-500">{currentProduct.dispatchReadiness || 'Direct Depot Dispatch'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center gap-1">
                <AppIcon name="verified" className="text-emerald-500 text-lg" />
                <span className="text-[11px] font-bold text-slate-800">Factory Direct</span>
                <span className="text-[10px] text-slate-500">Unbeatable Wholesale Prices</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center gap-1">
                <AppIcon name="support_agent" className="text-blue-500 text-lg" />
                <span className="text-[11px] font-bold text-slate-800">B2B Support</span>
                <span className="text-[10px] text-slate-500">Sowcarpet Team Ready</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Information & Interactive Selectors (7 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200 uppercase tracking-wide">
                  {currentProduct.category}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  SKU: {currentProduct.code}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {currentProduct.title}
              </h1>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {currentProduct.description}
              </p>
            </div>

            {/* Requirements Tags (Shop by Requirement links) */}
            {currentProduct.requirements && currentProduct.requirements.length > 0 && (
              <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-orange-50/50 border border-orange-100">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <AppIcon name="sell" className="text-orange-500 text-sm" />
                  Recommended For Requirement:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentProduct.requirements.map(reqKey => (
                    <button
                      key={reqKey}
                      type="button"
                      onClick={() => onNavigate('shop', `/shop?requirement=${reqKey}`)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-orange-200 text-orange-700 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <span>{REQUIREMENT_LABELS[reqKey] || reqKey}</span>
                      <AppIcon name="arrow_forward" className="text-[10px]" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">
                  ₹{effectiveUnitPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / {currentProduct.unit} (excl. freight)
                </span>
                {currentProduct.originalPrice && currentProduct.originalPrice > effectiveUnitPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{currentProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discountMultiplier < 1 && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                    {Math.round((1 - discountMultiplier) * 100)}% Bulk Slab Applied
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>Minimum Order Quantity (MOQ): <strong className="text-slate-800 font-semibold">{currentProduct.moq}</strong></span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">GST Input Credit Available</span>
              </div>

              {/* Bulk discount tier badges */}
              <div className="mt-2 pt-2 border-t border-slate-200/60 grid grid-cols-3 gap-2 text-center text-xs">
                <div className={`p-2 rounded-lg border ${quantity < 5 ? 'bg-orange-50 border-orange-300 font-bold text-orange-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                  <div className="font-semibold">1 - 4 {currentProduct.unit}s</div>
                  <div className="text-[11px]">Standard Wholesale</div>
                </div>
                <div className={`p-2 rounded-lg border ${quantity >= 5 && quantity < 10 ? 'bg-orange-50 border-orange-300 font-bold text-orange-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                  <div className="font-semibold">5 - 9 {currentProduct.unit}s</div>
                  <div className="text-[11px] text-emerald-600 font-bold">5% OFF</div>
                </div>
                <div className={`p-2 rounded-lg border ${quantity >= 10 ? 'bg-orange-50 border-orange-300 font-bold text-orange-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                  <div className="font-semibold">10+ {currentProduct.unit}s</div>
                  <div className="text-[11px] text-emerald-600 font-bold">10-15% OFF</div>
                </div>
              </div>
            </div>

            {/* DYNAMIC VARIATIONS SELECTOR */}
            {currentProduct.variations && currentProduct.variations.length > 0 ? (
              <div className="flex flex-col gap-4">
                {currentProduct.variations.map((variation: ProductVariation) => {
                  const currentOptId = selectedVariations[variation.id];
                  return (
                    <div key={variation.id} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                          {variation.name}
                        </label>
                        <span className="text-xs font-medium text-orange-600">
                          {variation.options.find(o => o.id === currentOptId)?.name}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {variation.options.map(option => {
                          const isSelected = currentOptId === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => {
                                setSelectedVariations(prev => ({
                                  ...prev,
                                  [variation.id]: option.id
                                }));
                              }}
                              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                                isSelected
                                  ? 'bg-orange-50 border-orange-600 text-orange-900 shadow-2xs ring-1 ring-orange-500'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <span>{option.name}</span>
                              {option.price && (
                                <span className="text-[11px] text-slate-500">
                                  (₹{option.price.toLocaleString('en-IN')})
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* Quantity Stepper & Add to Order List */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {/* Stepper */}
              <div className="flex items-center justify-between border border-slate-200 rounded-xl bg-white px-2 py-1.5 sm:w-36">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(moqNumber, prev - 1))}
                  disabled={quantity <= moqNumber}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <AppIcon name="remove" className="text-base" />
                </button>
                <span className="font-bold text-sm text-slate-900 min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <AppIcon name="add" className="text-base" />
                </button>
              </div>

              {/* Add to Order List Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <AppIcon name="shopping_cart" className="text-base" />
                <span>Add to Order List (₹{totalPrice.toLocaleString('en-IN')})</span>
              </button>
            </div>

            {/* WhatsApp Wholesale Inquiry Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <AppIcon name="chat" className="text-base" />
              <span>Inquire &amp; Order on WhatsApp</span>
            </a>

            {/* Technical Specifications Sheet */}
            <div className="mt-4 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Product Specifications
              </h3>
              <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
                {currentProduct.material && (
                  <div className="grid grid-cols-3 p-3 bg-slate-50/50">
                    <span className="text-slate-500 font-medium">Material</span>
                    <span className="col-span-2 text-slate-900 font-semibold">{currentProduct.material}</span>
                  </div>
                )}
                {currentProduct.structuralProfile && (
                  <div className="grid grid-cols-3 p-3 bg-white">
                    <span className="text-slate-500 font-medium">Profile / Finish</span>
                    <span className="col-span-2 text-slate-900">{currentProduct.structuralProfile}</span>
                  </div>
                )}
                {currentProduct.specs?.dimensions && (
                  <div className="grid grid-cols-3 p-3 bg-slate-50/50">
                    <span className="text-slate-500 font-medium">Dimensions</span>
                    <span className="col-span-2 text-slate-900">{currentProduct.specs.dimensions}</span>
                  </div>
                )}
                {currentProduct.specs?.weight && (
                  <div className="grid grid-cols-3 p-3 bg-white">
                    <span className="text-slate-500 font-medium">Weight</span>
                    <span className="col-span-2 text-slate-900">{currentProduct.specs.weight}</span>
                  </div>
                )}
                <div className="grid grid-cols-3 p-3 bg-slate-50/50">
                  <span className="text-slate-500 font-medium">Dispatch Readiness</span>
                  <span className="col-span-2 text-slate-900 font-semibold text-emerald-700">
                    {currentProduct.dispatchReadiness || 'Ready Stock - Sowcarpet Depot'}
                  </span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-white">
                  <span className="text-slate-500 font-medium">Minimum Order</span>
                  <span className="col-span-2 text-slate-900">{currentProduct.moq}</span>
                </div>
              </div>
            </div>

            {/* Issue #13: Product Demonstration Video */}
            {currentProduct.videoUrl && (
              <div className="mt-4 pt-6 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AppIcon name="videocam" className="text-orange-500 text-lg" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Product Demonstration Video
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsVideoActive(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200"
                  >
                    <AppIcon name="play_arrow" className="text-sm" />
                    <span>Watch on Main Stage</span>
                  </button>
                </div>
                <div className="w-full rounded-2xl overflow-hidden bg-black shadow-md aspect-video border border-slate-200">
                  {renderVideoPlayer(currentProduct.videoUrl, false)}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Related Jewellery Packaging &amp; Displays
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Frequently ordered together by boutique jewelers &amp; online sellers
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('shop')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Catalog</span>
                <AppIcon name="arrow_forward" className="text-xs" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(rel => {
                const relInWishlist = storeManager.isInWishlist(rel.id);
                return (
                  <div
                    key={rel.id}
                    onClick={() => {
                      if (onSelectProduct) onSelectProduct(rel);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white rounded-2xl border border-slate-100 hover:border-orange-300 p-3 sm:p-4 shadow-2xs hover:shadow-md transition-all flex flex-col group cursor-pointer"
                  >
                    <div className="relative aspect-square w-full rounded-xl bg-slate-50 overflow-hidden mb-3">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          storeManager.toggleWishlist(rel);
                        }}
                        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer z-10 ${
                          relInWishlist
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-white/80 text-slate-400 hover:text-rose-500'
                        }`}
                        title="Wishlist"
                      >
                        <AppIcon name="favorite" className={`text-base ${relInWishlist ? 'text-rose-600 fill-current' : ''}`} />
                      </button>
                    </div>

                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">
                      {rel.category}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-orange-600 line-clamp-2 transition-colors mb-2">
                      {rel.title}
                    </h4>

                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900">
                        ₹{rel.price.toLocaleString('en-IN')}
                      </span>
                      <span className="px-2.5 py-1.5 rounded-lg bg-orange-50 group-hover:bg-orange-600 text-orange-700 group-hover:text-white transition-all text-xs font-semibold">
                        View Details
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
