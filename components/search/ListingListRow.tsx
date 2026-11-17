'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ListingItem } from '@/lib/mock-data';
import { formatCurrencyVND, formatPricePerM2 } from '@/lib/utils';
import { MapPin, Bed, Bath, Layers, Sparkles, Heart, ArrowRight, ShieldCheck, Maximize2 } from 'lucide-react';
import { getListingUrl } from '@/lib/listing-slug';
import { PropertyImage } from '@/components/common/PropertyImage';
import { normalizeListingImages } from '@/lib/listing-images';

interface ListingListRowProps {
  listing: ListingItem;
  index: number;
  isSaved?: boolean;
  isSelected?: boolean;
  onSaveToggle?: (id: string) => void;
  onSelect?: (id: string) => void;
}

export const ListingListRow: React.FC<ListingListRowProps> = ({
  listing,
  index,
  isSaved,
  isSelected,
  onSaveToggle,
  onSelect,
}) => {
  const listingUrl = getListingUrl(listing);

  return (
    <motion.div
      id={`listing-card-${listing.id}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      onClick={() => onSelect && onSelect(listing.id)}
      className={`group relative flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer ${
        isSelected
          ? 'border-orange-500 bg-orange-50/30 dark:bg-orange-950/20 ring-2 ring-orange-500/20 shadow-md'
          : 'border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-900/50'
      }`}
    >
      {/* Image Left */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect && onSelect(listing.id);
        }}
        className="relative sm:w-56 h-48 sm:h-auto overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 cursor-pointer"
      >
        <PropertyImage
          src={listing.images[0]}
          alt={listing.title}
          propertyType={listing.type}
          width={480}
          quality={80}
          className="group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {listing.isFeatured && (
            <span className="bg-orange-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow">
              ⭐ Nổi bật
            </span>
          )}
          <span className="bg-navy/80 backdrop-blur-sm text-white font-bold text-[9px] px-1.5 py-0.5 rounded">
            {listing.planningZone}
          </span>
        </div>

        {onSaveToggle && (
          <button
            onClick={() => onSaveToggle(listing.id)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 dark:bg-slate-900/90 shadow flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        )}
      </div>

      {/* Content Center */}
      <div className="flex-1 p-4 flex flex-col justify-between space-y-2.5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-orange-600">
            <span className="bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded">
              {listing.type === 'house' ? '🏠 Nhà phố' : listing.type === 'apartment' ? '🏢 Chung cư' : '🌿 Đất nền'}
            </span>
            <span className="text-slate-400 font-normal">·</span>
            <span className="text-slate-500">{listing.legalStatus}</span>
          </div>

          <Link href={listingUrl}>
            <h3 className="text-sm sm:text-base font-extrabold text-navy dark:text-white group-hover:text-orange-600 transition-colors line-clamp-1 mt-1">
              {listing.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
            <MapPin className="h-3.5 w-3.5 text-orange-500 shrink-0" />
            <span className="truncate">{listing.address}</span>
          </p>
        </div>

        {/* Specs & Tags */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-semibold pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1">
            <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
            {listing.area} m²
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5 text-slate-400" />
            {listing.bedrooms} PN
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5 text-slate-400" />
            {listing.bathrooms} WC
          </span>
          {listing.direction && (
            <>
              <span>·</span>
              <span>Hướng: {listing.direction}</span>
            </>
          )}
        </div>
      </div>

      {/* Price & CTA Right */}
      <div className="sm:w-48 p-4 bg-slate-50/50 dark:bg-slate-800/40 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 flex flex-col justify-between items-start sm:items-end text-left sm:text-right shrink-0">
        <div>
          <span className="text-lg font-black text-orange-600 dark:text-orange-400 block">
            {formatCurrencyVND(listing.price)}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {formatPricePerM2(listing.price, listing.area)}
          </span>
        </div>

        <div className="w-full mt-3 sm:mt-0">
          <Link
            href={listingUrl}
            className="w-full py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors shadow-sm"
          >
            <span>Chi tiết</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
