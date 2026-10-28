import { AppIcon } from '../../components/AppIcon';
import type { AppIconName } from '../../components/AppIcon';
import React from 'react';
import { AdminTab } from '../AdminApp';
import { storeManager } from '../../services/storeManager';
import { getWhatsAppNumber } from '../../utils/whatsapp';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const orders = storeManager.getOrders();
  const newOrdersCount = orders.filter(o => o.status === 'New (Awaiting WhatsApp)').length;
  const quotes = storeManager.getQuotes();
  const pendingQuotesCount = quotes.filter(q => q.status === 'Pending Review').length;

  const menuItems: { id: AdminTab; label: string; icon: AppIconName; badge?: number; subtitle: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', subtitle: 'Main Overview' },
    { id: 'orders', label: 'Orders List', icon: 'list_alt', badge: newOrdersCount > 0 ? newOrdersCount : undefined, subtitle: 'Incoming Orders' },
    { id: 'quotes', label: 'Custom Quotes', icon: 'request_quote', badge: pendingQuotesCount > 0 ? pendingQuotesCount : undefined, subtitle: 'Bespoke Inquiries' },
    { id: 'products', label: 'Products & Stock', icon: 'inventory_2', subtitle: 'Displays & Packaging' },
    { id: 'categories', label: 'Categories', icon: 'category', subtitle: 'Catalog Sections' },
    { id: 'homepage', label: 'Homepage Banners', icon: 'view_carousel', subtitle: 'Hero Slides' },
    { id: 'customers', label: 'Customer Directory', icon: 'group', subtitle: 'Boutique Buyers' },
    { id: 'media', label: 'Media Library', icon: 'perm_media', subtitle: 'Optimized Assets' },
    { id: 'settings', label: 'Business Settings', icon: 'settings', subtitle: 'WhatsApp & UPI' },
    { id: 'team', label: 'Team & Roles', icon: 'admin_panel_settings', subtitle: 'Owner & Staff' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 hidden md:flex select-none">
      <div className="p-4 border-b border-slate-200">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Store Administration
        </span>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <AppIcon name={item.icon} className={`text-[20px] ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                <div className="flex flex-col text-left">
                  <span className="leading-tight">{item.label}</span>
                  <span className={`text-[9px] font-normal ${isActive ? 'text-orange-500' : 'text-slate-400'}`}>
                    {item.subtitle}
                  </span>
                </div>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-orange-600 text-white font-bold px-2 py-0.5 rounded-full text-[10px] animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
          <span className="text-[11px] font-medium text-slate-800">Feel Khana Depot Online</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1 font-mono">
          WhatsApp: +{getWhatsAppNumber()}
        </p>
      </div>
    </aside>
  );
};
