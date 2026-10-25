import React, { useEffect, useState } from 'react';
import { AdminTab } from '../AdminApp';
import { storeManager, AdminOrder, AdminSettings } from '../../services/storeManager';
import { getContactWhatsAppLink } from '../../utils/whatsapp';

interface AdminOrderDetailViewProps {
  orderId: string | null;
  setActiveTab: (tab: AdminTab) => void;
  showToast: (msg: string) => void;
}

export const AdminOrderDetailView: React.FC<AdminOrderDetailViewProps> = ({
  orderId,
  setActiveTab,
  showToast
}) => {
  const [orders, setOrders] = useState<AdminOrder[]>(() => storeManager.getOrders());
  const settings: AdminSettings = storeManager.getSettings();

  const order = orders.find((o) => o.id === orderId) || orders[0];
  const [trackingNo, setTrackingNo] = useState(order?.trackingNo || '');
  const [internalNotes, setInternalNotes] = useState(order?.notes || '');

  useEffect(() => storeManager.subscribe((state) => {
    setOrders(state.orders);
  }), []);

  useEffect(() => {
    setTrackingNo(order?.trackingNo || '');
    setInternalNotes(order?.notes || '');
  }, [order?.id, order?.trackingNo, order?.notes]);

  if (!order) {
    return (
      <div className="p-8 text-center flex flex-col gap-4">
        <p className="text-sm text-[#76777b]">No order selected.</p>
        <button
          onClick={() => setActiveTab('orders')}
          className="bg-[#1a1c20] text-white px-4 py-2 rounded-xl text-xs font-semibold w-fit mx-auto"
        >
          Return to Orders List
        </button>
      </div>
    );
  }

  const handleStatusUpdate = async (newStatus: AdminOrder['status']) => {
    const updated = orders.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o));
    if (!await storeManager.saveOrders(updated)) {
      showToast(storeManager.getState().catalogSyncError || 'Could not save order status.');
      return;
    }
    showToast(`Order status updated to "${newStatus}"`);
  };

  const handleSaveNotes = async () => {
    const updated = orders.map((o) => (o.id === order.id ? { ...o, notes: internalNotes, trackingNo } : o));
    if (!await storeManager.saveOrders(updated)) {
      showToast(storeManager.getState().catalogSyncError || 'Could not save order notes.');
      return;
    }
    showToast('Order internal notes and tracking number saved!');
  };

  // WhatsApp Templates
  const handleWhatsAppReply = () => {
    const text = `Hi ${order.customerName} (${order.storeName}), thanks for confirming wholesale order *${order.orderNo}* with All Display Hyderabad.\n\n` +
      `Manifest Summary:\n` +
      order.items.map(i => `• ${i.title} (${i.finish}): ${i.quantity} ${i.unitLabel} @ ₹${i.unitPrice.toLocaleString('en-IN')}`).join('\n') +
      `\n\nGrand Total (incl. GST): ₹${order.total.toLocaleString('en-IN')}\n\n` +
      `Your order is being prepared at our Ranigunj warehouse. We will share transport dispatch LR soon!`;
    
    window.open(getContactWhatsAppLink(order.whatsapp, text), '_blank');
    showToast('WhatsApp reply window opened with order confirmation template.');
  };

  const handleSendPaymentDetails = () => {
    const text = `Hi ${order.customerName} (${order.storeName}), here are the banking details for Wholesale Proforma *${order.orderNo}* (Total: ₹${order.total.toLocaleString('en-IN')}):\n\n` +
      `🏦 Bank: ${settings.bankName}\n` +
      `📋 Account No: ${settings.accountNo}\n` +
      `🔑 IFSC: ${settings.ifscCode}\n` +
      `⚡ UPI ID: ${settings.upiId}\n\n` +
      `Please share payment screenshot on WhatsApp once completed so we can dispatch immediately!`;

    window.open(getContactWhatsAppLink(order.whatsapp, text), '_blank');
    showToast('WhatsApp payment details template dispatched.');
  };

  const handleSendDispatchNotice = () => {
    const text = `Hi ${order.customerName} (${order.storeName}), great news! Your wholesale order *${order.orderNo}* has been packed and dispatched via transport.\n\n` +
      `📦 Lorry Receipt / Tracking No: *${trackingNo || 'To be confirmed'}*\n` +
      `Destination Depot: ${order.destination} (${order.pincode})\n\n` +
      `Please collect consignment from transport office upon arrival. Thank you for shopping with All Display!`;

    window.open(getContactWhatsAppLink(order.whatsapp, text), '_blank');
    showToast('Transport dispatch notice sent via WhatsApp.');
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e6e2dc] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('orders')}
            className="w-10 h-10 rounded-xl bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#1c1c18]">{order.orderNo}</h1>
              <span className="bg-[#ffdf98]/40 text-[#775a00] px-2.5 py-0.5 rounded-full text-xs font-semibold">
                {order.status}
              </span>
            </div>
            <span className="text-xs text-[#76777b]">
              Placed on {order.date} • {order.storeName} ({order.customerName})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintInvoice}
            className="bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Order Manifest & Customer Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Customer & Destination Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#e6e2dc] shadow-sm flex flex-col gap-4">
            <h2 className="font-serif font-bold text-base text-[#1c1c18]">Consignee &amp; Delivery Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#fdf9f3] p-3.5 rounded-xl border border-[#e6e2dc] flex flex-col gap-1">
                <span className="text-[#76777b] uppercase font-bold text-[10px]">Store &amp; Proprietor</span>
                <span className="font-bold text-sm text-[#1c1c18]">{order.storeName}</span>
                <span className="text-[#45474b]">Prop: {order.customerName}</span>
                <span className="text-[#25D366] font-semibold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>WhatsApp: +91 {order.whatsapp}</span>
                </span>
              </div>

              <div className="bg-[#fdf9f3] p-3.5 rounded-xl border border-[#e6e2dc] flex flex-col gap-1">
                <span className="text-[#76777b] uppercase font-bold text-[10px]">Destination Lorry Transport</span>
                <span className="font-bold text-sm text-[#1c1c18]">{order.destination}</span>
                <span className="text-[#45474b] font-mono">Pincode: {order.pincode}</span>
                <span className="text-[11px] text-[#76777b] mt-1">
                  Ranigunj Dispatch Godown Bay #4
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Manifest Table */}
          <div className="bg-white rounded-2xl p-6 border border-[#e6e2dc] shadow-sm flex flex-col gap-4">
            <h2 className="font-serif font-bold text-base text-[#1c1c18]">Order Manifest &amp; Fixture Specs</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#fdf9f3] text-[10px] font-bold text-[#775a00] uppercase tracking-wider border-b border-[#e6e2dc]">
                    <th className="p-3">SKU &amp; Fixture Item</th>
                    <th className="p-3">Finish Spec</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Rate</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6e2dc]">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#1c1c18]">{item.title}</span>
                          <span className="font-mono text-[10px] text-[#76777b]">{item.sku}</span>
                        </div>
                      </td>
                      <td className="p-3 font-medium text-[#45474b]">{item.finish}</td>
                      <td className="p-3 text-center font-bold">{item.quantity} {item.unitLabel}</td>
                      <td className="p-3 text-right font-mono">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-mono font-bold">₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="bg-[#fdf9f3] p-4 rounded-xl border border-[#e6e2dc] flex flex-col gap-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#e6e2dc]">
                <span className="text-[#76777b]">Ex-Factory Subtotal:</span>
                <span className="font-mono font-semibold">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between py-1 border-b border-[#e6e2dc] text-emerald-700">
                  <span>Volume Slab Discount ({order.subtotal >= 50000 ? '15%' : '10%'}):</span>
                  <span className="font-mono font-semibold">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-[#e6e2dc]">
                <span className="text-[#76777b]">18% GST (CGST + SGST):</span>
                <span className="font-mono font-semibold">₹{order.gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold text-[#1c1c18]">
                <span>Total Commercial Payable:</span>
                <span className="font-mono text-base text-[#775a00]">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: 1-Click WhatsApp Actions & Status Pipeline */}
        <div className="flex flex-col gap-6">
          {/* 1-Click WhatsApp Action Triggers */}
          <div className="bg-white rounded-2xl p-6 border border-[#e6e2dc] shadow-sm flex flex-col gap-4">
            <h2 className="font-serif font-bold text-base text-[#1c1c18]">WhatsApp Action Center</h2>
            <p className="text-xs text-[#76777b]">
              Clicking any button below instantly launches WhatsApp with the customer's number and prefilled professional wholesale copy.
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleWhatsAppReply}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white p-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>1. Reply &amp; Confirm on WhatsApp</span>
              </button>

              <button
                onClick={handleSendPaymentDetails}
                className="w-full bg-[#ffdf98] hover:bg-[#f6ce78] text-[#1c1c18] p-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">payments</span>
                <span>2. Send UPI/Bank Proforma Details</span>
              </button>

              <button
                onClick={handleSendDispatchNotice}
                className="w-full bg-[#1a1c20] hover:bg-black text-white p-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                <span>3. Send Transport LR &amp; Dispatch Notice</span>
              </button>
            </div>
          </div>

          {/* Status Progression & Tracking */}
          <div className="bg-white rounded-2xl p-6 border border-[#e6e2dc] shadow-sm flex flex-col gap-4">
            <h2 className="font-serif font-bold text-base text-[#1c1c18]">Workflow Status</h2>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#1c1c18]">Current Stage</label>
              <select
                value={order.status}
                onChange={(e) => handleStatusUpdate(e.target.value as AdminOrder['status'])}
                className="w-full p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs font-semibold focus:outline-none focus:border-[#775a00] cursor-pointer"
              >
                <option value="New (Awaiting WhatsApp)">New (Awaiting WhatsApp)</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Payment pending">Payment pending</option>
                <option value="Paid">Paid</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <label className="text-xs font-semibold text-[#1c1c18]">Transport Lorry Receipt / LR Number</label>
              <input
                type="text"
                value={trackingNo}
                onChange={(e) => setTrackingNo(e.target.value)}
                placeholder="e.g. LR-77392-HYD"
                className="w-full p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs font-mono focus:outline-none focus:border-[#775a00]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#1c1c18]">Internal Godown Fit Notes</label>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Add packing or cutting notes..."
                className="w-full p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs focus:outline-none focus:border-[#775a00]"
              ></textarea>
            </div>

            <button
              onClick={handleSaveNotes}
              className="w-full bg-[#1a1c20] hover:bg-black text-[#ffdf98] py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Save Internal Notes &amp; LR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
