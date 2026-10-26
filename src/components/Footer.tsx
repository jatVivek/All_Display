import React, { useState, useEffect } from 'react';
import { AppIcon } from './AppIcon';
import { ActiveView } from '../types';
import { getWhatsAppLink } from '../utils/whatsapp';
import { storeManager } from '../services/storeManager';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
  onOpenWishlist?: () => void;
  onOpenAccount?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView, onOpenWishlist, onOpenAccount }) => {
  const [settings, setSettings] = useState(() => storeManager.getSettings());

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(storeManager.getSettings());
    };
    window.addEventListener('vinayak_settings_updated', handleUpdate);
    window.addEventListener('alldisplay_data_updated', handleUpdate);
    return () => {
      window.removeEventListener('vinayak_settings_updated', handleUpdate);
      window.removeEventListener('alldisplay_data_updated', handleUpdate);
    };
  }, []);

  const brandName = settings.brandName || settings.storeName || 'Vinayak Packaging';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-100 pt-14 pb-8 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        
        {/* Top 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-center md:text-left">
          
          {/* 1. Payment Options & Brand Assurance */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2 mb-1">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={brandName}
                  className="h-7 w-auto object-contain max-w-[120px]"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
                  VP
                </div>
              )}
              <span className="font-extrabold text-slate-900 tracking-tight text-sm">
                {brandName}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 tracking-tight uppercase">
              Payment Options
            </h4>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              {['Paytm', 'PhonePe', 'Google Pay', 'BHIM UPI'].map((gateway, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-[11px] font-bold text-slate-700 flex items-center gap-1.5"
                >
                  <AppIcon name="payments" className="text-orange-500 text-xs" />
                  <span>{gateway}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-600 mt-1 max-w-xs">
              100% secure encrypted checkout via UPI, NetBanking, Debit &amp; Credit Cards. Direct factory dispatch.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div className="flex flex-col items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              Quick Links
            </h4>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-slate-600 max-w-md pt-1">
              <button
                type="button"
                onClick={() => setActiveView('shop')}
                className="hover:text-orange-600 transition-colors cursor-pointer"
              >
                Catalog &amp; Shop
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setActiveView('home');
                  setTimeout(() => {
                    document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="hover:text-orange-600 transition-colors cursor-pointer"
              >
                About us
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveView('contact' as ActiveView)}
                className="hover:text-orange-600 transition-colors cursor-pointer"
              >
                Contact us
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => onOpenAccount ? onOpenAccount() : setActiveView('account')}
                className="hover:text-orange-600 transition-colors cursor-pointer font-semibold text-slate-700"
              >
                My Account
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => onOpenWishlist ? onOpenWishlist() : setActiveView('quote-cart')}
                className="hover:text-orange-600 transition-colors cursor-pointer font-semibold text-rose-600"
              >
                Wishlist
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-slate-600 pt-1">
              <button
                type="button"
                onClick={() => setActiveView('shop')}
                className="hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveView('shop')}
                className="hover:underline cursor-pointer"
              >
                Refund and Returns Policy
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveView('shop')}
                className="hover:underline cursor-pointer"
              >
                Terms and conditions
              </button>
            </div>
          </div>

          {/* 3. Social Media & Direct Support */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              Customer Support &amp; Social
            </h4>
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:border-transparent transition-all shadow-2xs"
                title="Instagram"
              >
                <AppIcon name="instagram" className="text-sm" />
              </a>
              <a
                href={getWhatsAppLink(`Hi ${brandName}, I would like to inquire about products.`)}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:text-white hover:bg-emerald-500 hover:border-transparent transition-all shadow-2xs"
                title="WhatsApp"
              >
                <AppIcon name="chat" className="text-sm" />
              </a>
              <a
                href={`tel:${settings.supportPhone || '+919462247004'}`}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:text-white hover:bg-orange-600 hover:border-transparent transition-all shadow-2xs"
                title="Call Depot"
              >
                <AppIcon name="phone" className="text-sm" />
              </a>
            </div>
            <p className="text-[11px] text-slate-600 text-center md:text-right">
              {settings.showroomAddress || 'Sowcarpet Showroom, George Town, Chennai'} • Ph: {settings.supportPhone || '+91 94622 47004'}
            </p>
          </div>

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p className="text-center sm:text-left">
            Copyright © 2025 <strong className="text-slate-800">{brandName}</strong>. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('admin' as any)}
              className="text-slate-600 hover:text-orange-600 text-[11px] font-semibold flex items-center gap-1"
            >
              <AppIcon name="lock" className="text-xs" />
              <span>Admin Portal</span>
            </button>

            {/* Scroll to Top Circle Button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-orange-500 hover:text-orange-600 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              title="Back to Top"
              aria-label="Back to top"
            >
              <AppIcon name="expand_less" className="text-base" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
