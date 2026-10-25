import React, { useState, useMemo, useEffect } from 'react';
import { ActiveView, Product } from '../types';
import { storeManager } from '../services/storeManager';
import { getWhatsAppLink } from '../utils/whatsapp';

interface CatalogViewProps {
  setActiveView: (view: ActiveView) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToast: (msg: string) => void;
  cartCount: number;
  cartSubtotal: number;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  setActiveView,
  onAddToCart,
  onToast,
  cartCount,
  cartSubtotal
}) => {
  const [products, setProducts] = useState<Product[]>(() => storeManager.getProducts());
  const [categories, setCategories] = useState(() => storeManager.getCategories());

  useEffect(() => {
    const handleUpdate = () => {
      setProducts(storeManager.getProducts());
      setCategories(storeManager.getCategories());
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

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>(['Matte Black Powder Coat']);
  const [selectedProfile, setSelectedProfile] = useState('All Configurations');
  const [selectedLoads, setSelectedLoads] = useState<string[]>(['>100kg Heavy Duty']);
  const [maxPrice, setMaxPrice] = useState(12000);
  const [dispatchType, setDispatchType] = useState<string[]>(['Same-Day Hyderabad Dispatch']);
  const [sortBy, setSortBy] = useState('Most Popular for New Stores');
  const [isTableView, setIsTableView] = useState(false);

  // Filter application
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (selectedCategory !== 'All Categories' && prod.category !== selectedCategory) {
        return false;
      }
      // Finish filter
      if (selectedFinishes.length > 0 && !selectedFinishes.includes(prod.finish)) {
        return false;
      }
      // Structural Profile
      if (selectedProfile !== 'All Configurations' && prod.structuralProfile !== selectedProfile) {
        return false;
      }
      // Certified Load Capacity
      if (selectedLoads.length > 0) {
        const matchesLoad = selectedLoads.some((l) => {
          if (l === '>100kg Heavy Duty') return prod.loadCapacity.includes('>100kg') || prod.loadCapacity.includes('150') || prod.loadCapacity.includes('120') || prod.loadCapacity.includes('140');
          if (l === '50 kg – 100 kg') return prod.loadCapacity.includes('50') || prod.loadCapacity.includes('80');
          if (l === 'Up to 50 kg') return prod.loadCapacity.includes('50');
          return true;
        });
        if (!matchesLoad) return false;
      }
      // Price
      if (prod.price > maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'Price: Low to High (Wholesale)') return a.price - b.price;
      if (sortBy === 'Price: High to Low (Luxury)') return b.price - a.price;
      return 0; // Most popular default
    });
  }, [selectedCategory, selectedFinishes, selectedProfile, selectedLoads, maxPrice, sortBy]);

  useEffect(() => {
    if (selectedCategory !== 'All Categories' && !categories.some((category) => category.name === selectedCategory)) {
      setSelectedCategory('All Categories');
    }
  }, [categories, selectedCategory]);

  const toggleFinish = (f: string) => {
    setSelectedFinishes((prev) =>
      prev.includes(f) ? prev.filter((item) => item !== f) : [...prev, f]
    );
  };

  const toggleLoad = (l: string) => {
    setSelectedLoads((prev) =>
      prev.includes(l) ? prev.filter((item) => item !== l) : [...prev, l]
    );
  };

  const clearAllFilters = () => {
    setSelectedFinishes([]);
    setSelectedProfile('All Configurations');
    setSelectedLoads([]);
    setMaxPrice(12000);
    setDispatchType(['Same-Day Hyderabad Dispatch']);
  };

  return (
    <div className="w-full bg-[#fdf9f3] text-[#1c1c18] pb-24">
      {/* Category Header & Architectural Breadcrumb */}
      <section className="w-full bg-[#f7f3ed] px-4 lg:px-8 py-8 border-b border-[#e6e2dc]">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          {/* Breadcrumb Trail */}
          <nav className="flex items-center gap-1.5 text-xs text-[#76777b]">
            <button onClick={() => setActiveView('home')} className="hover:text-[#000102] transition-colors">
              Home
            </button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="hover:text-[#000102]">Store Fixtures</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#000102] font-semibold">Floor Stands &amp; Bumper Racks</span>
          </nav>

          {/* Headline & Engineered Proposition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#fece57]/40 text-[#775a00] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Showroom Engineered
                </span>
                <span className="text-[11px] text-[#76777b] font-medium">
                  Hyderabad Direct Manufacturer
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#000102] tracking-tight">
                Commercial Floor Display Stands &amp; Island Racks
              </h1>
              <p className="text-xs sm:text-sm text-[#45474b] max-w-3xl leading-relaxed">
                Heavy-duty commercial clothing racks engineered for garment showrooms, ethnic boutiques, and multi-brand apparel stores. Fabricated with 1.6mm industrial mild steel and 304-grade stainless steel with scratch-proof powder coat and electroplated PVD titanium gold finishes.
              </p>
            </div>

            {/* Quick Spec Highlights Matrix */}
            <div className="lg:col-span-4 bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e6e2dc] flex flex-col gap-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#f1ede7]">
                <span className="text-[11px] uppercase font-bold text-[#76777b]">Standard Stock Gauge</span>
                <span className="text-xs font-bold text-[#000102]">16 SWG (1.6mm)</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-[#f1ede7]">
                <span className="text-[11px] uppercase font-bold text-[#76777b]">Ranigunj Ready Dispatch</span>
                <span className="text-xs font-bold text-[#25D366]">26 Ready Fixtures</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-[#76777b]">Structural Warranty</span>
                <span className="text-xs font-bold text-[#000102]">5 Years Weld Guarantee</span>
              </div>
            </div>
          </div>

          {/* Active Filter Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#76777b]">Active Filters:</span>
            {selectedFinishes.map((f) => (
              <button
                key={f}
                onClick={() => toggleFinish(f)}
                className="flex items-center gap-1.5 bg-[#e6e2dc] hover:bg-[#ddd9d4] text-[#1c1c18] px-3 py-1 rounded-full text-xs font-medium transition-colors"
              >
                <span>Finish: {f.split(' ')[0]}</span>
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            ))}
            {selectedLoads.map((l) => (
              <button
                key={l}
                onClick={() => toggleLoad(l)}
                className="flex items-center gap-1.5 bg-[#e6e2dc] hover:bg-[#ddd9d4] text-[#1c1c18] px-3 py-1 rounded-full text-xs font-medium transition-colors"
              >
                <span>Load: {l}</span>
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            ))}
            {(selectedFinishes.length > 0 || selectedLoads.length > 0) && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#775a00] hover:underline pl-2 font-semibold cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Catalog Architecture: Sidebar + Product Grid */}
      <section className="w-full px-4 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Architectural Filter Sidebar (3 cols) */}
          <aside className="lg:col-span-3 flex flex-col gap-5 bg-[#f7f3ed] p-5 rounded-2xl border border-[#e6e2dc]">
            <div className="flex items-center justify-between pb-2 border-b border-[#e6e2dc]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-[#000102]">tune</span>
                <h2 className="font-serif text-base font-bold text-[#000102]">Fixtures Filter</h2>
              </div>
              <span className="text-[11px] bg-[#e6e2dc] px-2 py-0.5 rounded text-[#45474b] font-medium">
                {filteredProducts.length} Items
              </span>
            </div>

            {/* 1. Category Hierarchy */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#76777b]">
                Catalog Category
              </label>
              <div className="flex flex-col gap-1 text-xs">
                {[
                  { name: 'All Categories', count: products.length },
                  ...categories.map((category) => ({
                    name: category.name,
                    count: products.filter((product) => product.category === category.name).length
                  }))
                ].map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                      selectedCategory === cat.name
                        ? 'bg-[#1a1c20] text-white font-semibold'
                        : 'text-[#1c1c18] hover:bg-[#ebe8e2]'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      {selectedCategory === cat.name && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ffdf98]"></span>
                      )}
                      <span>{cat.name}</span>
                    </span>
                    <span className={`text-[11px] ${selectedCategory === cat.name ? 'text-[#ffdf98]' : 'text-[#76777b]'}`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Finish & Surface Treatment */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#e6e2dc]">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#76777b]">
                Finish / Surface Treatment
              </label>
              <div className="flex flex-col gap-2 text-xs">
                {[
                  { name: 'Matte Black Powder Coat', color: '#1A1C20', count: 18 },
                  { name: 'Brushed Champagne Gold PVD', color: '#D4AF37', count: 12 },
                  { name: 'Mirror Chrome Finish', color: '#E0E2E5', count: 15 },
                  { name: 'Natural Teak & Mild Steel', color: '#8C5E3C', count: 8 },
                  { name: 'Gloss Commercial White', color: '#FFFFFF', count: 6 }
                ].map((fin) => (
                  <label key={fin.name} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedFinishes.includes(fin.name)}
                        onChange={() => toggleFinish(fin.name)}
                        className="w-4 h-4 rounded text-[#000102] accent-[#000102]"
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-sm border border-black/10"
                        style={{ backgroundColor: fin.color }}
                      ></span>
                      <span className="text-[#1c1c18] group-hover:text-[#000102]">{fin.name}</span>
                    </div>
                    <span className="text-[11px] text-[#76777b]">{fin.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Structural Profile */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#e6e2dc]">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#76777b]">
                Structural Profile
              </label>
              <div className="flex flex-col gap-1.5 text-xs">
                {[
                  'All Configurations',
                  'Triple Pipe Island Hanging Rack',
                  '4-Way Stepped Waterfall Stand',
                  'Heavy Duty Bumper Perimeter Stand',
                  'Minimalist Single Bar Studio Stand',
                  'Circular 360° Revolving Stand'
                ].map((prof) => (
                  <label key={prof} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="structural_profile"
                      checked={selectedProfile === prof}
                      onChange={() => setSelectedProfile(prof)}
                      className="accent-[#000102]"
                    />
                    <span className={selectedProfile === prof ? 'font-semibold text-[#000102]' : 'text-[#45474b]'}>
                      {prof}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Certified Load Capacity */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#e6e2dc]">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#76777b]">
                Certified Load Capacity
              </label>
              <div className="flex flex-col gap-2 text-xs">
                {[
                  { label: 'Up to 50 kg (Boutique Dresses / Tops)', val: 'Up to 50 kg' },
                  { label: '50 kg – 100 kg (Standard Retail Merchandising)', val: '50 kg – 100 kg' },
                  { label: '100 kg+ (Heavy Sarees, Lehengas & Denim)', val: '>100kg Heavy Duty' }
                ].map((load) => (
                  <label key={load.val} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLoads.includes(load.val)}
                      onChange={() => toggleLoad(load.val)}
                      className="w-4 h-4 rounded text-[#000102] accent-[#000102]"
                    />
                    <span className={selectedLoads.includes(load.val) ? 'font-semibold text-[#000102]' : 'text-[#45474b]'}>
                      {load.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 5. Wholesale Price Range (INR) */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#e6e2dc]">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#76777b]">
                  B2B Trade Rate (INR)
                </label>
                <span className="text-xs font-bold text-[#775a00]">₹1,000 – ₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="12000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                className="w-full accent-[#000102] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-[#76777b]">
                <span>₹1,000</span>
                <span>Max: ₹{maxPrice.toLocaleString('en-IN')}</span>
                <span>₹12,000</span>
              </div>
            </div>

            {/* 6. Logistics Dispatch Readiness */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#e6e2dc]">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#76777b]">
                Logistics Dispatch Readiness
              </label>
              <div className="flex flex-col gap-2 text-xs">
                <label className="flex items-center justify-between p-2 rounded-lg bg-white cursor-pointer shadow-sm border border-[#e6e2dc]">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dispatchType.includes('Same-Day Hyderabad Dispatch')}
                      onChange={() => {
                        setDispatchType((prev) =>
                          prev.includes('Same-Day Hyderabad Dispatch')
                            ? prev.filter((x) => x !== 'Same-Day Hyderabad Dispatch')
                            : [...prev, 'Same-Day Hyderabad Dispatch']
                        );
                      }}
                      className="w-4 h-4 rounded text-[#000102] accent-[#000102]"
                    />
                    <span className="font-medium text-[#1c1c18]">Same-Day Hyderabad Dispatch</span>
                  </div>
                  <span className="text-[#25D366] font-bold">26</span>
                </label>
                <label className="flex items-center justify-between p-2 rounded-lg bg-white cursor-pointer shadow-sm border border-[#e6e2dc]">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dispatchType.includes('Custom Made-to-Order (4 Days)')}
                      onChange={() => {
                        setDispatchType((prev) =>
                          prev.includes('Custom Made-to-Order (4 Days)')
                            ? prev.filter((x) => x !== 'Custom Made-to-Order (4 Days)')
                            : [...prev, 'Custom Made-to-Order (4 Days)']
                        );
                      }}
                      className="w-4 h-4 rounded text-[#000102] accent-[#000102]"
                    />
                    <span className="text-[#45474b]">Custom Made-to-Order (4 Days)</span>
                  </div>
                  <span className="text-[#76777b]">8</span>
                </label>
              </div>
            </div>

            {/* Store Layout Support Banner */}
            <div className="bg-[#1a1c20] text-white p-4 rounded-xl flex flex-col gap-3 shadow-md mt-2">
              <div className="flex items-center gap-2 text-[#ffdf98]">
                <span className="material-symbols-outlined text-[20px]">architecture</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Store Layout Support</span>
              </div>
              <p className="text-xs text-[#c6c6cb] leading-relaxed">
                Opening a new showroom in Hyderabad, Bangalore, or Chennai? Send your 2D CAD floor plan for optimal fixture count &amp; wholesale pack pricing.
              </p>
              <a
                href={getWhatsAppLink('Hi All Display, I have a store floor plan to quote.')}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-2.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                <span>Send Floor Plan on WhatsApp</span>
              </a>
            </div>
          </aside>

          {/* Products Grid & Controls (9 cols) */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            {/* Interactive Listing Toolbar */}
            <div className="bg-[#f7f3ed] p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm border border-[#e6e2dc]">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#1c1c18]">
                  Showing <strong className="text-[#000102] font-bold">{filteredProducts.length} Commercial Fixtures</strong>
                </span>
                <span className="text-[#76777b] text-xs hidden sm:inline">• Heavy Gauge Steel Stock</span>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold uppercase text-[#76777b] hidden sm:inline" htmlFor="sort_by">
                    Sort By:
                  </label>
                  <select
                    id="sort_by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white text-[#1c1c18] text-xs font-medium py-2 px-3 rounded-lg border border-[#c6c6cb] focus:outline-none focus:border-[#000102] shadow-sm cursor-pointer"
                  >
                    <option>Most Popular for New Stores</option>
                    <option>Price: Low to High (Wholesale)</option>
                    <option>Price: High to Low (Luxury)</option>
                    <option>Heavy Duty Load Capacity (120kg+)</option>
                    <option>Immediate Same-Day Dispatch</option>
                  </select>
                </div>

                {/* View Layout Toggle */}
                <div className="flex items-center bg-[#e6e2dc] p-0.5 rounded-lg">
                  <button
                    onClick={() => setIsTableView(false)}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      !isTableView ? 'bg-white text-[#000102] shadow-sm' : 'text-[#76777b] hover:text-[#000102]'
                    }`}
                    title="Catalog Grid View"
                  >
                    <span className="material-symbols-outlined text-[18px] block">grid_view</span>
                  </button>
                  <button
                    onClick={() => setIsTableView(true)}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      isTableView ? 'bg-white text-[#000102] shadow-sm' : 'text-[#76777b] hover:text-[#000102]'
                    }`}
                    title="Dense Commercial Spec Table"
                  >
                    <span className="material-symbols-outlined text-[18px] block">table_rows</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PRODUCT LISTING (GRID OR TABLE) */}
            {!isTableView ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="bg-[#ffffff] rounded-2xl p-4 shadow-sm border border-[#e6e2dc] flex flex-col justify-between hover:shadow-md transition-shadow group"
                  >
                    <div className="flex flex-col gap-3">
                      {/* Image Frame */}
                      <div className="relative w-full aspect-[4/5] bg-[#f7f3ed] rounded-xl overflow-hidden flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.badge && (
                          <div
                            className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                              product.badgeType === 'secondary'
                                ? 'bg-[#775a00] text-white'
                                : 'bg-[#000102] text-white'
                            }`}
                          >
                            {product.badge}
                          </div>
                        )}
                        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm text-[#000102] px-2 py-0.5 rounded text-[10px] font-semibold border border-black/5">
                          {product.moq}
                        </div>
                      </div>

                      {/* Product Metadata & Title */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[11px] text-[#76777b] font-mono">
                          <span>Code: {product.code}</span>
                          <span className="text-[#775a00] font-bold">{product.loadCapacity}</span>
                        </div>
                        <h3
                          onClick={() => setActiveView('pdp')}
                          className="font-serif text-base font-bold text-[#000102] group-hover:text-[#775a00] transition-colors leading-snug cursor-pointer line-clamp-2"
                        >
                          {product.title}
                        </h3>
                        <p className="text-xs text-[#45474b] line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Real Finish Material Swatches */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] uppercase font-bold text-[#76777b]">Finishes:</span>
                        <div className="flex items-center gap-1.5">
                          {product.finishes.map((f, i) => (
                            <span
                              key={i}
                              className="w-4 h-4 rounded-full shadow-sm border border-black/15 cursor-pointer hover:scale-110 transition-transform"
                              style={{ backgroundColor: f.color }}
                              title={f.name}
                            ></span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Price & Action Triggers Well */}
                    <div className="flex flex-col gap-3 pt-3 mt-3 bg-[#f7f3ed]/60 -mx-4 -mb-4 p-4 rounded-b-2xl border-t border-[#e6e2dc]">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-lg font-bold text-[#000102]">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-[#76777b]"> / {product.unit}</span>
                        </div>
                        <span className="text-[10px] text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded font-semibold">
                          {product.stockStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            onAddToCart(product);
                            onToast(`Added ${product.code} to your wholesale order list.`);
                          }}
                          className="flex items-center justify-center gap-1 bg-[#000102] hover:bg-[#2A2D34] text-white py-2 px-3 rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                          <span>Add to Order</span>
                        </button>
                        <a
                          href={getWhatsAppLink(`Interested in ${product.code} ${product.title} at wholesale rate INR ${product.price}`)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1 bg-[#25D366] hover:bg-[#128C7E] text-white py-2 px-3 rounded-lg text-xs font-semibold transition-all shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[16px]">chat</span>
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}

                {/* WHOLESALE BULK PROJECT CALLOUT CARD */}
                <article className="bg-[#1a1c20] text-white rounded-2xl p-6 shadow-md border border-white/10 flex flex-col justify-between">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffdf98]">
                        Turnkey Setup Assistance
                      </span>
                      <span className="material-symbols-outlined text-[24px] text-[#fece57]">domain_verification</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <h3 className="font-serif text-lg font-bold text-white">
                        Need 10+ Racks or Complete Showroom Fitting?
                      </h3>
                      <p className="text-xs text-[#c6c6cb] leading-relaxed">
                        Get our wholesale slab rates with up to 25% trade margin for retail contractors, architects, and multi-outlet brand expansion.
                      </p>
                    </div>

                    {/* Tier Mini Breakdown */}
                    <div className="bg-black/40 p-3.5 rounded-xl flex flex-col gap-2 text-xs border border-white/10">
                      <div className="flex justify-between text-[#c6c6cb]">
                        <span>1 – 4 Units</span>
                        <span className="font-semibold text-white">Standard Wholesale</span>
                      </div>
                      <div className="flex justify-between text-[#ffdf98] font-medium">
                        <span>5 – 19 Units</span>
                        <span className="font-bold">12% Flat Discount</span>
                      </div>
                      <div className="flex justify-between text-[#25D366] font-bold">
                        <span>20+ Units (Full Store)</span>
                        <span>25% Slab + Free Logistics</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => setActiveView('custom-quote')}
                      className="w-full flex items-center justify-center gap-2 bg-[#775a00] hover:bg-[#5a4300] text-white py-2.5 rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                      <span>Get B2B Project Quote</span>
                    </button>
                  </div>
                </article>
              </div>
            ) : (
              /* DENSE SPECIFICATION TABLE VIEW */
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e6e2dc] overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f7f3ed] text-[#45474b] font-bold uppercase text-[10px] tracking-wider border-b border-[#e6e2dc]">
                    <tr>
                      <th className="p-3">Product Name &amp; Code</th>
                      <th className="p-3">Finish &amp; Spec</th>
                      <th className="p-3">Load Capacity</th>
                      <th className="p-3">MOQ</th>
                      <th className="p-3">Wholesale Rate</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1ede7]">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#fdf9f3] transition-colors">
                        <td className="p-3 font-semibold text-[#000102]">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.title} className="w-10 h-10 object-cover rounded-lg border border-[#e6e2dc]" />
                            <div>
                              <span className="block">{p.title}</span>
                              <span className="text-[10px] text-[#76777b] font-mono">{p.code}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-[#45474b]">{p.finish}</td>
                        <td className="p-3 font-bold text-[#775a00]">{p.loadCapacity}</td>
                        <td className="p-3 text-[#76777b]">{p.moq}</td>
                        <td className="p-3 font-bold text-sm text-[#000102]">
                          ₹{p.price.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              onAddToCart(p);
                              onToast(`Added ${p.code} to Order List`);
                            }}
                            className="bg-[#000102] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#2A2D34]"
                          >
                            Add to Order
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#e6e2dc]">
              <span className="text-xs text-[#76777b]">
                Showing {filteredProducts.length} of 34 floor fixture units in Hyderabad depot
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <button disabled className="px-3 py-1.5 rounded-lg bg-[#f1ede7] text-[#76777b] opacity-50 cursor-not-allowed">
                  Previous
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-[#000102] text-white font-semibold">1</button>
                <button className="px-3 py-1.5 rounded-lg bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18]">2</button>
                <button className="px-3 py-1.5 rounded-lg bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18]">3</button>
                <button className="px-3 py-1.5 rounded-lg bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18]">Next</button>
              </div>
            </div>
          </main>
        </div>
      </section>

      {/* Technical Store Fit Guidance & System Comparison Section */}
      <section className="w-full bg-[#f7f3ed] px-4 lg:px-8 py-12 border-t border-[#e6e2dc] mt-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-1 max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#775a00]">
              Engineering Guide &amp; Store Planning
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#000102]">
              How to Choose the Right Rack System for Your Garment Store
            </h2>
            <p className="text-xs sm:text-sm text-[#45474b]">
              Structural comparison between Single Pipe, Triple Pipe, and 4-Way Bumper stands to balance visual aesthetic appeal with merchandise floor density.
            </p>
          </div>

          {/* Comparison Matrix Table */}
          <div className="w-full overflow-x-auto bg-[#ffffff] rounded-2xl shadow-sm border border-[#e6e2dc]">
            <table className="w-full text-left text-xs text-[#1c1c18]">
              <thead className="bg-[#f7f3ed] text-[10px] font-bold uppercase tracking-wider text-[#45474b] border-b border-[#e6e2dc]">
                <tr>
                  <th className="p-4">Fixture Type</th>
                  <th className="p-4">Best Garment Category</th>
                  <th className="p-4">Recommended Aisle Placement</th>
                  <th className="p-4">Max Load Rating</th>
                  <th className="p-4">Merchandise Capacity</th>
                  <th className="p-4">Factory Weld Material</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1ede7]">
                <tr className="hover:bg-[#fdf9f3] transition-colors">
                  <td className="p-4 font-bold text-[#000102] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#775a00] text-[18px]">view_column</span>
                    <span>Triple Pipe Island Rack</span>
                  </td>
                  <td className="p-4">Heavy Sarees, Designer Kurtis, Suiting &amp; Denim</td>
                  <td className="p-4">Showroom Center Floors &amp; Island Breaks</td>
                  <td className="p-4 font-bold text-[#000102]">120 kg – 150 kg</td>
                  <td className="p-4">60 – 80 Garments</td>
                  <td className="p-4 text-[#45474b]">1.6mm MS Steel / 304 SS</td>
                </tr>
                <tr className="bg-[#fdf9f3]/60 hover:bg-[#fdf9f3] transition-colors">
                  <td className="p-4 font-bold text-[#000102] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#775a00] text-[18px]">line_style</span>
                    <span>Single Rail Minimalist Stand</span>
                  </td>
                  <td className="p-4">Bridal Gowns, Long Anarkalis, Premium Lehengas</td>
                  <td className="p-4">Feature Focal Points &amp; Window Display</td>
                  <td className="p-4 font-bold text-[#000102]">50 kg – 75 kg</td>
                  <td className="p-4">20 – 25 Pieces</td>
                  <td className="p-4 text-[#45474b]">PVD Coated Stainless Steel</td>
                </tr>
                <tr className="hover:bg-[#fdf9f3] transition-colors">
                  <td className="p-4 font-bold text-[#000102] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#775a00] text-[18px]">reorder</span>
                    <span>4-Way Stepped Bumper Stand</span>
                  </td>
                  <td className="p-4">Shirts, Trousers, Kidswear, Promotional Sales</td>
                  <td className="p-4">End Caps &amp; High Traffic Walkways</td>
                  <td className="p-4 font-bold text-[#000102]">80 kg – 100 kg</td>
                  <td className="p-4">48 – 60 Pieces</td>
                  <td className="p-4 text-[#45474b]">Cold Rolled Commercial Pipe</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 3 Key Store Fit Principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#ffffff] p-5 rounded-2xl shadow-sm border border-[#e6e2dc] flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#000102]">
                <span className="material-symbols-outlined text-[20px] text-[#775a00]">straighten</span>
                <h3 className="font-serif text-base font-bold">Aisle Clearance Rule</h3>
              </div>
              <p className="text-xs text-[#45474b] leading-relaxed">
                Maintain a minimum 3.5ft (42 inches) walkway between perimeter wall channels and center floor island racks to accommodate smooth customer movement and full dress previews.
              </p>
            </div>

            <div className="bg-[#ffffff] p-5 rounded-2xl shadow-sm border border-[#e6e2dc] flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#000102]">
                <span className="material-symbols-outlined text-[20px] text-[#775a00]">layers</span>
                <h3 className="font-serif text-base font-bold">Finish Uniformity</h3>
              </div>
              <p className="text-xs text-[#45474b] leading-relaxed">
                Do not mix gloss chrome and champagne gold in the same sightline. Choose either full Matte Black for industrial aesthetics or Titanium Gold PVD for upscale bridal showrooms.
              </p>
            </div>

            <div className="bg-[#ffffff] p-5 rounded-2xl shadow-sm border border-[#e6e2dc] flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#000102]">
                <span className="material-symbols-outlined text-[20px] text-[#775a00]">local_shipping</span>
                <h3 className="font-serif text-base font-bold">Depot Pickups</h3>
              </div>
              <p className="text-xs text-[#45474b] leading-relaxed">
                Save on freight charges by collecting directly from our Ranigunj or Begum Bazaar facilities with your own mini-truck (Tata Ace / Ashok Leyland Dost).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Wholesale Order Preview Bar (Docked Above Bottom) */}
      <div className="fixed bottom-4 left-0 right-0 z-40 px-4 max-w-4xl mx-auto pointer-events-none">
        <div className="pointer-events-auto bg-[#1a1c20] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffdf98]/20 flex items-center justify-center text-[#ffdf98]">
              <span className="material-symbols-outlined text-[22px]">assignment</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm font-bold text-white">
                  Wholesale Order List: {cartCount} Items Selected
                </span>
                <span className="bg-[#25D366] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Ready
                </span>
              </div>
              <p className="text-xs text-[#c6c6cb]">
                Subtotal: <strong className="text-[#ffdf98] font-bold">₹{cartSubtotal.toLocaleString('en-IN')}</strong> (Excl. 18% GST &amp; Local Freight)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveView('quote-cart')}
              className="bg-white/15 hover:bg-white/25 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Review List
            </button>
            <a
              href={getWhatsAppLink(`Hi All Display, I have ${cartCount} items in my order list totalling INR ${cartSubtotal.toLocaleString('en-IN')}. Please confirm stock and provide tax invoice.`)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Export Order to WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
