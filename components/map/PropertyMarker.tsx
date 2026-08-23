'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ListingItem } from '@/lib/mock-data';
import { formatCurrencyVND } from '@/lib/utils';
import { Home, Building2, Trees, Landmark } from 'lucide-react';

interface PropertyMarkerProps {
  listing: ListingItem;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (listing: ListingItem) => void;
  onHover: (id: string | null) => void;
  clusterCount?: number;
}

export const PropertyMarker: React.FC<PropertyMarkerProps> = ({
  listing,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  clusterCount,
}) => {
  const getIcon = () => {
    switch (listing.type) {
      case 'apartment':
        return <Building2 className="h-3.5 w-3.5" />;
      case 'villa':
        return <Landmark className="h-3.5 w-3.5" />;
      case 'land':
        return <Trees className="h-3.5 w-3.5" />;
      default:
        return <Home className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="relative group">
      {/* Hover Tooltip */}
      {isHovered && !isSelected && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: -4, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-40 whitespace-nowrap rounded-lg bg-primary/95 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-xl backdrop-blur-md pointer-events-none border border-slate-700"
        >
          <p className="font-bold text-accent">{formatCurrencyVND(listing.price)} · {listing.area}m²</p>
          <p className="text-[10px] text-slate-300 truncate max-w-[140px]">{listing.district}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-primary/95" />
        </motion.div>
      )}

      {/* Interactive Pin Marker */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          scale: isSelected ? 1.25 : isHovered ? 1.15 : 1,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        onClick={() => onSelect(listing)}
        onMouseEnter={() => onHover(listing.id)}
        onMouseLeave={() => onHover(null)}
        className={`relative flex items-center gap-1.5 rounded-full px-2.5 py-1 shadow-lg transition-colors z-20 cursor-pointer ${
          isSelected
            ? 'bg-accent text-white ring-4 ring-accent/40 shadow-glow'
            : isHovered
            ? 'bg-white text-primary ring-2 ring-accent font-bold'
            : 'bg-primary/90 text-white hover:bg-accent border border-slate-600'
        }`}
      >
        <span className="shrink-0">{getIcon()}</span>
        <span className="text-xs font-bold whitespace-nowrap">
          {formatCurrencyVND(listing.price)}
        </span>

        {/* Cluster count indicator if overlapping */}
        {clusterCount && clusterCount > 1 && (
          <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-extrabold text-white">
            +{clusterCount}
          </span>
        )}

        {/* Bottom Pointer triangle */}
        <div
          className={`absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] border-4 border-transparent ${
            isSelected ? 'border-t-accent' : isHovered ? 'border-t-white' : 'border-t-primary/90'
          }`}
        />
      </motion.button>
    </div>
  );
};
