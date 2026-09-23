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
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      onMouseEnter={() => setHoveredListingId(listing.id)}
      onMouseLeave={() => setHoveredListingId(null)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/15 hover:border-orange-400 hover:z-20 ${
        isSelected
          ? 'border-l-4 border-l-accent border-accent ring-2 ring-accent/20 bg-orange-50/20 shadow-lg'
          : isHovered
          ? 'border-l-4 border-l-accent border-orange-400 shadow-xl'
          : 'border-slate-200/80'
      }`}
    >
      {/* Thumbnail Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <Link href={`/listings/${listing.id}`} className="block h-full w-full">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Badges (Top-left): Featured & Planning Zone */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5 items-center">
          {listing.isFeatured && (
            <motion.span
              whileHover={{ scale: 1.15, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-md shadow-orange-500/30 cursor-pointer select-none border border-white/20 transition-shadow hover:shadow-lg hover:shadow-orange-500/50"
            >
              <span>★</span> Nổi bật
            </motion.span>
          )}

          {listing.planningZone && (
            <motion.span
              whileHover={{ scale: 1.12, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="inline-flex items-center rounded-md bg-slate-900/85 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white shadow-md border border-white/10 cursor-pointer select-none transition-all hover:bg-slate-950 hover:border-white/30 hover:shadow-lg hover:shadow-slate-900/40"
            >
              {listing.planningZone}
            </motion.span>
          )}
        </div>

        {/* Wishlist / Heart Button (Top-right) */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.25, rotate: -6 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaveListing(listing.id);
          }}
          className="group/heart absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md transition-all duration-200 hover:bg-white hover:shadow-xl hover:shadow-red-500/25 ring-1 ring-black/5 hover:ring-2 hover:ring-red-400/40 cursor-pointer"
          title={isSaved ? 'Bỏ lưu' : 'Lưu tin'}
        >
          <Heart
            className={`h-4 w-4 transition-all duration-200 group-hover/heart:scale-110 ${
              isSaved
                ? 'fill-red-500 text-red-500 scale-105'
                : 'text-slate-500 group-hover/heart:text-red-500 group-hover/heart:fill-red-500/20'
            }`}
          />
        </motion.button>

        {/* Price Tag Overlay (Bottom-left) */}
        <motion.div
          whileHover={{ scale: 1.1, y: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="group/price absolute bottom-2.5 left-2.5 z-10 rounded-lg bg-slate-900/90 backdrop-blur-md px-2.5 py-1 text-xs font-black text-white shadow-lg border border-white/10 transition-all hover:bg-slate-950 hover:border-orange-400/60 hover:shadow-xl hover:shadow-orange-500/20 cursor-pointer select-none origin-bottom-left"
        >
          <span className="text-white group-hover/price:text-amber-300 transition-colors font-black">
            {formatCurrencyVND(listing.price)}
          </span>
          <span className="ml-1 text-[10px] font-normal text-slate-300 group-hover/price:text-slate-100 transition-colors">
            ({formatPricePerM2(listing.price, listing.area)})
          </span>
        </motion.div>

        {/* Hover Slide-up AI Report Button (Bottom-right) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileHover={{ opacity: 1, y: 0, scale: 1.08 }}
          className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 origin-bottom-right"
        >
          <Link
            href={`/reports/${listing.id}`}
            className="flex items-center gap-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg hover:shadow-orange-500/40 transition-all cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Xem báo cáo AI</span>
          </Link>
        </motion.div>
      </div>

      {/* Content Details */}
      <div className="flex flex-1 flex-col p-3.5">
        {/* Title */}
        <Link href={`/listings/${listing.id}`} className="group/title block">
          <motion.h3
            whileHover={{ scale: 1.025, x: 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="line-clamp-2 text-xs font-bold leading-snug text-slate-800 transition-all duration-200 group-hover/title:text-orange-600 group-hover/title:font-extrabold origin-left"
          >
            {listing.title}
          </motion.h3>
        </Link>

        {/* Address */}
        <motion.div
          whileHover={{ scale: 1.03, x: 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="group/addr mt-2 flex items-center gap-1 text-[11px] text-slate-500 transition-colors hover:text-slate-900 origin-left cursor-default select-none"
        >
          <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500 transition-transform duration-200 group-hover/addr:scale-125" />
          <span className="truncate">{listing.ward ? `${listing.ward}, ` : ''}{listing.district}, Hà Nội</span>
        </motion.div>

        {/* Specs Row */}
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
          {/* Area */}
          <motion.div
            whileHover={{ scale: 1.18, y: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="group/spec flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-orange-50 hover:text-orange-600 transition-all cursor-default select-none border border-transparent hover:border-orange-200 hover:shadow-sm"
          >
            <Maximize2 className="h-3.5 w-3.5 text-slate-400 group-hover/spec:text-orange-500 transition-colors" />
            <span className="font-extrabold text-slate-800 group-hover/spec:text-orange-600 transition-colors">
              {listing.area} m²
            </span>
          </motion.div>

          {listing.floors > 0 && (
            <motion.div
              whileHover={{ scale: 1.18, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="group/spec flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-orange-50 hover:text-orange-600 transition-all cursor-default select-none border border-transparent hover:border-orange-200 hover:shadow-sm"
            >
              <Building className="h-3.5 w-3.5 text-slate-400 group-hover/spec:text-orange-500 transition-colors" />
              <span className="font-bold text-slate-600 group-hover/spec:text-orange-600 transition-colors">
                {listing.floors} tầng
              </span>
            </motion.div>
          )}

          {listing.bedrooms > 0 && (
            <motion.div
              whileHover={{ scale: 1.18, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="group/spec flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-orange-50 hover:text-orange-600 transition-all cursor-default select-none border border-transparent hover:border-orange-200 hover:shadow-sm"
            >
              <Bed className="h-3.5 w-3.5 text-slate-400 group-hover/spec:text-orange-500 transition-colors" />
              <span className="font-bold text-slate-600 group-hover/spec:text-orange-600 transition-colors">
                {listing.bedrooms} PN
              </span>
            </motion.div>
          )}

          {listing.bathrooms > 0 && (
            <motion.div
              whileHover={{ scale: 1.18, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="group/spec flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-orange-50 hover:text-orange-600 transition-all cursor-default select-none border border-transparent hover:border-orange-200 hover:shadow-sm"
            >
              <Bath className="h-3.5 w-3.5 text-slate-400 group-hover/spec:text-orange-500 transition-colors" />
              <span className="font-bold text-slate-600 group-hover/spec:text-orange-600 transition-colors">
                {listing.bathrooms} PT
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
