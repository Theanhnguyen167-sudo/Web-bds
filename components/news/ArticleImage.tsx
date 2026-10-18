'use client';

import React, { useState, useEffect } from 'react';
import { getCategoryFallbackImage } from '@/lib/article-data';

export interface ArticleImageProps {
  src?: string | null;
  alt: string;
  category?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ArticleImage: React.FC<ArticleImageProps> = ({
  src,
  alt,
  category,
  className = '',
  style,
}) => {
  const fallback = getCategoryFallbackImage(category);
  const validSrc = src && typeof src === 'string' && src.trim() !== '' ? src : fallback;
  const [currentSrc, setCurrentSrc] = useState<string>(validSrc);

  useEffect(() => {
    setCurrentSrc(validSrc);
  }, [validSrc]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      style={style}
      loading="lazy"
      onError={() => {
        if (currentSrc !== fallback) {
          setCurrentSrc(fallback);
        }
      }}
    />
  );
};
