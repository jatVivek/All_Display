import React, { useState, useEffect } from 'react';
import { AppIcon } from './AppIcon';
import { ActiveView } from '../types';
import { getWhatsAppLink } from '../utils/whatsapp';
import { storeManager } from '../services/storeManager';
import { useAuth } from '../auth/AuthContext';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
  onOpenWishlist?: () => void;
  onOpenAccount?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView, onOpenWishlist, onOpenAccount }) => {
  const { user, openAuthDialog } = useAuth();
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

  const brandName = settings.brandName || settings.storeName || 'All Display';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAccountClick = () => {
    if (user) {
      if (onOpenAccount) onOpenAccount();
      else setActiveView('account');
    } else {
      openAuthDialog();
    }
  };

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-100 pt-14 pb-8 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        
        {/* Top Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-center md:text-left">
          
          {/* 1. Brand Identity & Assurance */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2 mb-1">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={brandName}
                  className="h-8 w-auto object-contain max-w-[140px]"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
                  AD
                </div>
              )}
              <span className="font-extrabold text-slate-900 tracking-tight text-base">
                {brandName}
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
              Premium jewellery display stands, velvet trays, acrylic organizers, and customized luxury packaging solutions. Direct wholesale supply across India.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Direct Factory Wholesale • Same-Day Dispatch</span>
            </div>
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
                onClick={handleAccountClick}
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

        {/* Bottom Copyright, Powered by Rusa Tech & Back to Top */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p className="text-center sm:text-left">
            Copyright © {new Date().getFullYear()} <strong className="text-slate-800">{brandName}</strong>. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <a
              href="https://wa.me/916269254726?text=Hi%20Rusa%20Tech"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-700 hover:text-orange-600 transition-colors flex items-center gap-1.5"
            >
              <span>Powered by</span>
              <span className="text-orange-600 font-extrabold hover:underline">Rusa Tech</span>
            </a>

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
