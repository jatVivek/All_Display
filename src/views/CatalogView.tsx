import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AppIcon } from '../components/AppIcon';
import { ActiveView, Product } from '../types';
import { storeManager } from '../services/storeManager';
import { getWhatsAppLink } from '../utils/whatsapp';

interface CatalogViewProps {
  setActiveView: (view: ActiveView, path?: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct?: (product: Product) => void;
  onToast: (msg: string) => void;
  cartCount: number;
  cartSubtotal: number;
  initialCategoryName?: string;
  initialSubCategoryName?: string;
  initialChildCategoryName?: string;
  initialProductId?: string | null;
  showAllProducts?: boolean;
}

const MATERIAL_OPTIONS = [
  'Velvet',
  'Solid Wood',
  'Paper / Board',
  'Acrylic',
  'Leatherette',
  'Ceramic / Metal'
];

export const CatalogView: React.FC<CatalogViewProps> = ({
  setActiveView,
  onAddToCart,
  onSelectProduct,
  onToast,
  initialCategoryName = 'All Categories',
  initialSubCategoryName = '',
  initialChildCategoryName = '',
}) => {
  const [products, setProducts] = useState<Product[]>(() => storeManager.getProducts());
  const [categories, setCategories] = useState(() => storeManager.getCategories());
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => storeManager.getWishlist());
  const [settings, setSettings] = useState(() => storeManager.getSettings());

  // Listen to catalog & wishlist updates
  useEffect(() => {
    const handleUpdate = () => {
      setProducts(storeManager.getProducts());
      setCategories(storeManager.getCategories());
      setWishlistIds(storeManager.getWishlist());
      setSettings(storeManager.getSettings());
    };
    window.addEventListener('alldisplay_catalog_updated', handleUpdate);
    window.addEventListener('alldisplay_data_updated', handleUpdate);
    window.addEventListener('vinayak_wishlist_updated', handleUpdate);
    window.addEventListener('vinayak_settings_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    const unsubscribe = storeManager.subscribe((state) => {
      setProducts(state.products);
      setCategories(state.categories);
      setWishlistIds(storeManager.getWishlist());
      setSettings(state.settings);
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

  // Filter States: Level 1 (Category), Level 2 (SubCategory), Level 3 (ChildCategory)
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryName);
  const [selectedSubCategory, setSelectedSubCategory] = useState(initialSubCategoryName);
  const [selectedChildCategory, setSelectedChildCategory] = useState(initialChildCategoryName);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedSubCategories, setExpandedSubCategories] = useState<Record<string, boolean>>({});

  const [categorySearch, setCategorySearch] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(15000);
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in_stock' | 'on_sale'>('all');
  const [sortBy, setSortBy] = useState('default');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);
  const [gridColumns, setGridColumns] = useState<4 | 3 | 1>(4);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Sync category & hierarchy filters when initial props change
  useEffect(() => {
    if (initialCategoryName) {
      setSelectedCategory(initialCategoryName);
      const catObj = categories.find(c => c.name.toLowerCase() === initialCategoryName.toLowerCase());
      if (catObj) {
        setExpandedCategories(prev => ({ ...prev, [catObj.id]: true }));
      }
    }
    if (initialSubCategoryName !== undefined) {
      setSelectedSubCategory(initialSubCategoryName);
      const subObj = categories.find(c => c.name.toLowerCase() === initialSubCategoryName.toLowerCase());
      if (subObj) {
        setExpandedSubCategories(prev => ({ ...prev, [subObj.id]: true }));
      }
    }
    if (initialChildCategoryName !== undefined) {
      setSelectedChildCategory(initialChildCategoryName);
    }
  }, [initialCategoryName, initialSubCategoryName, initialChildCategoryName, categories]);

  // Update hierarchy selection & URL query params cleanly
  const updateHierarchySelection = (catName: string, subCatName = '', childCatName = '') => {
    setSelectedCategory(catName);
    setSelectedSubCategory(subCatName);
    setSelectedChildCategory(childCatName);

    const params = new URLSearchParams();
    if (catName && catName !== 'All Categories' && catName !== 'All') {
      params.set('category', catName);
    }
    if (subCatName) {
      params.set('subCategory', subCatName);
    }
    if (childCatName) {
      params.set('childCategory', childCatName);
    }
    const q = params.toString();
    const newPath = q ? `/shop?${q}` : '/shop';
    window.history.pushState({ scrollY: window.scrollY }, '', newPath);

    // Auto expand selected branches
    if (catName && catName !== 'All Categories') {
      const catObj = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
      if (catObj) {
        setExpandedCategories(prev => ({ ...prev, [catObj.id]: true }));
      }
    }
    if (subCatName) {
      const subObj = categories.find(c => c.name.toLowerCase() === subCatName.toLowerCase());
      if (subObj) {
        setExpandedSubCategories(prev => ({ ...prev, [subObj.id]: true }));
      }
    }
  };

