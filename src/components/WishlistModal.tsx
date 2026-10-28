import React from 'react';
import { AppIcon } from './AppIcon';
import { Product } from '../types';
import { storeManager } from '../services/storeManager';
import { useScrollLock } from '../hooks/useScrollLock';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onNavigateToProduct?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onNavigateToProduct,
  onSelectProduct,
}) => {
  useScrollLock(isOpen);
  const [wishlistIds, setWishlistIds] = React.useState<string[]>(() => storeManager.getWishlist());
  const [allProducts, setAllProducts] = React.useState<Product[]>(() => storeManager.getProducts());

  const navigateProduct = onSelectProduct || onNavigateToProduct || (() => {});

  // Update whenever modal opens or event fires
  React.useEffect(() => {
    if (isOpen) {
      setWishlistIds(storeManager.getWishlist());
      setAllProducts(storeManager.getProducts());
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleUpdate = () => {
      setWishlistIds(storeManager.getWishlist());
      setAllProducts(storeManager.getProducts());
    };
    window.addEventListener('vinayak_wishlist_updated', handleUpdate);
    window.addEventListener('alldisplay_catalog_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    const unsub = storeManager.subscribe((state) => {
      setWishlistIds(storeManager.getWishlist());
      setAllProducts(state.products);
    });
    return () => {
      window.removeEventListener('vinayak_wishlist_updated', handleUpdate);
      window.removeEventListener('alldisplay_catalog_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      unsub();
    };
  }, []);

  if (!isOpen) return null;

  const wishlistedProducts = allProducts.filter((p) =>
    wishlistIds.includes(p.id) || (p.code && wishlistIds.includes(p.code))
  );

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storeManager.toggleWishlist(id);
    setWishlistIds(storeManager.getWishlist());
  };

  const handleMoveToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleClearAll = () => {
    storeManager.clearWishlist();
    setWishlistIds([]);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200 touch-none overscroll-none"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <AppIcon name="heart" className="text-xl fill-rose-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">My Wishlist</h2>
              <p className="text-xs text-slate-500 font-medium">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'saved item' : 'saved items'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {wishlistedProducts.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-slate-500 hover:text-rose-600 font-semibold px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <AppIcon name="close" className="text-lg" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 divide-y divide-slate-100" data-scrollable="true">
          {wishlistedProducts.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <AppIcon name="heart" className="text-3xl" />
              </div>
              <h3 className="font-bold text-base text-slate-800">Your wishlist is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Explore our jewellery display stands, velvet trays, and packaging tools, then tap the heart icon to save your favorites!
              </p>
            </div>
          ) : (
            wishlistedProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  navigateProduct(product);
                  onClose();
                }}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 hover:bg-slate-50/80 p-2 rounded-2xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] uppercase font-bold text-orange-600 truncate">
                      {product.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                      {product.title}
                    </h4>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xs sm:text-sm font-black text-slate-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[11px] text-slate-400 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleMoveToCart(product, e)}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <AppIcon name="add_shopping_cart" className="text-xs" />
                    <span className="hidden sm:inline">Add to Cart</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleRemove(product.id, e)}
                    className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                    title="Remove from Wishlist"
                  >
                    <AppIcon name="delete" className="text-sm" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistedProducts.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">
              Tap any product to view full details &amp; options
            </span>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-900 hover:bg-black text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
