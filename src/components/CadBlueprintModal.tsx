import React from 'react';
import { useScrollLock } from '../hooks/useScrollLock';
import { getWhatsAppLink } from '../utils/whatsapp';

interface CadBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  sku?: string;
  modelName?: string;
}

export const CadBlueprintModal: React.FC<CadBlueprintModalProps> = ({
  isOpen,
  onClose,
  sku = 'AD-TPR-739',
  modelName = 'Commercial Triple Pipe Rack System'
}) => {
  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 touch-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#ffffff] text-[#1c1c18] rounded-2xl overflow-y-auto overscroll-contain shadow-2xl flex flex-col border border-[#e6e2dc]">
        {/* Modal Top Header */}
        <div className="bg-[#1a1c20] text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ffdf98] text-[24px]">architecture</span>
            <div>
              <h3 className="font-serif text-lg font-bold text-white leading-tight">
                Architectural CAD Schematic &amp; Blueprint Spec
              </h3>
              <p className="text-xs text-[#c6c6cb] font-mono">
                CAD BLOCK: {sku}.DWG • SCALE 1:1 • BIS STANDARD ERW TUBE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Blueprint Visual & Dimension Schematic */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[80vh]">
          {/* Blueprint Graphic */}
          <div className="relative w-full aspect-[16/9] bg-[#0b1d3a] rounded-xl p-4 flex items-center justify-center border-2 border-[#1e3a6a] overflow-hidden text-cyan-400 font-mono text-xs shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(#1e3a6a_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center">
              <div className="border border-cyan-400/50 p-6 rounded-lg bg-black/30 backdrop-blur-sm max-w-md w-full">
                <div className="flex justify-between text-[11px] text-cyan-300 border-b border-cyan-500/30 pb-2 mb-3">
                  <span>DIMENSIONAL TOLERANCE: ±0.5mm</span>
                  <span>WELD: CO2 MIG 360°</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div>
                    <span className="text-cyan-500 block text-[10px]">TOTAL HEIGHT (Z)</span>
                    <span className="font-bold text-sm text-white">1675mm / 1980mm</span>
                  </div>
                  <div>
                    <span className="text-cyan-500 block text-[10px]">BAY WIDTH (X)</span>
                    <span className="font-bold text-sm text-white">1200mm (4.0 Ft)</span>
                  </div>
                  <div>
                    <span className="text-cyan-500 block text-[10px]">BASE DEPTH (Y)</span>
                    <span className="font-bold text-sm text-white">450mm</span>
                  </div>
                  <div>
                    <span className="text-cyan-500 block text-[10px]">PIPE GAUGE</span>
                    <span className="font-bold text-sm text-white">1.6mm / 2.0mm ERW</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-cyan-500/30 text-center text-cyan-300 text-[11px]">
                  <span>Center Slot Pitch: 25mm Universal Commercial Center</span>
                </div>
              </div>
            </div>
          </div>

          {/* Download & Architect Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#f7f3ed] p-4 rounded-xl flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase text-[#775a00] tracking-wider">
                Compatible CAD Software
              </span>
              <p className="text-xs text-[#45474b]">
                Supplied in 3D AutoCAD (.dwg), SketchUp (.skp), Revit Family (.rfa), and OBJ formats for immediate insertion into your store layout models.
              </p>
            </div>

            <div className="bg-[#f7f3ed] p-4 rounded-xl flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase text-[#775a00] tracking-wider">
                Custom Millimetric Sizing
              </span>
              <p className="text-xs text-[#45474b]">
                Have non-standard column spacing or low ceiling clearance? Our Ranigunj factory produces custom lengths with no tooling surcharge.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={getWhatsAppLink('Hi All Display Engineering, please email me the DWG and Revit CAD bundle for Triple Pipe Rack AD-TPR-739.')}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Request CAD 3D Bundle (.ZIP) on WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18] py-3 px-6 rounded-xl text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
