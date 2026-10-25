import React, { useState } from 'react';
import { ActiveView, CartItem } from '../types';

interface OrderListViewProps {
  onNavigate: (view: ActiveView) => void;
  cart: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onOpenProforma: () => void;
}

export const OrderListView: React.FC<OrderListViewProps> = ({
  onNavigate,
  cart,
  onUpdateQty,
  onRemoveItem,
  onOpenProforma
}) => {
  // Consignee state
  const [storeName, setStoreName] = useState('Kalyan Silks Boutique');
  const [proprietor, setProprietor] = useState('Rajesh Kalyan');
  const [whatsapp, setWhatsapp] = useState('9849023456');
  const [destination, setDestination] = useState('Vijayawada, AP');
  const [pincode, setPincode] = useState('520002');
  const [launchTimeline, setLaunchTimeline] = useState<'7days' | '15days' | 'nextmonth'>('7days');
  const [notes, setNotes] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Calculations
  const grossSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discountRate = grossSubtotal >= 50000 ? 0.15 : grossSubtotal >= 25000 ? 0.10 : 0;
  const discountAmount = Math.round(grossSubtotal * discountRate);
  const taxableAmount = grossSubtotal - discountAmount;
  const gstAmount = Math.round(taxableAmount * 0.18);
  const totalPayable = taxableAmount + gstAmount;

  // Next slab progress
  const progressPercent = Math.min(100, Math.round((grossSubtotal / 50000) * 100));

  const buildWhatsAppText = () => {
    const lines = cart.map(item => `- ${item.sku} ${item.title} (${item.finish}, ${item.sizeOrSpec}): ${item.quantity} ${item.unitLabel} @ ₹${item.unitPrice.toLocaleString('en-IN')} = ₹${(item.unitPrice * item.quantity).toLocaleString('en-IN')}`).join('\n');
    return `Hi All Display Team, I want to confirm Wholesale Order #AD-HYD-8492 for ${storeName} (${proprietor}, ${destination} - ${pincode}, Ph: +91 ${whatsapp}).\n\nItems:\n${lines}\n\nGross Subtotal: ₹${grossSubtotal.toLocaleString('en-IN')}\nVolume Discount: -₹${discountAmount.toLocaleString('en-IN')}\n18% GST: ₹${gstAmount.toLocaleString('en-IN')}\nEstimated Total: ₹${totalPayable.toLocaleString('en-IN')}\nTimeline: ${launchTimeline === '7days' ? 'Within 7 Days' : launchTimeline === '15days' ? '15 Days' : 'Next Month'}\nNotes: ${notes || 'None'}\n\nPlease share exact freight estimate and Ranigunj Factory NEFT bank details for payment.`;
  };

  const handleWhatsAppSend = () => {
    const text = encodeURIComponent(buildWhatsAppText());
    window.open(`https://wa.me/917396127273?text=${text}`, '_blank');
  };

  const handleCopyOrderRef = () => {
    navigator.clipboard.writeText(buildWhatsAppText());
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="w-full relative min-h-[calc(100vh-280px)]">
      {/* Copied Feedback Toast */}
      {copiedNotification && (
        <div className="fixed top-24 right-6 z-50 bg-[#1a1c20] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-pulse border border-secondary">
          <span className="material-symbols-outlined text-[#25D366] text-[18px]">check_circle</span>
          <span>Order Reference copied to clipboard!</span>
        </div>
      )}

      {/* Dimmed Background Preview Canvas */}
      <div className="w-full bg-surface-container-low px-4 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Active Wholesale Order Container */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden border border-surface-container">
            
            {/* Top Structural Bar */}
            <div className="bg-[#1a1c20] text-on-primary px-5 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-secondary-fixed">
                  <span className="material-symbols-outlined text-[24px]">assignment_turned_in</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h1 className="font-serif text-lg font-bold text-white tracking-tight">Wholesale Order List</h1>
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] uppercase font-bold">
                      {cart.length} Fixture {cart.length === 1 ? 'Line' : 'Lines'}
                    </span>
                  </div>
                  <p className="text-[11px] text-outline-variant">
                    Ranigunj Central Warehouse Direct Dispatch • Ex-Factory Hyderabad Commercial Pricing
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-secondary-container">
                    Tier-1 Wholesale Slab
                  </span>
                  <span className="text-[10px] text-outline-variant font-mono">Active MOQ Guaranteed</span>
                </div>
                <button
                  onClick={() => onNavigate('racks-floor-stands')}
                  className="p-2 rounded-lg bg-surface-container-highest/20 hover:bg-surface-container-highest/40 text-on-primary transition-colors"
                  title="Back to Catalog"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Split 12-Column Responsive Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-surface-container">
              
              {/* LEFT COLUMN: Itemized Fixture Manifest & Live Configurator (7 Columns) */}
              <div className="lg:col-span-7 p-5 lg:p-8 flex flex-col gap-6 bg-surface-bright">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-widest text-secondary">
                      Manufactured Items Manifest
                    </span>
                    <span className="text-outline-variant">•</span>
                    <span className="text-xs text-on-surface-variant">Heavy Gauge Commercial Steel (1.6mm)</span>
                  </div>
                  <button 
                    onClick={() => onNavigate('racks-floor-stands')}
                    className="text-secondary hover:text-on-secondary-container text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_circle</span> 
                    <span>Add More Items</span>
                  </button>
                </div>

                {/* Items List */}
                {cart.length === 0 ? (
                  <div className="bg-surface-container-low rounded-xl p-8 text-center flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-[48px] text-outline">shopping_bag</span>
                    <h3 className="font-serif text-lg font-bold text-primary">Your Wholesale Order List is Empty</h3>
                    <p className="text-xs text-on-surface-variant max-w-sm">
                      Select heavy-duty floor racks, wall channels, or mannequins from our Hyderabad catalog to build your store quotation.
                    </p>
                    <button
                      onClick={() => onNavigate('racks-floor-stands')}
                      className="mt-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow hover:bg-[#2A2D34]"
                    >
                      Browse Commercial Catalog
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {cart.map((item) => (
                      <div 
                        key={item.id}
                        className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow"
                      >
                        <div className="w-full sm:w-28 aspect-square flex-shrink-0 rounded-lg overflow-hidden relative bg-surface-container">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-primary text-white text-[9px] uppercase font-bold">
                            MOQ: {item.moq} {item.unitLabel}
                          </span>
                        </div>

                        <div className="flex flex-col justify-between flex-1 gap-2">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                            <div>
                              <span className="text-[10px] text-outline font-bold tracking-wider font-mono">
                                SKU: {item.sku}
                              </span>
                              <h3 className="font-serif text-base font-bold text-primary leading-snug">
                                {item.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[10px] font-semibold">
                                  Finish: {item.finish}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[10px] font-semibold">
                                  {item.sizeOrSpec}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-[10px] font-semibold">
                                  {item.gauge}
                                </span>
                              </div>
                            </div>
                            <div className="text-right sm:pl-2 shrink-0">
                              <div className="font-serif text-lg font-bold text-primary">
                                ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                              </div>
                              <div className="text-[11px] text-on-surface-variant">
                                @ ₹{item.unitPrice.toLocaleString('en-IN')} / {item.unitLabel}
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-surface-container">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-on-surface-variant font-medium">
                                {item.isLinear ? 'Running Feet:' : 'Qty:'}
                              </span>
                              <div className="inline-flex items-center rounded-lg bg-surface-container p-0.5 border border-surface-container-high">
                                <button
                                  onClick={() => onUpdateQty(item.id, Math.max(item.moq, item.quantity - 1))}
                                  className="w-7 h-7 flex items-center justify-center rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[16px]">remove</span>
                                </button>
                                <span className="w-9 text-center font-bold text-xs text-on-surface">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                                  className="w-7 h-7 flex items-center justify-center rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[16px]">add</span>
                                </button>
                              </div>
                              <span className="text-[11px] text-outline font-semibold ml-1">{item.packingType}</span>
                            </div>

                            <button 
                              onClick={() => onRemoveItem(item.id)}
                              className="text-error hover:text-red-700 text-xs font-bold flex items-center gap-1 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* B2B Transparency Notice */}
                <div className="rounded-xl bg-surface-container-high p-4 flex flex-col gap-2 border border-surface-container">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
                    <span>Hyderabad Factory Transparent Terms</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                      <span className="text-on-surface-variant leading-relaxed">
                        <strong className="text-on-surface">100% Prepaid Dispatch:</strong> Bank RTGS, NEFT, or Corporate UPI before truck release. No Cash on Delivery.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">videocam</span>
                      <span className="text-on-surface-variant leading-relaxed">
                        <strong className="text-on-surface">Live Video Inspection:</strong> HD WhatsApp call prior to crate loading at Ranigunj depot to inspect finished lot.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes Textarea */}
                <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface flex items-center justify-between" htmlFor="order-notes">
                    <span>Showroom Floor Plan / Customization Instructions:</span>
                    <span className="text-outline text-[11px] font-normal">Optional</span>
                  </label>
                  <textarea
                    id="order-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Need 1.8mm heavy duty upright posts for denim weight load; boutique opening scheduled next Friday in Vijayawada..."
                    rows={2}
                    className="w-full bg-surface-container-low rounded-lg p-3 text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: Consignee Details, Calculations & WhatsApp Action (5 Columns) */}
              <div className="lg:col-span-5 p-5 lg:p-8 bg-surface-container-low flex flex-col justify-between gap-6">
                <div className="flex flex-col gap-5">
                  {/* Consignee Registration Form */}
                  <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold tracking-wider text-secondary">
                        1. Dispatch Consignee Details
                      </span>
                      <span className="text-[10px] text-outline uppercase bg-surface-container px-2 py-0.5 rounded font-semibold">
                        Commercial GST
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <label className="font-semibold text-on-surface">Store / Business Trade Name *</label>
                        <input
                          type="text"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-on-surface">Proprietor / Contact *</label>
                        <input
                          type="text"
                          value={proprietor}
                          onChange={(e) => setProprietor(e.target.value)}
                          className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-on-surface">WhatsApp Number *</label>
                        <div className="flex items-center bg-surface-container-low px-3 py-2 rounded-lg border border-surface-container">
                          <span className="text-on-surface-variant mr-1 font-mono">+91</span>
                          <input
                            type="tel"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            className="w-full bg-transparent text-on-surface focus:outline-none font-mono"
                          />
                          <span className="material-symbols-outlined text-[#25D366] text-[16px]">check_circle</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-on-surface">Destination City / State *</label>
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-on-surface">Pincode (For Freight) *</label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface border border-surface-container focus:outline-none focus:border-primary font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-1 sm:col-span-2 pt-1">
                        <label className="font-semibold text-on-surface">Store Fit-Out Launch Date</label>
                        <div className="grid grid-cols-3 gap-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => setLaunchTimeline('7days')}
                            className={`py-1.5 px-1 rounded-md text-[11px] font-bold transition-all ${
                              launchTimeline === '7days' ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                            }`}
                          >
                            Within 7 Days
                          </button>
                          <button
                            type="button"
                            onClick={() => setLaunchTimeline('15days')}
                            className={`py-1.5 px-1 rounded-md text-[11px] font-bold transition-all ${
                              launchTimeline === '15days' ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                            }`}
                          >
                            15 Days
                          </button>
                          <button
                            type="button"
                            onClick={() => setLaunchTimeline('nextmonth')}
                            className={`py-1.5 px-1 rounded-md text-[11px] font-bold transition-all ${
                              launchTimeline === 'nextmonth' ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                            }`}
                          >
                            Next Month
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Commercial Price Summary */}
                  <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container flex flex-col gap-3">
                    <span className="text-xs uppercase font-bold tracking-wider text-secondary">
                      2. Commercial Price Summary
                    </span>
                    <div className="flex flex-col gap-2 text-xs pt-1">
                      <div className="flex items-center justify-between text-on-surface-variant">
                        <span>Ex-Factory Gross Subtotal:</span>
                        <span className="font-mono text-on-surface font-semibold">₹{grossSubtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#128C7E]">
                        <span className="flex items-center gap-1">
                          <span>Volume Slab Discount ({Math.round(discountRate * 100)}% Tier)</span>
                          <span className="material-symbols-outlined text-[14px]">high_res</span>
                        </span>
                        <span className="font-mono font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <span>B2B Input GST (18% Tax Invoice)</span>
                          <span className="material-symbols-outlined text-[14px] text-outline" title="Claimable input tax credit on your GSTIN">info</span>
                        </span>
                        <span className="font-mono text-on-surface">₹{gstAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-on-surface-variant pt-0.5">
                        <span>Truck Freight &amp; Wooden Crating</span>
                        <span className="text-[10px] text-secondary font-bold uppercase bg-secondary-container/40 px-2 py-0.5 rounded">
                          Shared on WhatsApp
                        </span>
                      </div>

                      <div className="my-1 border-b border-surface-container"></div>

                      <div className="flex items-end justify-between">
                        <div>
                          <span className="font-serif text-base font-bold text-primary">Total Commercial Payable</span>
                          <div className="text-[10px] text-outline">Exclusive of destination unloading labor</div>
                        </div>
                        <div className="text-right">
                          <span className="font-serif text-2xl text-primary font-bold">
                            ₹{totalPayable.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Volume Discount Progress Bar */}
                    <div className="rounded-lg bg-surface-container p-2.5 mt-1 flex flex-col gap-1.5 border border-surface-container">
                      <div className="flex items-center justify-between text-[10px] font-bold text-on-surface-variant">
                        <span className="text-secondary">
                          {grossSubtotal >= 25000 ? 'Unlocked 10% Slab (>₹25,000)' : 'Add ₹' + (25000 - grossSubtotal).toLocaleString('en-IN') + ' for 10% Slab'}
                        </span>
                        <span className="text-on-surface">Next: 15% Slab at ₹50,000</span>
                      </div>
                      <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                        <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2.5 pt-2">
                  <button
                    onClick={handleWhatsAppSend}
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all transform hover:-translate-y-0.5"
                  >
                    <span className="material-symbols-outlined text-[20px]">send</span>
                    <span>Send Order to WhatsApp (+91 73961 27273)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={onOpenProforma}
                      className="w-full bg-surface-container-lowest hover:bg-surface-container-high text-primary py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors border border-surface-container"
                    >
                      <span className="material-symbols-outlined text-[18px] text-secondary">picture_as_pdf</span>
                      <span>PDF Proforma</span>
                    </button>
                    <button
                      onClick={handleCopyOrderRef}
                      className="w-full bg-surface-container-lowest hover:bg-surface-container-high text-primary py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors border border-surface-container"
                    >
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                      <span>Copy Order Ref</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-center text-[11px] text-outline pt-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">local_shipping</span>
                    <span>Direct daily dispatches via VRL / Navata / Safechem Logistics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
