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
    <header className="bg-white text-slate-800 h-16 px-6 flex items-center justify-between border-b border-slate-200 shrink-0 shadow-xs">
      {/* Brand & Breadcrumb */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
          VP
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-slate-900">Vinayak Packaging Admin</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              syncStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : syncStatus === 'error'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {syncStatus === 'connected' ? 'MySQL Connected' : syncStatus === 'connecting' ? 'Connecting' : syncStatus === 'error' ? 'Sync Error' : 'Local Only'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 capitalize">
            Section: <strong className="text-orange-600 font-semibold">{activeTab.replace('-', ' ')}</strong>
          </span>
        </div>
      </div>

      {/* Center / Right Controls */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
          Role: <strong className="ml-1 text-slate-900">{role}</strong>
        </span>

        {/* Guided Tour */}
        <button
          onClick={onOpenTour}
          className="hidden md:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer border border-slate-200"
          title="Guided Tour"
        >
          <AppIcon name="help" className="text-[18px] text-orange-600" />
          <span>Tour</span>
        </button>

        {/* Storefront Link */}
        <button
          onClick={onExitAdmin}
          className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
        >
          <AppIcon name="storefront" className="text-[18px]" />
          <span className="hidden sm:inline">View Website</span>
        </button>

        {/* Lock / Logout */}
        <button
          onClick={onLogout}
          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 flex items-center justify-center transition-colors cursor-pointer border border-slate-200"
          title="Lock Admin Panel"
        >
          <AppIcon name="lock" className="text-[18px]" />
        </button>
      </div>
    </header>
  );
};
