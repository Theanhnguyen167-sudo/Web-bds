'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Layers, X, Info, ZoomIn, ZoomOut, 
  RotateCcw, Sliders, ChevronDown, ChevronUp, FileText,
  Locate, Crosshair, Loader2, Navigation, Compass, MapPin
} from 'lucide-react'
import { 
  HANOI_CENTER, HANOI_PLANNING_ZONES, PLANNING_ZONE_TYPES,
  HANOI_METRO_STATIONS 
} from '@/lib/leaflet/hanoi-data'
import { fixLeafletIcons } from '@/lib/leaflet/fix-icons'
import { useApp } from '@/lib/context/AppContext'
import { MapLocationSearch } from './MapLocationSearch'
import { HanoiLocationItem } from '@/lib/data/hanoi-locations'

export interface SelectedZoneInfo {
  id: string
  name: string
  type: string
  district: string
  planYear: number
  status: string
  floorAreaRatio: number
  maxHeight: string
  color: string
  pdfUrl?: string
  fileType?: string
  fileName?: string
}

interface PlanningMapProps {
  activeDistrict?: string
  activeLayers: {
    planning: boolean
    metro: boolean
    projects?: boolean
    amenities?: boolean
    green?: boolean
  }
  planYear: 2025 | 2030 | 2045
  opacity: number
  onZoneClick?: (zone: SelectedZoneInfo) => void
  zones?: any[]
  focusZoneId?: string | null
}

