import { AppIcon } from '../../components/AppIcon';
import React, { useEffect, useMemo, useState } from 'react';
import { storeManager, RegisteredCustomer, AdminOrder } from '../../services/storeManager';

export const AdminCustomersView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'registered' | 'buyers'>('registered');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [registeredCustomers, setRegisteredCustomers] = useState<RegisteredCustomer[]>(() =>
    storeManager.getRegisteredCustomers()
  );
  const [orders, setOrders] = useState<AdminOrder[]>(() => storeManager.getOrders());

  // Subscribe to store updates
  useEffect(() => {
    return storeManager.subscribe((state) => {
      setRegisteredCustomers(storeManager.getRegisteredCustomers());
      setOrders(state.orders);
    });
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        storeManager.refreshCustomers(),
        storeManager.refreshOrders(),
      ]);
      setRegisteredCustomers(storeManager.getRegisteredCustomers());
      setOrders(storeManager.getOrders());
    } finally {
      setIsRefreshing(false);
    }
  };

  // Aggregate wholesale buyers from placed orders
  const wholesaleBuyers = useMemo(() => {
    const customerMap: Record<
      string,
      { name: string; storeName: string; whatsapp: string; city: string; count: number; spend: number; lastDate: string }
    > = {};

    orders.forEach((o) => {
      const key = o.whatsapp || o.customerName;
      if (!customerMap[key]) {
        customerMap[key] = {
          name: o.customerName,
          storeName: o.storeName,
          whatsapp: o.whatsapp,
          city: o.destination,
          count: 0,
          spend: 0,
          lastDate: o.date,
        };
      }
      customerMap[key].count += 1;
      customerMap[key].spend += o.total;
    });

    return Object.values(customerMap);
  }, [orders]);

  // Filtered registered customers
  const filteredRegistered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return registeredCustomers;
    return registeredCustomers.filter((c) => {
      const name = (c.name || '').toLowerCase();
      const email = (c.email || '').toLowerCase();
      const phone = (c.phone || '').toLowerCase();
      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [registeredCustomers, searchQuery]);

  // Filtered wholesale buyers
  const filteredBuyers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return wholesaleBuyers;
    return wholesaleBuyers.filter((b) => {
      const name = (b.name || '').toLowerCase();
      const store = (b.storeName || '').toLowerCase();
      const phone = (b.whatsapp || '').toLowerCase();
      const city = (b.city || '').toLowerCase();
      return name.includes(q) || store.includes(q) || phone.includes(q) || city.includes(q);
    });
  }, [wholesaleBuyers, searchQuery]);

  const totalWholesaleSpend = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const formatPhone = (phone?: string) => {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    if (digits.length === 12 && digits.startsWith('91')) return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
    return phone;
  };

  const getCleanWhatsApp = (phone?: string) => {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `91${digits}`;
    return digits;
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AppIcon name="group" className="text-orange-600 text-[24px]" />
            <h1 className="text-2xl font-bold text-slate-900">Customer &amp; Client Directory</h1>
          </div>
          <p className="text-xs text-slate-500">
            Registered customer accounts, wholesale jewellery boutiques, and pan-India retail clients.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer disabled:opacity-60"
        >
          <AppIcon name="sync" className={`text-sm ${isRefreshing ? 'animate-spin text-orange-600' : ''}`} />
          <span>{isRefreshing ? 'Syncing…' : 'Sync Directory'}</span>
        </button>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
            <AppIcon name="person" className="text-[22px]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Registered Accounts</span>
            <span className="text-xl font-extrabold text-slate-900">{registeredCustomers.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <AppIcon name="storefront" className="text-[22px]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ordering Boutiques</span>
            <span className="text-xl font-extrabold text-slate-900">{wholesaleBuyers.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <AppIcon name="receipt_long" className="text-[22px]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Orders</span>
            <span className="text-xl font-extrabold text-slate-900">{orders.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <AppIcon name="payments" className="text-[22px]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Volume</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">₹{totalWholesaleSpend.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Tabs and Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab('registered')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'registered'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AppIcon name="person" className="text-sm" />
              <span>Registered Accounts ({registeredCustomers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('buyers')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'buyers'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AppIcon name="storefront" className="text-sm" />
              <span>Wholesale Buyers ({wholesaleBuyers.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <AppIcon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]" />
            <input
              type="text"
              placeholder={activeTab === 'registered' ? 'Search by name, email, or phone…' : 'Search by store, contact, or city…'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <AppIcon name="close" className="text-xs" />
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Registered Customer Accounts */}
        {activeTab === 'registered' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 pl-6">Customer Profile</th>
                  <th className="p-4">WhatsApp / Contact</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Orders Placed</th>
                  <th className="p-4">Total Spend</th>
                  <th className="p-4 pr-6 text-right">Direct Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRegistered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AppIcon name="person_off" className="text-[36px] text-slate-300" />
                        <span className="font-semibold text-slate-600">No registered accounts found</span>
                        <p className="text-xs text-slate-400 max-w-sm">
                          {searchQuery
                            ? `No customer matches "${searchQuery}". Clear your search.`
                            : 'When customers register via Sign Up on the website, their verified profile entries will automatically show here.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRegistered.map((cust) => {
                    const cleanWa = getCleanWhatsApp(cust.phone);
                    const formatted = formatPhone(cust.phone);
                    const joined = cust.createdAt ? new Date(cust.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent';

                    return (
                      <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-xs shrink-0">
                              {cust.name ? cust.name.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{cust.name || 'Customer'}</span>
                              <span className="text-[11px] text-slate-500 font-normal">{cust.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {formatted ? (
                            <a
                              href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(`Hello ${cust.name}, greetings from All Display!`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold hover:text-emerald-800 hover:underline"
                            >
                              <AppIcon name="chat" className="text-[16px] text-emerald-600" />
                              <span>{formatted}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">Not provided</span>
                          )}
                        </td>
                        <td className="p-4 text-slate-600 font-medium">
                          {joined}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            (cust.orderCount || 0) > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {cust.orderCount || 0} Orders
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-900">
                          ₹{(cust.totalSpent || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="inline-flex items-center gap-2 justify-end">
                            {cleanWa && (
                              <a
                                href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(`Hello ${cust.name}, greetings from All Display!`)}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Chat on WhatsApp"
                                className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                              >
                                <AppIcon name="chat" className="text-sm" />
                              </a>
                            )}
                            <a
                              href={`mailto:${cust.email}?subject=${encodeURIComponent('All Display - Jewellery Display & Packaging')}`}
                              title="Send Email"
                              className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
                            >
                              <AppIcon name="mail" className="text-sm" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Wholesale Buyers from Placed Orders */}
        {activeTab === 'buyers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 pl-6">Store &amp; Proprietor</th>
                  <th className="p-4">WhatsApp Contact</th>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Total Orders</th>
                  <th className="p-4">Total Spend</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredBuyers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AppIcon name="storefront" className="text-[36px] text-slate-300" />
                        <span className="font-semibold text-slate-600">No boutique buyers found</span>
                        <p className="text-xs text-slate-400 max-w-sm">
                          {searchQuery
                            ? `No client matches "${searchQuery}". Clear your search.`
                            : 'As wholesale orders are placed by jewellery boutique owners, their details appear here.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBuyers.map((b, idx) => {
                    const cleanWa = getCleanWhatsApp(b.whatsapp);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">{b.storeName || 'Jewellery Store'}</span>
                            <span className="text-[11px] text-slate-500">Contact: {b.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <a
                            href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(`Hello ${b.name}, regards from All Display Chennai regarding your orders!`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold hover:text-emerald-800 hover:underline"
                          >
                            <AppIcon name="chat" className="text-[16px] text-emerald-600" />
                            <span>+91 {b.whatsapp}</span>
                          </a>
                        </td>
                        <td className="p-4 font-medium text-slate-600">{b.city || 'Tamil Nadu'}</td>
                        <td className="p-4 font-bold text-slate-900">{b.count} Orders</td>
                        <td className="p-4 font-mono font-bold text-slate-900">
                          ₹{b.spend.toLocaleString('en-IN')}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <a
                            href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(`Hello ${b.name}, regards from All Display Chennai!`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold transition-colors"
                          >
                            <AppIcon name="chat" className="text-xs" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
