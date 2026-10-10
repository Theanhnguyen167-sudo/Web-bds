'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  MapPin,
  Crosshair,
  Loader2,
  Navigation,
  Clock,
  Trash2,
  Building2,
  CornerDownLeft,
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

const RECENT_SEARCHES_KEY = 'hanoi_map_recent_searches';

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
  const [recentSearches, setRecentSearches] = useState<HanoiLocationItem[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 5));
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save a location to recent searches
  const saveToRecent = useCallback((item: HanoiLocationItem) => {
    try {
      setRecentSearches((prev) => {
        const filtered = prev.filter((p) => p.name.toLowerCase() !== item.name.toLowerCase());
        const updated = [item, ...filtered].slice(0, 5);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch {
      // Ignore
    }
  }, []);

  // Clear all recent searches
  const clearRecentSearches = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore
    }
  }, []);

  // Remove single recent item
  const removeRecentItem = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

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

  // Instant local suggestions (includes parsed addresses like "15 Duy Tân", "Số 10 Tôn Thất Tùng")
  const localResults = useMemo(() => {
    if (!query.trim()) {
      return HANOI_LOCATIONS.slice(0, 8);
    }
    return searchHanoiLocations(query, 12);
  }, [query]);

  // Online Geocoding via /api/geocode (Photon + Nominatim server engine)
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setOnlineResults([]);
      setIsSearchingOnline(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingOnline(true);
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(trimmed)}`);
        if (!res.ok) throw new Error('Geocode failed');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setOnlineResults(json.data);
        }
      } catch {
        setOnlineResults([]);
      } finally {
        setIsSearchingOnline(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Combined & deduplicated results
  const combinedResults = useMemo(() => {
    const list: HanoiLocationItem[] = [];
    const seenCoords = new Set<string>();
    const seenNames = new Set<string>();

    // 1. Online results first if they have high-precision address
    const highPrecisionOnline = onlineResults.filter((r) => r.category === 'address');
    for (const item of highPrecisionOnline) {
      const keyCoord = `${item.lat.toFixed(4)},${item.lng.toFixed(4)}`;
      const keyName = item.name.toLowerCase();
      if (!seenCoords.has(keyCoord) && !seenNames.has(keyName)) {
        seenCoords.add(keyCoord);
        seenNames.add(keyName);
        list.push(item);
      }
    }

    // 2. Local results (including parsed address)
    for (const item of localResults) {
      const keyCoord = `${item.lat.toFixed(4)},${item.lng.toFixed(4)}`;
      const keyName = item.name.toLowerCase();
      if (!seenCoords.has(keyCoord) && !seenNames.has(keyName)) {
        seenCoords.add(keyCoord);
        seenNames.add(keyName);
        list.push(item);
      }
    }

    // 3. Remaining online results
    for (const item of onlineResults) {
      const keyCoord = `${item.lat.toFixed(4)},${item.lng.toFixed(4)}`;
      const keyName = item.name.toLowerCase();
      if (!seenCoords.has(keyCoord) && !seenNames.has(keyName)) {
        seenCoords.add(keyCoord);
        seenNames.add(keyName);
        list.push(item);
      }
    }

    return list;
  }, [localResults, onlineResults]);

  // Filter by selected category tab
  const displayedResults = useMemo(() => {
    if (selectedCategory === 'all') return combinedResults;
    return combinedResults.filter((item) => item.category === selectedCategory);
  }, [combinedResults, selectedCategory]);

  // Reset highlight index when results change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [displayedResults]);

  // Handle selecting an item
  const handleSelect = (item: HanoiLocationItem) => {
    saveToRecent(item);
    setQuery(item.name);
    setIsOpen(false);
    onSelectLocation(item);
  };

  // Handle clear query
  const handleClear = () => {
    setQuery('');
    setOnlineResults([]);
    onClearLocation?.();
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    const listLength = query.trim() ? displayedResults.length : recentSearches.length || displayedResults.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < listLength - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : listLength - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        const targetList = query.trim() ? displayedResults : (recentSearches.length > 0 ? recentSearches : displayedResults);
        if (targetList[highlightedIndex]) {
          handleSelect(targetList[highlightedIndex]);
        }
      } else if (displayedResults.length > 0) {
        handleSelect(displayedResults[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Highlight query text inside name
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="text-orange-600 dark:text-orange-400 font-extrabold underline decoration-orange-300 dark:decoration-orange-600">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-[340px] sm:max-w-[420px] z-[500]">
      {/* ── Google Maps Search Bar ── */}
      <div
        className={`flex items-center gap-2 px-3.5 py-2.5 sm:py-3 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 ${
          isOpen
            ? 'border-orange-500 ring-4 ring-orange-500/20 shadow-[0_16px_40px_-6px_rgba(15,23,42,0.35)] dark:shadow-[0_20px_45px_-6px_rgba(0,0,0,0.85)]'
            : 'border-slate-300/90 dark:border-slate-700 ring-1 ring-slate-900/5 shadow-[0_10px_30px_-4px_rgba(15,23,42,0.25)] dark:shadow-[0_12px_36px_-4px_rgba(0,0,0,0.7)] hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-[0_14px_34px_-4px_rgba(15,23,42,0.3)]'
        }`}
      >
        {/* Left Google Maps Pin Icon */}
        <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 shrink-0">
          <Search className="h-4 w-4" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
          placeholder="Tìm số nhà, ngõ, đường phố, tòa nhà, quận..."
          className="flex-1 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none min-w-0"
        />

        {/* Loading Spinner */}
        {isSearchingOnline && (
          <Loader2 className="h-4 w-4 text-orange-500 animate-spin shrink-0" />
        )}

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Xóa tìm kiếm"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0" />

        {/* GPS Locate Me Button */}
        <button
          onClick={onLocateMe}
          disabled={isLocating}
          title="Định vị vị trí GPS hiện tại của tôi"
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            isLocating
              ? 'bg-blue-100 text-blue-600 animate-pulse cursor-wait'
              : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/70 dark:hover:bg-blue-900/70 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60'
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
          className="mt-2 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 backdrop-blur-sm text-orange-600 dark:text-orange-400 text-xs font-semibold shadow-sm"
        >
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0 animate-bounce" />
            <span className="truncate">Đang ghim: {activeLocationName}</span>
          </div>
          {onClearLocation && (
            <button
              onClick={onClearLocation}
              className="text-[11px] underline hover:text-orange-700 ml-1 shrink-0 font-bold"
            >
              Bỏ ghim
            </button>
          )}
        </motion.div>
      )}

      {/* ── Google Maps Autocomplete Dropdown Menu ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_20px_50px_-8px_rgba(15,23,42,0.4)] dark:shadow-[0_25px_60px_-8px_rgba(0,0,0,0.95)] border border-slate-200 dark:border-slate-800 overflow-hidden z-[600] max-h-[460px] flex flex-col"
          >
            {/* Quick Category Filter Pills */}
            <div className="flex items-center gap-1.5 p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 overflow-x-auto text-[11px] font-semibold shrink-0 no-scrollbar">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-xl transition-all whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setSelectedCategory('address')}
                className={`px-2.5 py-1 rounded-xl transition-all whitespace-nowrap ${
                  selectedCategory === 'address'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-rose-600'
                }`}
              >
                📍 Số nhà / Địa chỉ
              </button>
              <button
                onClick={() => setSelectedCategory('street')}
                className={`px-2.5 py-1 rounded-xl transition-all whitespace-nowrap ${
                  selectedCategory === 'street'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-emerald-600'
                }`}
              >
                🛣️ Tuyến phố
              </button>
              <button
                onClick={() => setSelectedCategory('project')}
                className={`px-2.5 py-1 rounded-xl transition-all whitespace-nowrap ${
                  selectedCategory === 'project'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-purple-600'
                }`}
              >
                🏙️ Dự án & KĐT
              </button>
              <button
                onClick={() => setSelectedCategory('district')}
                className={`px-2.5 py-1 rounded-xl transition-all whitespace-nowrap ${
                  selectedCategory === 'district'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-blue-600'
                }`}
              >
                🏛️ Quận / Phường
              </button>
            </div>

            {/* Quick Locate Me Action Tile */}
            <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-blue-50/40 dark:bg-blue-950/20">
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
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
                  Bán kính 2km
                </span>
              </button>
            </div>

            {/* Recent Searches Section (When query is empty) */}
            {!query.trim() && recentSearches.length > 0 && selectedCategory === 'all' && (
              <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
                <div className="flex items-center justify-between px-3.5 py-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-slate-400" />
                    Lịch sử tìm kiếm gần đây
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 text-[10px]"
                    title="Xóa tất cả lịch sử"
                  >
                    <Trash2 className="h-3 w-3" />
                    Xóa hết
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {recentSearches.map((item, idx) => (
                    <div
                      key={`recent-${item.id}`}
                      onClick={() => handleSelect(item)}
                      className={`w-full text-left px-3.5 py-2 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between gap-2 group cursor-pointer ${
                        highlightedIndex === idx ? 'bg-orange-50 dark:bg-slate-800' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-orange-600 transition-colors">
                            {item.name}
                          </p>
                          {item.description && (
                            <p className="text-[10px] text-slate-400 truncate">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => removeRecentItem(e, item.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
                        title="Xóa khỏi lịch sử"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions Header */}
            {!query.trim() && (
              <div className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500">
                ⚡ Địa điểm & khu vực nổi bật tại Hà Nội
              </div>
            )}

            {/* Results List */}
            <div ref={listRef} className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {displayedResults.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <Building2 className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2 stroke-[1.5]" />
                  <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Không tìm thấy địa điểm phù hợp
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Hãy thử gõ số nhà, tên đường (vd: 15 Duy Tân, 36 Hoàng Cầu) hoặc tên dự án/quận
                  </p>
                </div>
              ) : (
                displayedResults.map((item, idx) => {
                  const cfg = LOCATION_CATEGORY_CONFIG[item.category] || {
                    label: 'Địa điểm',
                    icon: '📍',
                    color: 'bg-slate-100 text-slate-600 border-slate-200',
                  };
                  const isHighlighted = highlightedIndex === idx;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center justify-between gap-3 group ${
                        isHighlighted
                          ? 'bg-orange-50/90 dark:bg-slate-800/90'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Google Maps Style Icon Circle */}
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 border transition-transform group-hover:scale-105 ${
                            item.category === 'address'
                              ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:border-rose-800'
                              : item.category === 'street'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:border-emerald-800'
                              : item.category === 'project'
                              ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/60 dark:border-purple-800'
                              : item.category === 'district'
                              ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:border-blue-800'
                              : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/60 dark:border-amber-800'
                          }`}
                        >
                          {cfg.icon}
                        </div>

                        {/* Text Container */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                              {renderHighlightedText(item.name, query)}
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

                      <div className="flex items-center gap-2 shrink-0">
                        {item.district && (
                          <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                            {item.district}
                          </span>
                        )}
                        <CornerDownLeft className="h-3 w-3 text-slate-300 group-hover:text-orange-500 transition-colors" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Bottom Footer hint */}
            <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-[10px] text-slate-400 text-center flex items-center justify-between px-3">
              <span>💡 Dùng ↑ ↓ và Enter để chọn nhanh</span>
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                Google Maps Precision
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
