import { AppIcon } from './AppIcon';
import React, { useState } from 'react';
import { CartItem, ConsigneeDetails } from '../types';
import { useScrollLock } from '../hooks/useScrollLock';
import { getWhatsAppLink } from '../utils/whatsapp';
import { storeManager } from '../services/storeManager';

interface ProformaModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  consignee: ConsigneeDetails;
}

export const ProformaModal: React.FC<ProformaModalProps> = ({
  isOpen,
  onClose,
  cart,
  consignee
}) => {
  const [copied, setCopied] = useState(false);
  const [orderReference] = useState(() => `AD-${Date.now().toString(36).toUpperCase()}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useScrollLock(isOpen);

  if (!isOpen) return null;

  const rawSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discountRate = rawSubtotal >= 50000 ? 0.15 : rawSubtotal >= 25000 ? 0.1 : 0;
  const discount = Math.round(rawSubtotal * discountRate);
  const taxable = rawSubtotal - discount;
  const gst = Math.round(taxable * 0.18);
  const grandTotal = taxable + gst;

  const manifestText = cart
    .map((item) => `• ${item.title} (${item.sku}): ${item.quantity} ${item.unitLabel} @ ₹${item.unitPrice.toLocaleString('en-IN')}`)
    .join('\n');

  const draftMessage = `Hi All Display Team, I want to confirm Order #${orderReference} for ${consignee.storeName || 'our store'} (${consignee.ownerName || 'contact not provided'}, ${consignee.destination || 'destination not provided'} - ${consignee.pincode || 'pincode not provided'}, ${consignee.whatsapp || 'phone not provided'}).\n\n` +
    `Manifest:\n${manifestText}\n\n` +
    `Financial Summary:\n` +
    `- Subtotal: ₹${rawSubtotal.toLocaleString('en-IN')}\n` +
    (discount > 0 ? `- Volume Slab Discount (${Math.round(discountRate * 100)}% Tier): -₹${discount.toLocaleString('en-IN')}\n` : '') +
    `- 18% Input GST: ₹${gst.toLocaleString('en-IN')}\n` +
    `- Total Commercial Payable: ₹${grandTotal.toLocaleString('en-IN')}\n\n` +
    (consignee.launchDate ? `Requested timeline: ${consignee.launchDate}\n` : '') +
    (consignee.notes ? `Delivery Notes: ${consignee.notes}\n\n` : '') +
    `Please share courier / transport dispatch details and All Display UPI / bank details for payment.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draftMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const launchWhatsApp = async () => {
    if (isSubmitting || cart.length === 0) return;
    const whatsappWindow = window.open('about:blank', '_blank');
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      const order = await storeManager.createOrder({
        customerName: consignee.ownerName.trim(),
        storeName: consignee.storeName.trim(),
        whatsapp: consignee.whatsapp.replace(/\D/g, ''),
        destination: consignee.destination.trim(),
        pincode: consignee.pincode.trim(),
        items: cart.map((item) => ({
          sku: item.sku,
          title: item.title,
          finish: item.finish,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          unitLabel: item.unitLabel,
          sizeOrSpec: item.sizeOrSpec,
          gauge: item.gauge,
          packingType: item.packingType,
        })),
        notes: `${consignee.notes.trim()}${consignee.notes.trim() ? '\n' : ''}Requested timeline: ${consignee.launchDate}`,
      });
      const message = draftMessage.replaceAll(orderReference, order.orderNo);
      if (whatsappWindow) {
        whatsappWindow.location.href = getWhatsAppLink(message);
        onClose();
      } else {
        setSubmissionError(`Order ${order.orderNo} was saved, but your browser blocked the WhatsApp window.`);
      }
    } catch (error) {
      whatsappWindow?.close();
      setSubmissionError(error instanceof Error ? error.message : 'Could not save this order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              Wholesale Proforma Draft #{orderReference}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg"
          >
            <AppIcon name="close" className="text-[20px]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto overscroll-contain" data-scrollable="true">
          <div className="flex items-center gap-3 bg-[#ffdf98]/30 p-3 rounded-xl border border-[#fece57]">
            <AppIcon name="chat" className="text-[#775a00] text-[24px]" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#1c1c18]">
                Ready to transmit directly to All Display Desk:
              </span>
              <span className="text-[11px] text-[#45474b]">
                WhatsApp order desk
              </span>
            </div>
          </div>

          <div className="bg-[#f7f3ed] rounded-xl p-4 font-mono text-xs text-[#1c1c18] select-all leading-relaxed whitespace-pre-line border border-[#e6e2dc]">
            {draftMessage}
          </div>
          {submissionError && <div role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-800">{submissionError}</div>}

          <div className="flex items-center justify-between text-[11px] text-[#76777b] px-1">
            <span>• 100% advance payment terms</span>
            <span>• Video call verification before dispatch</span>
            <span>• Tax Invoice with GSTIN</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={launchWhatsApp}
              disabled={isSubmitting || cart.length === 0}
              className="bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-50 text-white py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
            >
              <AppIcon name="open_in_new" className="text-[18px]" />
              <span>{isSubmitting ? 'Saving Order…' : 'Save Order & Open WhatsApp'}</span>
            </button>

            <button
              onClick={copyToClipboard}
              className="bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18] py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-[#c6c6cb]/60 cursor-pointer"
            >
              <AppIcon name={copied ? 'check' : 'content_copy'} className="text-[18px] text-[#775a00]" />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Proforma Ref'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
