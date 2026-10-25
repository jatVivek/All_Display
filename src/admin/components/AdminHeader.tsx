import React from 'react';
import { AdminTab } from '../AdminApp';

interface AdminHeaderProps {
  activeTab: AdminTab;
  role: 'Owner' | 'Staff';
  setRole: (role: 'Owner' | 'Staff') => void;
  onLogout: () => void;
  onOpenTour: () => void;
  onExitAdmin: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  role,
  setRole,
  onLogout,
  onOpenTour,
  onExitAdmin
}) => {
  return (
    <header className="bg-[#1a1c20] text-white h-16 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
      {/* Brand & Breadcrumb */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#ffdf98] text-[#1a1c20] flex items-center justify-center font-serif font-bold text-lg shadow-inner">
          AD
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base tracking-tight">All Display Wholesale Admin</span>
            <span className="bg-[#25D366]/20 text-[#25D366] text-[10px] font-mono px-2 py-0.5 rounded-full border border-[#25D366]/40">
              Live Sync
            </span>
          </div>
          <span className="text-[11px] text-[#c6c6cb] capitalize">
            Active Section: <strong className="text-[#ffdf98]">{activeTab.replace('-', ' ')}</strong>
          </span>
        </div>
      </div>

      {/* Center / Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Switcher */}
        <div className="hidden sm:flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          <span className="text-white/60 px-2 font-medium">Role:</span>
          <button
            onClick={() => setRole('Owner')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              role === 'Owner' ? 'bg-[#ffdf98] text-[#1a1c20] shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            Owner
          </button>
          <button
            onClick={() => setRole('Staff')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              role === 'Staff' ? 'bg-[#ffdf98] text-[#1a1c20] shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            Staff
          </button>
        </div>

        {/* Guided Tour */}
        <button
          onClick={onOpenTour}
          className="hidden md:flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white px-3 py-2 rounded-xl text-xs font-medium transition-colors"
          title="Guided Tour"
        >
          <span className="material-symbols-outlined text-[18px] text-[#ffdf98]">help</span>
          <span>Tour</span>
        </button>

        {/* Storefront Link */}
        <button
          onClick={onExitAdmin}
          className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">storefront</span>
          <span className="hidden sm:inline">View Website</span>
        </button>

        {/* Lock / Logout */}
        <button
          onClick={onLogout}
          className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Lock Admin Panel"
        >
          <span className="material-symbols-outlined text-[18px]">lock</span>
        </button>
      </div>
    </header>
  );
};