  const toggleCategoryExpand = (catId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const toggleSubCategoryExpand = (subCatId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedSubCategories(prev => ({ ...prev, [subCatId]: !prev[subCatId] }));
  };

  // Build 3-level interactive hierarchy tree with live product counts
  const hierarchyTree = useMemo(() => {
    const roots = categories.filter(c => (!c.level || c.level === 1) && (!c.parentId || c.parentId === null));

    return roots.map(root => {
      // Subcategories under this root (level === 2 && parentId === root.id)
      const subs = categories.filter(c => c.level === 2 && c.parentId === root.id);

      // Total count of products under this root
      const rootProductCount = products.filter(p => {
        const catMatch = p.category && p.category.toLowerCase() === root.name.toLowerCase();
        const subMatch = subs.some(s => p.subCategory && p.subCategory.toLowerCase() === s.name.toLowerCase());
        return catMatch || subMatch;
      }).length;

      const subTrees = subs.map(sub => {
        // Child categories under this sub (level === 3 && parentId === sub.id)
        const children = categories.filter(c => c.level === 3 && c.parentId === sub.id);

        const subProductCount = products.filter(p => {
          return p.subCategory && p.subCategory.toLowerCase() === sub.name.toLowerCase();
        }).length;

        const childTrees = children.map(child => {
          const childProductCount = products.filter(p => {
            return p.childCategory && p.childCategory.toLowerCase() === child.name.toLowerCase();
          }).length;

          return {
            ...child,
            productCount: childProductCount
          };
        });

        return {
          ...sub,
          productCount: subProductCount,
          children: childTrees
        };
      });

      return {
        ...root,
        productCount: rootProductCount,
        subCategories: subTrees
      };
    }).filter(root => {
      if (!categorySearch.trim()) return true;
      const search = categorySearch.toLowerCase().trim();
      const matchRoot = root.name.toLowerCase().includes(search);
      const matchSub = root.subCategories.some(s =>
        s.name.toLowerCase().includes(search) ||
        s.children.some(c => c.name.toLowerCase().includes(search))
      );
      return matchRoot || matchSub;
    });
  }, [categories, products, categorySearch]);

  // Current category data for horizontal chip strips
  const currentCategoryData = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'All Categories' || selectedCategory === 'All') return null;
    return hierarchyTree.find(r => r.name.toLowerCase() === selectedCategory.toLowerCase()) || null;
  }, [hierarchyTree, selectedCategory]);

  const currentSubCategoriesList = useMemo(() => {
    if (!currentCategoryData) return [];
    return currentCategoryData.subCategories;
  }, [currentCategoryData]);

  const currentChildCategoriesList = useMemo(() => {
    if (!selectedSubCategory || !currentCategoryData) return [];
    const subObj = currentCategoryData.subCategories.find(s => s.name.toLowerCase() === selectedSubCategory.toLowerCase());
    return subObj ? subObj.children : [];
  }, [currentCategoryData, selectedSubCategory]);

  const handleQtyChange = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const updated = Math.max(1, current + delta);
      return { ...prev, [productId]: updated };
    });
  };

  const toggleMaterial = (mat: string) => {
    setSelectedMaterials(prev =>
      prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
    );
  };

  // Filter application: Category (Root), Sub-Category (Level 2), Child-Category (Level 3), Material, Price, Stock
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // 1. Root Category filter
      if (selectedCategory !== 'All Categories' && selectedCategory !== 'All') {
        const selCat = selectedCategory.toLowerCase();
        const matchesCategory =
          (prod.category && (prod.category.toLowerCase() === selCat || prod.category.toLowerCase().includes(selCat))) ||
          (prod.subCategory && (prod.subCategory.toLowerCase() === selCat || prod.subCategory.toLowerCase().includes(selCat)));
        if (!matchesCategory) return false;
      }

      // 2. Sub-Category filter
      if (selectedSubCategory) {
        const selSub = selectedSubCategory.toLowerCase();
        const matchesSub = prod.subCategory && (prod.subCategory.toLowerCase() === selSub || prod.subCategory.toLowerCase().includes(selSub));
        if (!matchesSub) return false;
      }

      // 3. Child-Category filter
      if (selectedChildCategory) {
        const selChild = selectedChildCategory.toLowerCase();
        const matchesChild = prod.childCategory && (prod.childCategory.toLowerCase() === selChild || prod.childCategory.toLowerCase().includes(selChild));
        if (!matchesChild) return false;
      }

      // 4. Material filter (support multiple)
      if (selectedMaterials.length > 0) {
        const prodMat = prod.material || '';
        const matchesMat = selectedMaterials.some(m =>
          prodMat.toLowerCase().includes(m.toLowerCase())
        );
        if (!matchesMat) return false;
      }

      // 5. Price filter
      if (prod.price > priceRange) {
        return false;
      }

      // 6. Status filter
      if (stockStatusFilter === 'on_sale' && (!prod.originalPrice || prod.originalPrice <= prod.price)) {
        return false;
      }
      if (stockStatusFilter === 'in_stock' && prod.stockStatus && !prod.stockStatus.toLowerCase().includes('in stock')) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.id.startsWith('prod-') ? Number(a.id.replace('prod-', '')) || 0 : 0);
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.id.startsWith('prod-') ? Number(b.id.replace('prod-', '')) || 0 : 0);
        return timeB - timeA;
      }
      // 'default': Newly added stuffs visible first, preserving configured order
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.id.startsWith('prod-') ? Number(a.id.replace('prod-', '')) || 0 : 0);
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.id.startsWith('prod-') ? Number(b.id.replace('prod-', '')) || 0 : 0);
      if (timeA > 0 || timeB > 0) {
        if (timeA !== timeB) return timeB - timeA;
      }
      const orderA = typeof a.sortOrder === 'number' ? a.sortOrder : 999999;
      const orderB = typeof b.sortOrder === 'number' ? b.sortOrder : 999999;
      return orderB - orderA;
    });
  }, [products, selectedCategory, selectedSubCategory, selectedChildCategory, selectedMaterials, priceRange, stockStatusFilter, sortBy]);

  const displayedProducts = filteredProducts.slice(0, itemsPerPage);

  // Automatic infinite scrolling in chunks of 10 with animated loader
  useEffect(() => {
    if (filteredProducts.length <= itemsPerPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setItemsPerPage((prev) => prev + 10);
            setIsLoadingMore(false);
          }, 350);
        }
      },
      { threshold: 0.1 }
    );

    const target = loadMoreSentinelRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [filteredProducts.length, itemsPerPage, isLoadingMore]);

  const resetAllFilters = () => {
    updateHierarchySelection('All Categories', '', '');
    setSelectedMaterials([]);
    setPriceRange(15000);
    setStockStatusFilter('all');
    setSortBy('default');
  };

  return (
    <div className="w-full bg-white text-slate-900 pb-20 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">

        {/* 1. BREADCRUMBS & HEADING */}
        <div className="flex flex-col gap-2">
          <nav className="flex items-center gap-1.5 text-xs text-slate-600 flex-wrap">
            <button
              onClick={() => setActiveView('home')}
              className="hover:text-orange-600 transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => updateHierarchySelection('All Categories', '', '')}
              className={`hover:text-orange-600 transition-colors cursor-pointer ${
                selectedCategory === 'All Categories' ? 'text-slate-900 font-bold' : ''
              }`}
            >
              Shop Catalog
            </button>
            {selectedCategory !== 'All Categories' && selectedCategory !== 'All' && (
              <>
                <span>/</span>
                <button
                  onClick={() => updateHierarchySelection(selectedCategory, '', '')}
                  className={`hover:text-orange-600 transition-colors cursor-pointer ${
                    !selectedSubCategory ? 'text-orange-600 font-bold' : 'text-slate-700'
                  }`}
                >
                  {selectedCategory}
                </button>
              </>
            )}
            {selectedSubCategory && (
              <>
                <span>/</span>
                <button
                  onClick={() => updateHierarchySelection(selectedCategory, selectedSubCategory, '')}
                  className={`hover:text-orange-600 transition-colors cursor-pointer ${
                    !selectedChildCategory ? 'text-orange-600 font-bold' : 'text-slate-700'
                  }`}
                >
                  {selectedSubCategory}
                </button>
              </>
            )}
            {selectedChildCategory && (
              <>
                <span>/</span>
                <span className="text-orange-600 font-bold">{selectedChildCategory}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Jewellery Displays &amp; Packaging Catalog
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Wholesale prices directly from Feel Khana, Hyderabad depot. GST invoices provided.
              </p>
            </div>

            {/* Active Filters tags preview */}
            {(selectedMaterials.length > 0 || (selectedCategory !== 'All Categories' && selectedCategory !== 'All') || selectedSubCategory || selectedChildCategory) && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="w-fit text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <AppIcon name="clear_all" className="text-sm" />
                <span>Clear All Active Filters</span>
              </button>
            )}
          </div>

          {/* Active Hierarchy & Material Filter Badges */}
          {(selectedMaterials.length > 0 || (selectedCategory !== 'All Categories' && selectedCategory !== 'All') || selectedSubCategory || selectedChildCategory) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {selectedCategory !== 'All Categories' && selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs">
                  <span>Category: <strong>{selectedCategory}</strong></span>
                  <button
                    type="button"
                    onClick={() => updateHierarchySelection('All Categories', '', '')}
                    className="hover:text-red-600 cursor-pointer text-sm font-bold ml-0.5"
                    title="Remove Category filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedSubCategory && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                  <span>Sub-Category: <strong>{selectedSubCategory}</strong></span>
                  <button
                    type="button"
                    onClick={() => updateHierarchySelection(selectedCategory, '', '')}
                    className="hover:text-red-600 cursor-pointer text-sm font-bold ml-0.5"
                    title="Remove Sub-Category filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedChildCategory && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-900 border border-yellow-300 shadow-2xs">
                  <span>Child-Category: <strong>{selectedChildCategory}</strong></span>
                  <button
                    type="button"
                    onClick={() => updateHierarchySelection(selectedCategory, selectedSubCategory, '')}
                    className="hover:text-red-600 cursor-pointer text-sm font-bold ml-0.5"
                    title="Remove Child-Category filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedMaterials.map(mat => (
                <span key={mat} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  <span>{mat}</span>
                  <button
                    type="button"
                    onClick={() => toggleMaterial(mat)}
                    className="hover:text-red-600 cursor-pointer text-sm font-bold ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2. PROMOTIONAL BANNER */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-50 via-rose-50 to-amber-50 border border-orange-100 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
            <span className="w-fit self-center md:self-start bg-white/90 border border-orange-200 text-orange-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
              Direct Manufacturer Dispatch
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Pan-India &amp; Global Wholesale Dispatch
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Order boutique displays, velvet busts, multi-slot trays, and branded packaging cards in bulk. Dispatch within 24-48 hours from Hyderabad.
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href={getWhatsAppLink(`Hi ${brandName}, I would like to inquire about wholesale rates and dispatch.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-xs transition-colors"
              >
                <span>WhatsApp Wholesale Inquiries</span>
                <AppIcon name="arrow_forward" className="text-sm" />
              </a>
            </div>
          </div>

          <div className="w-full md:w-80 h-36 sm:h-44 rounded-2xl overflow-hidden bg-white shadow-xs border border-white/60 shrink-0">
            <img
              src="/assets/vinayak/shop_banner.png"
              alt="Global shipping promotion"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if banner image is missing
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80';
              }}
            />
          </div>
        </div>

        {/* 3. MAIN SHOP LAYOUT: SIDEBAR (Left) & PRODUCTS GRID (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT FILTER SIDEBAR */}
          <aside className="lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col gap-6">
            
            {/* Filter by Categories with Search & 3-Level Hierarchy Accordion */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  Category Hierarchy
                </h3>
                {(selectedCategory !== 'All Categories' || selectedSubCategory || selectedChildCategory) && (
                  <button
                    onClick={() => updateHierarchySelection('All Categories', '', '')}
                    className="text-[11px] text-orange-600 font-bold hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Search Category Input */}
              <div className="relative">
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Find category or sub-category..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500"
                />
                <AppIcon name="search" className="absolute left-2.5 top-2 text-slate-400 text-sm" />
              </div>

              {/* Category Hierarchy Accordion Tree */}
              <div className="flex flex-col gap-1 max-h-80 overflow-y-auto pr-1">
                {/* All Categories Option */}
                <div
                  onClick={() => updateHierarchySelection('All Categories', '', '')}
                  className={`flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer text-xs transition-colors ${
                    selectedCategory === 'All Categories' ? 'bg-orange-50 font-bold text-orange-600' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <AppIcon name="category" className="text-sm text-slate-400" />
                    <span>All Categories</span>
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                    {products.length}
                  </span>
                </div>

                {/* Root Categories */}
                {hierarchyTree.map((root) => {
                  const isRootSelected = selectedCategory.toLowerCase() === root.name.toLowerCase() && !selectedSubCategory && !selectedChildCategory;
                  const isRootActive = selectedCategory.toLowerCase() === root.name.toLowerCase();
                  const isExpanded = Boolean(expandedCategories[root.id] || isRootActive);
                  const hasSubs = root.subCategories && root.subCategories.length > 0;

                  return (
                    <div key={root.id} className="flex flex-col">
                      {/* Root Category Row */}
                      <div
                        onClick={() => {
                          updateHierarchySelection(root.name, '', '');
                          if (hasSubs && !expandedCategories[root.id]) {
                            toggleCategoryExpand(root.id);
                          }
                        }}
                        className={`group flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer text-xs transition-colors ${
                          isRootSelected
                            ? 'bg-orange-50 font-bold text-orange-600'
                            : isRootActive
                            ? 'bg-slate-50 font-semibold text-orange-700'
                            : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate pr-1">
                          {hasSubs ? (
                            <button
                              type="button"
                              onClick={(e) => toggleCategoryExpand(root.id, e)}
                              className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-orange-600 cursor-pointer"
                              title={isExpanded ? 'Collapse' : 'Expand'}
                            >
                              <AppIcon
                                name={isExpanded ? 'expand_more' : 'chevron_right'}
                                className="text-xs transition-transform"
                              />
                            </button>
                          ) : (
                            <span className="w-4" />
                          )}
                          <span className="truncate">{root.name}</span>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold shrink-0">
                          {root.productCount}
                        </span>
                      </div>

                      {/* Level 2 Sub-Categories (Collapsible) */}
                      {hasSubs && isExpanded && (
                        <div className="flex flex-col pl-4 py-0.5 border-l-2 border-orange-100 ml-3 gap-0.5">
                          {root.subCategories.map((sub) => {
                            const isSubSelected =
                              selectedCategory.toLowerCase() === root.name.toLowerCase() &&
                              selectedSubCategory.toLowerCase() === sub.name.toLowerCase() &&
                              !selectedChildCategory;
                            const isSubActive =
                              selectedCategory.toLowerCase() === root.name.toLowerCase() &&
                              selectedSubCategory.toLowerCase() === sub.name.toLowerCase();
                            const isSubExpanded = Boolean(expandedSubCategories[sub.id] || isSubActive);
                            const hasChildren = sub.children && sub.children.length > 0;

                            return (
                              <div key={sub.id} className="flex flex-col">
                                <div
                                  onClick={() => {
                                    updateHierarchySelection(root.name, sub.name, '');
                                    if (hasChildren && !expandedSubCategories[sub.id]) {
                                      toggleSubCategoryExpand(sub.id);
                                    }
                                  }}
                                  className={`flex items-center justify-between py-1 px-2 rounded-md cursor-pointer text-[11px] transition-colors ${
                                    isSubSelected
                                      ? 'bg-orange-100/70 font-bold text-orange-700'
                                      : isSubActive
                                      ? 'bg-slate-100 font-semibold text-orange-700'
                                      : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                                  }`}
                                >
                                  <div className="flex items-center gap-1 truncate pr-1">
                                    {hasChildren ? (
                                      <button
                                        type="button"
                                        onClick={(e) => toggleSubCategoryExpand(sub.id, e)}
                                        className="w-3.5 h-3.5 flex items-center justify-center text-slate-400 hover:text-orange-600 cursor-pointer"
                                        title={isSubExpanded ? 'Collapse' : 'Expand'}
                                      >
                                        <AppIcon
                                          name={isSubExpanded ? 'expand_more' : 'chevron_right'}
                                          className="text-[10px]"
                                        />
                                      </button>
                                    ) : (
                                      <span className="w-2.5 h-0.5 bg-slate-300 rounded-full shrink-0" />
                                    )}
                                    <span className="truncate">{sub.name}</span>
                                  </div>
                                  <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded-full font-medium shrink-0">
                                    {sub.productCount}
                                  </span>
                                </div>

                                {/* Level 3 Child-Categories (Collapsible) */}
                                {hasChildren && isSubExpanded && (
                                  <div className="flex flex-col pl-3 py-0.5 border-l-2 border-amber-200 ml-2.5 gap-0.5">
                                    {sub.children.map((child) => {
                                      const isChildSelected =
                                        selectedCategory.toLowerCase() === root.name.toLowerCase() &&
                                        selectedSubCategory.toLowerCase() === sub.name.toLowerCase() &&
                                        selectedChildCategory.toLowerCase() === child.name.toLowerCase();

                                      return (
                                        <div
                                          key={child.id}
                                          onClick={() => updateHierarchySelection(root.name, sub.name, child.name)}
                                          className={`flex items-center justify-between py-0.5 px-2 rounded cursor-pointer text-[10px] transition-colors ${
                                            isChildSelected
                                              ? 'bg-amber-100 font-bold text-amber-900'
                                              : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800'
                                          }`}
                                        >
                                          <div className="flex items-center gap-1.5 truncate pr-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                            <span className="truncate">{child.name}</span>
                                          </div>
                                          <span className="text-[9px] bg-white border border-slate-200 text-slate-500 px-1 rounded-full font-medium shrink-0">
                                            {child.productCount}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filter by Material (Multi-select) */}
            <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  Material / Finish
                </h3>
                {selectedMaterials.length > 0 && (
                  <button
                    onClick={() => setSelectedMaterials([])}
                    className="text-[11px] text-orange-600 font-bold hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {MATERIAL_OPTIONS.map((mat) => {
                  const isChecked = selectedMaterials.includes(mat);
                  return (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => toggleMaterial(mat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter by Price Slider */}
            <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Filter by Max Price
              </h3>
              
              <input
                type="range"
                min={100}
                max={15000}
                step={100}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-orange-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  Max: <strong className="text-slate-900">₹{priceRange.toLocaleString('en-IN')}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setPriceRange(15000)}
                  className="text-[10px] font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  Reset Price
                </button>
              </div>
            </div>

            {/* Product Status */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Stock &amp; Offer Status
              </h3>
              
              <div className="flex flex-col gap-1.5 text-xs text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
                  <input
                    type="radio"
                    name="status-filter"
                    checked={stockStatusFilter === 'all'}
                    onChange={() => setStockStatusFilter('all')}
                    className="accent-orange-600"
                  />
                  <span>All Products</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
                  <input
                    type="radio"
                    name="status-filter"
                    checked={stockStatusFilter === 'in_stock'}
                    onChange={() => setStockStatusFilter('in_stock')}
                    className="accent-orange-600"
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
                  <input
                    type="radio"
                    name="status-filter"
                    checked={stockStatusFilter === 'on_sale'}
                    onChange={() => setStockStatusFilter('on_sale')}
                    className="accent-orange-600"
                  />
                  <span>On Sale / Special Discount</span>
                </label>
              </div>
            </div>

            {/* Wholesale Assistance Box */}
            <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-100 flex flex-col gap-2 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                Depot Assistance
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                Need customized branding, laser engraving, or bulk export cartons?
              </p>
              <a
                href={getWhatsAppLink(`Hi ${brandName}, I need custom branding and wholesale export assistance.`)}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 mt-1"
              >
                <span>Chat with Feel Khana Depot</span>
                <AppIcon name="arrow_forward" className="text-xs" />
              </a>
            </div>

          </aside>

          {/* RIGHT PRODUCTS LISTING & CONTROLS */}
          <main className="lg:col-span-9 flex flex-col gap-6">

            {/* Horizontal Sub-Category & Child-Category Navigation Bar */}
            {currentSubCategoriesList.length > 0 && (
              <div className="bg-gradient-to-r from-orange-50/60 via-amber-50/40 to-slate-50 border border-orange-100 rounded-2xl p-3.5 sm:p-4.5 flex flex-col gap-3 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Explore {selectedCategory} Sub-Categories
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {currentSubCategoriesList.length} Sub-Categories available
                  </span>
                </div>

                {/* Sub-Category Horizontal Scrollable Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <button
                    type="button"
                    onClick={() => updateHierarchySelection(selectedCategory, '', '')}
                    className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      !selectedSubCategory
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300 hover:text-orange-600'
                    }`}
                  >
                    All {selectedCategory} ({currentCategoryData?.productCount || 0})
                  </button>
                  {currentSubCategoriesList.map((sub) => {
                    const isSelected = selectedSubCategory.toLowerCase() === sub.name.toLowerCase();
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => updateHierarchySelection(selectedCategory, sub.name, '')}
                        className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-orange-600 text-white font-bold shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300 hover:text-orange-600'
                        }`}
                      >
                        <span>{sub.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {sub.productCount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Level 3 Child-Category Pills (when sub-category is selected) */}
                {currentChildCategoriesList.length > 0 && (
                  <div className="pt-2.5 border-t border-orange-200/50 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                      <AppIcon name="subdirectory_arrow_right" className="text-xs text-amber-600" />
                      <span>Child Categories under "{selectedSubCategory}":</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                      <button
                        type="button"
                        onClick={() => updateHierarchySelection(selectedCategory, selectedSubCategory, '')}
                        className={`shrink-0 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          !selectedChildCategory
                            ? 'bg-amber-600 text-white shadow-xs font-bold'
                            : 'bg-white text-slate-600 border border-amber-200 hover:border-amber-400 hover:text-amber-800'
                        }`}
                      >
                        All {selectedSubCategory}
                      </button>
                      {currentChildCategoriesList.map((child) => {
                        const isChildSelected = selectedChildCategory.toLowerCase() === child.name.toLowerCase();
                        return (
                          <button
                            key={child.id}
                            type="button"
                            onClick={() => updateHierarchySelection(selectedCategory, selectedSubCategory, child.name)}
                            className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                              isChildSelected
                                ? 'bg-amber-600 text-white font-bold shadow-xs'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300 hover:text-amber-800'
                            }`}
                          >
                            <span>{child.name}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                                isChildSelected ? 'bg-white/30 text-white' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {child.productCount}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Toolbar (View Mode, Sorting, Count) */}
            <div className="bg-slate-50/80 p-3 sm:p-4 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-600 font-medium">
                Showing <strong className="text-slate-900">{displayedProducts.length}</strong> of{' '}
                <strong className="text-slate-900">{filteredProducts.length}</strong> products
              </div>

              <div className="flex items-center gap-3 ml-auto">
                {/* Sorting Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 text-xs text-slate-800 font-medium px-3 py-1.5 rounded-full focus:outline-none focus:border-orange-500 cursor-pointer shadow-2xs"
                >
                  <option value="default">Default sorting (Newest first)</option>
                  <option value="newest">Newest arrivals</option>
                  <option value="price_asc">Price: low to high</option>
                  <option value="price_desc">Price: high to low</option>
                  <option value="rating">Average rating</option>
                </select>

                {/* Show Items Count Dropdown in chunks of 10 */}
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="hidden sm:block bg-white border border-slate-200 text-xs text-slate-800 font-medium px-3 py-1.5 rounded-full focus:outline-none focus:border-orange-500 cursor-pointer shadow-2xs"
                >
                  <option value={10}>Show 10</option>
                  <option value={20}>Show 20</option>
                  <option value={30}>Show 30</option>
                </select>

                {/* Grid View Toggles */}
                <div className="flex items-center bg-white p-0.5 rounded-full border border-slate-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setGridColumns(4)}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      gridColumns === 4 ? 'bg-orange-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="4 Columns Grid"
                  >
                    <AppIcon name="grid_view" className="text-sm block" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridColumns(3)}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      gridColumns === 3 ? 'bg-orange-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="3 Columns Grid"
                  >
                    <AppIcon name="view_column" className="text-sm block" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridColumns(1)}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      gridColumns === 1 ? 'bg-orange-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="List View"
                  >
                    <AppIcon name="list_alt" className="text-sm block" />
                  </button>
                </div>
              </div>
            </div>

            {/* PRODUCT CARDS GRID */}
            {displayedProducts.length === 0 ? (
              <div className="bg-slate-50 rounded-3xl p-12 text-center flex flex-col items-center gap-3 border border-slate-100">
                <AppIcon name="inventory_2" className="text-4xl text-slate-400" />
                <h3 className="font-bold text-base text-slate-900">
                  {products.length === 0 ? 'No Products in Catalog' : 'No products matched your criteria'}
                </h3>
                <p className="text-xs text-slate-600 max-w-sm">
                  {products.length === 0
                    ? 'The product catalog has been cleared. Products added via Admin will be visible here.'
                    : 'Try widening your price range or clearing category / material filters.'}
                </p>
                {products.length > 0 && (
                  <button
                    onClick={resetAllFilters}
                    className="bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full mt-2 cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            ) : (
              <div
                className={`grid gap-4 ${
                  gridColumns === 4
                    ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                    : gridColumns === 3
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {displayedProducts.map((product) => {
                  const qty = quantities[product.id] || 1;
                  const discountPercent = product.originalPrice
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : 0;
                  const inWishlist = wishlistIds.includes(product.id);
                  const hasVariations = Boolean(product.variations && product.variations.length > 0);

                  return (
                    <article
                      key={product.id}
                      className="group bg-white rounded-2xl p-3 border border-slate-100 hover:border-orange-200 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
                      onClick={() => onSelectProduct ? onSelectProduct(product) : null}
                    >
                      {/* Product Image Frame */}
                      <div className="relative w-full aspect-square rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center mb-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                          {(product.createdAt || product.id.startsWith('prod-')) && (
                            <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                              <span>✨</span>
                              <span>NEW</span>
                            </span>
                          )}
                          {discountPercent > 0 && (
                            <span className="bg-orange-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                              {discountPercent}% OFF
                            </span>
                          )}
                          {hasVariations && (
                            <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-semibold px-2 py-0.5 rounded-md">
                              Options Available
                            </span>
                          )}
                          {product.videoUrl && (
                            <span className="bg-slate-900/85 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                              <AppIcon name="videocam" className="text-orange-400 text-[11px]" />
                              <span>Video</span>
                            </span>
                          )}
                        </div>

                        {/* Floating Wishlist Heart */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newState = storeManager.toggleWishlist(product);
                            onToast(newState ? `Added ${product.title} to wishlist` : `Removed from wishlist`);
                          }}
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

                      {/* Product Metadata & Title */}
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider truncate">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateHierarchySelection(product.category, '', '');
                            }}
                            className="text-orange-600 hover:underline truncate cursor-pointer font-bold"
                            title={`Filter by Category: ${product.category}`}
                          >
                            {product.category}
                          </button>
                          {product.subCategory && (
                            <>
                              <span className="text-slate-300">/</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateHierarchySelection(product.category, product.subCategory, '');
                                }}
                                className="text-slate-600 hover:text-orange-600 hover:underline truncate cursor-pointer font-semibold"
                                title={`Filter by Sub-Category: ${product.subCategory}`}
                              >
                                {product.subCategory}
                              </button>
                            </>
                          )}
                          {product.childCategory && (
                            <>
                              <span className="text-slate-300">/</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateHierarchySelection(product.category, product.subCategory || '', product.childCategory);
                                }}
                                className="text-amber-700 hover:text-orange-600 hover:underline truncate cursor-pointer font-semibold"
                                title={`Filter by Child-Category: ${product.childCategory}`}
                              >
                                {product.childCategory}
                              </button>
                            </>
                          )}
                        </div>
                        
                        <h3 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                          {product.title}
                        </h3>

                        {/* Material & MOQ tag */}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                          {product.material && <span className="truncate">{product.material}</span>}
                          {product.material && <span>•</span>}
                          <span className="shrink-0">MOQ: {product.moq}</span>
                        </div>

                        {/* Price Hierarchy */}
                        <div className="mt-auto pt-2 flex items-baseline gap-2">
                          <span className="text-sm font-extrabold text-slate-900">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Interactive Controls */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                        {hasVariations ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSelectProduct) onSelectProduct(product);
                            }}
                            className="w-full bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs py-2 px-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>Select Options &amp; Specs</span>
                            <AppIcon name="arrow_forward" className="text-xs" />
                          </button>
                        ) : (
                          <>
                            {/* Quantity Stepper */}
                            <div
                              className="flex items-center border border-slate-200 rounded-lg bg-slate-50 px-1 py-0.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => handleQtyChange(product.id, -1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900 font-bold text-xs cursor-pointer"
                              >
                                –
                              </button>
                              <span className="w-5 text-center text-xs font-bold text-slate-900">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQtyChange(product.id, 1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900 font-bold text-xs cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(product, qty);
                                onToast(`Added ${qty}x ${product.title} to Order List`);
                              }}
                              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2 px-2 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer truncate"
                            >
                              <AppIcon name="add_shopping_cart" className="text-xs shrink-0" />
                              <span className="truncate">Add to Cart</span>
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Issue #24: Automatic infinite scrolling in chunks of 10 with animated loader */}
            {filteredProducts.length > itemsPerPage && (
              <div ref={loadMoreSentinelRef} className="flex flex-col items-center justify-center pt-8 pb-4 gap-2">
                {isLoadingMore ? (
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold animate-pulse shadow-2xs">
                    <AppIcon name="progress_activity" className="animate-spin text-base" />
                    <span>Loading 10 more products…</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoadingMore(true);
                      setTimeout(() => {
                        setItemsPerPage((prev) => prev + 10);
                        setIsLoadingMore(false);
                      }, 300);
                    }}
                    className="bg-white border border-slate-200 hover:border-orange-500 text-slate-800 text-xs font-bold px-6 py-2.5 rounded-full shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>Load More Products ({filteredProducts.length - itemsPerPage} remaining)</span>
                    <AppIcon name="expand_more" className="text-sm" />
                  </button>
                )}
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
};
