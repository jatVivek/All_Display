import { AppIcon } from '../../components/AppIcon';
import React, { useEffect, useState } from 'react';
import { AdminTab } from '../AdminApp';
import { storeManager, AdminOrder } from '../../services/storeManager';

interface AdminOrdersViewProps {
  setActiveTab: (tab: AdminTab) => void;
  setSelectedOrderId: (id: string) => void;
  showToast: (msg: string) => void;
}

export const AdminOrdersView: React.FC<AdminOrdersViewProps> = ({
  setActiveTab,
  setSelectedOrderId,
  showToast
}) => {
  const [orders, setOrders] = useState<AdminOrder[]>(() => storeManager.getOrders());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => storeManager.subscribe((state) => setOrders(state.orders)), []);

  const handleSyncOrders = async () => {
    setIsSyncing(true);
    try {
      await storeManager.refreshOrders();
      setOrders(storeManager.getOrders());
      showToast('Orders synchronized successfully.');
    } catch {
      showToast('Unable to synchronize orders.');
    } finally {
      setIsSyncing(false);
    }
  };

  const statuses = [
    'All',
    'New (Awaiting WhatsApp)',
    'Confirmed',
    'Payment pending',
    'Paid',
    'Packed',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch = 
      ord.orderNo.toLowerCase().includes(search.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(search.toLowerCase()) ||
      ord.storeName.toLowerCase().includes(search.toLowerCase()) ||
      ord.whatsapp.includes(search) ||
      ord.destination.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: AdminOrder['status']) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o));
    if (!await storeManager.saveOrders(updated)) {
      showToast(storeManager.getState().catalogSyncError || 'Could not save order status.');
      return;
    }
    showToast(`Order status updated to "${newStatus}"`);
  };

  const handleExportCSV = () => {
    const headers = 'Order No,Date,Customer,Store Name,WhatsApp,Destination,Total,Status\n';
    const rows = filteredOrders
      .map(o => `"${o.orderNo}","${o.date}","${o.customerName}","${o.storeName}","+91 ${o.whatsapp}","${o.destination}",${o.total},"${o.status}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AllDisplay_Orders_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Orders exported successfully as CSV!');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AppIcon name="list_alt" className="text-orange-600 text-[24px]" />
            <h1 className="text-2xl font-bold text-slate-900">Customer Orders List</h1>
          </div>
          <p className="text-xs text-slate-500">
            Manage incoming WhatsApp orders, track payment status, and dispatch shipments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncOrders}
            disabled={isSyncing}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
          >
            <AppIcon name="sync" className={`text-[18px] ${isSyncing ? 'animate-spin text-orange-600' : ''}`} />
            <span>{isSyncing ? 'Syncing…' : 'Sync Orders'}</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <AppIcon name="download" className="text-[18px]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <AppIcon name="search" className="text-[18px]" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search store name, order #, WhatsApp..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  statusFilter === st
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 pl-6">Order Ref &amp; Date</th>
                <th className="p-4">Customer &amp; Store</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{ord.orderNo}</span>
                        <span className="text-[11px] text-slate-500">{ord.date}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{ord.storeName}</span>
                        <span className="text-[11px] text-slate-500">{ord.customerName} • +91 {ord.whatsapp}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{ord.destination}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{ord.pincode}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900">
                      ₹{ord.total.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as AdminOrder['status'])}
                        className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer outline-none ${
                          ord.status === 'New (Awaiting WhatsApp)' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                          ord.status === 'Confirmed' ? 'bg-violet-50 text-violet-800 border-violet-300' :
                          ord.status === 'Payment pending' ? 'bg-orange-50 text-orange-800 border-orange-300' :
                          ord.status === 'Paid' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          ord.status === 'Packed' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                          ord.status === 'Shipped' ? 'bg-indigo-50 text-indigo-800 border-indigo-300' : 'bg-gray-100 text-gray-700 border-gray-300'
                        }`}
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
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrderId(ord.id);
                          setActiveTab('order-detail');
                        }}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                      >
                        Inspect &amp; Reply
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
