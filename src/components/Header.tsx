import React, { useState } from 'react';
import { getWhatsAppLink, getWhatsAppNumber } from '../utils/whatsapp';
import { ActiveView, CartItem } from '../types';
import { useScrollLock } from '../hooks/useScrollLock';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  cart: CartItem[];
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  cart,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Lock body scroll when mobile menu drawer is open
  useScrollLock(mobileMenuOpen);

  const rawSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discount = rawSubtotal >= 25000 ? Math.round(rawSubtotal * 0.1) : 0;
  const taxable = rawSubtotal - discount;
  const gst = Math.round(taxable * 0.18);
  const grandTotal = taxable + gst;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    if (activeView !== 'racks-floor-stands') {
      setActiveView('racks-floor-stands');
    }
    setShowSuggestions(false);
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const selectSuggestion = (term: string) => {
    setSearchQuery(term);
    if (onSearch) onSearch(term);
    setActiveView('racks-floor-stands');
    setShowSuggestions(false);
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const navigateTo = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  return (
    <>
      {/* FULLY RESPONSIVE STICKY HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fdf9f3]/95 backdrop-blur-md shadow-[0_1px_4px_rgba(0,0,0,0.04)] border-b border-[#e6e2dc]">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-14 sm:h-15 flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* 1. Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 text-left group cursor-pointer min-w-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#1a1c20] flex items-center justify-center text-[#ffdf98] font-serif font-bold text-sm sm:text-base shadow-2xs border border-[#ffdf98]/30 shrink-0">
                AD
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-serif text-xs sm:text-base font-bold uppercase tracking-wider text-[#000102] group-hover:text-[#775a00] transition-colors leading-tight truncate">
                    All Display
                  </span>
                  <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse shrink-0"></span>
                </div>
                <span className="text-[7px] sm:text-[9px] uppercase tracking-widest text-[#76777b] font-semibold truncate">
                  Factory Hyd
                </span>
              </div>
            </button>
          </div>

          {/* 2. Desktop Quick Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs">
            <button
              onClick={() => navigateTo('home')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                activeView === 'home'
                  ? 'bg-[#1a1c20] text-white font-semibold'
                  : 'text-[#45474b] hover:text-[#000102] hover:bg-[#f1ede7]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('racks-floor-stands')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                activeView === 'racks-floor-stands'
                  ? 'bg-[#1a1c20] text-white font-semibold'
                  : 'text-[#45474b] hover:text-[#000102] hover:bg-[#f1ede7]'
              }`}
            >
              Racks &amp; Stands
            </button>
            <button
              onClick={() => navigateTo('pdp')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                activeView === 'pdp'
                  ? 'bg-[#1a1c20] text-white font-semibold'
                  : 'text-[#45474b] hover:text-[#000102] hover:bg-[#f1ede7]'
              }`}
            >
              Triple Pipe Rack (PDP)
            </button>
            <button
              onClick={() => navigateTo('shop-setup-projects')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                activeView === 'shop-setup-projects'
                  ? 'bg-[#1a1c20] text-white font-semibold'
                  : 'text-[#45474b] hover:text-[#000102] hover:bg-[#f1ede7]'
              }`}
            >
              Setup Projects
            </button>
            <button
              onClick={() => navigateTo('custom-quote')}
              className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                activeView === 'custom-quote'
                  ? 'bg-[#775a00] text-white'
                  : 'text-[#775a00] hover:text-[#5a4300] hover:bg-[#ffdf98]/30'
              }`}
            >
              Custom Quote
            </button>
          </nav>

          {/* 3. Integrated Search Bar (Desktop / Tablet) */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm relative">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="w-full flex items-center bg-[#ffffff] px-2.5 py-1.5 rounded-lg shadow-2xs border border-[#c6c6cb]/60 focus-within:border-[#000102]">
                <span className="material-symbols-outlined text-[#76777b] text-[16px] mr-2">search</span>
                <input
                  className="w-full bg-transparent border-0 focus:outline-none text-[11px] text-[#1c1c18] placeholder:text-[#76777b]"
                  placeholder="Search pipe racks, channels, mannequins..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                />
                <span className="text-[8px] font-bold bg-[#f1ede7] px-1 py-0.5 rounded text-[#45474b] uppercase tracking-wider">
                  B2B
                </span>
              </div>
            </form>

            {showSuggestions && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-[#ffffff] rounded-xl shadow-[0_8px_24px_-4px_rgba(26,28,32,0.12)] p-2.5 z-50 border border-[#e6e2dc]">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#76777b] px-1 pb-1">
                  <span>Suggested Searches</span>
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(false)}
                    className="text-[#76777b] hover:text-[#000102]"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {['Heavy Duty Triple Pipe Racks', 'Brushed Gold Slotted Channels', 'Matte White Tailor Dummies', 'Lotus Wood Hangers Bulk'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => selectSuggestion(tag)}
                      className="text-[10px] bg-[#f1ede7] hover:bg-[#fece57]/40 px-2 py-1 rounded text-[#1c1c18] transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Right Utility Actions (Fully responsive for mobile screens) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden w-7 h-7 rounded-lg bg-[#f1ede7] flex items-center justify-center text-[#1c1c18] hover:bg-[#ebe8e2] transition-colors cursor-pointer shrink-0"
              aria-label="Toggle Search"
            >
              <span className="material-symbols-outlined text-[16px]">
                {mobileSearchOpen ? 'close' : 'search'}
              </span>
            </button>

            {/* Direct WhatsApp Callout - Responsive */}
            <a
              href={getWhatsAppLink('Hi All Display Hyderabad, I want to inquire about store fixtures wholesale rates.')}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 bg-[#25D366] hover:bg-[#128C7E] text-white px-2 sm:px-3 py-1 rounded-lg text-[11px] font-bold transition-all shadow-2xs shrink-0"
              title="WhatsApp Commercial Desk"
            >
              <span className="material-symbols-outlined text-[15px]">chat</span>
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="sm:hidden">WA</span>
              <span className="hidden lg:inline text-[10px] font-normal opacity-90">+{getWhatsAppNumber()}</span>
            </a>

            {/* Wholesale Order List Cart Button - Responsive */}
            <button
              onClick={() => navigateTo('quote-cart')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border shrink-0 ${
                activeView === 'quote-cart'
                  ? 'bg-[#1a1c20] text-white border-[#1a1c20]'
                  : 'bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18] border-transparent'
              }`}
              title="View Wholesale Order List"
            >
              <span className="material-symbols-outlined text-[15px] text-[#775a00]">assignment</span>
              <span className="hidden sm:inline">Orders</span>
              <span className="bg-[#775a00] text-white px-1.5 py-0.2 rounded-full text-[9px] font-bold">
                {cart.length}
              </span>
              <span className="hidden xl:inline text-[#76777b] text-[10px]">
                • ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#1a1c20] text-[#ffdf98] flex items-center justify-center transition-colors cursor-pointer shadow-2xs shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-[17px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile Search Overlay Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden px-3 pb-2 pt-1 border-t border-[#e6e2dc] bg-[#ffffff] animate-in fade-in duration-150">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="w-full flex items-center bg-[#fdf9f3] px-2.5 py-1.5 rounded-lg border border-[#c6c6cb] focus-within:border-primary">
                <span className="material-symbols-outlined text-[#76777b] text-[16px] mr-2">search</span>
                <input
                  className="w-full bg-transparent border-0 focus:outline-none text-[11px] text-[#1c1c18] placeholder:text-[#76777b]"
                  placeholder="Search pipe racks, channels, mannequins..."
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-[#1a1c20] text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase shrink-0"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        )}
      </header>

      {/* Offcanvas Drawer Menu (Mobile & Tablet) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity touch-none"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-sm h-full bg-[#fdf9f3] shadow-2xl flex flex-col z-10 overflow-y-auto overscroll-contain" data-scrollable="true">
            {/* Drawer Header */}
            <div className="bg-[#1a1c20] text-white p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#ffdf98] text-[#1a1c20] flex items-center justify-center font-serif font-bold text-base">
                  AD
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-sm text-white">All Display</span>
                  <span className="text-[10px] text-[#fece57] uppercase tracking-wider">Hyderabad Wholesale</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Quick Stats Pill */}
            <div className="bg-[#fece57]/20 p-3 mx-4 mt-4 rounded-xl border border-[#fece57]/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                <span className="font-bold text-[#775a00]">B2B Direct Wholesale</span>
              </div>
              <span className="text-[10px] font-mono text-[#1c1c18]">48h Dispatch</span>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col p-4 gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#76777b] px-2 mb-1">
                Navigation &amp; Showroom
              </span>

              <button
                onClick={() => navigateTo('home')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold transition-colors ${
                  activeView === 'home'
                    ? 'bg-[#1a1c20] text-white'
                    : 'text-[#1c1c18] hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">home</span>
                  <span>Home</span>
                </div>
                <span className="material-symbols-outlined text-[16px] opacity-60">chevron_right</span>
              </button>

              <button
                onClick={() => navigateTo('racks-floor-stands')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold transition-colors ${
                  activeView === 'racks-floor-stands'
                    ? 'bg-[#1a1c20] text-white'
                    : 'text-[#1c1c18] hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">shelves</span>
                  <span>Racks &amp; Floor Stands</span>
                </div>
                <span className="text-[10px] bg-secondary-container px-1.5 py-0.5 rounded text-on-secondary-container font-bold">
                  Catalog
                </span>
              </button>

              <button
                onClick={() => navigateTo('pdp')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold transition-colors ${
                  activeView === 'pdp'
                    ? 'bg-[#1a1c20] text-white'
                    : 'text-[#1c1c18] hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                  <span>Triple Pipe Rack System</span>
                </div>
                <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded">
                  PDP &amp; CAD
                </span>
              </button>

              <button
                onClick={() => navigateTo('shop-setup-projects')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold transition-colors ${
                  activeView === 'shop-setup-projects'
                    ? 'bg-[#1a1c20] text-white'
                    : 'text-[#1c1c18] hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">play_circle</span>
                  <span>Shop Setup Projects</span>
                </div>
                <span className="text-[10px] bg-[#E1306C] text-white px-1.5 py-0.5 rounded font-bold">
                  Reels
                </span>
              </button>

              <button
                onClick={() => navigateTo('quote-cart')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold transition-colors ${
                  activeView === 'quote-cart'
                    ? 'bg-[#1a1c20] text-white'
                    : 'text-[#1c1c18] hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-[#775a00]">assignment</span>
                  <span>Wholesale Order List</span>
                </div>
                <span className="bg-[#775a00] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {cart.length}
                </span>
              </button>

              <button
                onClick={() => navigateTo('custom-quote')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-bold transition-colors ${
                  activeView === 'custom-quote'
                    ? 'bg-[#775a00] text-white'
                    : 'bg-[#775a00]/10 text-[#775a00] hover:bg-[#775a00]/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px]">draw</span>
                  <span>Get Custom Quote</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold">Free CAD</span>
              </button>

              <div className="border-t border-[#e6e2dc] my-2"></div>

              {/* Showroom Contacts in Mobile Drawer */}
              <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-2.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                  Direct Wholesale Contact
                </span>

                <a
                  href={getWhatsAppLink('Hi All Display, I would like to know more about your wholesale fixtures.')}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-primary font-bold hover:text-secondary"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#25D366]">chat</span>
                  <span>WhatsApp: +{getWhatsAppNumber()}</span>
                </a>

                <a
                  href={`tel:+${getWhatsAppNumber(true)}`}
                  className="flex items-center gap-2 text-primary font-bold hover:text-secondary"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#775a00]">phone</span>
                  <span>Showroom: +{getWhatsAppNumber(true)}</span>
                </a>

                <div className="text-[10px] text-on-surface-variant pt-1 border-t border-surface-container">
                  Ranigunj &amp; Begum Bazaar Depots, Hyderabad
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
