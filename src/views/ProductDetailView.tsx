import React, { useState } from 'react';
import { ActiveView, Product, CartItem, ProjectReel } from '../types';
import { getWhatsAppLink } from '../utils/whatsapp';

interface ProductDetailViewProps {
  onNavigate: (view: ActiveView) => void;
  onAddToCart: (item: Omit<CartItem, 'id'>, qty: number) => void;
  onOpenCad: () => void;
  onOpenReel: (reel?: ProjectReel) => void;
  onSelectProduct?: (productId: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  onNavigate,
  onAddToCart,
  onOpenCad,
  onOpenReel,
}) => {
  // Gallery states
  const galleryImages = [
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXybVXMlvZGeKYb_0JXEtHxZmiY36LraReoSDO2Auwjuyr6Nr9AmLN02CqnVSfW5qty_u1k1zBD3_8xhryMVP33uzyGFfJT-Irp_zV2RwgYU3JRLGf_A_X5jCoLJ4YtNB_MLXGfONPve3BhVwvtJJNkGZE4FJ2H53n7H1J-0lWZWLhZREwRq9q-GBEXPajJREpKLmpuAXp1s4ZoBzc79alpLRtJ6Es_FBOpz6L-smTtuCpCvs9H85f',
      alt: 'Showroom photograph of All Display heavy-duty triple pipe rack system with white powder-coated uprights and tempered glass shelves.'
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGPBK7sJPZ_lMG2-pGGpgJHoz_4ShqIY8tONZyTcsNrVvt8V6JHVMMHJD4jc5QTyeIFwIehUypxp0mA2dqEW0FevPhZUc8Cmz2ApgwTCXC2N_4d_1FKpT9pMGAUGztngfEgaYKCny8TwVDcXlP95x0GPsBMSOpdReilT9cYi7igcTfe1CByuOqVnppxv8w2p_v5oXFY-VoFjEfZE_38Bd_B7qGApKBZbBUyEytApduHmabb9EXYe6w',
      alt: 'Front view angle of commercial triple pipe floor standing display rack with glass shelves and clothes hanging rod.'
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeyRngn-txXSiqRPu1Qj0Mbwcq5KMUMOg8k6Zy1VnwfiSd9ghatzp9o9deTDByF_ZkrrWaUZCHHpefZmTX4_ua9pivSn_z65FjayJFW5nO0bvkuQjK0tKRKQDATBAtSoOG010HECGDjCBhYHEwMV64NYVY890XdAPlRlIC7KJ6A4VMuLMhVluJ0KiWSDQzZvemOLCSRr2-0k4uReE14dxNJemMx-hIJeuUijVVJqjUi8mPVXd1kF0n',
      alt: 'Close up architectural detail of laser-cut slot channel on triple pipe rack showing heavy steel gauge.'
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbwzfrTTu0OfTFIr-PYGL9__TTmRXBivUeVbNEvMxYUJXsFHWf1mdPefqkPTHdeluxlux2_GwB4KqER25Xd65v8FnXjRzt5mcD_0hByxXIMqoXdhlZ0nFuiIiJZnWy1KRlZKhek5mOcvxq2ZTOpUh8_IH7s_1l0wv4cztD6pfdC1Qy7PO6OY72GU-tzkE-CHolLytc_OwUs8sN1aRnddSWf7CHTQRFB0bimu7US6JHWl6qD5wwNIXb',
      alt: 'Store interior view showing four units of triple pipe racks aligned as island displays in a Hyderabad boutique.'
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_IZnN4pkTwYSgv741rybMBy0lCjl48qxBpbEi7NZLqfNze1ewS158M_DA7A5mNayY60oHGc-6suUp2lXF74YIw-mtCBeoRQ5oOElriMThbZTyzDytzP9zES4p54XYpSjTRjl9yQhZ-fni-K5Mnl52U9Hs3qyIA6rtdOHG8wssUYtNUAF1wmzW3EBfnzWWM9Qe1Q5DHUeCXeV_emmVYLB8PRCCl3TdPDhVQ9sivfynls8tbZSt2quP',
      alt: 'Triple pipe rack finished in PVD brushed titanium champagne gold finish with smoked bronze glass shelves.'
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8nH_WP56EObN4WQ1Tas5wrjzJ1ACv_1ZMR-29Lc5pChaSfa6Q04oDFbcsJfn8PICJjdtSL-G7ocAd1joSE7lAW7sdeWxA5S3l_HChA-E8Wb5HKDFSiEAuYiBlKA1FU_1Dkc3RFmOEnt13Dh7bA5luL8y2DNtkJG-w7wCvFKzqUdkrTWJy6KV0pIrLKtSTX1oJW-aOX8qpRlRFGuKnJRjEkBZtpLmrwId3_-VkMIc_zzbUp3FtorOD',
      alt: 'CAD engineering schematic blueprint of the triple pipe rack showing millimetric dimensions 1800mm x 1200mm x 450mm.'
    }
  ];

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Configuration options
  const [selectedTier, setSelectedTier] = useState<number>(4); // default 4 units tier
  const [quantity, setQuantity] = useState<number>(4);

  const finishes = [
    { id: 'matte-black', name: 'Industrial Matte Black', color: '#1A1C20', extra: 0, label: 'Matte Black' },
    { id: 'pvd-gold', name: 'Brushed Champagne Gold (PVD +₹600)', color: '#D4AF37', extra: 600, label: 'PVD Gold (+₹600)' },
    { id: 'gloss-white', name: 'Clean Gloss Architectural White', color: '#EAEBED', extra: 0, label: 'Gloss White' },
    { id: 'mirror-chrome', name: 'Mirror Chrome Plating (+₹450)', color: '#C2C7CF', extra: 450, label: 'Chrome (+₹450)' },
  ];
  const [selectedFinish, setSelectedFinish] = useState(finishes[0]);

  const heights = [
    { id: '5.5ft', name: '5.5 Ft (3 Tiers + Glass Deck)', extra: 0, desc: '3 Tiers + Deck' },
    { id: '6.5ft', name: '6.5 Ft (4 Tiers High Capacity +₹350)', extra: 350, desc: '4 Tiers (+₹350)' },
    { id: 'custom', name: 'Custom Architectural Fit-Out', extra: 800, desc: 'Built to Ceiling' },
  ];
  const [selectedHeight, setSelectedHeight] = useState(heights[0]);

  const gauges = [
    { id: '1.6mm', name: '1.6mm Commercial Heavy Gauge', extra: 0, desc: 'Recommended for Western Shirts, T-Shirts & Trousers (100kg load)' },
    { id: '2.0mm', name: '2.0mm Heavy Duty Reinforced (+₹250)', extra: 250, desc: 'Recommended for Heavy Silk Sarees, Sherwanis & Lehengas (160kg load)' },
  ];
  const [selectedGauge, setSelectedGauge] = useState(gauges[0]);

  // Active technical tab
  const [activeTab, setActiveTab] = useState<'specs' | 'store-fit' | 'shipping' | 'assembly'>('specs');
  const [isAddedToast, setIsAddedToast] = useState(false);

  // Determine base tier price based on current quantity
  const getBaseUnitPrice = (qty: number) => {
    if (qty >= 10) return 3450;
    if (qty >= 4) return 3850;
    return 4250;
  };

  const currentBasePrice = getBaseUnitPrice(quantity);
  const totalUnitPrice = currentBasePrice + selectedFinish.extra + selectedHeight.extra + selectedGauge.extra;
  const calculatedTotal = totalUnitPrice * quantity;

  const handleQtyChange = (delta: number) => {
    const newQty = Math.max(1, quantity + delta);
    setQuantity(newQty);
  };

  const handleTierClick = (qty: number) => {
    setSelectedTier(qty);
    setQuantity(qty);
  };

  const handleAddToCart = () => {
    onAddToCart({
      productId: 'ad-tpr-739',
      sku: 'AD-TPR-739',
      title: 'Triple Pipe Commercial Rack System',
      image: galleryImages[0].url,
      unitPrice: totalUnitPrice,
      quantity: quantity,
      moq: 1,
      unitLabel: 'units',
      finish: selectedFinish.name,
      sizeOrSpec: selectedHeight.name,
      gauge: selectedGauge.name,
      packingType: 'Standard Flat-Pack Wooden Crate (Export Grade)'
    }, quantity);

    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 3000);
  };

  const whatsappMessage =
    `Hi All Display Hyderabad, I want to place a B2B wholesale order for ${quantity} units of Triple Pipe Rack System (AD-TPR-739) with:\n- Finish: ${selectedFinish.name}\n- Height: ${selectedHeight.name}\n- Gauge: ${selectedGauge.name}\n- Unit Price: ₹${totalUnitPrice.toLocaleString('en-IN')}\n- Total: ₹${calculatedTotal.toLocaleString('en-IN')}\nPlease confirm dispatch schedule from Ranigunj depot.`;

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {isAddedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-[#25D366] text-[22px]">check_circle</span>
          <div>
            <div className="font-semibold text-sm">Added to B2B Order List!</div>
            <div className="text-xs text-outline-variant">{quantity} units @ ₹{totalUnitPrice.toLocaleString('en-IN')}/unit</div>
          </div>
          <button 
            onClick={() => onNavigate('quote-cart')}
            className="ml-2 text-xs font-bold text-secondary underline hover:text-white"
          >
            View Manifest →
          </button>
        </div>
      )}

      {/* Top Breadcrumb & Live Inventory Indicator Bar */}
      <div className="w-full bg-surface-container-low border-b border-surface-container py-3">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-wrap items-center justify-between gap-2 text-body-sm">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-on-surface-variant text-xs">
            <button onClick={() => onNavigate('home')} className="hover:text-primary transition-colors">Home</button>
            <span className="text-outline-variant text-[10px]">/</span>
            <button onClick={() => onNavigate('racks-floor-stands')} className="hover:text-primary transition-colors">Floor Stands &amp; Racks</button>
            <span className="text-outline-variant text-[10px]">/</span>
            <span className="text-on-surface font-semibold">Triple Pipe Rack System (Floor Standing &amp; Island)</span>
          </nav>
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-semibold uppercase text-[10px]">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
              In Stock: Ranigunj Warehouse (84 Units Ready)
            </span>
            <span className="hidden md:inline text-on-surface-variant font-mono">SKU: AD-TPR-739</span>
          </div>
        </div>
      </div>

      {/* Primary Product Section (Split Studio Gallery + Commercial Configurator) */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Architectural Gallery & Video Reels (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Media Frame */}
            <div className="relative w-full aspect-[4/4] sm:aspect-[4/3.5] bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex items-center justify-center group border border-surface-container">
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="bg-primary text-on-primary px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-sm">
                  Factory Direct • B2B Grade
                </span>
                <span className="bg-surface-container-highest/90 backdrop-blur-sm text-on-surface px-2.5 py-1 rounded text-xs font-semibold uppercase">
                  140 KG Tested Capacity
                </span>
              </div>
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button 
                  onClick={onOpenCad}
                  className="w-10 h-10 rounded-lg bg-surface/90 hover:bg-surface text-on-surface flex items-center justify-center shadow-md transition-all hover:scale-105" 
                  title="View CAD Structural Diagram"
                >
                  <span className="material-symbols-outlined text-[20px]">architecture</span>
                </button>
              </div>

              {/* Main Display Image */}
              <img 
                src={galleryImages[activeImgIndex].url}
                alt={galleryImages[activeImgIndex].alt}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02]" 
              />

              {/* Reel Overlay Trigger Bar */}
              <div className="absolute bottom-4 left-4 right-4 bg-primary/90 backdrop-blur-md rounded-lg p-3 text-on-primary flex items-center justify-between transition-transform duration-200 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm leading-tight text-white">Workshop Assembly &amp; Load Demo Video</span>
                    <span className="text-white/70 text-xs">45 sec reel filmed at Begum Bazaar store setup</span>
                  </div>
                </div>
                <button 
                  onClick={() => onOpenReel()}
                  className="px-3.5 py-1.5 rounded bg-surface text-primary font-bold text-xs hover:bg-surface-variant transition-colors"
                >
                  Watch Reel
                </button>
              </div>
            </div>

            {/* Thumbnail Strip & Finish Angles */}
            <div className="grid grid-cols-6 gap-2.5">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`aspect-square rounded-lg overflow-hidden bg-surface-container p-0.5 shadow-sm transition-all ${
                    activeImgIndex === idx 
                      ? 'ring-2 ring-primary ring-offset-1 opacity-100' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover rounded-md" />
                </button>
              ))}
            </div>

            {/* Factory Guarantee Banner */}
            <div className="bg-surface-container-low p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 border border-surface-container">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-[32px]">verified_user</span>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-primary">5-Year Structural Defect Warranty</span>
                  <span className="text-on-surface-variant text-xs">Precision MIG welded ERW pipe frame • Zero sag guaranteed</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant text-xs uppercase tracking-wider font-semibold bg-surface-container px-2.5 py-1 rounded">
                  BIS Standard Mild Steel
                </span>
              </div>
            </div>
          </div>

          {/* Right: Commercial Configurator & Instant Wholesale Quote (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Header Info */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-widest text-secondary">
                  Hyderabad Factory Original
                </span>
                <div className="flex items-center gap-1 text-[#ffb800]">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-bold text-on-surface text-sm">4.9</span>
                  <span className="text-on-surface-variant text-xs">(180+ South India Showrooms Fitted)</span>
                </div>
              </div>
              <h1 className="font-serif text-2xl lg:text-3xl font-bold text-primary tracking-tight">
                Commercial Heavy-Duty Triple Pipe Rack System
              </h1>
              <p className="text-sm text-on-surface-variant">
                Architectural freestanding island &amp; floor-to-wall modular display rack. Engineered for high-density denim stacks, shirts, and heavy traditional bridalwear lehengas.
              </p>
            </div>

            {/* Wholesale Tiered Pricing Panel */}
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-surface-container flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1 border-b border-surface-container">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Wholesale Tiered Pricing (Direct Ex-Factory)
                </span>
                <span className="text-xs font-semibold text-secondary">GST Invoice Included</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div 
                  onClick={() => handleTierClick(1)}
                  className={`p-2.5 rounded-lg transition-all cursor-pointer ${
                    quantity < 4 
                      ? 'bg-surface-container-lowest ring-2 ring-primary shadow-sm' 
                      : 'bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold text-on-surface-variant">1 – 3 Units</div>
                  <div className="font-serif text-lg font-bold text-primary my-0.5">₹4,250</div>
                  <div className="text-[11px] text-on-surface-variant">Sample / Retail</div>
                </div>
                
                <div 
                  onClick={() => handleTierClick(6)}
                  className={`p-2.5 rounded-lg transition-all cursor-pointer relative ${
                    quantity >= 4 && quantity < 10 
                      ? 'bg-surface-container-lowest ring-2 ring-secondary shadow-sm' 
                      : 'bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                    Popular
                  </div>
                  <div className="text-[10px] uppercase font-bold text-secondary">4 – 9 Units</div>
                  <div className="font-serif text-lg font-bold text-primary my-0.5">₹3,850</div>
                  <div className="text-[11px] text-secondary font-semibold">Save 10%</div>
                </div>

                <div 
                  onClick={() => handleTierClick(12)}
                  className={`p-2.5 rounded-lg transition-all cursor-pointer ${
                    quantity >= 10 
                      ? 'bg-surface-container-lowest ring-2 ring-primary shadow-sm' 
                      : 'bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold text-on-surface-variant">10+ Units</div>
                  <div className="font-serif text-lg font-bold text-primary my-0.5">₹3,450</div>
                  <div className="text-[11px] text-secondary font-bold">Save 19% (Full Store)</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 px-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">local_shipping</span>
                  Dispatch from Ranigunj / Begum Bazaar
                </span>
                <span>Excl. State Freight &amp; Crate</span>
              </div>
            </div>

            {/* Interactive Spec Selectors */}
            <div className="flex flex-col gap-4">
              {/* 1. Finish & Electroplating */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary">1. Architectural Frame Finish</span>
                  <span className="text-secondary font-semibold">{selectedFinish.name}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {finishes.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFinish(f)}
                      className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                        selectedFinish.id === f.id
                          ? 'bg-surface-container-lowest shadow-sm ring-2 ring-primary'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: f.color }}></span>
                      <span className="text-[11px] font-semibold text-on-surface leading-tight">
                        {f.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Height & Configuration */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary">2. Frame Height &amp; Tier Level</span>
                  <span className="text-secondary font-semibold">{selectedHeight.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {heights.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setSelectedHeight(h)}
                      className={`p-2.5 rounded-lg text-center transition-all ${
                        selectedHeight.id === h.id
                          ? 'bg-surface-container-lowest shadow-sm ring-2 ring-primary'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="text-xs font-bold text-primary">{h.name.split(' (')[0]}</div>
                      <div className="text-[10px] text-on-surface-variant mt-0.5">{h.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Steel Gauge / Load Spec */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary">3. Pipe Gauge / Steel Thickness</span>
                  <span className="text-on-surface-variant uppercase text-[10px] font-semibold">All Display Tested</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {gauges.map((g) => (
                    <label
                      key={g.id}
                      onClick={() => setSelectedGauge(g)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all ${
                        selectedGauge.id === g.id
                          ? 'bg-surface-container-lowest shadow-sm ring-2 ring-primary'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="steel-gauge"
                        checked={selectedGauge.id === g.id}
                        onChange={() => setSelectedGauge(g)}
                        className="mt-0.5 accent-primary"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-primary leading-tight">{g.name}</span>
                        <span className="text-[10px] text-on-surface-variant mt-0.5 leading-snug">{g.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity & Calculated Total */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center bg-surface-container-lowest border border-surface-container rounded-lg p-1 shadow-sm">
                <button 
                  onClick={() => handleQtyChange(-1)}
                  className="w-8 h-8 rounded flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <input 
                  type="number"
                  min="1"
                  max="500"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center bg-transparent border-0 font-bold text-on-surface focus:outline-none text-sm"
                />
                <button 
                  onClick={() => handleQtyChange(1)}
                  className="w-8 h-8 rounded flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
              <div className="flex flex-col">
                <span className="uppercase text-[10px] font-bold text-on-surface-variant tracking-wider">Estimated Ex-Depot Total</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl font-bold text-primary">₹{calculatedTotal.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-on-surface-variant">({quantity} Units @ ₹{totalUnitPrice.toLocaleString('en-IN')}/unit)</span>
                </div>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-col gap-2.5">
              <a 
                href={getWhatsAppLink(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-lg bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center gap-2 font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>Direct WhatsApp Order &amp; Proforma Invoice</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleAddToCart}
                  className="py-3 px-3 rounded-lg bg-primary hover:bg-[#2A2D34] text-on-primary flex items-center justify-center gap-1.5 font-bold text-xs transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">playlist_add</span>
                  <span>Add to B2B Order List</span>
                </button>
                <button 
                  onClick={onOpenCad}
                  className="py-3 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center gap-1.5 font-bold text-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">draft</span>
                  <span>Custom Size &amp; 3D CAD</span>
                </button>
              </div>
            </div>

            {/* Wholesale Commercial Terms Callout */}
            <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-1.5 text-xs border border-surface-container">
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="material-symbols-outlined text-[18px] text-secondary">account_balance_wallet</span>
                <span>Strict B2B Commercial Payment Terms</span>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                100% advance payment via RTGS / NEFT / UPI before dispatch from Hyderabad warehouse. No Cash On Delivery (COD). Store owners or retail architects can request a video inspection call prior to final packaging and vehicle handoff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Feature Break: Instagram Store Installation Spotlight */}
      <section className="w-full bg-surface-container-low py-12 my-6 border-y border-surface-container">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                <span>Live Hyderabad Boutique Installations</span>
              </div>
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-primary">
                Installed in Over 180 Boutiques Across South India
              </h2>
            </div>
            <a 
              href="https://instagram.com/all_display_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:underline"
            >
              <span>Follow @all_display_ on Instagram for Daily Fit-Out Videos</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>

          {/* Feature Banner with client Instagram photo */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-primary shadow-lg">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMHt9FXjCzLJDhUNmKJgOwSMNCAPstDkmPgnqSFY2uzUAYonR1oII70W8SDnVTX3HmYPpS9FvAYjTQkPoub2wqjSQ-Nb335vHgxWqt6hODQqtmThm9RFeJ8yEo78d48rrcWGHang-aHC0dyeUpbhLDsi6wexeBYSg5sv6Oe0hUmmxFQ1JP1e9N2Io46w75v4OxUTgfHNAghX26PX-4epFoWyQpSX4vPu2KbUywqF0Q1KSptsD14nWSTgbWZSipoCfiPg" 
              alt="All Display Instagram installation post showcasing modern wall channel fixtures and shelf hanging rods in boutique garment shop"
              className="w-full h-[320px] sm:h-[400px] object-cover opacity-85 hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent flex flex-col justify-end p-6 md:p-8 text-on-primary">
              <div className="max-w-2xl flex flex-col gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-secondary-fixed">
                  Hyderabad Flagship Project Archive
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Full Store Modular Fitting: Shirts, Folded Denims &amp; Cross-Hang Channels
                </h3>
                <p className="text-xs sm:text-sm text-surface-variant leading-relaxed">
                  Complete boutique setup executed within 48 hours utilizing AD-TPR-739 Triple Pipe Racks combined with our concealed heavy slotted wall systems in Banjara Hills, Hyderabad.
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <button 
                    onClick={() => onNavigate('custom-quote')}
                    className="px-4 py-2 rounded-lg bg-surface text-primary font-bold text-xs hover:bg-surface-variant transition-colors flex items-center gap-1.5 shadow"
                  >
                    <span className="material-symbols-outlined text-[18px]">storefront</span>
                    <span>Get Full Store Fit-Out Estimate</span>
                  </button>
                  <button 
                    onClick={() => onNavigate('shop-setup-projects')}
                    className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors backdrop-blur-sm"
                  >
                    View Project Reels
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Technical Tabs & Commercial Fit-Out Guide */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8 w-full">
        {/* Tab Controls */}
        <div className="flex items-center gap-2 pb-4 overflow-x-auto border-b border-surface-container">
          <button 
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors whitespace-nowrap ${
              activeTab === 'specs' 
                ? 'bg-primary text-on-primary shadow-sm' 
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Technical Specs &amp; Engineering CAD
          </button>
          <button 
            onClick={() => setActiveTab('store-fit')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors whitespace-nowrap ${
              activeTab === 'store-fit' 
                ? 'bg-primary text-on-primary shadow-sm' 
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Retail Merchandising &amp; Aisle Guide
          </button>
          <button 
            onClick={() => setActiveTab('shipping')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors whitespace-nowrap ${
              activeTab === 'shipping' 
                ? 'bg-primary text-on-primary shadow-sm' 
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Pan-India Packing &amp; Freight Logistics
          </button>
          <button 
            onClick={() => setActiveTab('assembly')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors whitespace-nowrap ${
              activeTab === 'assembly' 
                ? 'bg-primary text-on-primary shadow-sm' 
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            10-Minute Boltless Assembly
          </button>
        </div>

        {/* Tab 1: Engineering Specs Content */}
        {activeTab === 'specs' && (
          <div className="flex flex-col gap-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Architectural Parameters Card */}
              <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-surface-container flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-secondary text-[22px]">square_foot</span>
                  <h4 className="font-bold text-sm">Millimetric Dimensions</h4>
                </div>
                <div className="flex flex-col divide-y divide-surface-container text-xs">
                  <div className="flex justify-between py-2">
                    <span className="text-on-surface-variant">Standard Height</span>
                    <span className="font-semibold text-primary font-mono">1675 mm (5.5 Ft) / 1980 mm (6.5 Ft)</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-on-surface-variant">Frame Width / Length</span>
                    <span className="font-semibold text-primary font-mono">1200 mm (4.0 Ft Bay)</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-on-surface-variant">Shelf Depth</span>
                    <span className="font-semibold text-primary font-mono">380 mm (Glass) / 450 mm (Base)</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-on-surface-variant">Floor Clearance</span>
                    <span className="font-semibold text-primary font-mono">100 mm (Cleanable beneath)</span>
                  </div>
                </div>
              </div>

              {/* Material & Load Capacity */}
              <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-surface-container flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-secondary text-[22px]">fitness_center</span>
                  <h4 className="font-bold text-sm">Material &amp; Structural Load</h4>
                </div>
                <div className="flex flex-col divide-y divide-surface-container text-xs">
                  <div className="flex justify-between py-2">
                    <span className="text-on-surface-variant">Steel Alloy</span>
                    <span className="font-semibold text-primary">Cold Rolled Mild Steel (IS 513)</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-on-surface-variant">Wall Thickness</span>
                    <span className="font-semibold text-primary font-mono">1.6 mm / 2.0 mm (Reinforced ERW)</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-on-surface-variant">Hanging Bar Capacity</span>
                    <span className="font-semibold text-primary">60 kg continuous distributed</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-on-surface-variant">Total Frame Load</span>
                    <span className="font-bold text-secondary">140 kg certified safe capacity</span>
                  </div>
                </div>
              </div>

              {/* Surface Coating & Glass */}
              <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-surface-container flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-secondary text-[22px]">format_paint</span>
                  <h4 className="font-bold text-sm">Finishing &amp; Shelving</h4>
                </div>
                <div className="flex flex-col divide-y divide-surface-container text-xs">
                  <div className="flex justify-between py-2">
                    <span className="text-on-surface-variant">Powder Coating</span>
                    <span className="font-semibold text-primary">7-Tank Treated 80µm Epoxy</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-on-surface-variant">Gold Option</span>
                    <span className="font-semibold text-primary">Titanium PVD Vacuum Deposition</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-on-surface-variant">Glass Spec</span>
                    <span className="font-semibold text-primary">8mm Toughened Polished Glass</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-on-surface-variant">Leveling Glides</span>
                    <span className="font-semibold text-primary">M8 Threaded Brass-Capped Feet</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CAD Dimension Card */}
            <div className="bg-surface-container p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-surface-container">
              <div className="flex flex-col gap-2 max-w-lg">
                <span className="text-xs font-bold text-secondary uppercase tracking-widest">Architectural Blueprint Resource</span>
                <h4 className="font-serif text-xl font-bold text-primary">Download Free DWG &amp; SketchUp 3D Assets</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Planning a multi-store rollout or boutique interior? Download exact scale CAD blocks (.dwg, .skp, .rvt) to drop the Triple Pipe Rack AD-TPR-739 directly into your 3ds Max or Revit layout models.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <a 
                    href={getWhatsAppLink('Please email me the DWG and 3D SketchUp file for Triple Pipe Rack AD-TPR-739.')}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-[#2A2D34] transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    <span>Download 3D CAD Bundle (.ZIP)</span>
                  </a>
                </div>
              </div>
              <div className="w-full md:w-80 p-4 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-2 font-mono text-[11px] text-on-surface-variant border border-surface-container">
                <div className="flex items-center justify-between text-primary font-bold border-b border-surface-container pb-2">
                  <span>MODEL: AD-TPR-739.DWG</span>
                  <span>SCALE: 1:1</span>
                </div>
                <div className="flex justify-between"><span>X (Length):</span><span className="font-semibold text-primary">1200 mm</span></div>
                <div className="flex justify-between"><span>Y (Depth):</span><span className="font-semibold text-primary">450 mm</span></div>
                <div className="flex justify-between"><span>Z (Height):</span><span className="font-semibold text-primary">1675 mm / 1980 mm</span></div>
                <div className="flex justify-between"><span>Tube OD:</span><span className="font-semibold text-primary">Ø 25.4 mm (1" Seamless)</span></div>
                <div className="flex justify-between text-secondary"><span>Slot Pitch:</span><span>25 mm Universal Center</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Retail Merchandising */}
        {activeTab === 'store-fit' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-surface-container flex flex-col gap-2">
              <span className="text-[10px] font-bold text-secondary uppercase">Recommended Retail Categories</span>
              <h4 className="font-serif text-base font-bold text-primary">Denim &amp; Menswear Boutiques</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Top 2 glass shelves fit up to 36 folded denim pairs per bay without sagging. Middle hanging bar holds 40+ casual button-down shirts or polos on 42cm wooden hangers.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-surface-container flex flex-col gap-2">
              <span className="text-[10px] font-bold text-secondary uppercase">Aisle Clearance Standard</span>
              <h4 className="font-serif text-base font-bold text-primary">900mm – 1200mm Pathway</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                When deployed as a center island display, maintain a 3.5-foot perimeter walkway on both sides to ensure comfortable browsing for luxury retail customer flow.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-surface-container flex flex-col gap-2">
              <span className="text-[10px] font-bold text-secondary uppercase">Bridal &amp; Heavy Garments</span>
              <h4 className="font-serif text-base font-bold text-primary">2.0mm Reinforced Upgrade</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                For silk lehengas, Anarkali gowns, or winter sherwanis exceeding 2.5 kg per hanger, always specify the 2.0mm ERW steel tube upgrade to eliminate center bar flex.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Pan India Freight */}
        {activeTab === 'shipping' && (
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container flex flex-col gap-4 pt-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-[30px]">local_shipping</span>
              <div>
                <h4 className="font-bold text-sm text-primary">Dispatch from Hyderabad Wholesale Market Hub</h4>
                <p className="text-xs text-on-surface-variant">Direct warehouse transfers to local transporters (VRL, Navata, TCI, SafeXpress, Orange Cargo)</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
              <div className="bg-surface-container-low p-4 rounded-lg flex flex-col gap-1.5">
                <strong className="text-primary">Local Hyderabad &amp; Secunderabad:</strong>
                <p className="text-on-surface-variant">Same-day Tata Ace / Auto pickup from Ranigunj or Begum Bazaar godown. Direct vehicle loading by factory handlers.</p>
              </div>
              <div className="bg-surface-container-low p-4 rounded-lg flex flex-col gap-1.5">
                <strong className="text-primary">Telangana &amp; Andhra Pradesh:</strong>
                <p className="text-on-surface-variant">24-to-48 hours delivery to Vijayawada, Vizag, Guntur, Warangal, Karimnagar, Tirupati via Navata &amp; Kranti Roadlines.</p>
              </div>
              <div className="bg-surface-container-low p-4 rounded-lg flex flex-col gap-1.5">
                <strong className="text-primary">All-India Crating:</strong>
                <p className="text-on-surface-variant">5-layer heavy bubble wrapping + corrugated corner protectors. Export grade pinewood skeleton crates available for outstation rail &amp; road transit.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Assembly Guide */}
        {activeTab === 'assembly' && (
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container flex flex-col gap-4 pt-6">
            <div>
              <h4 className="font-bold text-base text-primary">10-Minute Boltless Modular Setup</h4>
              <p className="text-xs text-on-surface-variant mt-1">
                No skilled carpenter or welding equipment required on-site. The entire triple pipe frame breaks down into flat knock-down packages that fit in the boot of a standard car or local auto.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-surface-container-low rounded-lg">
                <span className="font-mono font-bold text-secondary text-base">01</span>
                <h5 className="font-bold text-xs text-primary mt-1">Base Leveling</h5>
                <p className="text-[11px] text-on-surface-variant mt-1">Set twin base legs on the floor and adjust threaded M8 brass feet to eliminate rocking.</p>
              </div>
              <div className="p-4 bg-surface-container-low rounded-lg">
                <span className="font-mono font-bold text-secondary text-base">02</span>
                <h5 className="font-bold text-xs text-primary mt-1">Interlock Uprights</h5>
                <p className="text-[11px] text-on-surface-variant mt-1">Slide vertical triple pipe pillars into precision machined bottom socket sleeves.</p>
              </div>
              <div className="p-4 bg-surface-container-low rounded-lg">
                <span className="font-mono font-bold text-secondary text-base">03</span>
                <h5 className="font-bold text-xs text-primary mt-1">Snap Shelf Brackets</h5>
                <p className="text-[11px] text-on-surface-variant mt-1">Insert cantilever shelf arms at desired height intervals along the slotted channel.</p>
              </div>
              <div className="p-4 bg-surface-container-low rounded-lg">
                <span className="font-mono font-bold text-secondary text-base">04</span>
                <h5 className="font-bold text-xs text-primary mt-1">Mount Glass &amp; Hang</h5>
                <p className="text-[11px] text-on-surface-variant mt-1">Affix suction silicon pads, rest 8mm toughened glass decks, and snap the garment hanging rod.</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Frequently Bundled Retail Fixtures (Coordinated Boutique Systems) */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10 w-full">
        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">hub</span>
            <span>Coordinated Boutique Systems</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-primary">Frequently Bundled Retail Fixtures</h2>
          <p className="text-xs text-on-surface-variant">Combine with identical powder coat or PVD finishes for unified retail boutique aesthetics.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Item 1 */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-3">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-surface-container-low relative">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbdDtclrOBfHzXaOEi5Y2SoKSrSbYFsmD2qhw7Sl27UuIHkGTBiBcxlED1KDX69qhX1gu_rC44LmWZZNMDa59VDsUxgThK4cUwpgh9XVSXTK5LzwxtJIvWAmtsn_RV2eMcvj1suzuKmQP_yvh9eCoa10UGh9XyQpopg_TIc6f7-hRG0Y2PSgKvohdZCFe7nSgQGSPV6SbOox02Iv_061sU7SeYGFxUFCg5MK8jlLjzYDzKSLyU28Bz" 
                  alt="Concealed slotted wall channel racks with wood laminate shelving and matte black hanging rods in clothing boutique."
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-surface/90 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase">Wall Mounted</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-on-surface-variant font-mono">Model: AD-WCR-520</span>
                <h3 className="font-bold text-sm text-primary group-hover:text-secondary transition-colors mt-0.5">
                  Slotted Wall Channel System (Rod &amp; Shelf)
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">Heavy gauge slot channels with cantilever glass/wood shelf brackets.</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-surface-container">
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase block font-semibold">Wholesale Rate</span>
                <span className="font-bold text-base text-primary">₹520 <span className="text-[10px] font-normal text-on-surface-variant">/ running ft</span></span>
              </div>
              <button 
                onClick={() => {
                  onAddToCart({
                    productId: 'ad-wcr-520',
                    sku: 'AD-WCR-520',
                    title: 'Slotted Wall Channel System',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbdDtclrOBfHzXaOEi5Y2SoKSrSbYFsmD2qhw7Sl27UuIHkGTBiBcxlED1KDX69qhX1gu_rC44LmWZZNMDa59VDsUxgThK4cUwpgh9XVSXTK5LzwxtJIvWAmtsn_RV2eMcvj1suzuKmQP_yvh9eCoa10UGh9XyQpopg_TIc6f7-hRG0Y2PSgKvohdZCFe7nSgQGSPV6SbOox02Iv_061sU7SeYGFxUFCg5MK8jlLjzYDzKSLyU28Bz',
                    unitPrice: 520,
                    quantity: 10,
                    moq: 10,
                    unitLabel: 'rft',
                    finish: 'Matte Black',
                    sizeOrSpec: '8ft Vertical Channel',
                    gauge: '1.6mm Cold Rolled',
                    packingType: 'Shrink-wrapped Bundle'
                  }, 10);
                  setIsAddedToast(true);
                  setTimeout(() => setIsAddedToast(false), 2500);
                }}
                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-colors shadow-sm"
                title="Add 10 rft to order"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              </button>
            </div>
          </div>

          {/* Item 2 */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-3">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-surface-container-low relative">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjsvmXZlohMZptyHS-gMam8Ct3W1nVaqsr_mc0zz2CFqebliYcutec3B9BqZlE6DXkvhqWI7GDLzzMYlG39q8zVA9hzToMg32UZPukc45kD7EsyTvVHGXhV2FwJETW4HGVdCH5tsOWaHksqiYH8uqi33EAjJs1Z1xhpkTxYcv-L-yfmtMf0mvfHtQanYLYdLU0NxlKlIok4FYgainzT43AvDWJaPz25hj292y3bKucJBicVMNTHk09" 
                  alt="Bumper display garment stand with heavy industrial wheels and matte black tubular steel frame."
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-surface/90 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase">100kg Load</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-on-surface-variant font-mono">Model: AD-BDS-260</span>
                <h3 className="font-bold text-sm text-primary group-hover:text-secondary transition-colors mt-0.5">
                  Heavy Duty Bumper Exhibition Stand
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">Portable exhibition clothing stand with lockable wheels &amp; reinforced bottom pipes.</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-surface-container">
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase block font-semibold">Wholesale Rate</span>
                <span className="font-bold text-base text-primary">₹2,650 <span className="text-[10px] font-normal text-on-surface-variant">/ unit</span></span>
              </div>
              <button 
                onClick={() => {
                  onAddToCart({
                    productId: 'ad-bds-260',
                    sku: 'AD-BDS-260',
                    title: 'Heavy Duty Bumper Exhibition Stand',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjsvmXZlohMZptyHS-gMam8Ct3W1nVaqsr_mc0zz2CFqebliYcutec3B9BqZlE6DXkvhqWI7GDLzzMYlG39q8zVA9hzToMg32UZPukc45kD7EsyTvVHGXhV2FwJETW4HGVdCH5tsOWaHksqiYH8uqi33EAjJs1Z1xhpkTxYcv-L-yfmtMf0mvfHtQanYLYdLU0NxlKlIok4FYgainzT43AvDWJaPz25hj292y3bKucJBicVMNTHk09',
                    unitPrice: 2650,
                    quantity: 1,
                    moq: 1,
                    unitLabel: 'unit',
                    finish: 'Industrial Black',
                    sizeOrSpec: '5ft Long x 5ft High',
                    gauge: '1.6mm ERW Tube',
                    packingType: 'Box Crate'
                  }, 1);
                  setIsAddedToast(true);
                  setTimeout(() => setIsAddedToast(false), 2500);
                }}
                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              </button>
            </div>
          </div>

          {/* Item 3 */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-3">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-surface-container-low relative">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbFMN45gZUvd-eGVPfvQ8iwZsWJF_409UyU6RZsSKqyhznNE8a78xL7neMrZ6m58B1KFp1EB8KGWLouMpxTKZW53przfuExdTMsPPbk7U1h3zN_nukTO2w97ji8oEM6dZlbIho3tWLYQXSBwUHgfI8LwFeV6TVcpsB8gnVjyNzsfFJsHL8JumJg0rFSX6Lfh-xbnYJpiQgxAob0vsj4xK2UyTj6cCukkqfqTEQ-M_jfuDXwkmhjUBr" 
                  alt="Wall mounted solid oak finished shelf with industrial matte black iron pipe hanging rod."
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-secondary text-on-secondary px-2 py-0.5 rounded text-[10px] font-bold uppercase">Hot Seller</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-on-surface-variant font-mono">Model: AD-WSH-145</span>
                <h3 className="font-bold text-sm text-primary group-hover:text-secondary transition-colors mt-0.5">
                  Natural Wood Shelf with Hanging Rod
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">Dual utility top wooden plank shelf for bags with lower hanger rod for apparel sets.</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-surface-container">
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase block font-semibold">Wholesale Rate</span>
                <span className="font-bold text-base text-primary">₹1,450 <span className="text-[10px] font-normal text-on-surface-variant">/ unit</span></span>
              </div>
              <button 
                onClick={() => {
                  onAddToCart({
                    productId: 'ad-wsh-145',
                    sku: 'AD-WSH-145',
                    title: 'Natural Wood Shelf with Hanging Rod',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbFMN45gZUvd-eGVPfvQ8iwZsWJF_409UyU6RZsSKqyhznNE8a78xL7neMrZ6m58B1KFp1EB8KGWLouMpxTKZW53przfuExdTMsPPbk7U1h3zN_nukTO2w97ji8oEM6dZlbIho3tWLYQXSBwUHgfI8LwFeV6TVcpsB8gnVjyNzsfFJsHL8JumJg0rFSX6Lfh-xbnYJpiQgxAob0vsj4xK2UyTj6cCukkqfqTEQ-M_jfuDXwkmhjUBr',
                    unitPrice: 1450,
                    quantity: 2,
                    moq: 2,
                    unitLabel: 'units',
                    finish: 'Natural Teak + Matte Black',
                    sizeOrSpec: '36" W x 12" D',
                    gauge: 'Solid Hardwood + ERW Rod',
                    packingType: 'Box Pack'
                  }, 2);
                  setIsAddedToast(true);
                  setTimeout(() => setIsAddedToast(false), 2500);
                }}
                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              </button>
            </div>
          </div>

          {/* Item 4 */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-3">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-surface-container-low relative">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3wT2dEWWiX7L8L83-7jR0xWJ_y9d_5Y3oA5-nUo9z0Xg9" 
                  alt="Luxury Lotus Wood Hangers with 360 degree gold swivel hook."
                  onError={(e)=>{ (e.target as HTMLImageElement).src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeyRngn-txXSiqRPu1Qj0Mbwcq5KMUMOg8k6Zy1VnwfiSd9ghatzp9o9deTDByF_ZkrrWaUZCHHpefZmTX4_ua9pivSn_z65FjayJFW5nO0bvkuQjK0tKRKQDATBAtSoOG010HECGDjCBhYHEwMV64NYVY890XdAPlRlIC7KJ6A4VMuLMhVluJ0KiWSDQzZvemOLCSRr2-0k4uReE14dxNJemMx-hIJeuUijVVJqjUi8mPVXd1kF0n'; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-surface/90 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase">Box of 50</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-on-surface-variant font-mono">Model: AD-HNG-50</span>
                <h3 className="font-bold text-sm text-primary group-hover:text-secondary transition-colors mt-0.5">
                  Lotus Wood Heavy Shoulder Hangers
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">Smooth natural lacquer finish with non-slip grooved bar and gold swivel hook.</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-surface-container">
              <div>
                <span className="text-[10px] text-on-surface-variant uppercase block font-semibold">Wholesale Rate</span>
                <span className="font-bold text-base text-primary">₹38 <span className="text-[10px] font-normal text-on-surface-variant">/ piece</span></span>
              </div>
              <a 
                href={getWhatsAppLink('Inquiring about Lotus Wood Hangers AD-HNG-50')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
