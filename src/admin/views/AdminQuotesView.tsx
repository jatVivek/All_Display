import { AppIcon } from '../../components/AppIcon';
import React, { useEffect, useState } from 'react';
import { storeManager, AdminQuote } from '../../services/storeManager';
import { getContactWhatsAppLink } from '../../utils/whatsapp';

interface AdminQuotesViewProps {
  showToast: (msg: string) => void;
}

export const AdminQuotesView: React.FC<AdminQuotesViewProps> = ({ showToast }) => {
  const [quotes, setQuotes] = useState<AdminQuote[]>(() => storeManager.getQuotes());

  useEffect(() => storeManager.subscribe((state) => setQuotes(state.quotes)), []);

  const handleStatusChange = async (id: string, newStatus: AdminQuote['status']) => {
    const updated = quotes.map((q) => (q.id === id ? { ...q, status: newStatus } : q));
    if (!await storeManager.saveQuotes(updated)) {
      showToast(storeManager.getState().catalogSyncError || 'Could not save quote status.');
      return;
    }
    showToast(`Quote status updated to "${newStatus}"`);
  };

  const handleReplyWhatsApp = (quote: AdminQuote) => {
    const text = `Hi ${quote.customerName} (${quote.storeName}), regarding your bespoke store quote *${quote.quoteNo}* for ${quote.area} (${quote.storeType} in ${quote.city}):\n\n` +
      `Our Ranigunj engineering desk has reviewed your floor plan requirements. Let's discuss ex-factory pricing and 3D CAD elevations!`;

    window.open(getContactWhatsAppLink(quote.whatsapp, text), '_blank');
    showToast('WhatsApp quote consultation opened.');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-[#e6e2dc] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AppIcon name="architecture" className="text-[#775a00] text-[24px]" />
            <h1 className="font-serif text-2xl font-bold text-[#1c1c18]">Bespoke Store Quotes &amp; CAD Inquiries</h1>
          </div>
          <p className="text-xs text-[#76777b]">
            Custom floor plan layouts, heavy pipe rack elevation quotes, and bulk boutique fit-outs.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e6e2dc] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fdf9f3] text-[11px] font-bold text-[#775a00] uppercase tracking-wider border-b border-[#e6e2dc]">
                <th className="p-4 pl-6">Quote No &amp; Date</th>
                <th className="p-4">Store &amp; Owner</th>
                <th className="p-4">Location &amp; Area</th>
                <th className="p-4">Inquiry Notes</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e2dc] text-xs">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#76777b]">
                    No pending custom quote inquiries.
                  </td>
                </tr>
              ) : (
                quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-[#fdf9f3]/60 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1c1c18]">{q.quoteNo}</span>
                        <span className="text-[11px] text-[#76777b]">{q.date}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#1c1c18]">{q.storeName}</span>
                        <span className="text-[11px] text-[#76777b]">{q.customerName} • +91 {q.whatsapp}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-[#1c1c18]">{q.city}</span>
                        <span className="text-[10px] text-[#76777b] font-mono">{q.area} • {q.storeType}</span>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs text-[#45474b] truncate" title={[q.notes, q.fixtures?.join(', '), q.finish, q.timeline, q.gstin, q.attachmentName].filter(Boolean).join(' | ')}>
                      <span>{q.notes}</span>
                      {q.fixtures?.length ? <span className="block text-[10px] text-[#76777b]">Fixtures: {q.fixtures.join(', ')}</span> : null}
                      {q.finish ? <span className="block text-[10px] text-[#76777b]">Finish: {q.finish} • Timeline: {q.timeline}</span> : null}
                      {q.gstin ? <span className="block text-[10px] text-[#76777b]">GSTIN: {q.gstin}</span> : null}
                      {q.attachmentName ? <span className="block text-[10px] text-amber-700">Customer listed attachment: {q.attachmentName} (not uploaded)</span> : null}
                    </td>
                    <td className="p-4">
                      <select
                        value={q.status}
                        onChange={(e) => handleStatusChange(q.id, e.target.value as AdminQuote['status'])}
                        className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-[#e6e2dc] bg-[#fdf9f3] cursor-pointer outline-none"
                      >
                        <option value="Pending Review">Pending Review</option>
                        <option value="Priced">Priced</option>
                        <option value="Converted to Order">Converted to Order</option>
                      </select>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleReplyWhatsApp(q)}
                        className="bg-[#25D366] hover:bg-[#128C7E] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ml-auto transition-colors cursor-pointer shadow-sm"
                      >
                        <AppIcon name="chat" className="text-[16px]" />
                        <span>Reply WhatsApp</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
