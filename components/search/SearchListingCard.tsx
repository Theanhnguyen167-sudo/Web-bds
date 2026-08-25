'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ListingItem } from '@/lib/mock-data';
import { formatCurrencyVND, formatPricePerM2 } from '@/lib/utils';
import { MapPin, Heart, Bed, Sparkles, Eye, ArrowRight } from 'lucide-react';

interface SearchListingCardProps {
  listing: ListingItem;
  isSelected?: boolean;
  isHovered?: boolean;
  isSaved?: boolean;
  onHover?: (id: string | null) => void;
  onClick?: (id: string) => void;
  onSaveToggle?: (id: string) => void;
}

export const SearchListingCard: React.FC<SearchListingCardProps> = ({
  listing,
  isSelected,
  isHovered,
  isSaved,
  onHover,
  onClick,
  onSaveToggle,
}) => {
  return (
    <motion.div
      id={`listing-card-${listing.id}`}
      layout
      whileHover={{ y: -2 }}
      onMouseEnter={() => onHover && onHover(listing.id)}
      onMouseLeave={() => onHover && onHover(null)}
      onClick={() => onClick && onClick(listing.id)}
      className={`group relative flex gap-3 p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left bg-white dark:bg-slate-900 ${
        isSelected
          ? 'border-orange-500 bg-orange-50/40 dark:bg-orange-950/20 ring-2 ring-orange-500/20 shadow-md'
          : isHovered
          ? 'border-orange-300 dark:border-orange-700 bg-slate-50/80 dark:bg-slate-800/80 shadow-md'
          : 'border-slate-100 dark:border-slate-800 hover:border-orange-200 shadow-2xs'
      }`}
    >
      {/* Thumbnail Left (80x80px) */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80'}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {listing.isFeatured && (
          <span className="absolute top-1 left-1 bg-orange-500 text-white font-extrabold text-[8px] px-1 py-0.2 rounded shadow">
            ⭐ HOT
          </span>
        )}
      </div>

      {/* Content Right */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          {/* Price Row */}
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-sm font-black text-orange-600 dark:text-orange-400">
              {formatCurrencyVND(listing.price)}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {formatPricePerM2(listing.price, listing.area)}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-xs font-bold text-navy dark:text-white truncate group-hover:text-orange-600 transition-colors">
            {listing.title}
          </h4>

          {/* Location */}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 text-orange-500 shrink-0" />
            <span className="truncate">{listing.district}, Hà Nội</span>
          </p>
        </div>

        {/* Specs Row */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-800 text-[10px] text-slate-500 font-semibold">
          <div className="flex items-center gap-2">
            <span>📐 {listing.area}m²</span>
            <span>🛏 {listing.bedrooms} PN</span>
          </div>

          <Link
            href={`/listings/${listing.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-orange-500 hover:text-orange-600 font-bold flex items-center gap-0.5 hover:underline"
          >
            <span>Chi tiết</span>
            <ArrowRight className="h-2.5 w-2.5" />
          </Link>
        </div>
      </div>

      {/* Save Heart Button */}
      {onSaveToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSaveToggle(listing.id);
          }}
          className="absolute top-2 right-2 text-slate-300 hover:text-red-500 p-1"
          title={isSaved ? 'Bỏ lưu' : 'Lưu tin'}
        >
          <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      )}
    </motion.div>
  );
};
