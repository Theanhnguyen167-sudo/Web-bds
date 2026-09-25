'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  MapPin,
  Crosshair,
  Loader2,
  Navigation,
  Compass,
  Building,
  Check,
} from 'lucide-react';
import {
  HanoiLocationItem,
  searchHanoiLocations,
  LOCATION_CATEGORY_CONFIG,
  HANOI_LOCATIONS,
} from '@/lib/data/hanoi-locations';

interface MapLocationSearchProps {
  onSelectLocation: (loc: HanoiLocationItem) => void;
  onLocateMe: () => void;
  isLocating: boolean;
  activeLocationName?: string | null;
  onClearLocation?: () => void;
}

export const MapLocationSearch: React.FC<MapLocationSearchProps> = ({
  onSelectLocation,
  onLocateMe,
  isLocating,
  activeLocationName,
  onClearLocation,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlineResults, setOnlineResults] = useState<HanoiLocationItem[]>([]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Instant local suggestions
  const localResults = React.useMemo(() => {
    if (!query.trim()) {
      // Default top suggestions when clicking on empty input
      return HANOI_LOCATIONS.slice(0, 7);
    }
    return searchHanoiLocations(query, 12);
  }, [query]);

  // Filter by category if user clicks a category filter pill
  const filteredResults = React.useMemo(() => {
    const list = [...localResults, ...onlineResults];
    // Deduplicate by name
    const seen = new Set<string>();
    const unique = list.filter((item) => {
      const key = item.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (selectedCategory === 'all') return unique;
    return unique.filter((item) => item.category === selectedCategory);
  }, [localResults, onlineResults, selectedCategory]);

  // Debounced online geocoding query fallback via OSM Nominatim
  useEffect(() => {
    if (!query.trim() || query.trim().length < 3) {
      setOnlineResults([]);
      setIsSearchingOnline(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingOnline(true);
        const encoded = encodeURIComponent(`${query.trim()}, Hà Nội, Việt Nam`);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&countrycodes=vn&limit=4&addressdetails=1`,
          { headers: { 'Accept-Language': 'vi' } }
        );
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();

        const formatted: HanoiLocationItem[] = data.map((item: any) => ({
          id: `osm-${item.place_id}`,
          name: item.name || item.display_name.split(',')[0],
          category: 'landmark',
          district: item.address?.suburb || item.address?.city_district || 'Hà Nội',
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          zoom: 16,
          description: item.display_name.split(',').slice(0, 3).join(','),
        }));

        setOnlineResults(formatted);
      } catch (err) {
        // Silently handle geocode offline/rate-limit fallback
        setOnlineResults([]);
      } finally {
        setIsSearchingOnline(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item: HanoiLocationItem) => {
    setQuery(item.name);
    setIsOpen(false);
    onSelectLocation(item);
  };

  const handleClear = () => {
    setQuery('');
    setOnlineResults([]);
    onClearLocation?.();
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-[340px] sm:max-w-[380px] z-[450]">
      {/* ── Search Input Box ── */}
      <div
        className={`flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl border transition-all duration-200 ${
          isOpen
            ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-orange-500/10'
            : 'border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
      >
        <Search className="h-4 w-4 text-orange-500 shrink-0" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Tìm quận, đường phố, KĐT, dự án..."
          className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none min-w-0"
        />

        {/* Loading Spinner for online geocoding */}
        {isSearchingOnline && (
          <Loader2 className="h-3.5 w-3.5 text-slate-400 animate-spin shrink-0" />
        )}

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Xóa tìm kiếm vị trí"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Locate Me Shortcut Button in the Search Bar */}
        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-0.5" />
        <button
          onClick={onLocateMe}
          disabled={isLocating}
          title="Định vị vị trí hiện tại của tôi"
          className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold transition-all ${
            isLocating
              ? 'bg-blue-100 text-blue-600 animate-pulse cursor-wait'
              : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400'
          }`}
        >
          {isLocating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Crosshair className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          )}
          <span className="hidden sm:inline text-[11px]">GPS</span>
        </button>
      </div>

      {/* ── Active Location Banner Badge ── */}
      {activeLocationName && !isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 backdrop-blur-sm text-orange-600 dark:text-orange-400 text-xs font-semibold"
        >
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0 animate-bounce" />
            <span className="truncate">Đang xem: {activeLocationName}</span>
          </div>
          {onClearLocation && (
            <button
              onClick={onClearLocation}
              className="text-[11px] underline hover:text-orange-700 ml-1 shrink-0"
            >
              Bỏ ghim
            </button>
          )}
        </motion.div>
      )}

      {/* ── Autocomplete Dropdown Menu ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[500] max-h-[380px] flex flex-col"
          >
            {/* Quick Category Filter Pills */}
            <div className="flex items-center gap-1 p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-x-auto text-[11px] font-semibold shrink-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setSelectedCategory('district')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  selectedCategory === 'district'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-blue-600'
                }`}
              >
                🏛️ Quận
              </button>
              <button
                onClick={() => setSelectedCategory('project')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  selectedCategory === 'project'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-purple-600'
                }`}
              >
                🏙️ Dự án/KĐT
              </button>
              <button
                onClick={() => setSelectedCategory('street')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  selectedCategory === 'street'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-emerald-600'
                }`}
              >
                🛣️ Tuyến phố
              </button>
            </div>

            {/* Quick Locate Me Action Tile */}
            <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-blue-50/50 dark:bg-blue-950/30">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLocateMe();
                }}
                disabled={isLocating}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm text-xs font-bold group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-white/20">
                    {isLocating ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Navigation className="h-3.5 w-3.5 transform group-hover:rotate-45 transition-transform" />
                    )}
                  </div>
                  <span>{isLocating ? 'Đang dò vị trí GPS...' : 'Định vị vị trí hiện tại của tôi'}</span>
                </div>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-medium">
                  Bán kính 2km
                </span>
              </button>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredResults.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  <p className="font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Không tìm thấy địa điểm phù hợp
                  </p>
                  <p>Hãy thử gõ tên Quận, tên đường hoặc dự án tại Hà Nội</p>
                </div>
              ) : (
                filteredResults.map((item) => {
                  const cfg = LOCATION_CATEGORY_CONFIG[item.category] || {
                    label: 'Địa điểm',
                    icon: '📍',
                    color: 'bg-slate-100 text-slate-600',
                  };

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between gap-2 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm shrink-0 group-hover:scale-110 transition-transform">
                          {cfg.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                              {item.name}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-md border font-semibold shrink-0 ${cfg.color}`}
                            >
                              {cfg.label}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {item.district && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.district}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Bottom Footer hint */}
            <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-[10px] text-slate-400 text-center">
              💡 Bấm để bay bản đồ tới vị trí & kiểm tra bất động sản lân cận
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
