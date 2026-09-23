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
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      onMouseEnter={() => setHoveredListingId(listing.id)}
      onMouseLeave={() => setHoveredListingId(null)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-400 hover:z-20 ${
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
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
          />
        </Link>

        {/* Badges (Top-left): Featured & Planning Zone */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-wrap gap-2 items-center">
          {listing.isFeatured && (
            <div
              className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 px-2.5 py-1 text-[11px] font-black text-white shadow-md shadow-orange-500/30 cursor-pointer select-none border border-white/30 transform-gpu transition-all duration-200 hover:scale-125 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/60 hover:ring-2 hover:ring-white"
              title="Bất động sản nổi bật"
            >
              <span className="text-yellow-200 text-xs">★</span> Nổi bật
            </div>
          )}

          {listing.planningZone && (
            <div
              className="inline-flex items-center rounded-lg bg-slate-900/85 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white shadow-md border border-white/20 cursor-pointer select-none transform-gpu transition-all duration-200 hover:scale-120 hover:-translate-y-1 hover:bg-slate-950 hover:border-blue-400 hover:ring-2 hover:ring-blue-400/60 hover:shadow-xl hover:shadow-slate-950/60"
              title={`Quy hoạch: ${listing.planningZone}`}
            >
              {listing.planningZone}
            </div>
          )}
        </div>

        {/* Wishlist / Heart Button (Top-right) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaveListing(listing.id);
          }}
          className="group/heart absolute top-2.5 right-2.5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-md cursor-pointer select-none transform-gpu transition-all duration-200 hover:scale-130 hover:-translate-y-1 hover:bg-white hover:shadow-2xl hover:shadow-red-500/40 hover:ring-4 hover:ring-red-400/40 active:scale-95"
          title={isSaved ? 'Bỏ lưu tin này' : 'Lưu tin yêu thích'}
        >
          <Heart
            className={`h-5 w-5 transition-all duration-200 group-hover/heart:scale-125 ${
              isSaved
                ? 'fill-red-500 text-red-500 scale-110 drop-shadow'
                : 'text-slate-600 group-hover/heart:text-red-500 group-hover/heart:fill-red-500'
            }`}
          />
        </button>

        {/* Price Tag Overlay (Bottom-left) */}
        <div
          className="group/price absolute bottom-2.5 left-2.5 z-20 rounded-xl bg-slate-900/90 backdrop-blur-md px-3 py-1.5 text-xs font-black text-white shadow-lg border border-white/15 cursor-pointer select-none transform-gpu transition-all duration-200 hover:scale-115 hover:-translate-y-1.5 hover:bg-slate-950 hover:border-amber-400 hover:ring-2 hover:ring-amber-400/70 hover:shadow-2xl hover:shadow-amber-500/30 origin-bottom-left"
          title="Giá niêm yết"
        >
          <span className="text-white group-hover/price:text-amber-300 transition-colors font-black text-sm tracking-tight drop-shadow-sm">
            {formatCurrencyVND(listing.price)}
          </span>
          <span className="ml-1.5 text-[11px] font-medium text-slate-300 group-hover/price:text-slate-100 transition-colors">
            ({formatPricePerM2(listing.price, listing.area)})
          </span>
        </div>

        {/* Hover Slide-up AI Report Button (Bottom-right) */}
        <div
          className="absolute bottom-2.5 right-2.5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform-gpu translate-y-2 group-hover:translate-y-0"
        >
          <Link
            href={`/reports/${listing.id}`}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-orange-500/40 hover:shadow-xl hover:shadow-orange-500/60 hover:scale-110 transition-all cursor-pointer border border-white/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Xem báo cáo AI</span>
          </Link>
        </div>
      </div>

      {/* Content Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <Link href={`/listings/${listing.id}`} className="group/title block">
          <h3
            className="line-clamp-2 text-[13px] font-extrabold leading-snug text-slate-800 transition-all duration-200 transform-gpu group-hover/title:text-orange-600 group-hover/title:scale-[1.03] group-hover/title:translate-x-1.5 group-hover/title:drop-shadow-sm origin-left cursor-pointer"
          >
            {listing.title}
          </h3>
        </Link>

        {/* Address */}
        <div
          className="group/addr mt-2.5 flex items-center gap-1.5 text-xs text-slate-500 transition-all duration-200 transform-gpu hover:scale-105 hover:translate-x-1 hover:text-slate-900 origin-left cursor-pointer select-none"
        >
          <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500 transition-transform duration-200 group-hover/addr:scale-130 group-hover/addr:text-orange-600" />
          <span className="truncate font-semibold">{listing.ward ? `${listing.ward}, ` : ''}{listing.district}, Hà Nội</span>
        </div>

        {/* Specs Row */}
        <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-600">
          {/* Area */}
          <div
            className="group/area flex items-center gap-1.5 px-2 py-1 rounded-lg border border-slate-100 bg-slate-50/70 transition-all duration-200 transform-gpu cursor-pointer select-none hover:scale-125 hover:-translate-y-1 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 hover:text-white hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/30 hover:z-10"
            title="Diện tích đất / sàn"
          >
            <Maximize2 className="h-3.5 w-3.5 text-slate-400 group-hover/area:text-white transition-colors" />
            <span className="font-black text-slate-900 group-hover/area:text-white transition-colors">
              {listing.area} m²
            </span>
          </div>

          {/* Floors */}
          {listing.floors > 0 && (
            <div
              className="group/floor flex items-center gap-1.5 px-2 py-1 rounded-lg border border-slate-100 bg-slate-50/70 transition-all duration-200 transform-gpu cursor-pointer select-none hover:scale-125 hover:-translate-y-1 hover:bg-slate-900 hover:text-white hover:border-slate-800 hover:shadow-lg hover:shadow-slate-900/30 hover:z-10"
              title="Số tầng xây dựng"
            >
              <Building className="h-3.5 w-3.5 text-slate-400 group-hover/floor:text-white transition-colors" />
              <span className="font-bold text-slate-700 group-hover/floor:text-white transition-colors">
                {listing.floors} tầng
              </span>
            </div>
          )}

          {/* Bedrooms */}
          {listing.bedrooms > 0 && (
            <div
              className="group/bed flex items-center gap-1.5 px-2 py-1 rounded-lg border border-slate-100 bg-slate-50/70 transition-all duration-200 transform-gpu cursor-pointer select-none hover:scale-125 hover:-translate-y-1 hover:bg-blue-600 hover:text-white hover:border-blue-500 hover:shadow-lg hover:shadow-blue-600/30 hover:z-10"
              title="Số phòng ngủ"
            >
              <Bed className="h-3.5 w-3.5 text-slate-400 group-hover/bed:text-white transition-colors" />
              <span className="font-bold text-slate-700 group-hover/bed:text-white transition-colors">
                {listing.bedrooms} PN
              </span>
            </div>
          )}

          {/* Bathrooms */}
          {listing.bathrooms > 0 && (
            <div
              className="group/bath flex items-center gap-1.5 px-2 py-1 rounded-lg border border-slate-100 bg-slate-50/70 transition-all duration-200 transform-gpu cursor-pointer select-none hover:scale-125 hover:-translate-y-1 hover:bg-teal-600 hover:text-white hover:border-teal-500 hover:shadow-lg hover:shadow-teal-600/30 hover:z-10"
              title="Số phòng vệ sinh"
            >
              <Bath className="h-3.5 w-3.5 text-slate-400 group-hover/bath:text-white transition-colors" />
              <span className="font-bold text-slate-700 group-hover/bath:text-white transition-colors">
                {listing.bathrooms} PT
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
