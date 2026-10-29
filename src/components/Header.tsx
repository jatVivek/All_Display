import React, { useState, useEffect, useRef } from 'react';
import { AppIcon } from './AppIcon';
import { getWhatsAppLink } from '../utils/whatsapp';
import { ActiveView, CartItem, Product } from '../types';
import { useScrollLock } from '../hooks/useScrollLock';
import { useAuth } from '../auth/AuthContext';
import { storeManager } from '../services/storeManager';

interface HeaderProps {
  activeView: ActiveView;
  selectedCategoryName?: string;
  setActiveView: (view: ActiveView) => void;
  onNavigateToShop: (category?: string) => void;
  onNavigateToSection: (sectionId: string) => void;
  cart: CartItem[];
  onSearch?: (query: string) => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onSelectProduct: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  selectedCategoryName,
  setActiveView,
  onNavigateToShop,
  onNavigateToSection,
  cart,
  onSearch,
  onOpenWishlist,
  onOpenAccount,
  onSelectProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(() => storeManager.getWishlist().length);
  const [settings, setSettings] = useState(() => storeManager.getSettings());
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { user, openAuthDialog, logout } = useAuth();

  const categories = storeManager.getCategories();
  const products = storeManager.getProducts();

  // Filter categories to only those with at least 1 active product
  const activeCategories = React.useMemo(() => {
    return categories.filter((c) =>
      products.some((p) => (p.category && p.category.toLowerCase() === c.name.toLowerCase()) || p.category === c.id)
    );
  }, [categories, products]);

