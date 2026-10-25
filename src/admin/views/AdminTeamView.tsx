import React from 'react';

interface AdminTeamViewProps {
  role: 'Owner' | 'Staff';
}

export const AdminTeamView: React.FC<AdminTeamViewProps> = ({ role }) => {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-[#e6e2dc] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#775a00] text-[24px]">admin_panel_settings</span>
            <h1 className="font-serif text-2xl font-bold text-[#1c1c18]">Team Roles &amp; Permissions</h1>
          </div>
          <p className="text-xs text-[#76777b]">
            Your permissions are assigned to your authenticated admin account and enforced by the database.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Owner Card */}
        <div className={`bg-white p-6 rounded-2xl border-2 transition-all flex flex-col justify-between gap-4 ${
          role === 'Owner' ? 'border-[#775a00] shadow-md bg-[#fdf9f3]/50' : 'border-[#e6e2dc]'
        }`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-lg text-[#1c1c18]">Store Owner Role</span>
              {role === 'Owner' && (
                <span className="bg-[#775a00] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Current Role
                </span>
              )}
            </div>
            <p className="text-xs text-[#45474b] leading-relaxed">
              Full administrative privileges. Can modify ex-factory prices, manage business settings, configure UPI/bank details, and edit homepage content.
            </p>
          </div>

          {role === 'Owner' && <span className="bg-[#1a1c20] text-[#ffdf98] w-full py-3 rounded-xl text-xs font-semibold text-center">Assigned to this account</span>}
        </div>

        {/* Staff Card */}
        <div className={`bg-white p-6 rounded-2xl border-2 transition-all flex flex-col justify-between gap-4 ${
          role === 'Staff' ? 'border-[#775a00] shadow-md bg-[#fdf9f3]/50' : 'border-[#e6e2dc]'
        }`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-lg text-[#1c1c18]">Warehouse Staff Role</span>
              {role === 'Staff' && (
                <span className="bg-[#775a00] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Current Role
                </span>
              )}
            </div>
            <p className="text-xs text-[#45474b] leading-relaxed">
              Restricted operational privileges. Can view orders, trigger WhatsApp replies, update dispatch LR numbers, and toggle stock availability. Cannot alter prices or settings.
            </p>
          </div>

          {role === 'Staff' && <span className="bg-[#1a1c20] text-[#ffdf98] w-full py-3 rounded-xl text-xs font-semibold text-center">Assigned to this account</span>}
        </div>
      </div>
    </div>
  );
};
