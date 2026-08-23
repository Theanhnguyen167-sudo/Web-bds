'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ListingItem } from '@/lib/mock-data';
import { formatCurrencyVND, formatPricePerM2 } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Sparkles,
  Heart,
  Layers,
  ShieldCheck,
  Building
} from 'lucide-react';

interface ListingCardProps {
  listing: ListingItem;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const {
    activeListingId,
    setActiveListingId,
    hoveredListingId,
    setHoveredListingId,
    savedListingIds,
    toggleSaveListing,
  } = useApp();

  const isSelected = activeListingId === listing.id;
  const isHovered = hoveredListingId === listing.id;
  const isSaved = savedListingIds.includes(listing.id);

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setHoveredListingId(listing.id)}
      onMouseLeave={() => setHoveredListingId(null)}
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? 'border-l-4 border-l-accent border-accent ring-2 ring-accent/20 bg-orange-50/20'
          : isHovered
          ? 'border-l-4 border-l-accent border-slate-300 shadow-md'
          : 'border-border'
      }`}
    >
      {/* Thumbnail Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <Link href={`/listings/${listing.id}`}>
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Featured Badge (Top-left) */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 pointer-events-none">
          {listing.isFeatured && (
            <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-extrabold text-white shadow-md">
              ⭐ Nổi bật
            </span>
          )}
          <span className="rounded-md bg-primary/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white">
            {listing.planningZone}
          </span>
        </div>

        {/* Wishlist / Heart Button (Top-right) */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.15 }}
          onClick={(e) => {
            e.preventDefault();
            toggleSaveListing(listing.id);
          }}
          className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
          title={isSaved ? 'Bỏ lưu' : 'Lưu tin'}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isSaved ? 'fill-red-500 text-red-500' : 'text-slate-600 hover:text-red-500'
            }`}
          />
        </motion.button>

        {/* Price Tag Overlay (Bottom-left) */}
        <div className="absolute bottom-2.5 left-2.5 rounded-lg bg-primary/90 px-2.5 py-1 text-xs font-black text-white shadow-md backdrop-blur-sm">
          {formatCurrencyVND(listing.price)}
          <span className="ml-1 text-[10px] font-normal text-slate-300">
            ({formatPricePerM2(listing.price, listing.area)})
          </span>
        </div>

        {/* Hover Slide-up AI Report Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <Link
            href={`/reports/${listing.id}`}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-2.5 py-1 text-xs font-bold text-white shadow-lg hover:bg-accent-hover transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Xem báo cáo AI</span>
          </Link>
        </motion.div>
      </div>

      {/* Content Details */}
      <div className="flex flex-1 flex-col p-3.5">
        {/* Title */}
        <Link href={`/listings/${listing.id}`}>
          <h3 className="line-clamp-2 text-xs font-bold leading-snug text-text-primary group-hover:text-accent transition-colors">
            {listing.title}
          </h3>
        </Link>

        {/* Address truncated */}
        <div className="mt-2 flex items-center gap-1 text-[11px] text-text-secondary">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" />
          <span className="truncate">{listing.ward ? `${listing.ward}, ` : ''}{listing.district}, Hà Nội</span>
        </div>

        {/* Specs Row */}
        <div className="mt-3 flex items-center justify-between border-t border-border/80 pt-2.5 text-[11px] text-text-secondary">
          <div className="flex items-center gap-1">
            <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold text-text-primary">{listing.area} m²</span>
          </div>

          {listing.floors > 0 && (
            <div className="flex items-center gap-1">
              <Building className="h-3.5 w-3.5 text-slate-400" />
              <span>{listing.floors} tầng</span>
            </div>
          )}

          {listing.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5 text-slate-400" />
              <span>{listing.bedrooms} PN</span>
            </div>
          )}

          {listing.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5 text-slate-400" />
              <span>{listing.bathrooms} PT</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