  // Debounce search query to show loading state
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 200);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Listen to store updates for wishlist & settings
  useEffect(() => {
    const handleUpdate = () => {
      setWishlistCount(storeManager.getWishlist().length);
      setSettings(storeManager.getSettings());
    };
    window.addEventListener('vinayak_wishlist_updated', handleUpdate);
    window.addEventListener('vinayak_settings_updated', handleUpdate);
    window.addEventListener('alldisplay_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    const unsubscribe = storeManager.subscribe(() => {
      setWishlistCount(storeManager.getWishlist().length);
      setSettings(storeManager.getSettings());
    });
    return () => {
      window.removeEventListener('vinayak_wishlist_updated', handleUpdate);
      window.removeEventListener('vinayak_settings_updated', handleUpdate);
      window.removeEventListener('alldisplay_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      unsubscribe();
    };
  }, []);

  // Issue #18: Debounced search loader state
  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 220);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  // Click outside search suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu drawer is open
  useScrollLock(mobileMenuOpen);

  const rawSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  // Live matching products for autocomplete
  const matchingSuggestions = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => {
        const matchesCat = selectedCategory === 'All categories' || p.category === selectedCategory;
        const matchesText =
          p.title.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.finish.toLowerCase().includes(q) ||
          (p.material && p.material.toLowerCase().includes(q));
        return matchesCat && matchesText;
      })
      .slice(0, 5);
  }, [products, searchQuery, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    if (activeView !== 'shop') {
      onNavigateToShop();
    }
    setSearchFocused(false);
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const navigateTo = (view: ActiveView, category?: string) => {
    if (view === 'shop') onNavigateToShop(category);
    else setActiveView(view);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  const navigateToSection = (sectionId: string) => {
    onNavigateToSection(sectionId);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  const handleAccountClick = () => {
    if (user) onOpenAccount();
    else openAuthDialog();
  };

  const brandName = settings.brandName || settings.storeName || 'All Display';
  const brandTagline = settings.brandTagline || 'Jewellery Display, Trays & Packaging Solutions';
  const headerNotice = settings.headerNotice || 'Direct Factory Wholesale • Feel Khana Depot, Hyderabad • Same-Day Dispatch Across India';
  const phone = settings.supportPhone || '+91 73961 27273';
  const instagramLink = settings.instagramUrl || 'https://www.instagram.com/all_display_?cplk=MXNpcGN3cno4MHI0Nw==';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-xs border-b border-slate-100">
        {/* Top Minimal Strip (Visible on Desktop) */}
        <div className="hidden lg:block border-b border-slate-100 bg-slate-50/70 text-slate-600 text-xs py-1.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {headerNotice}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="font-medium text-slate-700 hover:text-orange-600 transition-colors flex items-center gap-1"
              >
                <AppIcon name="phone" className="text-orange-500 text-[13px]" />
                <span>Call For Order: {phone}</span>
              </a>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-2">
                <a
                  href={getWhatsAppLink(`Hi ${brandName}, I would like to inquire about wholesale rates.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-5 h-5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                  title="WhatsApp"
                >
                  <AppIcon name="chat" className="text-[12px]" />
                </a>
                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center transition-transform hover:scale-105"
                  title="Instagram"
                >
                  <AppIcon name="instagram" className="text-[11px]" />
                </a>
                <button
                  type="button"
                  onClick={() => navigateToSection('contact-us')}
                  className="w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Store Location"
                >
                  <AppIcon name="location_on" className="text-[12px]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3 sm:gap-6">
          {/* 1. Brand Logo (Dynamic through Admin, wrap protected against long text) */}
          <div className="flex items-center gap-2.5 shrink-0 min-w-0 max-w-[220px] sm:max-w-[320px]">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer min-w-0 w-full py-1"
            >
              <img
                src={settings.logoUrl || '/assets/logo.png'}
                alt={brandName}
                className="h-10 sm:h-12 w-auto max-w-[100px] sm:max-w-[140px] object-contain shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/logo.png';
                }}
              />
              <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors uppercase leading-tight truncate">
                  {brandName}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold truncate">
                  {brandTagline}
                </span>
              </div>
            </button>
          </div>

          {/* 2. Integrated Search Bar with Live Suggestions Dropdown & Loader */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="flex items-center w-full bg-slate-50 hover:bg-slate-100/80 focus-within:bg-white rounded-full border border-slate-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition-all p-1">
                {/* Category Dropdown (Excludes empty categories) */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-xs text-slate-700 font-medium pl-3 pr-2 py-1.5 border-r border-slate-200 focus:outline-none cursor-pointer shrink-0 max-w-[130px] truncate"
                >
                  <option value="All categories">All categories</option>
                  {activeCategories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>

                {/* Search Text Input */}
                <input
                  className="w-full bg-transparent border-0 focus:outline-none text-xs text-slate-900 placeholder:text-slate-400 px-3 py-1.5"
                  placeholder="Search for velvet display, earring cards, tape dispenser, trays..."
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchFocused(true);
                  }}
                />

                {/* Clear / Submit Buttons */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-600 mr-1"
                  >
                    <AppIcon name="close" className="text-xs" />
                  </button>
                )}
                <button
                  type="submit"
                  className="w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer shadow-xs"
                  aria-label="Submit search"
                >
                  {isSearching ? (
                    <AppIcon name="progress_activity" className="text-sm animate-spin" />
                  ) : (
                    <AppIcon name="search" className="text-sm" />
                  )}
                </button>
              </div>
            </form>

            {/* Live Autocomplete Dropdown Suggestions */}
            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Products Matching "{searchQuery}"</span>
                  <span>{matchingSuggestions.length} found</span>
                </div>

                {/* Live Suggestions or Search Loader */}
                {isSearching ? (
                  <div className="p-8 flex items-center justify-center gap-2.5 text-xs font-semibold text-slate-500">
                    <AppIcon name="progress_activity" className="text-lg text-orange-600 animate-spin" />
                    <span>Searching products catalog...</span>
                  </div>
                ) : matchingSuggestions.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No products matched "{searchQuery}". Try searching for "velvet", "stand", "cards", or "tray".
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {matchingSuggestions.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          onSelectProduct(prod);
                          setSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-slate-50 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-orange-600">{prod.category}</span>
                            <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                              {prod.title}
                            </h4>
                            <span className="text-[10px] text-slate-500 font-mono">{prod.code}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-xs text-slate-900">₹{prod.price.toLocaleString('en-IN')}</span>
                          <span className="block text-[10px] text-emerald-600 font-medium">In Stock</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                  >
                    View all results for "{searchQuery}" in Shop →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Right Utility Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Account Profile / Sign In */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleAccountClick}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-slate-700 transition-colors hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                aria-label={user ? `Account: ${user.name}` : 'Sign In'}
                title={user ? `Signed in as ${user.name} (${user.email}). Click to view profile & orders.` : 'Sign In or Create Account'}
              >
                {user ? (
                  <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <AppIcon name="person" className="text-base text-slate-600" />
                )}
                <span className="hidden lg:inline uppercase tracking-wide text-[11px]">
                  {user ? user.name.split(' ')[0] : 'Sign In'}
                </span>
              </button>

              {user && (
                <button
                  type="button"
                  onClick={() => logout()}
                  title="Sign Out"
                  className="hidden lg:flex items-center justify-center p-1.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  aria-label="Sign Out"
                >
                  <AppIcon name="logout" className="text-sm" />
                </button>
              )}
            </div>

            {/* Wishlist Link with Live Counter Heart */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 rounded-full text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
              title="View Wishlist & Saved Items"
              aria-label="Wishlist"
            >
              <AppIcon name="heart" className="text-lg" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-xs animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Modern Lightweight Cart Button */}
            <button
              onClick={() => navigateTo('quote-cart')}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white pl-3 pr-4 py-2 rounded-full text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
              title="View Cart"
            >
              <div className="relative">
                <AppIcon name="add_shopping_cart" className="text-base" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-slate-900 text-white text-[9px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center border-2 border-orange-600">
                    {cart.length}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">
                CART ₹ {rawSubtotal.toLocaleString('en-IN')}.00
              </span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <AppIcon name={mobileMenuOpen ? 'close' : 'menu'} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Secondary Category Navigation Strip (Desktop) */}
        <nav className="hidden lg:block border-t border-slate-100 bg-white shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-6 py-2.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className={`transition-colors hover:text-orange-600 cursor-pointer whitespace-nowrap py-1 ${
                  activeView === 'home' ? 'text-orange-600 font-bold border-b-2 border-orange-500' : ''
                }`}
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => navigateTo('shop', 'All Categories')}
                className={`transition-colors hover:text-orange-600 cursor-pointer whitespace-nowrap py-1 ${
                  activeView === 'shop' && (!selectedCategoryName || selectedCategoryName === 'All Categories')
                    ? 'text-orange-600 font-bold border-b-2 border-orange-500'
                    : ''
                }`}
              >
                All Shop Categories
              </button>
              {activeCategories.slice(0, 8).map((cat) => {
                const isCatActive = activeView === 'shop' && selectedCategoryName === cat.name;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (onSearch) onSearch('');
                      navigateTo('shop', cat.name);
                    }}
                    className={`transition-colors hover:text-orange-600 cursor-pointer whitespace-nowrap py-1 ${
                      isCatActive
                        ? 'text-orange-600 font-bold border-b-2 border-orange-500'
                        : 'text-slate-700 font-semibold'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => navigateTo('custom-quote')}
                className={`transition-colors hover:text-orange-600 cursor-pointer whitespace-nowrap py-1 ${
                  activeView === 'custom-quote' ? 'text-orange-600 font-bold border-b-2 border-orange-500' : ''
                }`}
              >
                Custom Branding &amp; Bulk
              </button>
              <button
                type="button"
                onClick={() => navigateTo('contact')}
                className={`transition-colors hover:text-orange-600 cursor-pointer whitespace-nowrap py-1 ${
                  activeView === 'contact' ? 'text-orange-600 font-bold border-b-2 border-orange-500' : ''
                }`}
              >
                Contact &amp; Showroom
              </button>
            </div>

            <div className="flex items-center gap-2 text-slate-500 font-medium text-[11px] shrink-0 pl-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Feel Khana Depot Online</span>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <img
                    src={settings.logoUrl || '/assets/logo.png'}
                    alt={brandName}
                    className="h-8 w-auto max-w-[120px] object-contain rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/logo.png';
                    }}
                  />
                  <span className="font-bold text-sm text-slate-900 truncate">{brandName}</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400">
                  <AppIcon name="close" className="text-lg" />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 p-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full text-xs bg-transparent outline-none px-2"
                  />
                  <button type="submit" className="text-orange-600">
                    <AppIcon name="search" className="text-sm" />
                  </button>
                </div>
              </form>

              <div className="flex flex-col gap-2.5 text-sm font-semibold text-slate-800">
                <button onClick={() => navigateTo('home')} className="text-left py-1.5 hover:text-orange-600">Home</button>
                <button onClick={() => navigateTo('shop', 'All Categories')} className="text-left py-1.5 hover:text-orange-600">All Products</button>
                {activeCategories.slice(0, 6).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (onSearch) onSearch('');
                      navigateTo('shop', cat.name);
                    }}
                    className="text-left py-1 pl-3 text-xs text-slate-600 hover:text-orange-600 border-l-2 border-orange-200"
                  >
                    {cat.name}
                  </button>
                ))}
                <button onClick={() => { onOpenWishlist(); setMobileMenuOpen(false); }} className="text-left py-1.5 hover:text-orange-600 flex items-center justify-between">
                  <span>My Wishlist</span>
                  <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-xs">{wishlistCount}</span>
                </button>
                <button onClick={() => { handleAccountClick(); setMobileMenuOpen(false); }} className="text-left py-1.5 hover:text-orange-600">
                  {user ? `My Account (${user.name})` : 'Sign In'}
                </button>
                {user && (
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="text-left py-1.5 text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <AppIcon name="logout" className="text-sm" />
                    <span>Sign Out ({user.name})</span>
                  </button>
                )}
                <button onClick={() => navigateTo('custom-quote')} className="text-left py-1.5 hover:text-orange-600">Custom Bulk Quotes</button>
                <button onClick={() => navigateTo('contact')} className="text-left py-1.5 hover:text-orange-600">Contact &amp; Showroom</button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col gap-2 text-xs text-slate-500">
              <p className="font-bold text-slate-700">{phone}</p>
              <p>{settings.businessAddress}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
