import { AppIcon } from '../../components/AppIcon';
import React from 'react';
import { storeManager } from '../../services/storeManager';

interface AdminMediaViewProps {
  showToast: (msg: string) => void;
}

export const AdminMediaView: React.FC<AdminMediaViewProps> = ({ showToast }) => {
  const products = storeManager.getProducts();

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Image CDN URL copied to clipboard!');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-[#e6e2dc] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AppIcon name="perm_media" className="text-[#775a00] text-[24px]" />
            <h1 className="font-serif text-2xl font-bold text-[#1c1c18]">Storefront Media Library</h1>
          </div>
          <p className="text-xs text-[#76777b]">
            Optimized product photos, showroom showroom fixtures, and CAD diagram assets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-[#e6e2dc] overflow-hidden shadow-sm flex flex-col">
            <div className="aspect-[4/3] bg-[#fdf9f3] relative overflow-hidden">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono">
                Optimized (WebP)
              </span>
            </div>
            <div className="p-3.5 flex flex-col justify-between gap-3 flex-1">
              <div className="flex flex-col">
                <span className="font-bold text-xs text-[#1c1c18] truncate">{p.title}</span>
                <span className="text-[10px] text-[#76777b] font-mono">{p.code}</span>
              </div>
              <button
                onClick={() => handleCopyUrl(p.image)}
                className="w-full bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18] py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <AppIcon name="content_copy" className="text-[16px]" />
                <span>Copy URL</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