export default function PlanningMap({
  activeDistrict,
  activeLayers,
  planYear,
  opacity,
  onZoneClick,
  zones,
  focusZoneId,
}: PlanningMapProps) {
  let appContext: any = null
  try {
    appContext = useApp()
  } catch {
    // Outside AppProvider fallback
  }

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const polygonsRef = useRef<any[]>([])
  const metroMarkersRef = useRef<any[]>([])
  const tileLayerRef = useRef<any>(null)

  // Custom marker refs for user GPS & searched pin
  const userLocationMarkerRef = useRef<any>(null)
  const userLocationCircleRef = useRef<any>(null)
  const searchedLocationMarkerRef = useRef<any>(null)

  const [isMapReady, setIsMapReady] = useState(false)
  const [selectedZone, setSelectedZone] = useState<SelectedZoneInfo | null>(null)
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const [showInfoPanel, setShowInfoPanel] = useState(false)
  const [mapStyle, setMapStyle] = useState<'light' | 'satellite'>('light')
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(13)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [searchedLocation, setSearchedLocation] = useState<HanoiLocationItem | null>(null)

  // ── TILE CONFIGS (2 lớp: Đường phố & Vệ tinh Google Maps) ──
  const TILE_CONFIGS = {
    light: {
      label: '☀️ Đường phố',
      base: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      attribution: '©Google Maps',
    },
    satellite: {
      label: '🛰️ Vệ tinh',
      base: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      attribution: '©Google Maps',
    },
  }

  // ── INIT MAP ──
  useEffect(() => {
    if (typeof window === 'undefined' || mapInstanceRef.current) return

    const initMap = async () => {
      const L = (await import('leaflet')).default
      fixLeafletIcons()
      if (!mapRef.current || mapInstanceRef.current) return

      const map = L.map(mapRef.current, {
        center: HANOI_CENTER,
        zoom: 13,
        zoomControl: false,
        maxZoom: 19,
        minZoom: 10,
      })

      // Base tile
      const initialConfig = TILE_CONFIGS.light
      tileLayerRef.current = L.tileLayer(
        initialConfig.base,
        { attribution: initialConfig.attribution, maxZoom: 19 }
      ).addTo(map)

      map.on('zoomend', () => setZoomLevel(map.getZoom()))
      mapInstanceRef.current = map
      setIsMapReady(true)
    }

    initMap()
    return () => {
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // ── CHANGE MAP STYLE ──
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return
    const updateStyle = async () => {
      const L = (await import('leaflet')).default
      const map = mapInstanceRef.current
      map.eachLayer((l: any) => {
        if (l instanceof L.TileLayer) map.removeLayer(l)
      })
      const config = TILE_CONFIGS[mapStyle]
      L.tileLayer(config.base, { 
        attribution: config.attribution, 
        maxZoom: 19 
      }).addTo(map)
    }
    updateStyle()
  }, [mapStyle, isMapReady])

  // ── GET USER LOCATION (HIGH ACCURACY & PULSING RADAR) ──
  const handleLocateMe = useCallback(async () => {
    if (!mapInstanceRef.current) return
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị GPS.')
      return
    }

    setIsLocating(true)
    const L = (await import('leaflet')).default
    const map = mapInstanceRef.current

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        setUserLocation([lat, lng])
        setIsLocating(false)

        // Clear existing user marker & circle if any
        if (userLocationMarkerRef.current) {
          map.removeLayer(userLocationMarkerRef.current)
          userLocationMarkerRef.current = null
        }
        if (userLocationCircleRef.current) {
          map.removeLayer(userLocationCircleRef.current)
          userLocationCircleRef.current = null
        }

        // Create animated sonar GPS marker
        const gpsHtml = `
          <div class="user-gps-container">
            <div class="user-gps-pulse"></div>
            <div class="user-gps-pulse-delay"></div>
            <div class="user-gps-dot"></div>
            <div class="user-gps-label">📍 Vị trí của bạn</div>
          </div>
        `
        const icon = L.divIcon({
          html: gpsHtml,
          className: 'user-location-marker',
          iconSize: [48, 48],
          iconAnchor: [24, 24],
        })

        const marker = L.marker([lat, lng], { icon, zIndexOffset: 2000 })
        marker.addTo(map)
        userLocationMarkerRef.current = marker

        // Create 2km translucent radius circle
        const circle = L.circle([lat, lng], {
          radius: 2000,
          color: '#2563eb',
          weight: 1.5,
          opacity: 0.8,
          fillColor: '#3b82f6',
          fillOpacity: 0.12,
          dashArray: '5,5',
        }).addTo(map)
        userLocationCircleRef.current = circle

        // Smooth fly to current position
        map.flyTo([lat, lng], 15, { duration: 1.2 })
      },
      (err) => {
        setIsLocating(false)
        console.warn('Geolocation failed:', err)
        alert('Không thể xác định vị trí: Vui lòng cho phép quyền truy cập vị trí trên trình duyệt của bạn.')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    )
  }, [])

  // ── SELECT LOCATION FROM SEARCH BAR ──
  const handleSelectLocation = useCallback(
    async (loc: HanoiLocationItem) => {
      if (!mapInstanceRef.current) return
      const L = (await import('leaflet')).default
      const map = mapInstanceRef.current

      setSearchedLocation(loc)

      // Clear previous searched marker
      if (searchedLocationMarkerRef.current) {
        map.removeLayer(searchedLocationMarkerRef.current)
        searchedLocationMarkerRef.current = null
      }

      // Add high-contrast drop pin
      const pinHtml = `
        <div class="searched-pin-container">
          <div class="searched-pin-badge">📍 ${loc.name}</div>
          <div class="searched-pin-dot"></div>
        </div>
      `
      const icon = L.divIcon({
        html: pinHtml,
        className: 'searched-location-pin',
        iconSize: [160, 48],
        iconAnchor: [80, 40],
      })

      const marker = L.marker([loc.lat, loc.lng], { icon, zIndexOffset: 1500 })
      marker.addTo(map)
      searchedLocationMarkerRef.current = marker

      // Fly to location
      map.flyTo([loc.lat, loc.lng], loc.zoom || 15.5, { duration: 1.2 })
    },
    []
  )

  // ── CLEAR SEARCHED LOCATION ──
  const handleClearSearched = useCallback(() => {
    if (searchedLocationMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(searchedLocationMarkerRef.current)
      searchedLocationMarkerRef.current = null
    }
    setSearchedLocation(null)
  }, [])

  // ── RENDER PLANNING POLYGONS ──
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return

    const renderZones = async () => {
      const L = (await import('leaflet')).default
      const map = mapInstanceRef.current

      polygonsRef.current.forEach(p => map.removeLayer(p))
      polygonsRef.current = []

      if (!activeLayers.planning) return

      const sourceZones = zones || (appContext?.planningZones && appContext.planningZones.length > 0 ? appContext.planningZones : HANOI_PLANNING_ZONES)

      const filteredZones = activeDistrict && activeDistrict !== 'all'
        ? sourceZones.filter((z: any) => z.district?.toLowerCase().includes(activeDistrict.toLowerCase()))
        : sourceZones

      filteredZones.forEach((zone: any) => {
        const isSelected = selectedZone?.id === zone.id || focusZoneId === zone.id || appContext?.selectedPlanningZoneId === zone.id
        const isHovered = hoveredZone === zone.id

        const polygon = L.polygon(zone.coordinates, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: isSelected ? opacity + 0.25 : isHovered ? opacity + 0.1 : opacity,
          weight: isSelected ? 3.5 : isHovered ? 2.5 : 1.5,
          opacity: 0.9,
          dashArray: zone.type === 'transport' ? '10,6' : undefined,
        })
        ;(polygon as any)._zoneId = zone.id

        polygon.on('click', (e: any) => {
          L.DomEvent.stopPropagation(e)
          const info: SelectedZoneInfo = {
            id: zone.id,
            name: zone.name,
            type: zone.type || 'residential',
            district: zone.district,
            planYear: zone.planYear || 2030,
            status: zone.status || 'Đã công bố',
            floorAreaRatio: zone.floorAreaRatio || 3.5,
            maxHeight: zone.maxHeight || (zone.maxFloors ? `${zone.maxFloors} tầng` : 'Không áp dụng'),
            color: zone.color,
            pdfUrl: zone.pdfUrl,
            fileType: zone.fileType,
            fileName: zone.fileName,
          }
          setSelectedZone(info)
          setShowInfoPanel(true)
          onZoneClick?.(info)

          // Fly to polygon center
          const bounds = polygon.getBounds()
          map.flyToBounds(bounds, { padding: [80, 80], maxZoom: 16, duration: 0.8 })
        })

        polygon.on('mouseover', function(this: any, e: any) {
          this.setStyle({ fillOpacity: opacity + 0.15, weight: 2.5 })
          setHoveredZone(zone.id)
          
          // Show hover tooltip
          const tooltip = L.tooltip({
            permanent: false,
            direction: 'top',
            className: 'planning-tooltip',
            offset: [0, -10],
          })
          .setContent(`
            <div style="
              font-family:Inter,sans-serif;
              padding:6px 10px;
              background:rgba(26,39,68,0.95);
              border-radius:8px;
              color:white;
              font-size:11px;
              font-weight:600;
              border:1px solid rgba(255,255,255,0.15);
              white-space:nowrap;
            ">
              <span style="color:${zone.color}">●</span> ${zone.name}
              ${zone.pdfUrl ? '<span style="background:#ef4444;color:white;font-size:9px;padding:1px 5px;border-radius:4px;margin-left:5px;font-weight:700">PDF</span>' : ''}
              <br>
              <span style="color:rgba(255,255,255,0.6);font-size:10px">
                ${PLANNING_ZONE_TYPES[zone.type as keyof typeof PLANNING_ZONE_TYPES]?.label || 'Quy hoạch phân khu'}
                ${zone.pdfUrl ? '· Có đồ án PDF' : ''}
                · Click để xem chi tiết
              </span>
            </div>
          `)
          .setLatLng(e.latlng)
          .addTo(map)
          
          // Store tooltip ref for removal
          ;(this as any)._tooltip = tooltip
        })

        polygon.on('mousemove', function(this: any, e: any) {
          if ((this as any)._tooltip) {
            ;(this as any)._tooltip.setLatLng(e.latlng)
          }
        })

        polygon.on('mouseout', function(this: any) {
          this.setStyle({ 
            fillOpacity: selectedZone?.id === zone.id ? opacity + 0.25 : opacity, 
            weight: selectedZone?.id === zone.id ? 3.5 : 1.5 
          })
          setHoveredZone(null)
          if ((this as any)._tooltip) {
            map.removeLayer((this as any)._tooltip)
            ;(this as any)._tooltip = null
          }
        })

        polygon.addTo(map)
        polygonsRef.current.push(polygon)
      })
    }

    renderZones()
  }, [activeLayers.planning, activeDistrict, opacity, isMapReady, selectedZone, hoveredZone, zones, focusZoneId, appContext?.planningZones, appContext?.selectedPlanningZoneId])

  // Fly to focusZoneId when changed
  useEffect(() => {
    const targetId = focusZoneId || appContext?.selectedPlanningZoneId
    if (!isMapReady || !mapInstanceRef.current || !targetId) return
    const target = polygonsRef.current.find((p: any) => p._zoneId === targetId)
    if (target) {
      const bounds = target.getBounds()
      mapInstanceRef.current.flyToBounds(bounds, { padding: [80, 80], maxZoom: 15, duration: 0.8 })
    }
  }, [focusZoneId, appContext?.selectedPlanningZoneId, isMapReady, zones, appContext?.planningZones])

  // ── RENDER METRO STATIONS ──
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return

    const renderMetro = async () => {
      const L = (await import('leaflet')).default
      const map = mapInstanceRef.current

      metroMarkersRef.current.forEach(m => map.removeLayer(m))
      metroMarkersRef.current = []

      if (!activeLayers.metro) return

      HANOI_METRO_STATIONS.forEach(station => {
        // Metro line indicator
        const lineColors: Record<string, string> = {
          'Line 2A': '#ef4444',
          'Line 3': '#3b82f6',
          'Line 1': '#22c55e',
        }
        const color = lineColors[station.line] || '#f97316'

        const icon = L.divIcon({
          html: `
            <div style="
              background:${color};
              color:white;
              border-radius:50%;
              width:28px;height:28px;
              display:flex;align-items:center;justify-content:center;
              font-size:13px;
              border:2px solid white;
              box-shadow:0 2px 8px rgba(0,0,0,0.4);
              font-family:Inter,sans-serif;
            ">🚇</div>
          `,
          className: '',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })

        const marker = L.marker([station.lat, station.lng], { icon })
        marker.bindTooltip(`
          <div style="font-family:Inter,sans-serif;padding:4px 8px">
            <strong>${station.name}</strong>
            <br><span style="color:#64748b;font-size:11px">${station.line}</span>
          </div>
        `, { direction: 'top', offset: [0, -14] })

        marker.addTo(map)
        metroMarkersRef.current.push(marker)
      })
    }

    renderMetro()
  }, [activeLayers.metro, isMapReady])

  // ── FLY TO DISTRICT ──
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !activeDistrict || activeDistrict === 'all') return

    const districtZone = HANOI_PLANNING_ZONES.find(z => z.district.toLowerCase().includes(activeDistrict.toLowerCase()))
    if (districtZone) {
      import('leaflet').then(({ default: L }) => {
        const polygon = L.polygon(districtZone.coordinates)
        mapInstanceRef.current?.flyToBounds(polygon.getBounds(), {
          padding: [60, 60],
          maxZoom: 15,
          duration: 1,
        })
      })
    }
  }, [activeDistrict, isMapReady])

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn()
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut()
  const handleReset = () => {
    mapInstanceRef.current?.flyTo(HANOI_CENTER, 13, { duration: 0.8 })
    setSelectedZone(null)
    setShowInfoPanel(false)
  }

  return (
    <div className="relative w-full h-full">
      {/* ── Map Container ── */}
      <div ref={mapRef} className="w-full h-full" />

      {/* ── Loading ── */}
      <AnimatePresence>
        {!isMapReady && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0f1923] flex items-center 
                       justify-center z-[500]"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="text-5xl mb-4"
              >
                🗺️
              </motion.div>
              <p className="text-white/60 text-sm">Đang tải dữ liệu quy hoạch...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Zoom + Controls (top-right) ── */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
                        overflow-hidden border border-gray-200 dark:border-gray-700">
          <motion.button
            onClick={handleZoomIn}
            whileHover={{ backgroundColor: '#f97316', color: '#fff' }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center 
                       text-navy dark:text-white font-bold text-xl
                       hover:bg-orange-500 hover:text-white transition-colors
                       border-b border-gray-200 dark:border-gray-700"
          >
            +
          </motion.button>
          <motion.button
            onClick={handleZoomOut}
            whileHover={{ backgroundColor: '#f97316', color: '#fff' }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center 
                       text-navy dark:text-white font-bold text-xl
                       hover:bg-orange-500 hover:text-white transition-colors"
          >
            −
          </motion.button>
        </div>
        
        <motion.button onClick={handleReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
                     border border-gray-200 dark:border-gray-700 flex items-center justify-center 
                     text-navy dark:text-white hover:bg-orange-500 hover:text-white transition-all"
          title="Về vị trí ban đầu">
          <RotateCcw size={15} />
        </motion.button>

        {/* Locate Me */}
        <motion.button
          onClick={handleLocateMe}
          disabled={isLocating}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-10 h-10 rounded-2xl shadow-lg border flex items-center justify-center transition-all ${
            userLocation
              ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20'
              : 'bg-white dark:bg-gray-800 text-navy dark:text-white border-gray-200 dark:border-gray-700 hover:bg-orange-500 hover:text-white hover:border-orange-500'
          }`}
          title="Vị trí của tôi (Định vị GPS)"
        >
          {isLocating ? (
            <Loader2 size={16} className="animate-spin text-orange-500" />
          ) : userLocation ? (
            <Crosshair size={16} className="animate-pulse" />
          ) : (
            <Locate size={16} />
          )}
        </motion.button>

        {/* Layer Switcher (Giống phần Tìm kiếm) */}
        <div className="relative">
          <motion.button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-white dark:bg-gray-800 rounded-2xl 
                       shadow-lg border border-gray-200 dark:border-gray-700
                       flex items-center justify-center text-navy dark:text-white
                       hover:bg-orange-500 hover:text-white transition-all"
            title="Chọn lớp bản đồ"
          >
            <Layers size={16} />
          </motion.button>

          <AnimatePresence>
            {showLayerPanel && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="absolute right-12 top-0 bg-white dark:bg-gray-800 
                           rounded-2xl shadow-xl border border-gray-200 
                           dark:border-gray-700 p-3 min-w-[160px]"
              >
                <p className="text-xs font-semibold text-gray-500 mb-2 
                              uppercase tracking-wide">Lớp bản đồ</p>
                {Object.entries(TILE_CONFIGS).map(([key, tile]) => (
                  <motion.button
                    key={key}
                    onClick={() => {
                      setMapStyle(key as typeof mapStyle)
                      setShowLayerPanel(false)
                    }}
                    whileHover={{ x: 2 }}
                    className={`w-full flex items-center gap-2 px-3 py-2 
                               rounded-xl text-sm font-medium transition-all ${
                      mapStyle === key
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tile.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Top-Left: Location Search Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isMapReady ? 1 : 0, y: isMapReady ? 0 : -10 }}
        className="absolute top-4 left-4 sm:left-[390px] z-[400] max-w-[calc(100%-88px)] sm:max-w-xs"
      >
        <MapLocationSearch
          onSelectLocation={handleSelectLocation}
          onLocateMe={handleLocateMe}
          isLocating={isLocating}
          activeLocationName={searchedLocation?.name}
          onClearLocation={handleClearSearched}
        />
      </motion.div>

      {/* ── Zoom Level Badge ── */}
      <div className="absolute bottom-6 right-4 z-[400] bg-black/50 
                      backdrop-blur-sm text-white/60 text-xs px-2.5 py-1.5 
                      rounded-lg font-mono">
        Z{zoomLevel}
      </div>

      {/* ── Zone Info Side Panel ── */}
      <AnimatePresence>
        {showInfoPanel && selectedZone && (
          <motion.div
            initial={{ opacity: 0, x: 320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 320 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-4 right-16 z-[450] w-[300px] 
                       bg-white dark:bg-gray-800 rounded-2xl shadow-2xl 
                       border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between p-4 border-b 
                            border-gray-100 dark:border-gray-700"
              style={{ borderLeft: `4px solid ${selectedZone.color}` }}>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                  {PLANNING_ZONE_TYPES[selectedZone.type as keyof typeof PLANNING_ZONE_TYPES]?.label}
                </p>
                <p className="text-sm font-bold text-navy dark:text-white leading-tight">
                  {selectedZone.name}
                </p>
              </div>
              <motion.button onClick={() => setShowInfoPanel(false)}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
                <X size={16} />
              </motion.button>
            </div>

            {/* Zone details */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Năm quy hoạch', value: selectedZone.planYear },
                  { label: 'Quận/Huyện', value: selectedZone.district },
                  { label: 'Hệ số SDĐ', value: selectedZone.floorAreaRatio || 'N/A' },
                  { label: 'Chiều cao tối đa', value: selectedZone.maxHeight },
                ].map(item => (
                  <div key={item.label} 
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className="text-sm font-bold text-navy dark:text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-3 text-sm font-semibold"
                style={{ 
                  background: `${selectedZone.color}20`,
                  color: selectedZone.color 
                }}>
                ✅ {selectedZone.status}
              </div>

              {selectedZone.pdfUrl && (
                <a
                  href={selectedZone.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full 
                             bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 
                             border border-red-200 dark:border-red-800
                             text-red-600 dark:text-red-400 text-xs font-bold py-2.5 px-3 
                             rounded-xl transition-colors shadow-xs"
                >
                  <FileText size={15} className="text-red-500 shrink-0" />
                  <span className="truncate">
                    📄 Mở tài liệu đồ án PDF {selectedZone.fileName ? `(${selectedZone.fileName})` : ''}
                  </span>
                </a>
              )}

              <a href={`/search?district=${encodeURIComponent(selectedZone.district)}`}
                className="flex items-center justify-center gap-2 w-full 
                           bg-navy hover:bg-navy/90 dark:bg-gray-700 
                           text-white text-sm font-semibold py-2.5 
                           rounded-xl transition-colors">
                🔍 Xem BĐS trong khu vực này
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Planning Legend ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isMapReady ? 1 : 0, y: isMapReady ? 0 : 20 }}
        className="absolute bottom-6 left-4 z-[400] bg-white/95 dark:bg-gray-800/90 
                   backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 
                   dark:border-gray-700 p-4"
      >
        <p className="text-xs font-bold text-navy dark:text-white mb-2.5 
                      uppercase tracking-wide flex items-center gap-1.5">
          <Layers size={12} /> Chú giải
        </p>
        <div className="space-y-1.5">
          {Object.entries(PLANNING_ZONE_TYPES).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-4 h-3 rounded flex-shrink-0 border border-white/30"
                style={{ backgroundColor: val.color, opacity: 0.8 }} />
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {val.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
