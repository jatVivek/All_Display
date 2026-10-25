import { AppIcon } from './AppIcon';
import React, { useState } from 'react';
import { useScrollLock } from '../hooks/useScrollLock';
import { getWhatsAppLink, getWhatsAppNumber } from '../utils/whatsapp';

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
                  AD
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] ring-2 ring-[#1a1c20]"></span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight">All Display Team</span>
                <span className="text-xs text-[#ffdf98]">Wholesale Desk • Hyderabad</span>
                <span className="text-[10px] text-white/60">Typically replies in &lt; 5 mins</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white p-1 rounded"
              title="Close"
            >
              <AppIcon name="close" className="text-[20px]" />
            </button>
          </div>

          <div className="p-4 bg-[#fdf9f3] flex flex-col gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm border border-[#e6e2dc] text-[#1c1c18] leading-relaxed">
              Hello! Planning a clothing store fit-out or need wholesale price slabs for pipe racks and gold channels?
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <a
                href={getWhatsAppLink('Hi All Display, I am looking for clothing store fittings and display fixtures.')}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-2.5 px-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <AppIcon name="chat" className="text-[18px]" />
                <span>Chat on WhatsApp (+{getWhatsAppNumber()})</span>
              </a>

              <a
                href={getWhatsAppLink('Hi All Display, I have a store floor plan for quotation.', true)}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18] py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <AppIcon name="upload_file" className="text-[16px] text-[#775a00]" />
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
        <AppIcon name="support_agent" className="text-[22px]" />
        <div className="flex flex-col text-left pr-1 hidden sm:flex">
          <span className="text-[9px] uppercase tracking-wider text-white/90 leading-tight">Showroom Specialist</span>
          <span className="font-semibold text-white leading-tight">Chat with Showroom Lead</span>
        </div>
      </button>
    </div>
    </>
  );
};
