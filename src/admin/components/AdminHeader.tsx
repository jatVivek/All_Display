import { AppIcon } from '../../components/AppIcon';
import React from 'react';
import { AdminTab } from '../AdminApp';

interface AdminHeaderProps {
  activeTab: AdminTab;
  role: 'Owner' | 'Staff';
  syncStatus: 'local' | 'connecting' | 'connected' | 'error';
  onLogout: () => void;
  onOpenTour: () => void;
  onExitAdmin: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  role,
  syncStatus,
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
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              syncStatus === 'connected'
                ? 'bg-[#25D366]/20 text-[#25D366] border-[#25D366]/40'
                : syncStatus === 'error'
                  ? 'bg-red-500/20 text-red-300 border-red-400/40'
                  : 'bg-white/10 text-white/70 border-white/20'
            }`}>
              {syncStatus === 'connected' ? 'Shared DB' : syncStatus === 'connecting' ? 'Connecting' : syncStatus === 'error' ? 'Sync Error' : 'Local Only'}
            </span>
          </div>
          <span className="text-[11px] text-[#c6c6cb] capitalize">
            Active Section: <strong className="text-[#ffdf98]">{activeTab.replace('-', ' ')}</strong>
          </span>
        </div>
      </div>

      {/* Center / Right Controls */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-xs text-white/70">{role}</span>

        {/* Guided Tour */}
        <button
          onClick={onOpenTour}
          className="hidden md:flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white px-3 py-2 rounded-xl text-xs font-medium transition-colors"
          title="Guided Tour"
        >
          <AppIcon name="help" className="text-[18px] text-[#ffdf98]" />
          <span>Tour</span>
        </button>

        {/* Storefront Link */}
        <button
          onClick={onExitAdmin}
          className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer"
        >
          <AppIcon name="storefront" className="text-[18px]" />
          <span className="hidden sm:inline">View Website</span>
        </button>

        {/* Lock / Logout */}
        <button
          onClick={onLogout}
          className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Lock Admin Panel"
        >
          <AppIcon name="lock" className="text-[18px]" />
        </button>
      </div>
    </header>
  );
};
