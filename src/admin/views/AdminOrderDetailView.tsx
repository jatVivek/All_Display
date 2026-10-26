import { AppIcon } from '../../components/AppIcon';
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
        <p className="text-sm text-slate-500">No order selected.</p>
        <button
          onClick={() => setActiveTab('orders')}
          className="bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-semibold w-fit mx-auto cursor-pointer"
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
    const text = `Hi ${order.customerName} (${order.storeName}), thanks for confirming your order *${order.orderNo}* with Vinayak Packaging Sowcarpet, Chennai.\n\n` +
      `Order Summary:\n` +
      order.items.map(i => `• ${i.title} (${i.finish}): ${i.quantity} ${i.unitLabel} @ ₹${i.unitPrice.toLocaleString('en-IN')}`).join('\n') +
      `\n\nGrand Total: ₹${order.total.toLocaleString('en-IN')}\n\n` +
      `Your order is being prepared at our Sowcarpet warehouse. We will share dispatch tracking details soon!`;
    
    window.open(getContactWhatsAppLink(order.whatsapp, text), '_blank');
    showToast('WhatsApp reply window opened with order confirmation template.');
  };

  const handleSendPaymentDetails = () => {
    const text = `Hi ${order.customerName} (${order.storeName}), here are the banking details for Proforma *${order.orderNo}* (Total: ₹${order.total.toLocaleString('en-IN')}):\n\n` +
      `🏦 Bank: ${settings.bankName}\n` +
      `📋 Account No: ${settings.accountNo}\n` +
      `🔑 IFSC: ${settings.ifscCode}\n` +
      `⚡ UPI ID: ${settings.upiId}\n\n` +
      `Please share payment screenshot on WhatsApp once completed so we can dispatch immediately!`;

    window.open(getContactWhatsAppLink(order.whatsapp, text), '_blank');
    showToast('WhatsApp payment details template dispatched.');
  };

  const handleSendDispatchNotice = () => {
    const text = `Hi ${order.customerName} (${order.storeName}), great news! Your order *${order.orderNo}* has been packed and dispatched.\n\n` +
      `📦 Courier / Tracking No: *${trackingNo || 'To be confirmed'}*\n` +
      `Destination: ${order.destination} (${order.pincode})\n\n` +
      `Thank you for shopping with Vinayak Packaging!`;

    window.open(getContactWhatsAppLink(order.whatsapp, text), '_blank');
    showToast('Dispatch notice sent via WhatsApp.');
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('orders')}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <AppIcon name="arrow_back" className="text-[20px]" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{order.orderNo}</h1>
              <span className="bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                {order.status}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Placed on {order.date} • {order.storeName} ({order.customerName})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintInvoice}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <AppIcon name="print" className="text-[18px]" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Order Manifest & Customer Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Customer & Destination Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col gap-4">
            <h2 className="font-bold text-base text-slate-900">Customer &amp; Delivery Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-1">
                <span className="text-slate-500 uppercase font-bold text-[10px]">Store &amp; Proprietor</span>
                <span className="font-bold text-sm text-slate-900">{order.storeName}</span>
                <span className="text-slate-600">Contact: {order.customerName}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                  <AppIcon name="chat" className="text-[16px]" />
                  <span>WhatsApp: +91 {order.whatsapp}</span>
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-1">
                <span className="text-slate-500 uppercase font-bold text-[10px]">Destination Address</span>
                <span className="font-bold text-sm text-slate-900">{order.destination}</span>
                <span className="text-slate-600 font-mono">Pincode: {order.pincode}</span>
                <span className="text-[11px] text-slate-500 mt-1">
                  Dispatch Depot: Sowcarpet Centre, Chennai
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Manifest Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col gap-4">
            <h2 className="font-bold text-base text-slate-900">Order Items &amp; Product Specs</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3">Product Item</th>
                    <th className="p-3">Spec</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Rate</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{item.title}</span>
                          <span className="font-mono text-[10px] text-slate-500">{item.sku}</span>
                        </div>
                      </td>
                      <td className="p-3 font-medium text-slate-600">{item.finish}</td>
                      <td className="p-3 text-center font-bold">{item.quantity} {item.unitLabel}</td>
                      <td className="p-3 text-right font-mono">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-right font-mono font-bold">₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Subtotal:</span>
                <span className="font-mono font-semibold">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-200 text-emerald-700">
                  <span>Volume Discount ({order.subtotal >= 50000 ? '15%' : '10%'}):</span>
                  <span className="font-mono font-semibold">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">18% GST (CGST + SGST):</span>
                <span className="font-mono font-semibold">₹{order.gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold text-slate-900">
                <span>Grand Total Payable:</span>
                <span className="font-mono text-base text-orange-600">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: 1-Click WhatsApp Actions & Status Pipeline */}
        <div className="flex flex-col gap-6">
          {/* 1-Click WhatsApp Action Triggers */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col gap-4">
            <h2 className="font-bold text-base text-slate-900">WhatsApp Action Center</h2>
            <p className="text-xs text-slate-500">
              Clicking any button below instantly launches WhatsApp with the customer's number and prefilled order copy.
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleWhatsAppReply}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white p-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <AppIcon name="chat" className="text-[18px]" />
                <span>1. Reply &amp; Confirm on WhatsApp</span>
              </button>

              <button
                onClick={handleSendPaymentDetails}
                className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 p-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <AppIcon name="payments" className="text-[18px] text-amber-700" />
                <span>2. Send UPI &amp; Bank Details</span>
              </button>

              <button
                onClick={handleSendDispatchNotice}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <AppIcon name="local_shipping" className="text-[18px] text-orange-400" />
                <span>3. Send Dispatch &amp; Tracking Notice</span>
              </button>
            </div>
          </div>

          {/* Status Progression & Tracking */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col gap-4">
            <h2 className="font-bold text-base text-slate-900">Workflow Status</h2>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-800">Current Stage</label>
              <select
                value={order.status}
                onChange={(e) => handleStatusUpdate(e.target.value as AdminOrder['status'])}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-orange-500 cursor-pointer"
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
              <label className="text-xs font-semibold text-slate-800">Tracking / Docket Number</label>
              <input
                type="text"
                value={trackingNo}
                onChange={(e) => setTrackingNo(e.target.value)}
                placeholder="e.g. TRK-94622-CHN"
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-800">Internal Depot Notes</label>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Add packing or fulfillment notes..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 resize-none"
              ></textarea>
            </div>

            <button
              onClick={handleSaveNotes}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
            >
              Save Internal Notes &amp; Tracking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
