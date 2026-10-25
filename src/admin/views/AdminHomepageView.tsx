import React, { useState } from 'react';

interface AdminHomepageViewProps {
  showToast: (msg: string) => void;
}

export const AdminHomepageView: React.FC<AdminHomepageViewProps> = ({ showToast }) => {
  const [heroTitle, setHeroTitle] = useState('Heavy-Duty Retail Display Fixtures & Racks');
  const [heroSubtitle, setHeroSubtitle] = useState('Factory Direct Wholesale from Ranigunj & Begum Bazaar, Hyderabad. Built for Garment Showrooms & Boutiques.');
  const [bannerNotice, setBannerNotice] = useState('PAN-INDIA FREIGHT LOGISTICS • DIRECT FACTORY WHOLESALE RATES');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Homepage banners and titles updated successfully!');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-[#e6e2dc] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#775a00] text-[24px]">view_carousel</span>
            <h1 className="font-serif text-2xl font-bold text-[#1c1c18]">Homepage Banner &amp; Content Manager</h1>
          </div>
          <p className="text-xs text-[#76777b]">
            Edit hero headlines, promotional notices, and category display sorting.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-[#e6e2dc] shadow-sm flex flex-col gap-5">
        <h2 className="font-serif font-bold text-base text-[#1c1c18]">Hero Banner Settings</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#1c1c18]">Main Hero Headline</label>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs focus:outline-none focus:border-[#775a00]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#1c1c18]">Hero Subtitle Description</label>
          <textarea
            rows={2}
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs focus:outline-none focus:border-[#775a00]"
          ></textarea>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#1c1c18]">Logistics Banner Ticker Notice</label>
          <input
            type="text"
            value={bannerNotice}
            onChange={(e) => setBannerNotice(e.target.value)}
            className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs font-mono focus:outline-none focus:border-[#775a00]"
          />
        </div>

        <div className="pt-4 border-t border-[#e6e2dc] flex justify-end">
          <button
            type="submit"
            className="bg-[#1a1c20] hover:bg-black text-[#ffdf98] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
          >
            Save Homepage Changes
          </button>
        </div>
      </form>
    </div>
  );
};
