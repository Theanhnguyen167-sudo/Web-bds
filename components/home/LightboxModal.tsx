'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

export interface GalleryImage {
  url: string;
  caption?: string;
  tag?: string;
}

export interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: (string | GalleryImage)[];
  initialIndex?: number;
  propertyTitle?: string;
  propertyPrice?: string;
}

export function LightboxModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  propertyTitle = '',
  propertyPrice = '',
}: LightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Normalize images to uniform object structure
  const normalizedImages: GalleryImage[] = useMemo(() => {
    if (!images || images.length === 0) return [];
    return images.map((img, idx) => {
      if (typeof img === 'string') {
        return {
          url: img,
          caption: propertyTitle ? `${propertyTitle} (Ảnh ${idx + 1})` : `Ảnh ${idx + 1}`,
          tag: `Góc ${idx + 1}`,
        };
      }
      return {
        url: img.url,
        caption: img.caption || (propertyTitle ? `${propertyTitle} (Ảnh ${idx + 1})` : `Ảnh ${idx + 1}`),
        tag: img.tag || `Góc ${idx + 1}`,
      };
    });
  }, [images, propertyTitle]);

  // Sync initialIndex when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
    }
  }, [isOpen, initialIndex]);

  const handleNext = useCallback(() => {
    if (normalizedImages.length === 0) return;
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % normalizedImages.length);
  }, [normalizedImages.length]);

  const handlePrev = useCallback(() => {
    if (normalizedImages.length === 0) return;
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  }, [normalizedImages.length]);

  // Keyboard navigation: Escape to close, ArrowLeft / ArrowRight to navigate
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Toggle browser fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen || normalizedImages.length === 0) return null;

  const currentImage = normalizedImages[currentIndex] || normalizedImages[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] flex flex-col justify-between bg-black/90 backdrop-blur-md select-none"
        onClick={(e) => {
          // Click out to close
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* ── 1. HEADER (Top Controls) ── */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 bg-gradient-to-b from-black/80 to-transparent z-50">
          
          {/* Left: Bộ đếm số lượng ảnh (Ví dụ: 1/6, 2/6) */}
          <div className="flex items-center gap-3 text-white">
            <span className="px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs sm:text-sm font-black tracking-wider text-orange-400 border border-white/10 shadow-sm">
              {currentIndex + 1} / {normalizedImages.length}
            </span>
          </div>

          {/* Right: Zoom In/Out + Fullscreen + Nút Đóng Modal (Icon 'X') */}
          <div className="flex items-center gap-2">
            {/* Zoom Button */}
            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={isZoomed ? 'Thu nhỏ' : 'Phóng to'}
            >
              {isZoomed ? <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" /> : <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="hidden sm:flex p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>

            {/* Close Button 'X' */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-transform hover:scale-105 ml-1.5 cursor-pointer"
              title="Đóng (Phím ESC hoặc click ra ngoài)"
              aria-label="Đóng Popup xem ảnh"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── 2. MAIN IMAGE DISPLAY (Center) ── */}
        <div
          className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-16 overflow-hidden"
          onClick={(e) => {
            // Click outside the image to close
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Nút mũi tên Trái (Prev) */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-40 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-orange-500 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 cursor-pointer shadow-2xl group"
            title="Ảnh trước (Mũi tên trái)"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Centered Large Image with Smooth Animation */}
          <div className="relative max-w-5xl max-h-[70vh] w-full flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: isZoomed ? 1.25 : 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 max-h-[68vh] flex items-center justify-center cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={currentImage.url}
                  alt={currentImage.caption || `Ảnh ${currentIndex + 1}`}
                  className="max-h-[68vh] max-w-full object-contain rounded-2xl transition-all"
                />

                {/* Tag Badge overlay (nếu có) */}
                {currentImage.tag && (
                  <span className="absolute top-3 left-3 bg-orange-500/90 backdrop-blur-sm text-white font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-md">
                    {currentImage.tag}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── THANH THÔNG TIN CỰC NHỎ GỌN BÊN DƯỚI ẢNH: [Tên BĐS] - [Giá tiền] ── */}
            {/* (KHÔNG thêm nút "Xem chi tiết" hay liên kết chuyển trang) */}
            {(propertyTitle || propertyPrice) && (
              <div className="mt-3 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white flex items-center justify-center gap-2 max-w-xl text-center shadow-lg pointer-events-auto">
                {propertyTitle && (
                  <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[320px] sm:max-w-md">
                    {propertyTitle}
                  </span>
                )}
                {propertyTitle && propertyPrice && (
                  <span className="text-orange-400 font-bold">−</span>
                )}
                {propertyPrice && (
                  <span className="text-xs sm:text-sm font-black text-orange-400 shrink-0">
                    {propertyPrice}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Nút mũi tên Phải (Next) */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-40 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-orange-500 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 cursor-pointer shadow-2xl group"
            title="Ảnh kế tiếp (Mũi tên phải)"
            aria-label="Ảnh kế tiếp"
          >
            <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* ── 3. DẢI ẢNH NHỎ (THUMBNAILS STRIP) PHÍA DƯỚI ── */}
        <div className="px-4 sm:px-8 py-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/20">
            {normalizedImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsZoomed(false);
                  setCurrentIndex(idx);
                }}
                className={`relative h-12 sm:h-14 w-18 sm:w-20 rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'ring-2 ring-orange-500 scale-105 opacity-100 shadow-lg'
                    : 'opacity-50 hover:opacity-85 ring-1 ring-white/10'
                }`}
              >
                <img
                  src={img.url}
                  alt={`thumb-${idx}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 truncate px-1 font-medium">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}

export default LightboxModal;
