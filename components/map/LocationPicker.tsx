'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Search, Locate, RotateCcw, 
  CheckCircle, Loader2, AlertCircle, X, Layers, Compass, Sparkles, Building2
} from 'lucide-react'
import { HANOI_CENTER } from '@/lib/leaflet/hanoi-data'
import { 
  reverseGeocode, 
  searchAddressWithSuggestions,
  SearchResultItem, 
} from '@/lib/leaflet/geocoding'
import { fixLeafletIcons } from '@/lib/leaflet/fix-icons'

export interface LocationData {
  lat: number
  lng: number
  displayName: string
  district: string
  ward: string
  road: string
  houseNumber: string;
}

interface LocationPickerProps {
  value?: LocationData | null
  onChange: (location: LocationData | null) => void
  height?: string
}

// Các lớp bản đồ: Google Maps Đường Phố chuẩn & Google Vệ tinh
const MAP_TILES = {
  googleStreet: {
    name: 'Google Maps',
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: '© Google Maps',
  },
  googleHybrid: {
    name: 'Vệ tinh',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: '© Google Maps Satellite',
  },
  osmStreet: {
    name: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors',
  }
}

export default function LocationPicker({
  value,
  onChange,
  height = '420px',
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const tileLayerRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const [mapStyle, setMapStyle] = useState<'googleStreet' | 'googleHybrid' | 'osmStreet'>('googleStreet')
  const [isMapReady, setIsMapReady] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Trạng thái gợi ý tìm kiếm & khu vực tương tự
  const [directMatches, setDirectMatches] = useState<SearchResultItem[]>([])
  const [similarMatches, setSimilarMatches] = useState<SearchResultItem[]>([])
  const [suggestedChips, setSuggestedChips] = useState<SearchResultItem[]>([])
  const [detectedDistrict, setDetectedDistrict] = useState<string | undefined>()
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [geocodeError, setGeocodeError] = useState<string | null>(null)
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    value ? [value.lat, value.lng] : null
  )

  // Khởi tạo các gợi ý mặc định
  useEffect(() => {
    const initialSuggestions = searchAddressWithSuggestions(value?.district || '')
    setSuggestedChips(initialSuggestions.suggestedChips)
    setSimilarMatches(initialSuggestions.similarMatches)
    setDetectedDistrict(initialSuggestions.detectedDistrict || value?.district)
  }, [value?.district])

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ── INIT MAP ──
  useEffect(() => {
    if (typeof window === 'undefined' || mapInstanceRef.current) return

    const initMap = async () => {
      const L = (await import('leaflet')).default
      fixLeafletIcons()
      if (!mapRef.current || mapInstanceRef.current) return

      const initialCenter: [number, number] = value
        ? [value.lat, value.lng]
        : HANOI_CENTER

      const map = L.map(mapRef.current, {
        center: initialCenter,
        zoom: value ? 16 : 14,
        zoomControl: false,
        scrollWheelZoom: true,
      })

      // Lớp bản đồ Google Maps Đường Phố chuẩn (không bị mờ, không dính API Key)
      const streetLayer = L.tileLayer(MAP_TILES.googleStreet.url, {
        subdomains: MAP_TILES.googleStreet.subdomains,
        maxZoom: MAP_TILES.googleStreet.maxZoom,
        attribution: MAP_TILES.googleStreet.attribution,
      }).addTo(map)
      tileLayerRef.current = streetLayer

      // Click to place/move pin
      map.on('click', async (e: any) => {
        const { lat, lng } = e.latlng
        await placePin(L, map, lat, lng)
      })

      mapInstanceRef.current = map
      setIsMapReady(true)

      // Place initial pin if value exists
      if (value) {
        await placePin(L, map, value.lat, value.lng, false)
      }
    }

    initMap()
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // ── ĐỔI KIỂU BẢN ĐỒ (Google Maps thường vs Vệ tinh) ──
  const switchMapStyle = useCallback(async (styleKey: 'googleStreet' | 'googleHybrid' | 'osmStreet') => {
    if (!mapInstanceRef.current) return
    const L = (await import('leaflet')).default
    const map = mapInstanceRef.current
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current)
    }

    const cfg = MAP_TILES[styleKey]
    const newLayer = L.tileLayer(cfg.url, {
      subdomains: cfg.subdomains,
      maxZoom: cfg.maxZoom,
      attribution: cfg.attribution,
    }).addTo(map)
    tileLayerRef.current = newLayer
    setMapStyle(styleKey)
  }, [])

  // ── PLACE / MOVE PIN ──
  const placePin = useCallback(async (
    L: any,
    map: any,
    lat: number,
    lng: number,
    geocode: boolean = true
  ) => {
    // Remove old marker
    if (markerRef.current) {
      map.removeLayer(markerRef.current)
    }

    // Custom draggable pin icon
    const pinIcon = L.divIcon({
      html: `
        <div class="pin-picker-marker">
          <div class="picker-pin" title="Kéo để điều chỉnh vị trí"></div>
        </div>
      `,
      className: 'pin-picker-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    })

    // Create draggable marker
    const marker = L.marker([lat, lng], {
      icon: pinIcon,
      draggable: true,
      autoPan: true,
    })

    // Drag end → reverse geocode new position
    marker.on('dragend', async (e: any) => {
      const pos = e.target.getLatLng()
      setMarkerPosition([pos.lat, pos.lng])
      await doReverseGeocode(pos.lat, pos.lng)
    })

    // Drag start → show hint
    marker.on('dragstart', () => {
      setGeocodeError(null)
    })

    marker.addTo(map)
    markerRef.current = marker
    setMarkerPosition([lat, lng])

    if (geocode) {
      await doReverseGeocode(lat, lng)
    }
  }, [])

  // ── REVERSE GEOCODE ──
  const doReverseGeocode = useCallback(async (lat: number, lng: number) => {
    setIsGeocoding(true)
    setGeocodeError(null)

    try {
      const result = await reverseGeocode(lat, lng)
      const locationData: LocationData = {
        lat,
        lng,
        displayName: result.displayName,
        district: result.district,
        ward: result.ward,
        road: result.road,
        houseNumber: result.houseNumber,
      }
      onChange(locationData)

      // Cập nhật gợi ý khu vực lân cận tương ứng với vị trí vừa ghim
      if (result.district) {
        const suggestions = searchAddressWithSuggestions(result.district)
        setSuggestedChips(suggestions.suggestedChips)
        setSimilarMatches(suggestions.similarMatches)
        setDetectedDistrict(result.district)
      }
    } catch {
      setGeocodeError('Không thể xác định địa chỉ. Vui lòng nhập thủ công.')
      onChange({ lat, lng, displayName: `${lat.toFixed(6)}, ${lng.toFixed(6)}`, 
                 district: '', ward: '', road: '', houseNumber: '' })
    } finally {
      setIsGeocoding(false)
    }
  }, [onChange])

  // ── TÌM KIẾM ĐỊA CHỈ & KHU VỰC TƯƠNG TỰ (TỨC THÌ 0MS) ──
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)

    if (!query || query.trim().length === 0) {
      const initial = searchAddressWithSuggestions('')
      setDirectMatches(initial.directMatches)
      setSimilarMatches(initial.similarMatches)
      setSuggestedChips(initial.suggestedChips)
      setDetectedDistrict(undefined)
      setShowSearchResults(false)
      return
    }

    // Tìm kiếm tức thì trong kho dữ liệu Hà Nội
    const results = searchAddressWithSuggestions(query)
    setDirectMatches(results.directMatches)
    setSimilarMatches(results.similarMatches)
    setSuggestedChips(results.suggestedChips)
    setDetectedDistrict(results.detectedDistrict)
    setShowSearchResults(results.directMatches.length > 0 || results.similarMatches.length > 0)
  }, [])

  // ── CHỌN MỘT VỊ TRÍ GỢI Ý HOẶC KHU VỰC TƯƠNG TỰ ──
  const handleSelectResult = useCallback(async (result: SearchResultItem) => {
    if (!mapInstanceRef.current) return
    const L = (await import('leaflet')).default
    const map = mapInstanceRef.current

    setSearchQuery(result.shortName)
    setShowSearchResults(false)

    // Di chuyển map tới địa chỉ đã chọn mượt mà
    map.flyTo([result.lat, result.lng], 16, { duration: 0.8 })

    // Cập nhật gợi ý khu vực lân cận mới dựa trên địa điểm vừa chọn
    const newSuggestions = searchAddressWithSuggestions(result.district || result.shortName)
    setSuggestedChips(newSuggestions.suggestedChips)
    setSimilarMatches(newSuggestions.similarMatches)
    setDetectedDistrict(result.district)

    // Truyền dữ liệu địa chỉ vào wizard
    onChange({
      lat: result.lat,
      lng: result.lng,
      displayName: result.displayName,
      district: result.district || '',
      ward: result.ward || '',
      road: result.road || '',
      houseNumber: result.houseNumber || '',
    })

    await placePin(L, map, result.lat, result.lng, false)
  }, [placePin, onChange])

  // ── LẤY VỊ TRÍ GPS HIỆN TẠI ──
  const handleLocateMe = useCallback(async () => {
    if (!mapInstanceRef.current) return

    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        const L = (await import('leaflet')).default
        const map = mapInstanceRef.current
        map.flyTo([lat, lng], 16, { duration: 0.8 })
        await placePin(L, map, lat, lng)
      },
      () => {
        setGeocodeError('Không thể lấy vị trí của bạn.')
      }
    )
  }, [placePin])

  // ── XÓA GHIM ──
  const handleClear = useCallback(() => {
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current)
      markerRef.current = null
    }
    setMarkerPosition(null)
    setSearchQuery('')
    setShowSearchResults(false)
    onChange(null)
  }, [onChange])

  return (
    <div className="flex flex-col gap-3">
      {/* ── Search Bar & Khu vực đề xuất ── */}
      <div ref={searchContainerRef} className="relative z-[650]">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 
                        border-2 border-gray-200 dark:border-gray-600 
                        rounded-xl px-4 py-3 focus-within:border-orange-500 
                        focus-within:ring-2 focus-within:ring-orange-500/20
                        transition-all shadow-sm">
          <Search size={16} className="text-orange-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="🔍 Nhập vị trí (VD: Quốc Oai, Hoài Đức, Cầu Giấy, Nam Từ Liêm...)"
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            onFocus={() => {
              const res = searchAddressWithSuggestions(searchQuery || value?.district || '')
              setDirectMatches(res.directMatches)
              setSimilarMatches(res.similarMatches)
              setSuggestedChips(res.suggestedChips)
              setDetectedDistrict(res.detectedDistrict || value?.district)
              setShowSearchResults(true)
            }}
            className="flex-1 bg-transparent text-sm text-navy dark:text-white 
                       placeholder-gray-400 outline-none min-w-0 font-medium"
          />
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {searchQuery && (
              <motion.button
                onClick={() => {
                  setSearchQuery('')
                  setShowSearchResults(false)
                }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                title="Xóa tìm kiếm"
              >
                <X size={15} />
              </motion.button>
            )}
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-600" />
            <motion.button
              onClick={handleLocateMe}
              whileTap={{ scale: 0.9 }}
              title="Dùng vị trí hiện tại của tôi"
              className="text-gray-400 hover:text-orange-500 transition-colors p-1"
            >
              <Locate size={16} />
            </motion.button>
          </div>
        </div>

        {/* ── Dropdown Đề xuất Vị trí & Khu vực tương tự ── */}
        <AnimatePresence>
          {showSearchResults && (directMatches.length > 0 || similarMatches.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-gray-800 
                         border border-gray-200 dark:border-gray-700 rounded-2xl 
                         shadow-2xl z-[700] overflow-hidden max-h-[380px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/60"
            >
              {/* Phân vùng 1: Vị trí phù hợp nhất */}
              {directMatches.length > 0 && (
                <div>
                  <div className="px-3.5 py-2 bg-gray-50/90 dark:bg-gray-700/60 flex items-center justify-between sticky top-0 backdrop-blur-xs z-10 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200 flex items-center gap-1.5 uppercase tracking-wider">
                      <MapPin size={12} className="text-orange-500" />
                      Vị trí phù hợp {detectedDistrict && <span className="text-orange-600 dark:text-orange-400">tại {detectedDistrict}</span>}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400 bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
                      {directMatches.length} kết quả
                    </span>
                  </div>

                  <div className="divide-y divide-gray-50 dark:divide-gray-700/40">
                    {directMatches.map((result, idx) => (
                      <button
                        key={result.id || `direct-${idx}`}
                        type="button"
                        onClick={() => handleSelectResult(result)}
                        className="w-full flex items-start gap-3 px-4 py-2.5 text-left 
                                   hover:bg-orange-50/70 dark:hover:bg-orange-950/20 
                                   transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-orange-100/80 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <MapPin size={13} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-navy dark:text-white line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                              {result.shortName}
                            </p>
                            {result.badge && (
                              <span className="text-[9px] font-bold bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300 px-1.5 py-0.2 rounded">
                                {result.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                            {result.description || result.displayName}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Phân vùng 2: Khu vực tương tự & lân cận đề xuất */}
              {similarMatches.length > 0 && (
                <div>
                  <div className="px-3.5 py-2 bg-amber-50/90 dark:bg-amber-950/40 flex items-center justify-between sticky top-0 backdrop-blur-xs z-10 border-b border-amber-200/50 dark:border-amber-800/50">
                    <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <Compass size={12} className="text-amber-600 dark:text-amber-400 animate-spin-slow" />
                      Khu vực tương tự & lân cận đề xuất
                    </span>
                    <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-900/40 px-1.5 py-0.5 rounded-full">
                      Dễ định vị BĐS kế cận
                    </span>
                  </div>

                  <div className="divide-y divide-amber-100/50 dark:divide-amber-900/20">
                    {similarMatches.map((result, idx) => (
                      <button
                        key={result.id || `similar-${idx}`}
                        type="button"
                        onClick={() => handleSelectResult(result)}
                        className="w-full flex items-start gap-3 px-4 py-2.5 text-left 
                                   hover:bg-amber-100/60 dark:hover:bg-amber-950/30 
                                   transition-colors group bg-amber-50/30 dark:bg-amber-950/10"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-200/70 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <Compass size={13} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-navy dark:text-white line-clamp-1 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                              {result.shortName}
                            </p>
                            <span className="text-[9px] font-bold bg-amber-200/80 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-1.5 py-0.2 rounded">
                              {result.badge || 'Lân cận'}
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-700/80 dark:text-amber-400 line-clamp-1 mt-0.5 font-medium">
                            {result.similarReason || result.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Thanh Gợi ý Khu vực Nhanh Dạng Pills (Chips) ── */}
        {suggestedChips.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 px-1 -mx-1">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1 shrink-0">
              <Sparkles size={12} className="text-orange-500" />
              Gợi ý nhanh:
            </span>
            {suggestedChips.map((chip, idx) => (
              <button
                key={chip.id || `chip-${idx}`}
                type="button"
                onClick={() => handleSelectResult(chip)}
                className={`shrink-0 text-xs px-2.5 py-1 rounded-lg font-semibold transition-all border flex items-center gap-1 shadow-2xs ${
                  chip.isSimilar
                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:border-amber-400 hover:bg-amber-100'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/50'
                }`}
              >
                {chip.isSimilar ? (
                  <Compass size={11} className="text-amber-500 shrink-0" />
                ) : (
                  <MapPin size={11} className="text-orange-500 shrink-0" />
                )}
                <span className="truncate max-w-[140px]">{chip.shortName}</span>
                {chip.isSimilar && (
                  <span className="text-[9px] bg-amber-200/80 dark:bg-amber-800/80 text-amber-800 dark:text-amber-200 px-1 py-0.2 rounded font-bold">
                    Lân cận
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Map Container ── */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 
                      dark:border-gray-700 focus-within:border-orange-500 
                      transition-colors shadow-sm"
        style={{ height }}>

        {/* Map div */}
        <div ref={mapRef} className="w-full h-full" />

        {/* Loading overlay */}
        <AnimatePresence>
          {!isMapReady && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-100 dark:bg-gray-800 
                         flex items-center justify-center z-[500]"
            >
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="w-10 h-10 border-3 border-gray-200 border-t-orange-500 rounded-full"
                />
                <p className="text-sm text-gray-500 font-medium">Đang tải bản đồ...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click hint overlay (shown before pin is placed) */}
        <AnimatePresence>
          {isMapReady && !markerPosition && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none z-[300] 
                         flex items-center justify-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-navy/85 backdrop-blur-md text-white text-xs 
                           font-medium px-4 py-2.5 rounded-2xl shadow-xl 
                           flex items-center gap-2 border border-white/10"
              >
                <span>👆</span>
                <span>Click vào bản đồ hoặc tìm kiếm khu vực để ghim vị trí BĐS</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Geocoding loading overlay */}
        <AnimatePresence>
          {isGeocoding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[450]"
            >
              <div className="bg-navy/90 backdrop-blur-sm text-white text-xs 
                              font-medium px-4 py-2 rounded-xl 
                              flex items-center gap-2 shadow-lg border border-white/10">
                <Loader2 size={12} className="animate-spin text-orange-400" />
                Đang xác định toạ độ & địa chỉ...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Layer Switcher & Zoom Controls */}
        <div className="absolute top-3 right-3 z-[400] flex flex-col items-end gap-2">
          {/* Layer switcher pills */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl p-1 shadow-lg border border-gray-200/80 dark:border-gray-700 flex items-center gap-1">
            <button
              type="button"
              onClick={() => switchMapStyle('googleStreet')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                mapStyle === 'googleStreet'
                  ? 'bg-orange-500 text-white shadow-sm font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Đường phố
            </button>
            <button
              type="button"
              onClick={() => switchMapStyle('googleHybrid')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                mapStyle === 'googleHybrid'
                  ? 'bg-orange-500 text-white shadow-sm font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Vệ tinh
            </button>
          </div>

          {/* Zoom & Action buttons */}
          <div className="flex flex-col gap-1.5">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md 
                            border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                type="button"
                onClick={() => mapInstanceRef.current?.zoomIn()}
                className="w-8 h-8 flex items-center justify-center text-navy 
                           dark:text-white font-bold hover:bg-orange-500 
                           hover:text-white transition-colors border-b border-gray-100 dark:border-gray-700 text-lg">+</button>
              <button
                type="button"
                onClick={() => mapInstanceRef.current?.zoomOut()}
                className="w-8 h-8 flex items-center justify-center text-navy 
                           dark:text-white font-bold hover:bg-orange-500 
                           hover:text-white transition-colors text-lg">−</button>
            </div>

            {markerPosition && (
              <motion.button
                type="button"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={handleClear}
                whileTap={{ scale: 0.9 }}
                title="Xóa ghim để chọn lại"
                className="w-8 h-8 bg-white dark:bg-gray-800 rounded-xl 
                           shadow-md border border-gray-200 dark:border-gray-700 flex items-center 
                           justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 
                           hover:text-red-500 transition-colors"
              >
                <RotateCcw size={13} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Map provider badge */}
        <div className="absolute bottom-2 left-2 z-[400] bg-white/90 dark:bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded-lg text-[10px] text-gray-600 dark:text-gray-300 font-semibold pointer-events-none select-none flex items-center gap-1.5 border border-gray-200/50 dark:border-gray-700">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Google Maps Đường Phố
        </div>
      </div>

      {/* ── Address Result Card ── */}
      <AnimatePresence>
        {value && !isGeocoding && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 
                       dark:border-green-800 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-xl 
                              flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-bold text-green-800 dark:text-green-300">
                    ✅ Đã xác định vị trí thửa đất
                  </p>
                  {value.district && (
                    <span className="text-[10px] font-bold bg-green-200/80 dark:bg-green-800/80 text-green-800 dark:text-green-200 px-2 py-0.2 rounded-md">
                      {value.district}
                    </span>
                  )}
                </div>
                <p className="text-xs text-green-700 dark:text-green-400 
                              leading-relaxed line-clamp-2 font-medium">
                  {value.displayName}
                </p>

                {/* Coordinate & Area chips */}
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  {value.ward && (
                    <span className="inline-flex items-center gap-1 bg-green-100/90 
                                     dark:bg-green-800/60 text-green-800 dark:text-green-200 
                                     text-xs font-semibold px-2 py-0.8 rounded-lg">
                      📍 {value.ward}
                    </span>
                  )}
                  {value.road && (
                    <span className="inline-flex items-center gap-1 bg-green-100/90 
                                     dark:bg-green-800/60 text-green-800 dark:text-green-200 
                                     text-xs font-semibold px-2 py-0.8 rounded-lg">
                      🛣️ {value.road}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 bg-white/80 
                                   dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                                   text-xs font-mono px-2 py-0.8 rounded-lg border border-green-200 dark:border-green-800">
                    {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
                  </span>
                </div>

                {/* Gợi ý các xã/khu vực lân cận của địa điểm này */}
                {similarMatches.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-green-200/60 dark:border-green-800/60">
                    <p className="text-[11px] font-bold text-green-800 dark:text-green-300 flex items-center gap-1 mb-1.5">
                      <Compass size={12} className="text-amber-600" />
                      Gợi ý khu vực lân cận/tiếp giáp {value.district}:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {similarMatches.slice(0, 4).map((sim, sIdx) => (
                        <button
                          key={`sub-sim-${sIdx}`}
                          type="button"
                          onClick={() => handleSelectResult(sim)}
                          className="text-[11px] bg-white/90 dark:bg-gray-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-gray-700 dark:text-gray-300 hover:text-amber-700 dark:hover:text-amber-300 px-2 py-0.5 rounded-md border border-green-200/80 dark:border-green-800/80 font-medium transition-colors flex items-center gap-1"
                        >
                          <span>{sim.shortName}</span>
                          <span className="text-[9px] text-amber-600 dark:text-amber-400">({sim.district})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Re-pick button */}
              <motion.button
                onClick={handleClear}
                whileTap={{ scale: 0.9 }}
                className="flex-shrink-0 text-green-600 hover:text-green-800 
                           dark:text-green-400 transition-colors p-1"
                title="Chọn lại vị trí"
              >
                <RotateCcw size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {geocodeError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 
                       dark:border-yellow-800 rounded-2xl p-4 
                       flex items-start gap-3"
          >
            <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-yellow-800 dark:text-yellow-300">
                {geocodeError}
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                Vị trí vẫn được lưu toạ độ. Bạn có thể kiểm tra và điền tên đường, xã/phường bên dưới.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Drag hint ── */}
      {markerPosition && (
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center -mt-1 font-medium">
          💡 Bạn có thể giữ và kéo thả pin trực tiếp trên bản đồ để định vị chính xác vị trí lô đất
        </p>
      )}
    </div>
  )
}
