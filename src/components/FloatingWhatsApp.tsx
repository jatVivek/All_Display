import React, { useState } from 'react';
import { useScrollLock } from '../hooks/useScrollLock';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Lock background scroll when the popup is active
  useScrollLock(isOpen);

  return (
    <>
      {/* Mobile backdrop to close when clicking outside and prevent background interaction */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] touch-none transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isOpen && (
          <div 
            className="mb-3 w-[calc(100vw-2rem)] sm:w-80 max-h-[85vh] overflow-y-auto overscroll-contain bg-white rounded-2xl shadow-2xl border border-[#e6e2dc] animate-in fade-in slide-in-from-bottom-3 duration-200"
            data-scrollable="true"
          >
          <div className="bg-[#1a1c20] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#ffdf98] text-[#1a1c20] font-bold flex items-center justify-center text-sm">
                  RS
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] ring-2 ring-[#1a1c20]"></span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight">Ramesh Sharma</span>
                <span className="text-xs text-[#ffdf98]">Showroom Lead • Ranigunj</span>
                <span className="text-[10px] text-white/60">Typically replies in &lt; 5 mins</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white p-1 rounded"
              title="Close"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="p-4 bg-[#fdf9f3] flex flex-col gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm border border-[#e6e2dc] text-[#1c1c18] leading-relaxed">
              Hello! Planning a clothing store fit-out or need wholesale price slabs for pipe racks and gold channels?
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <a
                href="https://wa.me/917396127273?text=Hi%20Ramesh,%20I%20am%20looking%20for%20clothing%20store%20fittings%20and%20display%20fixtures."
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-2.5 px-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Chat on WhatsApp (+91 73961 27273)</span>
              </a>

              <a
                href="https://wa.me/919849023456?text=Hi%20All%20Display,%20I%20have%20a%20store%20floor%20plan%20for%20quotation."
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18] py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#775a00]">upload_file</span>
                <span>Send CAD Floor Plan</span>
              </a>
            </div>

            <div className="text-[10px] text-[#76777b] text-center pt-1">
              Ranigunj &amp; Begum Bazaar Showrooms open Mon–Sat 10am to 8pm
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-3 rounded-full font-semibold text-xs shadow-[0_8px_24px_-4px_rgba(26,28,32,0.22)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[22px]">support_agent</span>
        <div className="flex flex-col text-left pr-1 hidden sm:flex">
          <span className="text-[9px] uppercase tracking-wider text-white/90 leading-tight">Showroom Specialist</span>
          <span className="font-semibold text-white leading-tight">Chat with Showroom Lead</span>
        </div>
      </button>
    </div>
    </>
  );
};

