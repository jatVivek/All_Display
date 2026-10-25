import { AppIcon } from '../../components/AppIcon';
import React, { useState } from 'react';
import { storeManager, AdminSettings } from '../../services/storeManager';

interface AdminSettingsViewProps {
  role: 'Owner' | 'Staff';
  showToast: (msg: string) => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ role, showToast }) => {
  const [settings, setSettings] = useState<AdminSettings>(() => storeManager.getSettings());

  const handleChange = (field: keyof AdminSettings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== 'Owner') {
      showToast('Staff role cannot modify business settings. Switch to Owner mode.');
      return;
    }
    if (!await storeManager.saveSettings(settings)) {
      showToast(storeManager.getState().catalogSyncError || 'Could not save business settings.');
      return;
    }
    showToast('Business & WhatsApp settings saved successfully!');
  };

  const handleReset = async () => {
    if (window.confirm('Restore the factory catalog and default business settings? Submitted orders and quote requests will be kept.')) {
      if (!await storeManager.resetAllData()) {
        showToast('Reset failed to sync the shared catalog. Check the database sync error.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-[#e6e2dc] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AppIcon name="settings" className="text-[#775a00] text-[24px]" />
            <h1 className="font-serif text-2xl font-bold text-[#1c1c18]">Business &amp; WhatsApp Settings</h1>
          </div>
          <p className="text-xs text-[#76777b]">
            Configure WhatsApp destination numbers, UPI ID, bank account details for proformas, and factory address.
          </p>
        </div>

        {role === 'Owner' && (
          <button
            onClick={handleReset}
            className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Reset Catalog &amp; Settings
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-[#e6e2dc] shadow-sm flex flex-col gap-5">
        <h2 className="font-serif font-bold text-base text-[#1c1c18]">WhatsApp &amp; Banking Parameters</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1c1c18]">Primary WhatsApp Number (Orders Desk)</label>
            <input
              type="tel"
              value={settings.whatsappNumber}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              placeholder="919876543210"
              className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs font-mono focus:outline-none focus:border-[#775a00]"
            />
            <span className="text-[10px] text-[#76777b]">Saved to the shared database and used by the storefront WhatsApp buttons.</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1c1c18]">Alternate WhatsApp Number (CAD / Floor Plans)</label>
            <input
              type="tel"
              value={settings.alternateWhatsapp}
              onChange={(e) => handleChange('alternateWhatsapp', e.target.value)}
              placeholder="919876543210"
              className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs font-mono focus:outline-none focus:border-[#775a00]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1c1c18]">UPI ID for Advance Payments</label>
            <input
              type="text"
              value={settings.upiId}
              onChange={(e) => handleChange('upiId', e.target.value)}
              className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs font-mono focus:outline-none focus:border-[#775a00]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1c1c18]">Bank Name &amp; Branch</label>
            <input
              type="text"
              value={settings.bankName}
              onChange={(e) => handleChange('bankName', e.target.value)}
              className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs focus:outline-none focus:border-[#775a00]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1c1c18]">Account Number</label>
            <input
              type="text"
              value={settings.accountNo}
              onChange={(e) => handleChange('accountNo', e.target.value)}
              className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs font-mono focus:outline-none focus:border-[#775a00]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1c1c18]">IFSC Code</label>
            <input
              type="text"
              value={settings.ifscCode}
              onChange={(e) => handleChange('ifscCode', e.target.value)}
              className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs font-mono focus:outline-none focus:border-[#775a00]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#1c1c18]">Business Address &amp; Showroom Location</label>
          <input
            type="text"
            value={settings.businessAddress}
            onChange={(e) => handleChange('businessAddress', e.target.value)}
            className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs focus:outline-none focus:border-[#775a00]"
          />
        </div>

        <div className="pt-4 border-t border-[#e6e2dc] flex justify-end">
          <button
            type="submit"
            className="bg-[#1a1c20] hover:bg-black text-[#ffdf98] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
          >
            Save Business Settings
          </button>
        </div>
      </form>
    </div>
  );
};
