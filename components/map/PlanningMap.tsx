'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Layers, X, Info, ZoomIn, ZoomOut, 
  RotateCcw, Sliders, ChevronDown, ChevronUp, FileText,
  Locate, Crosshair, Loader2, Navigation, Compass, MapPin, Palette,
  Scissors
} from 'lucide-react'
import { 
  HANOI_CENTER, HANOI_PLANNING_ZONES, PLANNING_ZONE_TYPES,
  HANOI_METRO_STATIONS 
} from '@/lib/leaflet/hanoi-data'
import { 
  getAllHanoiPlanningZones, 
  filterHanoiPlanningZones, 
  HANOI_SUBDIVISION_GROUPS, 
  PLANNING_STANDARD_SYMBOLS 
} from '@/lib/planning/hanoi-planning-db'
import { fixLeafletIcons } from '@/lib/leaflet/fix-icons'
import { useApp } from '@/lib/context/AppContext'
import { MapLocationSearch } from './MapLocationSearch'
import { HanoiLocationItem } from '@/lib/data/hanoi-locations'

export interface SelectedZoneInfo {
  id: string
  name: string
  code?: string
  type: string
  district: string
  planYear: number
  status: string
  floorAreaRatio: number
  maxHeight: string
  density?: string
  areaHa?: number
  color: string
  pdfUrl?: string
  fileType?: string
  fileName?: string
}

interface PlanningMapProps {
  activeDistrict?: string
  subdivisionGroup?: string // 'ALL' | 'H1' | 'H2' | 'N' | 'S' | 'SONG_HONG' | 'TAY_HO'
  zoneTypeCode?: string     // 'ODT' | 'TMD' | 'HH' | 'CX' | 'GT' | 'CQ' | 'GD' | 'YT' | 'QSQP' | 'CN' | 'all'
  searchQuery?: string
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
  isSwipeMode?: boolean
  onToggleSwipeMode?: (enabled: boolean) => void
}

