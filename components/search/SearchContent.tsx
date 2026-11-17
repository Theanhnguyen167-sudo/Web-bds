'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
import { SearchDetailPreview } from '@/components/search/SearchDetailPreview';
import { ListingItem } from '@/lib/mock-data';
import { Sliders, ListFilter, X } from 'lucide-react';

const SearchMap = dynamic(() => import('@/components/map/SearchMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-400 gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      <span className="text-xs font-semibold">Đang tải bản đồ tương tác...</span>
    </div>
  ),
});

export interface SearchContentProps {
  initialType?: string;
  initialPurpose?: 'sale' | 'rent';
  initialKeyword?: string;
  categoryKeyword?: string;
  initialDistrict?: string;
  categoryTitle?: string;
  enableCanonicalMeta?: boolean;
}

export function SearchContent({
  initialType,
  initialPurpose,
  initialKeyword = '',
  categoryKeyword,
  initialDistrict,
  categoryTitle,
  enableCanonicalMeta = false,
}: SearchContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { listings, savedListingIds, toggleSaveListing, user, addToast } = useApp();

  // ── FILTER STATE ──
  const [filters, setFilters] = useState<SearchFilters>(() => {
    return {
      keyword: searchParams.get('q') || searchParams.get('search') || initialKeyword,
      categoryKeyword: categoryKeyword || '',
      type: searchParams.get('type') || initialType || 'all',
      listingType: (searchParams.get('purpose') as any) || initialPurpose || 'sale',
      district: searchParams.get('district') || initialDistrict || '',
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
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    searchParams.get('listingId') || null
  );
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  const [isLoadingSelected, setIsLoadingSelected] = useState<boolean>(false);
  const [selectedListingError, setSelectedListingError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(
    Boolean(searchParams.get('listingId'))
  );
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'filters' | 'listings'>('listings');
  const [showSaveSearchModal, setShowSaveSearchModal] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // ── DEEP LINK & HISTORY SYNC (searchParams.listingId) ──
  const urlListingId = searchParams.get('listingId');
  useEffect(() => {
    if (urlListingId) {
      setSelectedListingId(urlListingId);
      setIsPreviewOpen(true);
      setSidebarTab('listings');
    } else {
      // Khi URL không còn listingId (do back/forward)
      setSelectedListingId(null);
      setIsPreviewOpen(false);
      setSelectedListing(null);
      setSelectedListingError(null);
    }
  }, [urlListingId]);

  // ── FETCH / RESOLVE SELECTED LISTING ──
  useEffect(() => {
    if (!selectedListingId) {
      setSelectedListing(null);
      setSelectedListingError(null);
      setIsLoadingSelected(false);
      return;
    }

    // 1. Kiểm tra trong danh sách context hiện có
    const foundInContext = listings.find((l) => l.id === selectedListingId);
    if (foundInContext) {
      setSelectedListing(foundInContext);
      setSelectedListingError(null);
      setIsLoadingSelected(false);
      return;
    }

    // 2. Fetch từ API route nếu chưa có trong memory
    let isCancelled = false;
    setIsLoadingSelected(true);
    setSelectedListingError(null);

    fetch(`/api/listings/${encodeURIComponent(selectedListingId)}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Không tìm thấy bất động sản này hoặc tin đăng đã hết hạn.');
        }
        const json = await res.json();
        const data = json.data || json;
        if (!isCancelled) {
          if (data && data.id) {
            setSelectedListing(data);
            setSelectedListingError(null);
          } else {
            setSelectedListing(null);
            setSelectedListingError('Không tìm thấy bất động sản này hoặc tin đăng đã hết hạn.');
          }
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setSelectedListing(null);
          setSelectedListingError(err.message || 'Không thể tải thông tin bất động sản.');
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingSelected(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedListingId, listings]);

  // ── URL PARAM SYNC (Debounced 500ms) ──
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    
    // Keyword sync: chỉ đưa lên query params nếu khác keyword khởi tạo của category
    if (filters.keyword && filters.keyword !== initialKeyword) {
      params.set('q', filters.keyword);
    }

    // Type sync: chỉ đưa lên query params nếu khác type mặc định của category
    if (filters.type !== 'all' && filters.type !== (initialType || 'all')) {
      params.set('type', filters.type);
    }

    // Purpose sync: chỉ đưa lên query params nếu khác purpose mặc định của category
    const defaultPurpose = initialPurpose || 'sale';
    if (filters.listingType !== defaultPurpose) {
      params.set('purpose', filters.listingType);
    }

    if (filters.district && filters.district !== (initialDistrict || '')) {
      params.set('district', filters.district);
    }
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

    // Lưu giữ listingId nếu preview đang mở
    if (selectedListingId && isPreviewOpen) {
      params.set('listingId', selectedListingId);
    }

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [filters, viewMode, pathname, router, initialKeyword, initialType, initialPurpose, initialDistrict, selectedListingId, isPreviewOpen]);

  useEffect(() => {
    const timer = setTimeout(updateURL, 500);
    return () => clearTimeout(timer);
  }, [updateURL]);

  // ── FILTER & SORT DATA ──
  const filteredListings = useMemo(() => {
    let filtered = filterListings(listings, filters);
    // Nếu có selectedListing nhưng bị bộ lọc vô tình loại trừ, tự động đưa lên đầu
    if (selectedListing && !filtered.some((l) => l.id === selectedListing.id)) {
      filtered = [selectedListing, ...filtered];
    }
    return sortListings(filtered, sortBy);
  }, [listings, filters, sortBy, selectedListing]);

  // ── ACTIVE FILTER COUNT ──
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.keyword.trim() && filters.keyword !== initialKeyword) count++;
    if (filters.type !== 'all' && filters.type !== initialType) count++;
    if (filters.listingType !== (initialPurpose || 'sale')) count++;
    if (filters.district && filters.district !== (initialDistrict || '')) count++;
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
  }, [filters, initialKeyword, initialType, initialPurpose, initialDistrict]);

  // ── RESET ALL FILTERS ──
  const handleResetFilters = useCallback(() => {
    setFilters({
      ...DEFAULT_SEARCH_FILTERS,
      type: initialType || 'all',
      categoryKeyword: categoryKeyword || '',
      district: initialDistrict || '',
      listingType: initialPurpose || 'sale',
      keyword: initialKeyword || '',
    });
  }, [initialType, initialPurpose, initialKeyword, categoryKeyword, initialDistrict]);

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
        [key]: key === 'type'
          ? (initialType || 'all')
          : key === 'keyword'
          ? (initialKeyword || '')
          : key === 'listingType'
          ? (initialPurpose || 'sale')
          : key === 'categoryKeyword'
          ? (categoryKeyword || '')
          : key === 'district'
          ? (initialDistrict || '')
          : DEFAULT_SEARCH_FILTERS[key],
      };
    });
  }, [initialType, initialKeyword, initialPurpose, categoryKeyword, initialDistrict]);

  // ── UPDATE PARTIAL FILTER STATE ──
  const handleFilterUpdate = useCallback(
    (update: Partial<SearchFilters> | ((prev: SearchFilters) => SearchFilters)) => {
      setFilters((prev) => (typeof update === 'function' ? update(prev) : { ...prev, ...update }));
    },
    []
  );

  // ── BIDIRECTIONAL SYNC & PREVIEW HANDLERS ──
  const handleListingSelect = useCallback((id: string) => {
    setSelectedListingId(id);
    setIsPreviewOpen(true);
    setSidebarTab('listings');

    // Cập nhật ngay query param ?listingId=... lên URL (không reload trang)
    if (typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set('listingId', id);
      router.replace(`${pathname}?${currentParams.toString()}`, { scroll: false });
    }

    setTimeout(() => {
      const el = document.getElementById(`listing-card-${id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
  }, [pathname, router]);

  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setSelectedListingId(null);
    setSelectedListing(null);
    setSelectedListingError(null);

    // Xóa listingId khỏi URL mà không làm mất các filter khác
    if (typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.delete('listingId');
      const qs = currentParams.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  }, [pathname, router]);

  // ── SEO METADATA (CHỈ ÁP DỤNG TRANG SEARCH GỐC NẾU ĐƯỢC BẬT) ──
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanoirealty.vn';
  const deepFilterKeys = [
    'minPrice',
    'maxPrice',
    'minArea',
    'maxArea',
    'beds',
    'direction',
    'street',
    'ward',
    'purpose',
    'type',
    'metro',
    'featured',
    'view',
  ];
  const activeParamsList = Array.from(searchParams.keys());
  const hasDeepFilters = activeParamsList.some((k) => deepFilterKeys.includes(k));
  const districtParam = searchParams.get('district');

  const canonicalUrl = `${baseUrl}/search`;
  const shouldNoIndex = hasDeepFilters || activeParamsList.length > 0;

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-page-bg text-text-primary">
      {enableCanonicalMeta && (
        <>
          <link rel="canonical" href={canonicalUrl} />
          {shouldNoIndex && <meta name="robots" content="noindex, follow" />}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'SearchResultsPage',
                name: districtParam
                  ? `Tìm kiếm Bất Động Sản tại ${districtParam}`
                  : 'Tìm kiếm Bất Động Sản Hà Nội',
                url: canonicalUrl,
                potentialAction: {
                  '@type': 'SearchAction',
                  target: `${baseUrl}/search?q={search_term_string}`,
                  'query-input': 'required name=search_term_string',
                },
              }),
            }}
          />
        </>
      )}

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
          onOpenSaveSearch={() => {
            if (!user) {
              addToast('Đăng nhập để lưu bất động sản này', 'warning');
              return;
            }
            setShowSaveSearchModal(true);
          }}
          onToggleMobileFilter={() => setMobileFilterOpen(true)}
        />

        {/* ACTIVE FILTER CHIPS BAR */}
        <ActiveFilterChips
          filters={filters}
          onRemove={handleRemoveChip}
          onReset={handleResetFilters}
          count={activeFilterCount}
          initialType={initialType}
          initialKeyword={initialKeyword}
          initialDistrict={initialDistrict}
        />
      </div>

      {/* MAIN 30 / 70 WORKSPACE */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        
        {/* ━━ LEFT COLUMN (30% Width - Min 280px, Max 380px) ━━ */}
        <div className="hidden md:flex w-[30%] min-w-[300px] max-w-[380px] flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shrink-0 z-20">
          
          {/* Sidebar Tab Selector */}
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
            
            {/* DETAIL PREVIEW (DESKTOP SPLIT VIEW KHI CHỌN 1 BĐS) */}
            {isPreviewOpen && (selectedListing || isLoadingSelected || selectedListingError) ? (
              <motion.div
                key={`preview-${selectedListingId}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="hidden md:flex absolute inset-0 z-30 bg-white dark:bg-slate-900 overflow-hidden flex-col"
              >
                <SearchDetailPreview
                  listing={selectedListing}
                  isLoading={isLoadingSelected}
                  error={selectedListingError}
                  onClose={handleClosePreview}
                  isSaved={selectedListing ? savedListingIds.includes(selectedListing.id) : false}
                  onSaveToggle={toggleSaveListing}
                  isMobile={false}
                />
              </motion.div>
            ) : null}

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
                  onLocationSelect={(loc) => {
                    const update: Partial<SearchFilters> = {};
                    if (loc.district) {
                      update.district = loc.district;
                    }
                    if (loc.category === 'street' || loc.category === 'address') {
                      if (loc.street) update.street = loc.street;
                      update.keyword = loc.name;
                    } else if (loc.category === 'project') {
                      update.keyword = loc.name;
                    }
                    handleFilterUpdate(update);
                    setSidebarTab('listings');
                  }}
                  onFilterNearLocation={(coords, radiusKm, label) => {
                    handleFilterUpdate({ keyword: label });
                    setSidebarTab('listings');
                  }}
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
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        navigationMode="search"
                        onSelect={handleListingSelect}
                        isSelected={selectedListingId === listing.id}
                      />
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
                      isSelected={selectedListingId === listing.id}
                      onSaveToggle={toggleSaveListing}
                      onSelect={handleListingSelect}
                    />
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* ━━ MOBILE BOTTOM SHEET FOR DETAIL PREVIEW ━━ */}
      <AnimatePresence>
        {isPreviewOpen && (selectedListing || isLoadingSelected || selectedListingError) && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="bg-white dark:bg-slate-900 rounded-t-3xl h-[88dvh] max-h-[88dvh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Mobile handle indicator */}
              <div className="py-2 flex justify-center shrink-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
              </div>

              <div className="flex-1 min-h-0 overflow-hidden">
                <SearchDetailPreview
                  listing={selectedListing}
                  isLoading={isLoadingSelected}
                  error={selectedListingError}
                  onClose={handleClosePreview}
                  isSaved={selectedListing ? savedListingIds.includes(selectedListing.id) : false}
                  onSaveToggle={toggleSaveListing}
                  isMobile={true}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
