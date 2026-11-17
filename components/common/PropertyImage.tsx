'use client';

import React, { useState, useEffect } from 'react';
import {
  getPropertyTypeMeta,
  getSafeImageUrl,
  PropertyType,
} from '@/lib/listing-images';
import { ImageOff } from 'lucide-react';

export interface PropertyImageProps {
  src?: string | null;
  alt: string;
  propertyType?: string;
  className?: string;
  containerClassName?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  quality?: number;
  onClick?: (e: React.MouseEvent<HTMLDivElement | HTMLImageElement>) => void;
  showPlaceholderBadge?: boolean;
}

export const PropertyImage: React.FC<PropertyImageProps> = ({
  src,
  alt,
  propertyType = 'house',
  className = '',
  containerClassName = '',
  loading = 'lazy',
  width = 800,
  quality = 80,
  onClick,
  showPlaceholderBadge = true,
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const typeMeta = getPropertyTypeMeta(propertyType);

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const optimizedSrc = getSafeImageUrl(src, width, quality);
  const shouldRenderPlaceholder = !optimizedSrc || hasError;

  if (shouldRenderPlaceholder) {
    return (
      <div
        onClick={onClick}
        className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-4 text-center select-none relative overflow-hidden ${containerClassName} ${
          onClick ? 'cursor-pointer' : ''
        }`}
        title={`${typeMeta.label} - Chưa có hình ảnh thực tế`}
      >
        {/* Subtle decorative background watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10 pointer-events-none text-8xl">
          {typeMeta.icon}
        </div>

        {/* Central Type Badge */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/90 dark:bg-slate-800/90 shadow-md border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-2xl sm:text-3xl transition-transform hover:scale-105">
            {typeMeta.icon}
          </div>

          <div className="space-y-0.5">
            <span className="block text-xs font-bold text-slate-700 dark:text-slate-200 tracking-tight">
              {typeMeta.label}
            </span>
            {showPlaceholderBadge && (
              <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-slate-400 dark:text-slate-500">
                <ImageOff className="h-3 w-3" />
                <span>Đang cập nhật ảnh</span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      loading={loading}
      decoding="async"
      onClick={onClick}
      onError={() => setHasError(true)}
      className={`w-full h-full object-cover ${className} ${onClick ? 'cursor-pointer' : ''}`}
    />
  );
};

