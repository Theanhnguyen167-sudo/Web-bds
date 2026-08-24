'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Search, Locate, RotateCcw, 
  CheckCircle, Loader2, AlertCircle, X 
} from 'lucide-react'
import { HANOI_CENTER } from '@/lib/leaflet/hanoi-data'
import { reverseGeocode, searchAddress } from '@/lib/leaflet/geocoding'
import { fixLeafletIcons } from '@/lib/leaflet/fix-icons'

export interface LocationData {
  lat: number
  lng: number
  displayName: string
  district: string
  ward: string
  road: string
  houseNumber: string
}

interface LocationPickerProps {
  value?: LocationData | null
  onChange: (location: LocationData | null) => void
  height?: string
}

export default function LocationPicker({
  value,
  onChange,
  height = '420px',
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  const [isMapReady, setIsMapReady] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{
    lat: number; lng: number; displayName: string; shortName: string
  }>>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [geocodeError, setGeocodeError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    value ? [value.lat, value.lng] : null
  )

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
        zoom: value ? 16 : 13,
        zoomControl: false,
        scrollWheelZoom: true,
      })

      // Bright street map for easier navigation when placing pins
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { 
          attribution: '©OpenStreetMap ©CartoDB', 
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map)

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
    } catch {
      setGeocodeError('Không thể xác định địa chỉ. Vui lòng nhập thủ công.')
      onChange({ lat, lng, displayName: `${lat.toFixed(6)}, ${lng.toFixed(6)}`, 
                 district: '', ward: '', road: '', houseNumber: '' })
    } finally {
      setIsGeocoding(false)
    }
  }, [onChange])

  // ── SEARCH ADDRESS ──
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
    clearTimeout(searchTimeoutRef.current)

    if (query.length < 3) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true)
      const results = await searchAddress(query)
      setSearchResults(results)
      setShowSearchResults(results.length > 0)
      setIsSearching(false)
    }, 600) // debounce 600ms
  }, [])

  // ── SELECT SEARCH RESULT ──
  const handleSelectResult = useCallback(async (result: {
    lat: number; lng: number; displayName: string
  }) => {
    if (!mapInstanceRef.current) return
    const L = (await import('leaflet')).default
    const map = mapInstanceRef.current

    setSearchQuery(result.displayName.split(',').slice(0, 2).join(', '))
    setShowSearchResults(false)
    setSearchResults([])

    // Fly to location
    map.flyTo([result.lat, result.lng], 17, { duration: 0.8 })
    await placePin(L, map, result.lat, result.lng)
  }, [placePin])

  // ── GET USER LOCATION ──
  const handleLocateMe = useCallback(async () => {
    if (!mapInstanceRef.current) return

    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        const L = (await import('leaflet')).default
        const map = mapInstanceRef.current
        map.flyTo([lat, lng], 17, { duration: 0.8 })
        await placePin(L, map, lat, lng)
      },
      () => {
        setGeocodeError('Không thể lấy vị trí của bạn.')
      }
    )
  }, [placePin])

  // ── CLEAR PIN ──
  const handleClear = useCallback(() => {
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current)
      markerRef.current = null
    }
    setMarkerPosition(null)
    setSearchQuery('')
    onChange(null)
  }, [onChange])

  return (
    <div className="flex flex-col gap-3">
      {/* ── Search Bar ── */}
      <div className="relative">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 
                        border-2 border-gray-200 dark:border-gray-600 
                        rounded-xl px-4 py-3 focus-within:border-orange-500 
                        transition-colors shadow-sm">
          {isSearching ? (
            <Loader2 size={16} className="text-orange-500 animate-spin flex-shrink-0" />
          ) : (
            <Search size={16} className="text-gray-400 flex-shrink-0" />
          )}
          <input
            type="text"
            placeholder="🔍 Tìm kiếm địa chỉ tại Hà Nội..."
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
            className="flex-1 bg-transparent text-sm text-navy dark:text-white 
                       placeholder-gray-400 outline-none min-w-0"
          />
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {searchQuery && (
              <motion.button
                onClick={() => {
                  setSearchQuery('')
                  setSearchResults([])
                  setShowSearchResults(false)
                }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={14} />
              </motion.button>
            )}
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-600" />
            <motion.button
              onClick={handleLocateMe}
              whileTap={{ scale: 0.9 }}
              title="Dùng vị trí hiện tại"
              className="text-gray-400 hover:text-orange-500 transition-colors"
            >
              <Locate size={16} />
            </motion.button>
          </div>
        </div>

        {/* Search Dropdown */}
        <AnimatePresence>
          {showSearchResults && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-gray-800 
                         border border-gray-200 dark:border-gray-700 rounded-xl 
                         shadow-xl z-[600] overflow-hidden"
            >
              {searchResults.map((result, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleSelectResult(result)}
                  whileHover={{ backgroundColor: '#fff7ed' }}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left 
                             border-b border-gray-100 dark:border-gray-700 
                             last:border-0 transition-colors"
                >
                  <MapPin size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy dark:text-white 
                                  line-clamp-1">
                      {result.shortName}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                      {result.displayName.split(',').slice(2, 5).join(',')}
                    </p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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
                <p className="text-sm text-gray-500">Đang tải bản đồ...</p>
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
                className="bg-navy/80 backdrop-blur-sm text-white text-sm 
                           font-medium px-5 py-3 rounded-2xl shadow-xl 
                           flex items-center gap-2.5 border border-white/10"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  👆
                </motion.div>
                Click vào bản đồ để đặt vị trí BĐS
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
                              flex items-center gap-2 shadow-lg">
                <Loader2 size={12} className="animate-spin" />
                Đang xác định địa chỉ...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom controls */}
        <div className="absolute top-3 right-3 z-[400] flex flex-col gap-1.5">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md 
                          border border-gray-200 overflow-hidden">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="w-8 h-8 flex items-center justify-center text-navy 
                         dark:text-white font-bold hover:bg-orange-500 
                         hover:text-white transition-colors border-b border-gray-100 text-lg">+</button>
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="w-8 h-8 flex items-center justify-center text-navy 
                         dark:text-white font-bold hover:bg-orange-500 
                         hover:text-white transition-colors text-lg">−</button>
          </div>

          {markerPosition && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={handleClear}
              whileTap={{ scale: 0.9 }}
              title="Xóa pin"
              className="w-8 h-8 bg-white dark:bg-gray-800 rounded-xl 
                         shadow-md border border-gray-200 flex items-center 
                         justify-center text-red-400 hover:bg-red-50 
                         hover:text-red-500 transition-colors"
            >
              <RotateCcw size={13} />
            </motion.button>
          )}
        </div>

        {/* Crosshair center indicator (subtle) */}
        <div className="absolute inset-0 pointer-events-none z-[200] 
                        flex items-center justify-center opacity-10">
          <div className="w-px h-8 bg-gray-600" />
          <div className="absolute w-8 h-px bg-gray-600" />
        </div>
      </div>

      {/* ── Address Result Card ── */}
      <AnimatePresence>
        {value && !isGeocoding && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 
                       dark:border-green-800 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-xl 
                              flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
                  ✅ Đã xác định vị trí
                </p>
                <p className="text-xs text-green-700 dark:text-green-400 
                              leading-relaxed line-clamp-2">
                  {value.displayName}
                </p>

                {/* Coordinate chips */}
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {value.district && (
                    <span className="inline-flex items-center gap-1 bg-green-100 
                                     dark:bg-green-800 text-green-700 dark:text-green-300 
                                     text-xs font-medium px-2.5 py-1 rounded-lg">
                      🏙️ {value.district}
                    </span>
                  )}
                  {value.ward && (
                    <span className="inline-flex items-center gap-1 bg-green-100 
                                     dark:bg-green-800 text-green-700 dark:text-green-300 
                                     text-xs font-medium px-2.5 py-1 rounded-lg">
                      📍 {value.ward}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 bg-gray-100 
                                   dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                                   text-xs font-mono px-2.5 py-1 rounded-lg">
                    {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
                  </span>
                </div>
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
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                {geocodeError}
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                Vị trí vẫn được lưu. Bạn có thể điền địa chỉ thủ công bên dưới.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Drag hint ── */}
      {markerPosition && (
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center -mt-1">
          💡 Kéo pin trên bản đồ để điều chỉnh vị trí chính xác hơn
        </p>
      )}
    </div>
  )
}
