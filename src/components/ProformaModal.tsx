import React, { useState } from 'react';
import { CartItem } from '../types';
import { useScrollLock } from '../hooks/useScrollLock';

interface ProformaModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  consignee: {
    storeName: string;
    ownerName: string;
    whatsapp: string;
    destination: string;
    pincode: string;
    launchDate: string;
    notes: string;
  };
}

export const ProformaModal: React.FC<ProformaModalProps> = ({
  isOpen,
  onClose,
  cart,
  consignee
}) => {
  const [copied, setCopied] = useState(false);

  useScrollLock(isOpen);

  if (!isOpen) return null;

  const rawSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discount = rawSubtotal >= 25000 ? Math.round(rawSubtotal * 0.1) : 0;
  const taxable = rawSubtotal - discount;
  const gst = Math.round(taxable * 0.18);
  const grandTotal = taxable + gst;

  const manifestText = cart
    .map((item) => `• ${item.title} (${item.sku}): ${item.quantity} ${item.unitLabel} @ ₹${item.unitPrice.toLocaleString('en-IN')}`)
    .join('\n');

  const draftMessage = `Hi All Display Team, I want to confirm Wholesale Order #AD-HYD-8492 for ${consignee.storeName || 'Boutique Store'} (${consignee.destination || 'Hyderabad'} - ${consignee.pincode || '500003'}).\n\n` +
    `Manifest:\n${manifestText}\n\n` +
    `Financial Summary:\n` +
    `- Ex-Factory Subtotal: ₹${rawSubtotal.toLocaleString('en-IN')}\n` +
    (discount > 0 ? `- Volume Slab Discount (10% Tier): -₹${discount.toLocaleString('en-IN')}\n` : '') +
    `- 18% Input GST: ₹${gst.toLocaleString('en-IN')}\n` +
    `- Total Commercial Payable: ₹${grandTotal.toLocaleString('en-IN')}\n\n` +
    (consignee.notes ? `Store Fit Notes: ${consignee.notes}\n\n` : '') +
    `Please share total lorry transport freight estimate to ${consignee.destination || 'our destination'} and Ranigunj Factory NEFT/RTGS bank details for advance payment.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draftMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const launchWhatsApp = () => {
    const encoded = encodeURIComponent(draftMessage);
    window.open(`https://wa.me/917396127273?text=${encoded}`, '_blank');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 touch-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#ffffff] max-w-xl w-full rounded-2xl shadow-[0_20px_48px_-8px_rgba(18,19,22,0.3)] overflow-hidden flex flex-col border border-[#e6e2dc]">
        {/* Header */}
        <div className="bg-[#1a1c20] text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-ping"></span>
            <h2 className="font-serif text-lg font-bold text-white">
              Wholesale Proforma Draft #AD-HYD-8492
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto overscroll-contain" data-scrollable="true">
          <div className="flex items-center gap-3 bg-[#ffdf98]/30 p-3 rounded-xl border border-[#fece57]">
            <span className="material-symbols-outlined text-[#775a00] text-[24px]">chat</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#1c1c18]">
                Ready to transmit directly to All Display Wholesale Desk:
              </span>
              <span className="text-[11px] text-[#45474b]">
                WhatsApp: +91 73961 27273 / +91 98490 23456
              </span>
            </div>
          </div>

          <div className="bg-[#f7f3ed] rounded-xl p-4 font-mono text-xs text-[#1c1c18] select-all leading-relaxed whitespace-pre-line border border-[#e6e2dc]">
            {draftMessage}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#76777b] px-1">
            <span>• 100% advance payment terms</span>
            <span>• Video call verification before dispatch</span>
            <span>• Tax Invoice with GSTIN</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={launchWhatsApp}
              className="bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              <span>Open WhatsApp Now</span>
            </button>

            <button
              onClick={copyToClipboard}
              className="bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18] py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-[#c6c6cb]/60 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#775a00]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Proforma Ref'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
