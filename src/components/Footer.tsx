import React from 'react';
import { ActiveView } from '../types';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView }) => {
  return (
    <footer className="w-full bg-[#f7f3ed] pt-12 pb-8 shadow-[0_-1px_6px_rgba(0,0,0,0.02)] border-t border-[#e6e2dc]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Brand Information */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1a1c20] flex items-center justify-center text-[#ffdf98] font-serif font-bold text-base border border-[#ffdf98]/30">
                AD
              </div>
              <span className="font-serif text-lg font-bold tracking-wider uppercase text-[#000102]">
                All Display
              </span>
            </div>
            <p className="text-xs text-[#45474b] leading-relaxed">
              Premier manufacturer and bulk stockist of boutique retail displays, heavy-duty garment racks, electroplated gold channel systems, and fiberglass mannequins serving Telangana, Andhra Pradesh, and all Indian states.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#45474b] font-medium pt-1">
              <span className="material-symbols-outlined text-[18px] text-[#775a00]">verified</span>
              <span>Govt. GST Registered Wholesale Facility • GSTIN: 36AAHCA1234F1Z8</span>
            </div>
          </div>

          {/* Column 2: Hyderabad Showrooms */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-serif text-base font-bold text-[#000102] mb-1">Hyderabad Showrooms</h4>
            <div className="flex flex-col gap-1 text-xs text-[#45474b]">
              <strong className="text-[#1c1c18] font-semibold">Ranigunj Flagship Unit:</strong>
              <p>Plot #14, Ground Floor, Wholesale Hardware Lane, Ranigunj, Secunderabad - 500003</p>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[#775a00] font-semibold">Direct:</span>
                <a href="tel:+917396127273" className="hover:underline text-[#1c1c18]">+91 73961 27273</a>
                <span>/</span>
                <a href="tel:+919849023456" className="hover:underline text-[#1c1c18]">+91 98490 23456</a>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-xs text-[#45474b] pt-2 border-t border-[#e6e2dc]/60">
              <strong className="text-[#1c1c18] font-semibold">Begum Bazaar Depot:</strong>
              <p>Near Fish Market Commercial Complex, Begum Bazaar, Hyderabad - 500012</p>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[#775a00] font-semibold">Phone:</span>
                <a href="tel:+914024607890" className="hover:underline text-[#1c1c18]">+91 40 2460 7890</a>
              </div>
            </div>
          </div>

          {/* Column 3: Commercial Policy */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-serif text-base font-bold text-[#000102] mb-1">B2B Commercial Policy</h4>
            <div className="bg-[#ffffff] p-3.5 rounded-lg flex flex-col gap-2 border border-[#e6e2dc]">
              <div className="flex items-center gap-1.5 text-xs text-[#000102] font-semibold">
                <span className="material-symbols-outlined text-[16px] text-[#775a00]">payments</span>
                <span>100% Prepaid Terms</span>
              </div>
              <p className="text-[11px] text-[#45474b] leading-normal">
                Payment via NEFT, RTGS, or Corporate UPI before transport dispatch. Strictly Zero Cash on Delivery (COD).
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#000102] font-semibold pt-1 border-t border-[#f1ede7]">
                <span className="material-symbols-outlined text-[16px] text-[#775a00]">videocam</span>
                <span>Video Call Inspection</span>
              </div>
              <p className="text-[11px] text-[#45474b] leading-normal">
                Live WhatsApp video verification of finished stock and packaging prior to vehicle loading.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-1 text-xs">
              <a
                className="text-[#45474b] hover:text-[#000102] flex items-center gap-1 font-medium"
                href="https://instagram.com/all_display_"
                target="_blank"
                rel="noreferrer"
              >
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                <span>@all_display_</span>
              </a>
              <button
                onClick={() => setActiveView('custom-quote')}
                className="text-[#775a00] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">map</span>
                <span>View Depot Pin</span>
              </button>
            </div>
          </div>

          {/* Column 4: Directory */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-serif text-base font-bold text-[#000102] mb-1">Full Catalog Directory</h4>
            <ul className="flex flex-col gap-1.5 text-xs text-[#45474b]">
              <li>
                <button
                  onClick={() => setActiveView('racks-floor-stands')}
                  className="hover:text-[#000102] text-left transition-colors cursor-pointer"
                >
                  Racks &amp; Floor Stands (SS &amp; MS Heavy Duty)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('pdp')}
                  className="hover:text-[#000102] text-left transition-colors cursor-pointer"
                >
                  Triple Pipe Island Display Racks (AD-TPR-739)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('racks-floor-stands')}
                  className="hover:text-[#000102] text-left transition-colors cursor-pointer"
                >
                  Slot Channels &amp; Glass Shelf Brackets
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('racks-floor-stands')}
                  className="hover:text-[#000102] text-left transition-colors cursor-pointer"
                >
                  Brushed Titanium Gold Display Islands
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('shop-setup-projects')}
                  className="hover:text-[#000102] text-left transition-colors cursor-pointer"
                >
                  Shop Setup Projects (Turnkey Showroom Fittings)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('custom-quote')}
                  className="hover:text-[#000102] text-left transition-colors font-medium text-[#775a00] cursor-pointer"
                >
                  Get Custom Quote &amp; Floor Plan Estimation
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-6 border-t border-[#e6e2dc] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#45474b]">
          <p>© 2025 All Display Fixtures &amp; Fittings Private Limited. All Rights Reserved. Ranigunj &amp; Begum Bazaar, Hyderabad, Telangana.</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveView('admin' as any)} className="text-[#775a00] hover:underline font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span>Admin Portal (/admin)</span>
            </button>
            <span className="text-[#c6c6cb]">•</span>
            <button onClick={() => setActiveView('custom-quote')} className="hover:underline">
              Pan-India Freight Logistics
            </button>
            <span className="text-[#c6c6cb]">•</span>
            <button onClick={() => setActiveView('pdp')} className="hover:underline">
              Technical Specifications
            </button>
            <span className="text-[#c6c6cb]">•</span>
            <button onClick={() => setActiveView('quote-cart')} className="hover:underline">
              Privacy &amp; B2B Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
