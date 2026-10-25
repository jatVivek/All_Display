import React from 'react';
import { AdminTab } from '../AdminApp';
import { storeManager } from '../../services/storeManager';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const orders = storeManager.getOrders();
  const newOrdersCount = orders.filter(o => o.status === 'New (Awaiting WhatsApp)').length;
  const quotes = storeManager.getQuotes();
  const pendingQuotesCount = quotes.filter(q => q.status === 'Pending Review').length;

  const menuItems: { id: AdminTab; label: string; icon: string; badge?: number; hinglish: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', hinglish: 'Main Overview' },
    { id: 'orders', label: 'Orders List', icon: 'orders', badge: newOrdersCount > 0 ? newOrdersCount : undefined, hinglish: 'Naye Orders' },
    { id: 'quotes', label: 'Quote Requests', icon: 'request_quote', badge: pendingQuotesCount > 0 ? pendingQuotesCount : undefined, hinglish: 'Bespoke Inquiries' },
    { id: 'products', label: 'Products & Stock', icon: 'inventory_2', hinglish: 'Racks & Materials' },
    { id: 'categories', label: 'Categories CRUD', icon: 'category', hinglish: 'Store Sections' },
    { id: 'homepage', label: 'Homepage Banners', icon: 'view_carousel', hinglish: 'Sliders & Videos' },
    { id: 'customers', label: 'Customer Directory', icon: 'group', hinglish: 'Boutique Owners' },
    { id: 'media', label: 'Media Library', icon: 'perm_media', hinglish: 'Store Photos' },
    { id: 'settings', label: 'Business Settings', icon: 'settings', hinglish: 'WhatsApp & UPI' },
    { id: 'team', label: 'Team & Roles', icon: 'admin_panel_settings', hinglish: 'Owner & Staff' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#e6e2dc] flex flex-col shrink-0 hidden md:flex">
      <div className="p-4 border-b border-[#e6e2dc]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#76777b]">
          Wholesale Management
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
                  ? 'bg-[#1a1c20] text-[#ffdf98] shadow-md'
                  : 'text-[#1c1c18] hover:bg-[#f7f3ed]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#ffdf98]' : 'text-[#775a00]'}`}>
                  {item.icon === 'orders' ? 'list_alt' : item.icon}
                </span>
                <div className="flex flex-col text-left">
                  <span className="leading-tight">{item.label}</span>
                  <span className={`text-[9px] font-normal ${isActive ? 'text-white/75' : 'text-[#76777b]'}`}>
                    {item.hinglish}
                  </span>
                </div>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-[#25D366] text-white font-bold px-2 py-0.5 rounded-full text-[10px] animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#e6e2dc] bg-[#fdf9f3]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#25D366] animate-ping"></div>
          <span className="text-[11px] font-medium text-[#1c1c18]">Ranigunj Desk Online</span>
        </div>
        <p className="text-[10px] text-[#76777b] mt-1">
          WhatsApp: +91 73961 27273
        </p>
      </div>
    </aside>
  );
};
