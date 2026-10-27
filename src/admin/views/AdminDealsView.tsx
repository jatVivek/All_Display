import { AppIcon } from '../../components/AppIcon';
import React, { useState, useMemo } from 'react';
import { Product } from '../../types';
import { storeManager } from '../../services/storeManager';
import { LoadingButton } from '../../components/LoadingStates';

interface AdminDealsViewProps {
  showToast: (msg: string) => void;
}

export const AdminDealsView: React.FC<AdminDealsViewProps> = ({ showToast }) => {
  const [dealProductIds, setDealProductIds] = useState(() => storeManager.getHomepageDealProductIds());
  const [products, setProducts] = useState(() => storeManager.getProducts());
  const [search, setSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => storeManager.subscribe((state) => {
    setProducts(state.products);
    setDealProductIds(state.homepageDealProductIds);
  }), []);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase().trim();
    return products.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleToggleDeal = (productId: string) => {
    setDealProductIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  const handleSelectAllFiltered = () => {
    const idsToAdd = filteredProducts.map((p) => p.id);
    setDealProductIds((current) => Array.from(new Set([...current, ...idsToAdd])));
  };

  const handleClearAllDeals = () => {
    setDealProductIds([]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const currentBanners = storeManager.getHomepageBanners();
      const success = await storeManager.saveHomepageBanners(currentBanners, dealProductIds);
      if (success) {
        showToast(`Deal of the Day updated (${dealProductIds.length} products featured).`);
      } else {
        showToast(storeManager.getState().catalogSyncError || 'Failed to save Deal of the Day configuration.');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save Deal of the Day.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AppIcon name="local_offer" className="text-orange-600 text-[24px]" />
            <h1 className="text-2xl font-bold text-slate-900">Deal of the Day Configuration</h1>
          </div>
          <p className="text-xs text-slate-500">
            Select products to feature on the storefront's dedicated Deals section and daily spotlight carousel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
            {dealProductIds.length} Selected Deals
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col gap-5">
          {/* Controls toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by title, SKU, category..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
              <AppIcon name="search" className="absolute left-3 top-2.5 text-slate-400 text-sm" />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-orange-400 text-xs font-semibold text-slate-700 hover:text-orange-600 transition-colors cursor-pointer"
              >
                Select Filtered
              </button>
              {dealProductIds.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllDeals}
                  className="px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-semibold text-red-600 transition-colors cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No products found matching &ldquo;{search}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProducts.map((product) => {
                const isSelected = dealProductIds.includes(product.id);
                return (
                  <label
                    key={product.id}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-orange-400 bg-orange-50/60 shadow-xs ring-1 ring-orange-200'
                        : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleDeal(product.id)}
                      className="h-4 w-4 accent-orange-600 cursor-pointer rounded"
                    />
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-14 w-14 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold text-slate-900">
                        {product.title}
                      </span>
                      <span className="block text-[11px] text-slate-500 font-mono mt-0.5">
                        SKU: {product.code}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-extrabold text-slate-900">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold truncate max-w-[100px]">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </section>

        <div className="pt-2 flex justify-end">
          <LoadingButton
            type="submit"
            loading={isSaving}
            loadingLabel="Saving Deal Configuration..."
            className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
          >
            Save Deal of the Day
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};