export default function PlanningMap({
  activeDistrict,
  subdivisionGroup,
  zoneTypeCode,
  searchQuery,
  activeLayers,
  planYear,
  opacity,
  onZoneClick,
  zones,
  focusZoneId,
  isSwipeMode: propIsSwipeMode,
  onToggleSwipeMode,
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
  const [showLegend, setShowLegend] = useState(false)
  const [mapStyle, setMapStyle] = useState<'light' | 'satellite'>('satellite')
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(13)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [searchedLocation, setSearchedLocation] = useState<HanoiLocationItem | null>(null)

  // ── SWIPE COMPARISON STATE & DRAG LOGIC ──
  const [internalSwipeMode, setInternalSwipeMode] = useState(false)
  const effectiveSwipeMode = propIsSwipeMode !== undefined ? propIsSwipeMode : internalSwipeMode
  const [swipePos, setSwipePos] = useState(50)
  const [isDraggingSwipe, setIsDraggingSwipe] = useState(false)

  const toggleSwipeMode = useCallback((val?: boolean) => {
    const next = val !== undefined ? val : !effectiveSwipeMode
    setInternalSwipeMode(next)
    onToggleSwipeMode?.(next)
    if (next && mapStyle !== 'satellite') {
      setMapStyle('satellite')
    }
  }, [effectiveSwipeMode, onToggleSwipeMode, mapStyle])

  const handleSwipeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingSwipe(true)
  }, [])

  useEffect(() => {
    if (!isDraggingSwipe) return

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!mapRef.current) return
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
      const rect = mapRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const percent = Math.min(95, Math.max(5, (x / rect.width) * 100))
      setSwipePos(Math.round(percent * 10) / 10)
    }

    const handleEnd = () => {
      setIsDraggingSwipe(false)
    }

    window.addEventListener('mousemove', handleMove, { passive: false })
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleEnd)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDraggingSwipe])

  // ── TILE CONFIGS (2 lớp: Đường phố & Vệ tinh Google Maps) ──
  const TILE_CONFIGS = {
    satellite: {
      label: '🛰️ Vệ tinh Google',
      base: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      attribution: '©Google Maps',
    },
    light: {
      label: '☀️ Bản đồ Giao thông',
      base: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
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

      // Tạo riêng pane cho quy hoạch để điều khiển Clip-Path cho chế độ Soi rèm (Curtain Swipe)
      const planningPane = map.createPane('planningPane')
      planningPane.style.zIndex = '450'

      // Base tile
      const initialConfig = TILE_CONFIGS[mapStyle]
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

  // ── UPDATE SWIPE CLIP-PATH ON PLANNING PANE (60fps GPU acceleration) ──
  useEffect(() => {
    if (!mapInstanceRef.current) return
    const pane = mapInstanceRef.current.getPane('planningPane')
    if (!pane) return

    if (effectiveSwipeMode) {
      pane.style.clipPath = `inset(0 0 0 ${swipePos}%)`
      pane.style.WebkitClipPath = `inset(0 0 0 ${swipePos}%)`
    } else {
      pane.style.clipPath = 'none'
      pane.style.WebkitClipPath = 'none'
    }
  }, [effectiveSwipeMode, swipePos, isMapReady])

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

        if (userLocationMarkerRef.current) {
          map.removeLayer(userLocationMarkerRef.current)
          userLocationMarkerRef.current = null
        }
        if (userLocationCircleRef.current) {
          map.removeLayer(userLocationCircleRef.current)
          userLocationCircleRef.current = null
        }

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

      if (searchedLocationMarkerRef.current) {
        map.removeLayer(searchedLocationMarkerRef.current)
        searchedLocationMarkerRef.current = null
      }

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

      map.flyTo([loc.lat, loc.lng], loc.zoom || 15.5, { duration: 1.2 })
    },
    []
  )

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

      const baseZones = zones && zones.length > 0
        ? zones
        : (appContext?.planningZones && appContext.planningZones.length > 0
            ? appContext.planningZones
            : getAllHanoiPlanningZones())

      const filteredZones = filterHanoiPlanningZones(baseZones, {
        subdivisionGroup,
        district: activeDistrict,
        zoneTypeCode,
        searchQuery,
      })

      const normOpacity = opacity > 1 ? opacity / 100 : opacity

      filteredZones.forEach((zone: any) => {
        const isSelected = selectedZone?.id === zone.id || focusZoneId === zone.id || appContext?.selectedPlanningZoneId === zone.id
        const isHovered = hoveredZone === zone.id

        const polygon = L.polygon(zone.coordinates, {
          pane: 'planningPane',
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: isSelected ? Math.min(1, normOpacity + 0.3) : isHovered ? Math.min(1, normOpacity + 0.15) : normOpacity,
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
            code: zone.code,
            type: zone.type || 'residential',
            district: zone.district,
            planYear: zone.planYear || 2030,
            status: zone.status || 'Đã công bố',
            floorAreaRatio: zone.floorAreaRatio || 3.5,
            maxHeight: zone.maxHeight || (zone.maxFloors ? `${zone.maxFloors} tầng` : 'Không áp dụng'),
            density: zone.density,
            areaHa: zone.areaHa,
            color: zone.color,
            pdfUrl: zone.pdfUrl,
            fileType: zone.fileType,
            fileName: zone.fileName,
          }
          setSelectedZone(info)
          setShowInfoPanel(true)
          onZoneClick?.(info)

          const bounds = polygon.getBounds()
          map.flyToBounds(bounds, { padding: [80, 80], maxZoom: 16, duration: 0.8 })
        })

        polygon.on('mouseover', function(this: any, e: any) {
          this.setStyle({ fillOpacity: Math.min(1, normOpacity + 0.2), weight: 2.5 })
          setHoveredZone(zone.id)
          
          const symbolPrefix = zone.code ? zone.code.split('-')[0] : null
          const symbolInfo = symbolPrefix ? (PLANNING_STANDARD_SYMBOLS as any)[symbolPrefix] : null
          const zoneTypeLabel = symbolInfo?.name || PLANNING_ZONE_TYPES[zone.type as keyof typeof PLANNING_ZONE_TYPES]?.label || 'Quy hoạch phân khu'

          const tooltip = L.tooltip({
            permanent: false,
            direction: 'top',
            className: 'planning-tooltip',
            offset: [0, -12],
          })
          .setContent(`
            <div style="
              font-family:Inter,sans-serif;
              padding:14px 16px;
              background:rgba(15,23,42,0.96);
              backdrop-filter:blur(8px);
              border-radius:14px;
              color:white;
              min-width:240px;
              max-width:300px;
              white-space:normal;
              border:1px solid rgba(255,255,255,0.14);
              box-shadow:0 12px 30px rgba(0,0,0,0.45);
              display:flex;
              flex-direction:column;
              gap:6px;
            ">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">
                <div style="display:flex;align-items:flex-start;gap:7px;font-size:13px;font-weight:700;line-height:1.4;color:#ffffff;">
                  <span style="color:${zone.color};font-size:14px;line-height:1.2;flex-shrink:0;">●</span>
                  <span>${zone.name}</span>
                </div>
                <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;">
                  ${zone.code ? `<span style="background:rgba(255,255,255,0.15);color:#fbbf24;font-size:10px;padding:2px 5px;border-radius:4px;font-weight:900;font-family:monospace;">${zone.code}</span>` : ''}
                  ${zone.pdfUrl ? '<span style="background:#ef4444;color:white;font-size:9px;padding:2px 6px;border-radius:5px;font-weight:800;letter-spacing:0.3px;">PDF</span>' : ''}
                </div>
              </div>

              <div style="color:rgba(226,232,240,0.8);font-size:11px;font-weight:500;line-height:1.4;padding-left:17px;">
                ${zoneTypeLabel}${zone.district ? ` · ${zone.district}` : ''}
              </div>

              ${zone.areaHa ? `
              <div style="display:flex;gap:12px;font-size:11px;color:#94a3b8;padding-left:17px;padding-top:2px;">
                <span>Quy mô: <strong style="color:#f8fafc;">${zone.areaHa} ha</strong></span>
                ${zone.density ? `<span>Mật độ: <strong style="color:#f8fafc;">${zone.density}</strong></span>` : ''}
              </div>
              ` : ''}

              <div style="margin-top:4px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:space-between;">
                <span style="
                  display:inline-flex;
                  align-items:center;
                  gap:5px;
                  background:rgba(249,115,22,0.18);
                  border:1px solid rgba(249,115,22,0.5);
                  color:#fb923c;
                  font-size:11px;
                  font-weight:700;
                  padding:4px 10px;
                  border-radius:8px;
                ">
                  Click để xem thông số chi tiết →
                </span>
              </div>
            </div>
          `)
          .setLatLng(e.latlng)
          .addTo(map)
          
          ;(this as any)._tooltip = tooltip
        })

        polygon.on('mousemove', function(this: any, e: any) {
          if ((this as any)._tooltip) {
            ;(this as any)._tooltip.setLatLng(e.latlng)
          }
        })

        polygon.on('mouseout', function(this: any) {
          this.setStyle({ 
            fillOpacity: selectedZone?.id === zone.id ? Math.min(1, normOpacity + 0.3) : normOpacity, 
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
  }, [
    activeLayers.planning, 
    activeDistrict, 
    subdivisionGroup, 
    zoneTypeCode, 
    searchQuery, 
    opacity, 
    isMapReady, 
    selectedZone, 
    hoveredZone, 
    zones, 
    focusZoneId, 
    appContext?.planningZones, 
    appContext?.selectedPlanningZoneId
  ])

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

  // ── AUTO FLY TO FILTERED DISTRICT OR SUBDIVISION BOUNDS ──
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return
    if ((!subdivisionGroup || subdivisionGroup === 'ALL') && (!activeDistrict || activeDistrict === 'all')) return

    const baseZones = zones && zones.length > 0
      ? zones
      : (appContext?.planningZones && appContext.planningZones.length > 0 
          ? appContext.planningZones 
          : getAllHanoiPlanningZones())

    const matched = filterHanoiPlanningZones(baseZones, {
      subdivisionGroup,
      district: activeDistrict,
    })

    if (matched.length > 0) {
      import('leaflet').then(({ default: L }) => {
        const allCoords: [number, number][] = []
        matched.forEach((z: any) => {
          if (Array.isArray(z.coordinates)) {
            z.coordinates.forEach((c: any) => {
              if (Array.isArray(c) && c.length >= 2 && typeof c[0] === 'number') {
                allCoords.push([c[0], c[1]])
              }
            })
          }
        })
        if (allCoords.length > 0) {
          const bounds = L.latLngBounds(allCoords)
          mapInstanceRef.current?.flyToBounds(bounds, { padding: [70, 70], maxZoom: 15, duration: 1.0 })
        }
      })
    }
  }, [subdivisionGroup, activeDistrict, isMapReady])

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

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn()
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut()
  const handleReset = () => {
    mapInstanceRef.current?.flyTo(HANOI_CENTER, 13, { duration: 0.8 })
    setSelectedZone(null)
    setShowInfoPanel(false)
  }

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* ── Map Container ── */}
      <div ref={mapRef} className="w-full h-full z-0" />

      {/* ── Loading Screen ── */}
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
              <p className="text-white/60 text-sm">Đang tải bản đồ quy hoạch Thủ đô Hà Nội...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SWIPE COMPARISON OVERLAY (SOI RÈM HIỆN TRẠNG) ── */}
      {effectiveSwipeMode && isMapReady && (
        <>
          {/* Top Comparison Floating Badges */}
          <div className="absolute top-20 left-4 sm:left-6 z-[420] pointer-events-none">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white text-xs font-bold shadow-xl flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              🛰️ Hiện trạng {mapStyle === 'satellite' ? 'Vệ tinh' : 'Giao thông'}
            </span>
          </div>

          <div className="absolute top-20 right-4 sm:right-20 z-[420] pointer-events-none">
            <span className="px-3 py-1.5 rounded-xl bg-orange-950/90 backdrop-blur-md border border-orange-500/80 text-orange-200 text-xs font-bold shadow-xl flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              📐 Đồ án Quy hoạch 2030 (QCVN 01)
            </span>
          </div>

          {/* Vertical Draggable Laser Divider */}
          <div
            className="absolute top-0 bottom-0 z-[460] select-none transition-none pointer-events-none"
            style={{ left: `${swipePos}%` }}
          >
            {/* Laser Line */}
            <div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.95)]" />

            {/* Draggable Handle */}
            <div
              onMouseDown={handleSwipeStart}
              onTouchStart={handleSwipeStart}
              className="pointer-events-auto absolute inset-y-0 -left-6 w-12 cursor-ew-resize flex items-center justify-center group"
            >
              <div className="w-11 h-11 rounded-full bg-slate-950/95 border-2 border-amber-400 text-amber-400 flex flex-col items-center justify-center shadow-2xl transition-transform group-hover:scale-110 active:scale-95">
                <div className="flex items-center gap-0.5 text-[10px] font-black">
                  <span>◀</span>
                  <span className="text-[12px] leading-none">❙❙</span>
                  <span>▶</span>
                </div>
                <span className="text-[7px] font-extrabold uppercase tracking-tighter text-amber-300 -mt-0.5">
                  Soi rèm
                </span>
              </div>
            </div>

            {/* Bottom percentage tag */}
            <div className="absolute bottom-6 -translate-x-1/2 bg-slate-950/90 text-amber-400 border border-amber-400/60 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shadow-lg pointer-events-none whitespace-nowrap">
              {Math.round(swipePos)}%
            </div>
          </div>
        </>
      )}

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

        {/* Mode Switcher: Soi rèm hiện trạng (Curtain Swipe) */}
        <motion.button
          onClick={() => toggleSwipeMode()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-10 h-10 rounded-2xl shadow-lg border flex items-center justify-center transition-all ${
            effectiveSwipeMode
              ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white border-amber-400 shadow-orange-500/30'
              : 'bg-white dark:bg-gray-800 text-navy dark:text-white border-gray-200 dark:border-gray-700 hover:bg-orange-500 hover:text-white'
          }`}
          title={effectiveSwipeMode ? 'Đang bật Soi rèm hiện trạng (Click để tắt)' : 'Bật chế độ Soi rèm hiện trạng (Curtain Swipe)'}
        >
          <Scissors size={16} className={effectiveSwipeMode ? 'rotate-90' : ''} />
        </motion.button>

        {/* Layer Switcher */}
        <div className="relative">
          <motion.button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-white dark:bg-gray-800 rounded-2xl 
                       shadow-lg border border-gray-200 dark:border-gray-700
                       flex items-center justify-center text-navy dark:text-white
                       hover:bg-orange-500 hover:text-white transition-all"
            title="Chọn lớp nền bản đồ"
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
                           dark:border-gray-700 p-3 min-w-[170px]"
              >
                <p className="text-xs font-semibold text-gray-500 mb-2 
                              uppercase tracking-wide">Lớp nền bản đồ</p>
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
                        ? 'bg-orange-500 text-white font-bold'
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
      <div className="absolute bottom-6 right-4 z-[400] bg-black/60 
                      backdrop-blur-md text-white/80 text-xs px-2.5 py-1.5 
                      rounded-lg font-mono border border-white/10">
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
            className="absolute top-4 right-16 z-[450] w-[330px] max-w-[calc(100vw-32px)]
                       bg-white dark:bg-slate-900 rounded-2xl shadow-2xl 
                       border border-gray-200 dark:border-slate-800 overflow-hidden"
          >
            {/* Panel header */}
            <div className="flex items-start justify-between gap-3 p-5 border-b 
                            border-gray-100 dark:border-slate-800"
              style={{ borderLeft: `5px solid ${selectedZone.color}` }}>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedZone.code && (
                    <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-800 text-amber-400">
                      {selectedZone.code}
                    </span>
                  )}
                  <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {PLANNING_ZONE_TYPES[selectedZone.type as keyof typeof PLANNING_ZONE_TYPES]?.label || selectedZone.type}
                  </p>
                </div>
                <p className="text-sm font-bold text-navy dark:text-white leading-snug">
                  {selectedZone.name}
                </p>
              </div>
              <motion.button onClick={() => setShowInfoPanel(false)}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 shrink-0">
                <X size={16} />
              </motion.button>
            </div>

            {/* Zone details */}
            <div className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Năm quy hoạch', value: selectedZone.planYear },
                  { label: 'Quận/Huyện', value: selectedZone.district },
                  { label: 'Diện tích phân khu', value: selectedZone.areaHa ? `${selectedZone.areaHa} ha` : 'Đang cập nhật' },
                  { label: 'Mật độ xây dựng', value: selectedZone.density || '60%' },
                  { label: 'Hệ số SDĐ (FAR)', value: selectedZone.floorAreaRatio ? `${selectedZone.floorAreaRatio}x` : 'N/A' },
                  { label: 'Chiều cao tối đa', value: selectedZone.maxHeight },
                ].map(item => (
                  <div key={item.label} 
                    className="bg-gray-50 dark:bg-slate-800/80 rounded-xl p-2.5">
                    <p className="text-[10px] text-gray-400 mb-0.5">{item.label}</p>
                    <p className="text-xs font-bold text-navy dark:text-white leading-tight">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-3 text-xs font-bold"
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
                             text-red-600 dark:text-red-400 text-xs font-bold py-2.5 px-3.5 
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
                           bg-orange-500 hover:bg-orange-600 
                           text-white text-xs font-bold py-3 px-4 
                           rounded-xl transition-colors shadow-md shadow-orange-500/20">
                <span>🔍 Xem BĐS trong khu vực này</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Planning Legend (QCVN 01:2021 Standard Symbols Popover at bottom-left) ── */}
      {isMapReady && (
        <div className="absolute bottom-6 left-4 z-[400]">
          <AnimatePresence>
            {showLegend && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                className="absolute bottom-12 left-0 mb-1 w-80 max-h-[70vh] flex flex-col bg-white/95 dark:bg-slate-900/95 
                           backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 
                           dark:border-slate-800 p-3.5"
              >
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2 mb-2.5">
                  <p className="text-xs font-extrabold text-navy dark:text-white 
                                uppercase tracking-wide flex items-center gap-1.5">
                    <Palette size={14} className="text-orange-500" /> Ký hiệu màu QCVN 01:2021
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowLegend(false)}
                    aria-label="Đóng bảng chú giải"
                    title="Đóng"
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-1.5 overflow-y-auto pr-1 max-h-[50vh]">
                  {Object.values(PLANNING_STANDARD_SYMBOLS).map((sym) => (
                    <div key={sym.code} className="flex items-start gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
                      <div
                        className="w-4 h-3.5 rounded flex-shrink-0 mt-0.5 border border-white/30 shadow-xs"
                        style={{ backgroundColor: sym.color }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-amber-500 text-[10px]">
                            {sym.code}
                          </span>
                          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                            {sym.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-slate-400 line-clamp-1">{sym.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1 font-semibold">
                    <Info size={11} className="text-orange-500" /> Viện QHXD Hà Nội
                  </span>
                  <span className="font-mono text-[9px]">WGS84 EPSG:4326</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={() => setShowLegend(prev => !prev)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-expanded={showLegend}
            aria-label="Chú giải màu sắc quy hoạch"
            title="Bảng ký hiệu màu sắc quy hoạch QCVN 01:2021"
            className={`relative w-10 h-10 rounded-2xl shadow-lg border flex items-center justify-center transition-all cursor-pointer ${
              showLegend
                ? 'bg-orange-500 text-white border-orange-500 shadow-orange-500/25'
                : 'bg-white/95 dark:bg-slate-900/95 text-navy dark:text-white border-gray-200 dark:border-slate-800 hover:bg-orange-500 hover:text-white hover:border-orange-500'
            }`}
          >
            <Palette size={17} />
            {!showLegend && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-white dark:bg-gray-900 p-0.5 shadow-xs">
                <span className="h-full w-full rounded-full bg-gradient-to-tr from-emerald-500 via-blue-500 to-orange-500" />
              </span>
            )}
          </motion.button>
        </div>
      )}
    </div>
  )
}
