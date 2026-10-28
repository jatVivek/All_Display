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
      <div className="bg-gradient-to-r from-orange-50 via-amber-50/40 to-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-orange-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col gap-2 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-medium text-orange-700 uppercase tracking-wider font-mono">
              Feel Khana Headquarters, Hyderabad, Telangana
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Jewellery Display &amp; Packaging Command Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            Customer order requests and custom inquiries are recorded directly into the shared database and forwarded to your WhatsApp desk. Review orders, update stock status, and coordinate fulfillment here.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setActiveTab('orders')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
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
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              New Orders
            </span>
            <span className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
              <AppIcon name="shopping_bag" className="text-[20px]" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{newOrdersCount}</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
              Awaiting WhatsApp
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Payment Pending
            </span>
            <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AppIcon name="payments" className="text-[20px]" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{paymentPendingCount}</span>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-100">
              UPI/NEFT Awaited
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => setActiveTab('orders')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ready to Dispatch
            </span>
            <span className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <AppIcon name="local_shipping" className="text-[20px]" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{readyToDispatchCount}</span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
              Packed for Courier
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div 
          onClick={() => setActiveTab('quotes')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Custom Inquiries
            </span>
            <span className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <AppIcon name="architecture" className="text-[20px]" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{pendingQuotesCount}</span>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
              Bespoke Quotes
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <AppIcon name="list_alt" className="text-orange-600 text-[22px]" />
              <h2 className="font-bold text-base text-slate-900">Recent Customer Orders</h2>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs font-semibold text-orange-600 hover:underline cursor-pointer"
            >
              View All Orders →
            </button>
          </div>

          <div className="flex flex-col divide-y divide-slate-100">
            {orders.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No orders received yet. Orders placed by customers on the storefront will appear here.
              </div>
            ) : (
              orders.slice(0, 5).map((ord) => (
                <div key={ord.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{ord.orderNo}</span>
                      <span className="text-xs text-slate-500">• {ord.storeName}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">
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
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions & Low Stock */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col gap-4">
            <h3 className="font-bold text-base text-slate-900">Quick Store Actions</h3>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => setActiveTab('products')}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <AppIcon name="inventory_2" className="text-[18px] text-orange-600" />
                  <span>Update Displays &amp; Prices</span>
                </div>
                <AppIcon name="chevron_right" className="text-[16px] text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('homepage')}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <AppIcon name="view_carousel" className="text-[18px] text-orange-600" />
                  <span>Edit Homepage Banners</span>
                </div>
                <AppIcon name="chevron_right" className="text-[16px] text-slate-400" />
              </button>

              <a
                href={getWhatsAppLink('Hi All Display Admin, checking today wholesale dispatch status.')}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <AppIcon name="chat" className="text-[18px]" />
                  <span>WhatsApp Desk (+{getWhatsAppNumber()})</span>
                </div>
                <AppIcon name="open_in_new" className="text-[16px]" />
              </a>
            </div>
          </div>

          {/* Business Summary */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs flex flex-col gap-3">
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider font-semibold">Active Pipeline</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-white">₹{totalMonthlyRevenue.toLocaleString('en-IN')}</span>
              <span className="text-xs text-emerald-400 font-semibold">{products.length} Products Live</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Based on confirmed orders and custom packaging inquiries across Chennai, Tamil Nadu, and PAN India dispatches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
