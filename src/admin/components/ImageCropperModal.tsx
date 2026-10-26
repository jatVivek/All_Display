import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppIcon } from '../../components/AppIcon';

export type CropAspectRatio = '16:9' | '4:3' | '1:1';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  defaultAspectRatio?: CropAspectRatio;
  title?: string;
  onClose: () => void;
  onCropComplete: (file: File) => Promise<void> | void;
}

const RATIO_CONFIG: Record<CropAspectRatio, { label: string; ratio: number; width: number; height: number }> = {
  '16:9': { label: '16:9 (Desktop Hero)', ratio: 16 / 9, width: 1600, height: 900 },
  '4:3': { label: '4:3 (Mobile Banner)', ratio: 4 / 3, width: 800, height: 600 },
  '1:1': { label: '1:1 (Square Tile)', ratio: 1 / 1, width: 800, height: 800 },
};

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageSrc,
  defaultAspectRatio = '16:9',
  title = 'Crop & Standardize Banner Size',
  onClose,
  onCropComplete,
}) => {
  const [selectedRatio, setSelectedRatio] = useState<CropAspectRatio>(defaultAspectRatio);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setSelectedRatio(defaultAspectRatio);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [defaultAspectRatio, imageSrc, isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile/tablets
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handlePerformCrop = async () => {
    if (!imageRef.current || !containerRef.current) return;
    setIsProcessing(true);

    try {
      const config = RATIO_CONFIG[selectedRatio];
      const canvas = document.createElement('canvas');
      canvas.width = config.width;
      canvas.height = config.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Could not get canvas context');

      const img = imageRef.current;
      const cropRect = containerRef.current.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();

      // Calculate how the image maps onto the target dimensions
      const scaleX = img.naturalWidth / imgRect.width;
      const scaleY = img.naturalHeight / imgRect.height;

      // Source coordinates relative to the crop box
      const sx = (cropRect.left - imgRect.left) * scaleX;
      const sy = (cropRect.top - imgRect.top) * scaleY;
      const sWidth = cropRect.width * scaleX;
      const sHeight = cropRect.height * scaleY;

      // Draw onto target uniform canvas
      ctx.drawImage(
        img,
        Math.max(0, sx),
        Math.max(0, sy),
        Math.min(img.naturalWidth, sWidth),
        Math.min(img.naturalHeight, sHeight),
        0,
        0,
        config.width,
        config.height
      );

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/webp', 0.92)
      );

      if (!blob) throw new Error('Canvas export failed');

      const file = new File([blob], `banner-cropped-${Date.now()}.webp`, {
        type: 'image/webp',
      });

      await onCropComplete(file);
      onClose();
    } catch (err) {
      console.error('Crop error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const currentConfig = RATIO_CONFIG[selectedRatio];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 flex flex-col overflow-hidden max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <AppIcon name="crop" className="text-lg" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold">{title}</h3>
              <p className="text-[11px] text-slate-400">
                Ensure uniform banner dimensions across all devices (Desktop &amp; Mobile)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <AppIcon name="close" className="text-base" />
          </button>
        </div>

        {/* Toolbar: Aspect Ratio Presets */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Aspect Ratio:</span>
            {(['16:9', '4:3', '1:1'] as CropAspectRatio[]).map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => {
                  setSelectedRatio(ratio);
                  setPan({ x: 0, y: 0 });
                  setZoom(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedRatio === ratio
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {RATIO_CONFIG[ratio].label}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            Target Output: {currentConfig.width} × {currentConfig.height}px
          </div>
        </div>

        {/* Cropper Viewport Canvas Stage */}
        <div
          className="relative flex-1 min-h-[320px] max-h-[500px] bg-slate-950 flex items-center justify-center overflow-hidden select-none cursor-move p-4"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Active Crop Box Boundary */}
          <div
            ref={containerRef}
            className="relative pointer-events-none rounded-xl overflow-hidden border-2 border-orange-500 shadow-2xl ring-999 ring-black/70"
            style={{
              width: '100%',
              maxWidth: selectedRatio === '16:9' ? '580px' : selectedRatio === '4:3' ? '460px' : '380px',
              aspectRatio: `${currentConfig.ratio}`,
            }}
          >
            {/* Rule of Thirds Grid Overlay */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10 opacity-30">
              <div className="border-r border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-r border-b border-white"></div>
              <div className="border-b border-white"></div>
              <div className="border-r border-white"></div>
              <div className="border-r border-white"></div>
              <div></div>
            </div>
          </div>

          {/* Underneath Draggable Image */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Source for cropping"
            draggable={false}
            className="absolute max-w-none transition-transform duration-75"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          />
        </div>

        {/* Zoom & Pan Controls Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <AppIcon name="search" className="text-slate-400 text-sm" />
            <span className="text-xs font-semibold text-slate-700">Zoom:</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="accent-orange-600 w-36 sm:w-48 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <span className="text-xs font-mono text-slate-500">{zoom.toFixed(1)}x</span>
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="text-[11px] text-orange-600 font-semibold hover:underline cursor-pointer ml-1"
            >
              Reset Position
            </button>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePerformCrop}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <AppIcon name={isProcessing ? 'progress_activity' : 'check'} className="text-sm" />
              <span>{isProcessing ? 'Cropping...' : 'Crop & Apply Uniform Banner'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
