import { AppIcon } from '../../components/AppIcon';
import React, { useState } from 'react';
import { storeManager, AdminSettings } from '../../services/storeManager';

interface AdminSettingsViewProps {
  role: 'Owner' | 'Staff';
  showToast: (msg: string) => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ role, showToast }) => {
  const [settings, setSettings] = useState<AdminSettings>(() => storeManager.getSettings());
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const handleChange = (field: keyof AdminSettings, value: string | number) => {
    setSettings((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'brandName') {
        next.storeName = String(value);
      } else if (field === 'storeName') {
        next.brandName = String(value);
      }
      return next;
    });
  };

  const handleUploadLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('/api/admin/uploads', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'X-Admin-Request': '1' },
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || `Logo upload failed (${response.status}).`);
      }
      handleChange('logoUrl', result.url);
      showToast('Brand logo uploaded successfully!');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Logo upload failed.');
    } finally {
      setIsUploadingLogo(false);
    }
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
    showToast('Brand, business & WhatsApp settings saved successfully!');
  };

  const handleReset = async () => {
    if (window.confirm('Restore default Vinayak Packaging settings and catalog? Submitted orders and quote requests will be kept.')) {
      if (!await storeManager.resetAllData()) {
        showToast('Reset failed to sync the shared catalog. Check the database sync error.');
      } else {
        setSettings(storeManager.getSettings());
        showToast('Settings and catalog restored to default.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AppIcon name="settings" className="text-orange-600 text-[24px]" />
            <h1 className="text-2xl font-bold text-slate-900">Brand, Storefront &amp; Business Settings</h1>
          </div>
          <p className="text-xs text-slate-500">
            Configure dynamic brand name, logo, header notice, WhatsApp desk number, UPI &amp; bank accounts.
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

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col gap-6">
        
        {/* SECTION 1: BRAND IDENTITY & LOGO */}
        <div className="flex flex-col gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <AppIcon name="verified" className="text-orange-600 text-lg" />
            <h2 className="font-bold text-base text-slate-900">Brand Identity &amp; Logo</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Brand Name</label>
              <input
                type="text"
                required
                value={settings.brandName || ''}
                onChange={(e) => handleChange('brandName', e.target.value)}
                placeholder="Vinayak Packaging"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Brand Tagline</label>
              <input
                type="text"
                value={settings.brandTagline || ''}
                onChange={(e) => handleChange('brandTagline', e.target.value)}
                placeholder="Jewellery Displays & Packaging Manufacturer"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Live Base URL</label>
              <input
                type="text"
                value={settings.siteUrl || 'https://all-display.vercel.app/'}
                onChange={(e) => handleChange('siteUrl', e.target.value)}
                placeholder="https://all-display.vercel.app/"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Logo URL & File Upload */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-xs overflow-hidden">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt="Brand Logo Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400 font-semibold text-center">No Logo Set</span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Logo Preview</span>
            </div>

            <div className="flex-1 w-full flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-800">Brand Logo URL</label>
              <input
                type="text"
                value={settings.logoUrl || ''}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                placeholder="https://... or upload from your device"
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500"
              />

              <div className="flex items-center gap-3 mt-1">
                <label className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-orange-700 bg-orange-100 hover:bg-orange-200 transition-colors cursor-pointer ${
                  isUploadingLogo ? 'opacity-50 cursor-wait' : ''
                }`}>
                  <AppIcon name="upload" className="text-sm" />
                  <span>{isUploadingLogo ? 'Uploading...' : 'Upload Logo File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingLogo}
                    onChange={handleUploadLogo}
                    className="sr-only"
                  />
                </label>
                {settings.logoUrl && (
                  <button
                    type="button"
                    onClick={() => handleChange('logoUrl', '')}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium"
                  >
                    Clear Logo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Header Notice */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-800">Storefront Header Top Notice</label>
            <input
              type="text"
              value={settings.headerNotice || ''}
              onChange={(e) => handleChange('headerNotice', e.target.value)}
              placeholder="✦ Wholesale Jewellery Displays, Velvet Busts & Packaging Tools — Sowcarpet, Chennai • Fast Dispatch across India"
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
            <span className="text-[10px] text-slate-500">Displays at the very top banner bar of all storefront pages.</span>
          </div>
        </div>

        {/* SECTION 2: WHATSAPP & SUPPORT */}
        <div className="flex flex-col gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <AppIcon name="chat" className="text-emerald-600 text-lg" />
            <h2 className="font-bold text-base text-slate-900">WhatsApp &amp; Support Contact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Primary WhatsApp Number (Order Desk)</label>
              <input
                type="tel"
                value={settings.whatsappNumber || ''}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="919462247004"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Alternate Support Phone</label>
              <input
                type="tel"
                value={settings.supportPhone || ''}
                onChange={(e) => handleChange('supportPhone', e.target.value)}
                placeholder="+91 94622 47004"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail || ''}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                placeholder="contact@www.vinayakpack.com"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Showroom / Depot Location</label>
              <input
                type="text"
                value={settings.showroomAddress || settings.businessAddress || ''}
                onChange={(e) => {
                  handleChange('showroomAddress', e.target.value);
                  handleChange('businessAddress', e.target.value);
                }}
                placeholder="29, Perumal Mudali St, Sowcarpet, George Town, Chennai - 600001"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: BANKING & PAYMENTS */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <AppIcon name="payments" className="text-orange-600 text-lg" />
            <h2 className="font-bold text-base text-slate-900">Banking &amp; Advance Payment Parameters</h2>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-800">UPI ID for B2B Wholesale Advances</label>
            <input
              type="text"
              value={settings.upiId || ''}
              onChange={(e) => handleChange('upiId', e.target.value)}
              placeholder="vinayakpack@okhdfcbank"
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Bank Name &amp; Branch</label>
              <input
                type="text"
                value={settings.bankName || ''}
                onChange={(e) => handleChange('bankName', e.target.value)}
                placeholder="HDFC Bank, Sowcarpet Branch"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Account Number</label>
              <input
                type="text"
                value={settings.accountNo || ''}
                onChange={(e) => handleChange('accountNo', e.target.value)}
                placeholder="50200084729104"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">IFSC Code</label>
              <input
                type="text"
                value={settings.ifscCode || ''}
                onChange={(e) => handleChange('ifscCode', e.target.value)}
                placeholder="HDFC0001842"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
};
