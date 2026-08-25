'use client';

import React, { useState, useCallback, useEffect, useMemo, useRef, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { ListingCard } from '@/components/listing/ListingCard';
import { useApp } from '@/lib/context/AppContext';
import {
  SearchFilters,
  DEFAULT_SEARCH_FILTERS,
  filterListings,
  sortListings,
} from '@/lib/search/filterListings';
import { SearchHeader } from '@/components/search/SearchHeader';
import { ActiveFilterChips } from '@/components/search/ActiveFilterChips';
import { FilterSidebar } from '@/components/search/FilterSidebar';
import { ListingsPanel } from '@/components/search/ListingsPanel';
import { ListingListRow } from '@/components/search/ListingListRow';
import { SaveSearchModal } from '@/components/search/SaveSearchModal';
import { Sliders, ListFilter, Map as MapIcon, X } from 'lucide-react';

const SearchMap = dynamic(() => import('@/components/map/SearchMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-400 gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      <span className="text-xs font-semibold">Đang tải bản đồ tương tác...</span>
    </div>
  ),
});

function SearchContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { listings, savedListingIds, toggleSaveListing } = useApp();

  // ── FILTER STATE ──
  const [filters, setFilters] = useState<SearchFilters>(() => {
    return {
      keyword: searchParams.get('q') || searchParams.get('search') || '',
      type: searchParams.get('type') || 'all',
      listingType: (searchParams.get('purpose') as any) || 'sale',
      district: searchParams.get('district') || '',
      ward: searchParams.get('ward') || '',
      street: searchParams.get('street') || '',
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
      minArea: searchParams.get('minArea') ? Number(searchParams.get('minArea')) : null,
      maxArea: searchParams.get('maxArea') ? Number(searchParams.get('maxArea')) : null,
      minBedrooms: searchParams.get('beds') ? Number(searchParams.get('beds')) : null,
      maxBedrooms: null,
      minBathrooms: null,
      minFloors: null,
      direction: searchParams.get('direction') ? [searchParams.get('direction')!] : [],
      legalStatus: [],
      features: [],
      planningZone: [],
      minPricePerM2: null,
      maxPricePerM2: null,
      minYearBuilt: null,
      maxYearBuilt: null,
      featuredOnly: searchParams.get('featured') === 'true',
      verifiedOnly: false,
      hasAIReport: false,
      nearSchool: false,
      nearHospital: false,
      nearMetro: searchParams.get('metro') === 'true',
      nearPark: false,
      nearRadius: 2,
    };
  });

  // ── UI STATE ──
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'grid'>(
    (searchParams.get('view') as any) || 'map'
  );
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'filters' | 'listings'>('listings');
  const [showSaveSearchModal, setShowSaveSearchModal] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // ── URL PARAM SYNC (Debounced 500ms) ──
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.keyword) params.set('q', filters.keyword);
    if (filters.type !== 'all') params.set('type', filters.type);
    if (filters.listingType !== 'sale') params.set('purpose', filters.listingType);
    if (filters.district) params.set('district', filters.district);
    if (filters.ward) params.set('ward', filters.ward);
    if (filters.street) params.set('street', filters.street);
    if (filters.minPrice !== null) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== null) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.minArea !== null) params.set('minArea', filters.minArea.toString());
    if (filters.maxArea !== null) params.set('maxArea', filters.maxArea.toString());
    if (filters.minBedrooms !== null) params.set('beds', filters.minBedrooms.toString());
    if (filters.featuredOnly) params.set('featured', 'true');
    if (filters.nearMetro) params.set('metro', 'true');
    if (viewMode !== 'map') params.set('view', viewMode);

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [filters, viewMode, pathname, router]);

  useEffect(() => {
    const timer = setTimeout(updateURL, 500);
    return () => clearTimeout(timer);
  }, [updateURL]);

  // ── FILTER & SORT DATA ──
  const filteredListings = useMemo(() => {
    const filtered = filterListings(listings, filters);
    return sortListings(filtered, sortBy);
  }, [listings, filters, sortBy]);

  // ── ACTIVE FILTER COUNT ──
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.keyword.trim()) count++;
    if (filters.type !== 'all') count++;
    if (filters.district) count++;
    if (filters.ward) count++;
    if (filters.street) count++;
    if (filters.minPrice !== null || filters.maxPrice !== null) count++;
    if (filters.minArea !== null || filters.maxArea !== null) count++;
    if (filters.minBedrooms !== null) count++;
    if (filters.direction.length > 0) count += filters.direction.length;
    if (filters.legalStatus.length > 0) count += filters.legalStatus.length;
    if (filters.features.length > 0) count += filters.features.length;
    if (filters.planningZone.length > 0) count += filters.planningZone.length;
    if (filters.featuredOnly) count++;
    if (filters.nearMetro) count++;
    return count;
  }, [filters]);

  // ── RESET ALL FILTERS ──
  const handleResetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_SEARCH_FILTERS });
  }, []);

  // ── REMOVE INDIVIDUAL FILTER CHIP ──
  const handleRemoveChip = useCallback((key: keyof SearchFilters, value?: any) => {
    setFilters((prev) => {
      if (Array.isArray(prev[key])) {
        return {
          ...prev,
          [key]: (prev[key] as string[]).filter((item) => item !== value),
        };
      }
      return {
        ...prev,
        [key]: DEFAULT_SEARCH_FILTERS[key],
      };
    });
  }, []);

  // ── UPDATE PARTIAL FILTER STATE ──
  const handleFilterUpdate = useCallback(
    (update: Partial<SearchFilters> | ((prev: SearchFilters) => SearchFilters)) => {
      setFilters((prev) => (typeof update === 'function' ? update(prev) : { ...prev, ...update }));
    },
    []
  );

  // ── BIDIRECTIONAL SYNC HANDLERS ──
  const handleListingSelect = useCallback((id: string) => {
    setSelectedListingId(id);
    // If user clicked marker or card, scroll to card if visible
    setTimeout(() => {
      const el = document.getElementById(`listing-card-${id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-page-bg text-text-primary">
      <Navbar />

      {/* TOP HEADER CONTROLS (56px) */}
      <div className="pt-16">
        <SearchHeader
          filters={filters}
          onFilterChange={handleFilterUpdate}
          activeCount={activeFilterCount}
          resultCount={filteredListings.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onReset={handleResetFilters}
          onOpenSaveSearch={() => setShowSaveSearchModal(true)}
          onToggleMobileFilter={() => setMobileFilterOpen(true)}
        />

        {/* ACTIVE FILTER CHIPS BAR */}
        <ActiveFilterChips
          filters={filters}
          onRemove={handleRemoveChip}
          onReset={handleResetFilters}
          count={activeFilterCount}
        />
      </div>

      {/* MAIN 30 / 70 WORKSPACE */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        
        {/* ━━ LEFT COLUMN (30% Width - Min 280px, Max 380px) ━━ */}
        <div className="hidden md:flex w-[30%] min-w-[300px] max-w-[380px] flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shrink-0 z-20">
          
          {/* Sidebar Tab Selector: [📋 Danh sách ({count})] vs [⚙️ Bộ lọc ({activeCount})] */}
          <div className="grid grid-cols-2 p-2 border-b border-slate-100 dark:border-slate-800 gap-1 bg-slate-50 dark:bg-slate-900/50 text-xs font-bold shrink-0">
            <button
              onClick={() => setSidebarTab('listings')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                sidebarTab === 'listings'
                  ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ListFilter className="h-3.5 w-3.5" />
              <span>Danh sách ({filteredListings.length})</span>
            </button>

            <button
              onClick={() => setSidebarTab('filters')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                sidebarTab === 'filters'
                  ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Bộ lọc chi tiết</span>
              {activeFilterCount > 0 && (
                <span className="bg-orange-500 text-white text-[10px] px-1.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Sidebar Tab Content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {sidebarTab === 'filters' ? (
              <FilterSidebar
                filters={filters}
                onChange={handleFilterUpdate}
                onReset={handleResetFilters}
                activeCount={activeFilterCount}
              />
            ) : (
              <ListingsPanel
                listings={filteredListings}
                selectedId={selectedListingId}
                hoveredId={hoveredListingId}
                savedIds={savedListingIds}
                onSelect={handleListingSelect}
                onHover={setHoveredListingId}
                onSaveToggle={toggleSaveListing}
                onResetFilters={handleResetFilters}
              />
            )}
          </div>
        </div>

        {/* ━━ RIGHT COLUMN (70% Width) ━━ */}
        <div className="flex-1 relative min-h-0 overflow-hidden bg-slate-100 dark:bg-slate-950">
          <AnimatePresence mode="wait">
            
            {/* VIEW MODE 1: Interactive GIS MAP */}
            {viewMode === 'map' && (
              <motion.div
                key="map-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <SearchMap
                  listings={filteredListings as any}
                  selectedListingId={selectedListingId}
                  hoveredListingId={hoveredListingId}
                  targetDistrict={filters.district}
                  onMarkerClick={(id) => {
                    handleListingSelect(id);
                    setSidebarTab('listings');
                  }}
                  onMarkerHover={setHoveredListingId}
                  showPlanningLayer={filters.planningZone.length > 0}
                />
              </motion.div>
            )}

            {/* VIEW MODE 2: GRID CARDS */}
            {viewMode === 'grid' && (
              <motion.div
                key="grid-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 overflow-y-auto p-4 sm:p-6"
              >
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredListings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW MODE 3: HORIZONTAL LIST ROWS */}
            {viewMode === 'list' && (
              <motion.div
                key="list-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 overflow-y-auto p-4 sm:p-6"
              >
                <div className="max-w-4xl mx-auto space-y-3">
                  {filteredListings.map((listing, idx) => (
                    <ListingListRow
                      key={listing.id}
                      listing={listing}
                      index={idx}
                      isSaved={savedListingIds.includes(listing.id)}
                      onSaveToggle={toggleSaveListing}
                    />
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* ━━ MOBILE BOTTOM SHEET FOR FILTERS ━━ */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-slate-900 rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Sheet Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="w-8 h-1 bg-slate-300 rounded-full mx-auto absolute top-2 left-1/2 -translate-x-1/2" />
                <h3 className="font-extrabold text-sm text-navy dark:text-white">
                  Bộ lọc tìm kiếm ({activeFilterCount})
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sheet Content */}
              <div className="flex-1 overflow-y-auto">
                <FilterSidebar
                  filters={filters}
                  onChange={handleFilterUpdate}
                  onReset={handleResetFilters}
                  activeCount={activeFilterCount}
                />
              </div>

              {/* Sheet Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                >
                  Đặt lại
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-2 py-3 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-500/20"
                >
                  Xem {filteredListings.length} kết quả
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ━━ SAVE SEARCH MODAL ━━ */}
      <SaveSearchModal
        isOpen={showSaveSearchModal}
        onClose={() => setShowSaveSearchModal(false)}
        filters={filters}
        activeCount={activeFilterCount}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-page-bg">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            <span className="text-xs font-semibold text-slate-500">Đang tải trang tìm kiếm...</span>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

