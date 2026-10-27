import { AppIcon } from '../../components/AppIcon';
import React, { useState } from 'react';
import { storeManager, AdminSettings } from '../../services/storeManager';
import { compressImage } from '../../utils/imageCompressor';

interface AdminSettingsViewProps {
  role: 'Owner' | 'Staff';
  showToast: (msg: string) => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ role, showToast }) => {
  const [settings, setSettings] = useState<AdminSettings>(() => storeManager.getSettings());
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [dbInfo, setDbInfo] = useState<{
    configured: boolean;
    connected: boolean;
    host: string | null;
    database: string | null;
    user: string | null;
    mode: string;
  } | null>(null);
  const [testUrl, setTestUrl] = useState('');
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  React.useEffect(() => {
    storeManager.getDatabaseInfo().then(setDbInfo).catch(() => null);

    // Auto-sanitize legacy "Vinayak Packaging" and broken "/uploads/..." URLs on mount
    const current = storeManager.getSettings();
    let needsUpdate = false;
    let brand = current.brandName || current.storeName || 'All Display';
    if (!brand || /vinayak/i.test(brand)) {
      brand = 'All Display';
      needsUpdate = true;
    }
    let logo = current.logoUrl || '/assets/logo.png';
    if (typeof logo === 'string' && (logo.startsWith('/uploads/') || logo.includes('vinayak/logo.png') || logo.includes('logo_alldisplay.svg'))) {
      logo = '/assets/logo.png';
      needsUpdate = true;
    }
    if (needsUpdate) {
      const sanitized = { ...current, brandName: brand, storeName: brand, logoUrl: logo };
      setSettings(sanitized);
      void storeManager.saveSettings(sanitized);
    }

    const unsubscribe = storeManager.subscribe((state) => {
      if (state.settings) {
        setSettings((prev) => {
          let updatedLogo = state.settings.logoUrl || prev.logoUrl;
          if (typeof updatedLogo === 'string' && (updatedLogo.startsWith('/uploads/') || updatedLogo.includes('vinayak/logo.png') || updatedLogo.includes('logo_alldisplay.svg'))) {
            updatedLogo = '/assets/logo.png';
          }
          return { ...state.settings, logoUrl: updatedLogo };
        });
      }
    });
    return unsubscribe;
  }, []);

  const handleTestDatabase = async () => {
    setIsTestingDb(true);
    setTestResult(null);
    try {
      const res = await storeManager.testDatabaseConnection(testUrl.trim() || undefined);
      setTestResult(res);
      if (res.success) {
        showToast('Database connection test successful!');
      } else {
        showToast(res.error || 'Connection failed.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Database test failed';
      setTestResult({ success: false, error: msg });
      showToast(msg);
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleChange = (field: keyof AdminSettings, value: string | number | Record<string, string>) => {
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
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      // Issue #2 & #20: High-clarity client-side WebP compression (max 500x250, 0.88 quality ~ 15-25 KB)
      const compressedLogo = await compressImage(file, { maxWidth: 500, maxHeight: 250, quality: 0.88 });
      
      handleChange('logoUrl', compressedLogo);
      const updatedSettings = {
        ...settings,
        storeName: settings.brandName || settings.storeName || 'All Display',
        brandName: settings.brandName || settings.storeName || 'All Display',
        logoUrl: compressedLogo,
      };
      await storeManager.saveSettings(updatedSettings);
      showToast('Brand logo updated and synced across storefront!');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Logo upload failed.');
    } finally {
      setIsUploadingLogo(false);
      event.target.value = '';
    }
  };

  const handleResetDefaultLogo = async () => {
    handleChange('logoUrl', '/assets/logo.png');
    const updatedSettings = {
      ...settings,
      logoUrl: '/assets/logo.png',
    };
    await storeManager.saveSettings(updatedSettings);
    showToast('Default All Display logo restored!');
  };

  const handleUploadRequirementImage = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, { maxWidth: 600, maxHeight: 450, quality: 0.85 });
      const currentReqs = { ...(settings.requirementImages || {}) };
      currentReqs[key] = compressed;
      handleChange('requirementImages', currentReqs);
      await storeManager.saveSettings({ ...settings, requirementImages: currentReqs });
      showToast('Requirement card image updated and saved!');
    } catch {
      showToast('Could not process image.');
    } finally {
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== 'Owner') {
      showToast('Staff role cannot modify business settings. Switch to Owner mode.');
      return;
    }

    const cleanDigits = (n?: string) => (n || '').replace(/\D/g, '');
    const pDigits = cleanDigits(settings.whatsappNumber);
    const aDigits = cleanDigits(settings.alternateWhatsapp);

    if (pDigits && (pDigits.length < 10 || pDigits.length > 15)) {
      showToast('Please enter a valid 10 to 15 digit Primary WhatsApp number.');
      return;
    }
    if (aDigits && (aDigits.length < 10 || aDigits.length > 15)) {
      showToast('Please enter a valid 10 to 15 digit Alternate WhatsApp number.');
      return;
    }

    const normalizedPrimary = pDigits.length === 10 ? `91${pDigits}` : (pDigits || settings.whatsappNumber);
    const normalizedAlternate = aDigits.length === 10 ? `91${aDigits}` : (aDigits || settings.alternateWhatsapp || normalizedPrimary);

    const payload: AdminSettings = {
      ...settings,
      whatsappNumber: normalizedPrimary,
      alternateWhatsapp: normalizedAlternate,
      supportPhone: settings.supportPhone?.trim() || '+91 94622 47004',
      storeName: settings.brandName || settings.storeName || 'All Display',
      brandName: settings.brandName || settings.storeName || 'All Display',
    };

    if (!await storeManager.saveSettings(payload)) {
      showToast(storeManager.getState().catalogSyncError || 'Could not save business settings.');
      return;
    }
    setSettings(storeManager.getSettings());
    showToast('Brand, WhatsApp numbers & business settings saved successfully!');
  };

  const handleReset = async () => {
    if (window.confirm('Restore default All Display settings and catalog? Submitted orders and quote requests will be kept.')) {
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
                placeholder="All Display"
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
                <img
                  src={settings.logoUrl || '/assets/logo.png'}
                  alt="Brand Logo Preview"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/logo.png';
                  }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Logo Preview</span>
            </div>

            <div className="flex-1 w-full flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800">Brand Logo (File or URL)</label>
                {settings.logoUrl?.startsWith('data:') && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2 py-0.5 rounded-md">
                    Custom Uploaded Image (Active)
                  </span>
                )}
              </div>
              <input
                type="text"
                value={settings.logoUrl?.startsWith('data:') ? '[Uploaded WebP Image Active]' : (settings.logoUrl || '')}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val !== '[Uploaded WebP Image Active]') {
                    handleChange('logoUrl', val);
                  }
                }}
                placeholder="https://... or click Upload Logo File below"
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500"
              />

              <div className="flex flex-wrap items-center gap-2.5 mt-1">
                <label className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-orange-700 bg-orange-100 hover:bg-orange-200 transition-colors cursor-pointer ${
                  isUploadingLogo ? 'opacity-50 cursor-wait' : ''
                }`}>
                  <AppIcon name={isUploadingLogo ? 'progress_activity' : 'upload'} className={`text-sm ${isUploadingLogo ? 'animate-spin' : ''}`} />
                  <span>{isUploadingLogo ? 'Compressing & Uploading...' : 'Upload Logo File'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                    disabled={isUploadingLogo}
                    onChange={handleUploadLogo}
                    className="sr-only"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleResetDefaultLogo}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Reset to default All Display logo"
                >
                  Restore Default Logo
                </button>

                {settings.logoUrl && settings.logoUrl !== '/assets/logo_alldisplay.svg' && settings.logoUrl !== '/assets/vinayak/logo.png' && (
                  <button
                    type="button"
                    onClick={() => handleChange('logoUrl', '')}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1"
                  >
                    Clear
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

          {/* Issue #12: Shop by Requirement Images Configuration */}
          <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <AppIcon name="hub" className="text-orange-600 text-sm" />
                Shop By Requirement Card Images
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Upload or change images for each requirement segment on the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'online-sellers', label: 'Online Sellers', defaultImg: '/assets/vinayak/req_online_sellers.png' },
                { key: 'instagram-shop', label: 'Instagram Shop', defaultImg: '/assets/vinayak/req_instagram_shop.png' },
                { key: 'new-jewellery', label: 'New Jewellery Sellers', defaultImg: '/assets/vinayak/req_new_jewellery.png' },
                { key: 'retail-shops', label: 'Retail Shops', defaultImg: '/assets/vinayak/req_retail_shops.png' },
              ].map((item) => {
                const currentImg = settings.requirementImages?.[item.key] || item.defaultImg;
                return (
                  <div key={item.key} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                    <img
                      src={currentImg}
                      alt={item.label}
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0"
                    />
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <span className="text-xs font-bold text-slate-900 truncate">{item.label}</span>
                      <label className="w-fit text-[11px] font-semibold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer">
                        <span>Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadRequirementImage(item.key, e)}
                          className="sr-only"
                        />
                      </label>
                      {settings.requirementImages?.[item.key] && (
                        <button
                          type="button"
                          onClick={async () => {
                            const updated = { ...(settings.requirementImages || {}) };
                            delete updated[item.key];
                            handleChange('requirementImages', updated);
                            await storeManager.saveSettings({ ...settings, requirementImages: updated });
                            showToast(`Reset ${item.label} image to default.`);
                          }}
                          className="w-fit text-[10px] text-rose-500 hover:text-rose-700 cursor-pointer"
                        >
                          Reset to default
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 2: WHATSAPP & SUPPORT */}
        <div className="flex flex-col gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <AppIcon name="chat" className="text-emerald-600 text-lg" />
            <h2 className="font-bold text-base text-slate-900">WhatsApp &amp; Support Contact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Primary WhatsApp Number (Order Desk)</label>
              <input
                type="tel"
                value={settings.whatsappNumber || ''}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="919462247004"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
              <span className="text-[10px] text-slate-500">For direct cart orders &amp; product inquiries.</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Alternate WhatsApp Number (Wholesale Quotes)</label>
              <input
                type="tel"
                value={settings.alternateWhatsapp || ''}
                onChange={(e) => handleChange('alternateWhatsapp', e.target.value)}
                placeholder="919462247004"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
              <span className="text-[10px] text-slate-500">For wholesale quote desk &amp; specialist chat.</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Support Calling Phone (Call For Order)</label>
              <input
                type="tel"
                value={settings.supportPhone || ''}
                onChange={(e) => handleChange('supportPhone', e.target.value)}
                placeholder="+91 94622 47004"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
              <span className="text-[10px] text-slate-500">Displays on header top bar &amp; contact cards.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail || ''}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                placeholder="contact@alldisplay.com"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
              <span className="text-[10px] text-slate-500">Customer service &amp; corporate inquiries.</span>
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
              <span className="text-[10px] text-slate-500">Physical address in Sowcarpet, Chennai.</span>
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
              placeholder="alldisplay@okhdfcbank"
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

      {/* SECTION 4: CLOUD DATABASE CONFIGURATION & TESTER */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <AppIcon name="database" className="text-orange-600 text-[22px]" />
            <div>
              <h2 className="font-bold text-base text-slate-900">Cloud MySQL Database Connection</h2>
              <p className="text-xs text-slate-500">Live persistence settings for Vercel Serverless deployment</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              dbInfo?.connected
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${dbInfo?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
              {dbInfo?.connected ? 'Connected (MySQL)' : 'Standalone Mode (Active)'}
            </span>
          </div>
        </div>

        {/* Info summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block mb-0.5">Mode:</span>
            <span className="font-semibold text-slate-800">
              {dbInfo?.connected ? 'Cloud MySQL Database' : 'Standalone In-Memory / LocalStorage'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Host:</span>
            <span className="font-mono text-slate-800">{dbInfo?.host || 'None (Local memory)'}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Database:</span>
            <span className="font-mono text-slate-800">{dbInfo?.database || 'None'}</span>
          </div>
        </div>

        {/* Database Tester */}
        <div className="flex flex-col gap-3 pt-2">
          <label className="text-xs font-semibold text-slate-800">Test MySQL Connection String</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="mysql://username:password@host:3306/dbname?ssl=true (Leave blank to test active server connection)"
              className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
            <button
              type="button"
              disabled={isTestingDb}
              onClick={handleTestDatabase}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isTestingDb ? (
                <>
                  <AppIcon name="refresh" className="animate-spin text-sm" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <AppIcon name="wifi_tethering" className="text-sm" />
                  <span>Test Connection</span>
                </>
              )}
            </button>
          </div>

          {testResult && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              testResult.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              <AppIcon name={testResult.success ? 'check_circle' : 'error'} className="text-base shrink-0" />
              <span>{testResult.message || testResult.error}</span>
            </div>
          )}
        </div>

        {/* Step-by-step instructions */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-950 flex flex-col gap-2">
          <div className="font-bold flex items-center gap-1.5 text-amber-900">
            <AppIcon name="info" className="text-base text-amber-600" />
            <span>How to Connect Cloud MySQL on Vercel:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-700 leading-relaxed ml-1">
            <li>Go to your Vercel Dashboard &gt; <strong>All_Display</strong> project &gt; <strong>Settings</strong> &gt; <strong>Environment Variables</strong>.</li>
            <li>Add <code>DATABASE_URL</code> with your cloud database URI (e.g. from TiDB Cloud, PlanetScale, Railway, or AWS RDS).</li>
            <li>Add <code>ADMIN_PASSWORD</code>: <code>12345678912345678</code></li>
            <li>Add <code>MYSQL_SSL</code>: <code>true</code> and <code>MYSQL_SSL_REJECT_UNAUTHORIZED</code>: <code>false</code>.</li>
            <li>Redeploy your latest commit. Tables will automatically be created on the cloud database!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
