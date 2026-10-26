import { AppIcon } from '../../components/AppIcon';
import React from 'react';

interface AdminTeamViewProps {
  role: 'Owner' | 'Staff';
}

export const AdminTeamView: React.FC<AdminTeamViewProps> = ({ role }) => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AppIcon name="admin_panel_settings" className="text-orange-600 text-[24px]" />
            <h1 className="text-2xl font-bold text-slate-900">Team Roles &amp; Permissions</h1>
          </div>
          <p className="text-xs text-slate-500">
            Role privileges configured for your authenticated admin session and stored securely in MySQL.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Owner Card */}
        <div className={`bg-white p-6 rounded-2xl border-2 transition-all flex flex-col justify-between gap-4 ${
          role === 'Owner' ? 'border-orange-500 shadow-xs bg-orange-50/20' : 'border-slate-200'
        }`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-slate-900">Store Owner Role</span>
              {role === 'Owner' && (
                <span className="bg-orange-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Current Role
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full administrative privileges. Can add or delete products, modify prices, manage business settings, configure UPI/bank details, and edit homepage content.
            </p>
          </div>

          {role === 'Owner' && (
            <span className="bg-slate-900 text-white w-full py-3 rounded-xl text-xs font-semibold text-center">
              Active Session
            </span>
          )}
        </div>

        {/* Staff Card */}
        <div className={`bg-white p-6 rounded-2xl border-2 transition-all flex flex-col justify-between gap-4 ${
          role === 'Staff' ? 'border-orange-500 shadow-xs bg-orange-50/20' : 'border-slate-200'
        }`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-slate-900">Depot Staff Role</span>
              {role === 'Staff' && (
                <span className="bg-orange-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Current Role
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Restricted operational privileges. Can view orders, trigger WhatsApp customer replies, update tracking numbers, and toggle stock availability. Cannot alter prices or banking settings.
            </p>
          </div>

          {role === 'Staff' && (
            <span className="bg-slate-900 text-white w-full py-3 rounded-xl text-xs font-semibold text-center">
              Active Session
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
