'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ListingItem } from '@/lib/mock-data';
import { formatCurrencyVND, formatPricePerM2 } from '@/lib/utils';
import { X, MapPin, Maximize2, Bed, Bath, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface PropertyPopupProps {
  listing: ListingItem;
  onClose: () => void;
}

export const PropertyPopup: React.FC<PropertyPopupProps> = ({ listing, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 15 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className="absolute bottom-6 right-6 z-40 w-80 rounded-2xl border border-slate-700/60 bg-primary/95 p-3.5 text-white shadow-2xl backdrop-blur-xl"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-slate-300 hover:bg-black/80 hover:text-white transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* Image Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-800">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Planning badge */}
        <div className="absolute top-2 left-2 rounded-md bg-emerald-600/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          <span>{listing.planningZone}</span>
        </div>

        {/* Price tag */}
        <div className="absolute bottom-2 left-2 rounded-lg bg-accent px-2 py-0.5 text-xs font-extrabold text-white shadow-md">
          {formatCurrencyVND(listing.price)}
          <span className="ml-1 text-[10px] font-normal opacity-90">
            ({formatPricePerM2(listing.price, listing.area)})
          </span>
        </div>
      </div>

      {/* Info details */}
      <div className="mt-3 space-y-2">
        <h4 className="line-clamp-2 text-xs font-bold leading-snug text-slate-100">
          {listing.title}
        </h4>

        <div className="flex items-center gap-1 text-[11px] text-slate-300">
          <MapPin className="h-3 w-3 text-accent shrink-0" />
          <span className="truncate">{listing.ward}, {listing.district}</span>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3 border-t border-slate-700/80 pt-2 text-[11px] text-slate-300">
          <div className="flex items-center gap-1">
            <Maximize2 className="h-3 w-3 text-slate-400" />
            <span>{listing.area}m²</span>
          </div>
          {listing.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="h-3 w-3 text-slate-400" />
              <span>{listing.bedrooms} PN</span>
            </div>
          )}
          {listing.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="h-3 w-3 text-slate-400" />
              <span>{listing.bathrooms} PT</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            href={`/reports/${listing.id}`}
            className="flex items-center justify-center gap-1 rounded-lg bg-primary-light/80 hover:bg-primary-light border border-slate-600 px-2.5 py-1.5 text-[11px] font-bold text-accent transition-colors"
          >
            <Sparkles className="h-3 w-3" />
            <span>Thẩm định AI</span>
          </Link>

          <Link
            href={`/listings/${listing.id}`}
            className="flex items-center justify-center gap-1 rounded-lg bg-accent hover:bg-accent-hover px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-colors"
          >
            <span>Xem chi tiết</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
