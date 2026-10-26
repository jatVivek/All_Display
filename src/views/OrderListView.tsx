import { AppIcon } from '../components/AppIcon';
import React, { useState } from 'react';
import { ActiveView, CartItem, ConsigneeDetails } from '../types';
import { storeManager } from '../services/storeManager';
import { getWhatsAppLink } from '../utils/whatsapp';

interface OrderListViewProps {
  onNavigate: (view: ActiveView) => void;
  cart: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onOpenProforma: (consignee: ConsigneeDetails) => void;
}

export const OrderListView: React.FC<OrderListViewProps> = ({
  onNavigate,
  cart,
  onUpdateQty,
  onRemoveItem,
  onOpenProforma
}) => {
  // Consignee state
  const [storeName, setStoreName] = useState('');
  const [proprietor, setProprietor] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [destination, setDestination] = useState('');
  const [pincode, setPincode] = useState('');
  const [launchTimeline, setLaunchTimeline] = useState<'7days' | '15days' | 'nextmonth'>('7days');
  const [notes, setNotes] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionNotice, setSubmissionNotice] = useState<string | null>(null);

  // Calculations
  const grossSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discountRate = grossSubtotal >= 50000 ? 0.15 : grossSubtotal >= 25000 ? 0.10 : 0;
  const discountAmount = Math.round(grossSubtotal * discountRate);
  const taxableAmount = grossSubtotal - discountAmount;
  const gstAmount = Math.round(taxableAmount * 0.18);
  const totalPayable = taxableAmount + gstAmount;

  // Next slab progress
  const progressPercent = Math.min(100, Math.round((grossSubtotal / 50000) * 100));

  const buildWhatsAppText = (orderNo: string) => {
    const lines = cart.map(item => `- ${item.sku} ${item.title} (${item.finish}, ${item.sizeOrSpec}): ${item.quantity} ${item.unitLabel} @ ₹${item.unitPrice.toLocaleString('en-IN')} = ₹${(item.unitPrice * item.quantity).toLocaleString('en-IN')}`).join('\n');
    return `Hi Vinayak Packaging Team, I want to confirm order *${orderNo}* for ${storeName} (${proprietor}, ${destination} - ${pincode}, Ph: ${whatsapp}).\n\nItems:\n${lines}\n\nGross Subtotal: ₹${grossSubtotal.toLocaleString('en-IN')}\nVolume Discount: -₹${discountAmount.toLocaleString('en-IN')}\n18% GST: ₹${gstAmount.toLocaleString('en-IN')}\nEstimated Total: ₹${totalPayable.toLocaleString('en-IN')}\nTimeline: ${launchTimeline === '7days' ? 'Within 7 Days' : launchTimeline === '15days' ? '15 Days' : 'Next Month'}\nNotes: ${notes || 'None'}\n\nPlease share dispatch details.`;
  };

  const handleWhatsAppSend = async () => {
    if (isSubmitting || cart.length === 0) return;
    const phoneDigits = whatsapp.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
    if (!storeName.trim() || !proprietor.trim() || !destination.trim() || !pincode.trim() || phoneDigits.length !== 10) {
      setSubmissionError('Enter the store name, contact person, 10-digit WhatsApp number, destination, and pincode before submitting.');
      return;
    }
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionNotice(null);
    const whatsappWindow = window.open('about:blank', '_blank');
    try {
      const order = await storeManager.createOrder({
        customerName: proprietor.trim(),
        storeName: storeName.trim(),
        whatsapp: phoneDigits,
        destination: destination.trim(),
        pincode: pincode.trim(),
        items: cart.map((item) => ({
          sku: item.sku,
          title: item.title,
          finish: item.finish,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          unitLabel: item.unitLabel,
          sizeOrSpec: item.sizeOrSpec,
          gauge: item.gauge,
          packingType: item.packingType,
        })),
        notes: `${notes.trim()}${notes.trim() ? '\n' : ''}Requested timeline: ${launchTimeline === '7days' ? 'Within 7 Days' : launchTimeline === '15days' ? '15 Days' : 'Next Month'}`,
      });
      const orderText = `Hi Vinayak Packaging Team, I want to confirm order *${order.orderNo}* for ${order.storeName} (${order.customerName}, ${order.destination} - ${order.pincode}, Ph: ${order.whatsapp}).\n\nItems:\n${order.items.map((item) => `- ${item.sku} ${item.title} (${item.finish}): ${item.quantity} ${item.unitLabel} @ ₹${item.unitPrice.toLocaleString('en-IN')}`).join('\n')}\n\nGross Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}\nVolume Discount: -₹${order.discount.toLocaleString('en-IN')}\n18% GST: ₹${order.gst.toLocaleString('en-IN')}\nEstimated Total: ₹${order.total.toLocaleString('en-IN')}\n\n${order.notes}\n\nPlease share dispatch details.`;
      if (whatsappWindow) whatsappWindow.location.href = getWhatsAppLink(orderText);
      else setSubmissionError(`Order ${order.orderNo} is saved, but your browser blocked the WhatsApp window.`);
      setSubmissionNotice(`Order ${order.orderNo} was saved to the admin Orders list.`);
      window.setTimeout(() => setSubmissionNotice(null), 6000);
    } catch (error) {
      whatsappWindow?.close();
      setSubmissionError(error instanceof Error ? error.message : 'Could not save this order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOrderRef = () => {
    navigator.clipboard.writeText(buildWhatsAppText('Order draft'));
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handleOpenProforma = () => {
    onOpenProforma({
      storeName,
      ownerName: proprietor,
      whatsapp,
      destination,
      pincode,
      launchDate: launchTimeline === '7days' ? 'Within 7 Days' : launchTimeline === '15days' ? '15 Days' : 'Next Month',
      notes,
    });
  };

  return (
    <div className="w-full relative min-h-[calc(100vh-280px)]">
      {/* Copied Feedback Toast */}
      {copiedNotification && (
        <div className="fixed top-24 right-6 z-50 bg-[#1a1c20] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-pulse border border-secondary">
          <AppIcon name="check_circle" className="text-[#25D366] text-[18px]" />
          <span>Order Reference copied to clipboard!</span>
        </div>
      )}
      {submissionError && <div role="alert" className="mx-4 mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{submissionError}</div>}
      {submissionNotice && <div role="status" className="mx-4 mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{submissionNotice}</div>}

      {/* Dimmed Background Preview Canvas */}
      <div className="w-full bg-surface-container-low px-4 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Active Wholesale Order Container */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden border border-surface-container">
            
            {/* Top Structural Bar */}
            <div className="bg-[#1a1c20] text-on-primary px-5 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-secondary-fixed">
                  <AppIcon name="assignment_turned_in" className="text-[24px]" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h1 className="font-serif text-lg font-bold text-white tracking-tight">Wholesale Order List</h1>
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] uppercase font-bold">
                      {cart.length} Fixture {cart.length === 1 ? 'Line' : 'Lines'}
                    </span>
                  </div>
                  <p className="text-[11px] text-outline-variant">
                    Sowcarpet Central Depot Direct Dispatch • Vinayak Packaging Wholesale Pricing
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
                  <AppIcon name="close" className="text-[20px]" />
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
                      Selected Items Manifest
                    </span>
                    <span className="text-outline-variant">•</span>
                    <span className="text-xs text-on-surface-variant">Products and options from your selections</span>
                  </div>
                  <button 
                    onClick={() => onNavigate('racks-floor-stands')}
                    className="text-secondary hover:text-on-secondary-container text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <AppIcon name="add_circle" className="text-[16px]" />
                    <span>Add More Items</span>
                  </button>
                </div>

                {/* Items List */}
                {cart.length === 0 ? (
                  <div className="bg-surface-container-low rounded-xl p-8 text-center flex flex-col items-center gap-3">
                    <AppIcon name="shopping_bag" className="text-[48px] text-outline" />
                    <h3 className="font-serif text-lg font-bold text-primary">Your Wholesale Order List is Empty</h3>
                    <p className="text-xs text-on-surface-variant max-w-sm">
                      Select jewellery display stands, velvet busts, trays, or packaging items from our catalog to build your order.
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
                                  <AppIcon name="remove" className="text-[16px]" />
                                </button>
                                <span className="w-9 text-center font-bold text-xs text-on-surface">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                                  className="w-7 h-7 flex items-center justify-center rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors"
                                >
                                  <AppIcon name="add" className="text-[16px]" />
                                </button>
                              </div>
                              <span className="text-[11px] text-outline font-semibold ml-1">{item.packingType}</span>
                            </div>

                            <button 
                              onClick={() => onRemoveItem(item.id)}
                              className="text-error hover:text-red-700 text-xs font-bold flex items-center gap-1 transition-colors"
                            >
                              <AppIcon name="delete" className="text-[16px]" />
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
                    <AppIcon name="verified" className="text-secondary text-[20px]" />
                    <span>Vinayak Packaging Transparent Terms</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-start gap-2">
                      <AppIcon name="check_circle" className="text-secondary text-[16px] shrink-0 mt-0.5" />
                      <span className="text-on-surface-variant leading-relaxed">
                        <strong className="text-on-surface">100% Secure Orders:</strong> Bank RTGS, NEFT, or Corporate UPI before transport release.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AppIcon name="videocam" className="text-secondary text-[16px] shrink-0 mt-0.5" />
                      <span className="text-on-surface-variant leading-relaxed">
                        <strong className="text-on-surface">Fast Dispatch:</strong> Same-day dispatch from Sowcarpet depot for ready stock items.
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
                              required
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
                            required
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            className="w-full bg-transparent text-on-surface focus:outline-none font-mono"
                          />
                          <AppIcon name="check_circle" className="text-[#25D366] text-[16px]" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-on-surface">Destination City / State *</label>
                        <input
                          type="text"
                          required
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-on-surface">Pincode (For Freight) *</label>
                        <input
                          type="text"
                          required
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
                          <AppIcon name="high_res" className="text-[14px]" />
                        </span>
                        <span className="font-mono font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <span>B2B Input GST (18% Tax Invoice)</span>
                          <AppIcon name="info" className="text-[14px] text-outline" />
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
                    disabled={cart.length === 0 || isSubmitting}
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all transform hover:-translate-y-0.5"
                  >
                    <AppIcon name="send" className="text-[20px]" />
                    <span>{isSubmitting ? 'Saving Order…' : 'Save Order & Continue to WhatsApp'}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleOpenProforma}
                      disabled={cart.length === 0}
                      className="w-full bg-surface-container-lowest hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed text-primary py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors border border-surface-container"
                    >
                      <AppIcon name="picture_as_pdf" className="text-[18px] text-secondary" />
                      <span>PDF Proforma</span>
                    </button>
                    <button
                      onClick={handleCopyOrderRef}
                      disabled={cart.length === 0}
                      className="w-full bg-surface-container-lowest hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed text-primary py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors border border-surface-container"
                    >
                      <AppIcon name="content_copy" className="text-[18px]" />
                      <span>Copy Order Ref</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-center text-[11px] text-outline pt-1">
                    <AppIcon name="local_shipping" className="text-[16px] text-secondary" />
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
