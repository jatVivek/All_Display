import { AppIcon } from './AppIcon';
import React, { useState } from 'react';
import { ProjectReel } from '../types';
import { useScrollLock } from '../hooks/useScrollLock';
import { getWhatsAppLink } from '../utils/whatsapp';

interface VideoReelModalProps {
  reel: ProjectReel | null;
  onClose: () => void;
}

export const VideoReelModal: React.FC<VideoReelModalProps> = ({ reel, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useScrollLock(Boolean(reel));

  if (!reel) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 touch-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-[#1a1c20] text-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <AppIcon name="close" className="text-[20px]" />
        </button>

        {/* Video Reel Player Frame */}
        <div className="w-full md:w-1/2 aspect-[9/16] max-h-[580px] bg-black relative flex items-center justify-center overflow-hidden">
          <img
            src={reel.image}
            alt={reel.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

          {/* Player Controls Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-lg"
            >
              <AppIcon name={isPlaying ? 'pause' : 'play_arrow'} className="text-[36px]" />
            </button>
          </div>

          {/* Bottom Video Meta Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-mono">
                {isPlaying ? '0:24 / ' + reel.duration : 'PAUSED'}
              </span>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
            >
              <AppIcon name={isMuted ? 'volume_off' : 'volume_up'} className="text-[18px]" />
            </button>
          </div>
        </div>

        {/* Project Technical Ledger & Ingestion Actions */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto overscroll-contain bg-[#1a1c20]" data-scrollable="true">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#ffdf98]">
                {reel.categoryLabel}
              </span>
              <span className="text-xs text-[#c6c6cb]">{reel.area}</span>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-bold text-white leading-tight mb-1">
                {reel.title}
              </h3>
              <p className="text-xs text-[#c6c6cb] flex items-center gap-1.5">
                <AppIcon name="location_on" className="text-[15px] text-[#ffdf98]" />
                <span>{reel.location}</span>
              </p>
            </div>

            <p className="text-sm text-[#e2e2e7] leading-relaxed">
              {reel.description}
            </p>

            {/* Spec Ledger */}
            <div className="bg-black/40 rounded-xl p-3.5 flex flex-col gap-2 text-xs border border-white/10">
              <span className="text-[10px] font-bold uppercase text-[#ffdf98] tracking-wider">
                Store Fixture Specification Manifest
              </span>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/60">Floor Display Units:</span>
                <span className="font-semibold text-white">{reel.specs?.floorUnits || reel.metrics?.racksInstalled || 'Standard'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/60">Wall Slot Channels:</span>
                <span className="font-semibold text-white">{reel.specs?.wallSlotChannels || reel.metrics?.capacity || 'Standard'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/60">Special Configuration:</span>
                <span className="font-semibold text-white">{reel.specs?.special || reel.metrics?.finishType || 'Custom'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/60">Turnkey Execution:</span>
                <span className="font-semibold text-[#25D366]">{reel.turnkeyTime}</span>
              </div>
            </div>

            {/* Finish swatches */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/70">Coating Spec:</span>
              <div className="flex items-center gap-2">
                {(reel.finishes || []).map((f: { name: string; color: string }, i: number) => (
                  <div key={i} className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-md border border-white/10">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: f.color }}></span>
                    <span className="text-[11px] text-white/90">{f.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col gap-2.5">
            <a
              href={getWhatsAppLink(`Hi All Display, I saw the ${reel.title} video reel and want a similar setup quote.`)}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <AppIcon name="chat" className="text-[18px]" />
              <span>Inquire This Setup on WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="w-full bg-white/10 hover:bg-white/15 text-white/90 py-2.5 px-4 rounded-xl text-xs font-medium transition-colors"
            >
              Close Video Walkthrough
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
