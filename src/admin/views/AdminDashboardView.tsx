import { AppIcon } from '../../components/AppIcon';
import React from 'react';
import { getWhatsAppLink, getWhatsAppNumber } from '../../utils/whatsapp';
import { AdminTab } from '../AdminApp';
import { storeManager } from '../../services/storeManager';

interface AdminDashboardViewProps {
  setActiveTab: (tab: AdminTab) => void;
  setSelectedOrderId: (id: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  setActiveTab,
  setSelectedOrderId
}) => {
  const orders = storeManager.getOrders();
  const quotes = storeManager.getQuotes();
  const products = storeManager.getProducts();

  const newOrdersCount = orders.filter(o => o.status === 'New (Awaiting WhatsApp)').length;
  const paymentPendingCount = orders.filter(o => o.status === 'Payment pending').length;
  const readyToDispatchCount = orders.filter(o => o.status === 'Packed').length;
  const pendingQuotesCount = quotes.filter(q => q.status === 'Pending Review').length;

  const totalMonthlyRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-[#1a1c20] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-[#ffdf98]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col gap-2 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-ping"></span>
            <span className="text-xs font-mono text-[#ffdf98] uppercase tracking-wider">Ranigunj &amp; Begum Bazaar Headquarters</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Wholesale Command Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#c6c6cb] max-w-xl">
            Customer order and quote requests are saved to the shared database before opening WhatsApp. Review requests, update statuses, and coordinate fulfillment here.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setActiveTab('orders')}
            className="bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <AppIcon name="list_alt" className="text-[18px]" />
            <span>View New Orders ({newOrdersCount})</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="bg-white p-5 rounded-2xl border border-[#e6e2dc] shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#76777b]">
              New Orders (Naye)
            </span>
            <span className="w-9 h-9 rounded-xl bg-[#ffdf98]/30 text-[#775a00] flex items-center justify-center">
              <AppIcon name="shopping_bag" className="text-[20px]" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-serif font-bold text-[#1c1c18]">{newOrdersCount}</span>
            <span className="text-[11px] font-medium text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded-md">
              Awaiting WhatsApp
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="bg-white p-5 rounded-2xl border border-[#e6e2dc] shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#76777b]">
              Payment Pending
            </span>
            <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AppIcon name="payments" className="text-[20px]" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-serif font-bold text-[#1c1c18]">{paymentPendingCount}</span>
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              UPI/NEFT Awaited
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="bg-white p-5 rounded-2xl border border-[#e6e2dc] shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#76777b]">
              Ready to Dispatch (Packed)
            </span>
            <span className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <AppIcon name="local_shipping" className="text-[20px]" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-serif font-bold text-[#1c1c18]">{readyToDispatchCount}</span>
            <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              Transport LR needed
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div 
          onClick={() => setActiveTab('quotes')}
          className="bg-white p-5 rounded-2xl border border-[#e6e2dc] shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#76777b]">
              Bespoke Quotes
            </span>
            <span className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <AppIcon name="architecture" className="text-[20px]" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-serif font-bold text-[#1c1c18]">{pendingQuotesCount}</span>
            <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
              CAD Layouts
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e6e2dc] p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#e6e2dc] pb-4">
            <div className="flex items-center gap-2">
              <AppIcon name="list_alt" className="text-[#775a00] text-[22px]" />
              <h2 className="font-serif font-bold text-lg text-[#1c1c18]">Recent Wholesale Orders</h2>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs font-semibold text-[#775a00] hover:underline"
            >
              View All Orders →
            </button>
          </div>

          <div className="flex flex-col divide-y divide-[#e6e2dc]">
            {orders.slice(0, 4).map((ord) => (
              <div key={ord.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#1c1c18]">{ord.orderNo}</span>
                    <span className="text-xs text-[#76777b]">• {ord.storeName}</span>
                  </div>
                  <span className="text-[11px] text-[#76777b]">
                    {ord.destination} • ₹{ord.total.toLocaleString('en-IN')} ({ord.items.length} items)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                    ord.status === 'New (Awaiting WhatsApp)' ? 'bg-amber-100 text-amber-800' :
                    ord.status === 'Payment pending' ? 'bg-orange-100 text-orange-800' :
                    ord.status === 'Packed' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {ord.status}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedOrderId(ord.id);
                      setActiveTab('order-detail');
                    }}
                    className="bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Low Stock */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-[#e6e2dc] p-6 shadow-sm flex flex-col gap-4">
            <h3 className="font-serif font-bold text-base text-[#1c1c18]">Quick Owner Actions</h3>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => setActiveTab('products')}
                className="w-full bg-[#fdf9f3] hover:bg-[#f1ede7] border border-[#e6e2dc] text-[#1c1c18] p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <AppIcon name="inventory_2" className="text-[18px] text-[#775a00]" />
                  <span>Update Racks &amp; Prices</span>
                </div>
                <AppIcon name="chevron_right" className="text-[16px] text-[#76777b]" />
              </button>

              <button
                onClick={() => setActiveTab('homepage')}
                className="w-full bg-[#fdf9f3] hover:bg-[#f1ede7] border border-[#e6e2dc] text-[#1c1c18] p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <AppIcon name="view_carousel" className="text-[18px] text-[#775a00]" />
                  <span>Edit Homepage Banners</span>
                </div>
                <AppIcon name="chevron_right" className="text-[16px] text-[#76777b]" />
              </button>

              <a
                href={getWhatsAppLink('Hi All Display Admin, checking today wholesale dispatch status.')}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <AppIcon name="chat" className="text-[18px]" />
                  <span>Open WhatsApp Desk (+{getWhatsAppNumber()})</span>
                </div>
                <AppIcon name="open_in_new" className="text-[16px]" />
              </a>
            </div>
          </div>

          {/* Business Summary */}
          <div className="bg-[#1a1c20] text-white rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <span className="text-[10px] font-mono text-[#ffdf98] uppercase tracking-wider">Estimated Revenue</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-serif font-bold text-white">₹{totalMonthlyRevenue.toLocaleString('en-IN')}</span>
              <span className="text-xs text-[#25D366] font-semibold">Active Pipeline</span>
            </div>
            <p className="text-[11px] text-[#c6c6cb] leading-relaxed">
              Based on all confirmed and pending wholesale inquiries across Hyderabad and Telangana districts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
