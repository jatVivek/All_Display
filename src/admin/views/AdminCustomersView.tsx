import { AppIcon } from '../../components/AppIcon';
import React from 'react';
import { storeManager } from '../../services/storeManager';

export const AdminCustomersView: React.FC = () => {
  const orders = storeManager.getOrders();

  // Aggregate customers from orders
  const customerMap: Record<string, { name: string; storeName: string; whatsapp: string; city: string; count: number; spend: number; lastDate: string }> = {};

  orders.forEach(o => {
    if (!customerMap[o.whatsapp]) {
      customerMap[o.whatsapp] = {
        name: o.customerName,
        storeName: o.storeName,
        whatsapp: o.whatsapp,
        city: o.destination,
        count: 0,
        spend: 0,
        lastDate: o.date
      };
    }
    customerMap[o.whatsapp].count += 1;
    customerMap[o.whatsapp].spend += o.total;
  });

  const customers = Object.values(customerMap);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AppIcon name="group" className="text-orange-600 text-[24px]" />
            <h1 className="text-2xl font-bold text-slate-900">Boutique &amp; Client Directory</h1>
          </div>
          <p className="text-xs text-slate-500">
            Repeat buyers, jewellery boutique owners, and retail clients across Chennai, Tamil Nadu, and PAN India.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 pl-6">Store &amp; Proprietor</th>
                <th className="p-4">WhatsApp Contact</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4 pr-6 text-right">Total Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400">
                    No customer order records found yet. As orders are placed, clients will appear here.
                  </td>
                </tr>
              ) : (
                customers.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{c.storeName}</span>
                        <span className="text-[11px] text-slate-500">Contact: {c.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-emerald-700 font-semibold flex items-center gap-1 pt-5">
                      <AppIcon name="chat" className="text-[16px]" />
                      <span>+91 {c.whatsapp}</span>
                    </td>
                    <td className="p-4 font-medium text-slate-600">{c.city}</td>
                    <td className="p-4 font-bold text-slate-900">{c.count} Orders</td>
                    <td className="p-4 pr-6 text-right font-mono font-bold text-slate-900">
                      ₹{c.spend.toLocaleString('en-IN')}
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
