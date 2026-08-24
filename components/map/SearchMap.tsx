'use client'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Layers, ZoomIn, ZoomOut, Locate, 
  X, MapPin, Eye, ExternalLink 
} from 'lucide-react'
import { HANOI_CENTER, HANOI_PLANNING_ZONES, PLANNING_ZONE_TYPES, HANOI_DISTRICT_CENTERS } from '@/lib/leaflet/hanoi-data'
import { fixLeafletIcons } from '@/lib/leaflet/fix-icons'

// ── Types ──
export interface SearchMapListing {
  id: string
  title: string
  price: number
  area: number
  address: string
  district: string
  lat: number
  lng: number
  type: 'house' | 'apartment' | 'land' | 'villa'
  images: string[]
  isFeatured?: boolean
  status?: 'active' | 'pending' | 'sold'
}

interface SearchMapProps {
  listings: SearchMapListing[]
  selectedListingId?: string | null
  hoveredListingId?: string | null
  targetDistrict?: string
  onMarkerClick?: (listingId: string) => void
  onMarkerHover?: (listingId: string | null) => void
  showPlanningLayer?: boolean
}

// ── Price formatter ──
function formatPriceShort(price: number): string {
  if (price >= 1_000_000_000) {
    const val = price / 1_000_000_000
    return val % 1 === 0 ? `${val}T` : `${val.toFixed(1)}T`
  }
  if (price >= 1_000_000) {
    return `${Math.round(price / 1_000_000)}M`
  }
  return price.toLocaleString('vi-VN')
}

// ── Property type icons ──
const TYPE_ICONS: Record<string, string> = {
  house: '🏠',
  apartment: '🏢',
  land: '🌿',
  villa: '🏰',
}

export default function SearchMap({
  listings,
  selectedListingId,
  hoveredListingId,
  targetDistrict,
  onMarkerClick,
  onMarkerHover,
  showPlanningLayer = false,
}: SearchMapProps) {
  const mapRef = useRef<any>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<Map<string, any>>(new Map())
  const polygonsRef = useRef<any[]>([])
  const [isMapReady, setIsMapReady] = useState(false)
  const [activePopupId, setActivePopupId] = useState<string | null>(null)
  const [popupListing, setPopupListing] = useState<SearchMapListing | null>(null)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  const [mapLayer, setMapLayer] = useState<'dark' | 'light' | 'satellite'>('dark')
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  // ── TILE LAYERS ──
  const TILE_LAYERS = {
    dark: {
      label: '🌙 Tối giản',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '©OpenStreetMap ©CartoDB',
    },
    light: {
      label: '☀️ Sáng',
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '©OpenStreetMap ©CartoDB',
    },
    satellite: {
      label: '🛰️ Vệ tinh',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '©Esri ©DigitalGlobe',
    },
  }

  // ── INIT MAP ──
  useEffect(() => {
    if (typeof window === 'undefined' || mapInstanceRef.current) return

    const initMap = async () => {
      const L = (await import('leaflet')).default
      // @ts-ignore
      await import('leaflet/dist/leaflet.css')
      fixLeafletIcons()

      if (!mapRef.current || mapInstanceRef.current) return

      const map = L.map(mapRef.current, {
        center: HANOI_CENTER,
        zoom: 13,
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
      })

      // Add tile layer
      L.tileLayer(TILE_LAYERS.dark.url, {
        attribution: TILE_LAYERS.dark.attribution,
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map)

      mapInstanceRef.current = map
      setIsMapReady(true)
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // ── CHANGE TILE LAYER ──
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return
    const initMap = async () => {
      const L = (await import('leaflet')).default
      const map = mapInstanceRef.current

      // Remove existing tile layers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) map.removeLayer(layer)
      })

      const tile = TILE_LAYERS[mapLayer]
      L.tileLayer(tile.url, {
        attribution: tile.attribution,
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map)
    }
    initMap()
  }, [mapLayer, isMapReady])

  // ── RENDER LISTING MARKERS ──
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return

    const renderMarkers = async () => {
      const L = (await import('leaflet')).default
      const map = mapInstanceRef.current

      // Clear old markers
      markersRef.current.forEach(marker => map.removeLayer(marker))
      markersRef.current.clear()

      listings.forEach(listing => {
        if (!listing.lat || !listing.lng) return

        // Create custom price pin icon
        const isSelected = listing.id === selectedListingId
        const isHovered = listing.id === hoveredListingId

        const displayPrice = listing.price < 1000000 ? listing.price * 1_000_000_000 : listing.price

        const iconHtml = `
          <div class="hanoi-price-pin">
            <div class="pin-bubble ${isSelected ? 'active' : ''} ${isHovered ? 'hovered' : ''}">
              ${TYPE_ICONS[listing.type] || '🏠'} ${formatPriceShort(displayPrice)}
            </div>
          </div>
        `

        const icon = L.divIcon({
          html: iconHtml,
          className: 'hanoi-price-pin',
          iconSize: [80, 32],
          iconAnchor: [40, 32],
          popupAnchor: [0, -34],
        })

        const marker = L.marker([listing.lat, listing.lng], {
          icon,
          zIndexOffset: isSelected ? 1000 : 0,
        })

        // Hover events
        marker.on('mouseover', () => {
          onMarkerHover?.(listing.id)
          const el = marker.getElement()?.querySelector('.pin-bubble')
          if (el) el.classList.add('hovered')
        })

        marker.on('mouseout', () => {
          onMarkerHover?.(null)
          const el = marker.getElement()?.querySelector('.pin-bubble')
          if (el) el.classList.remove('hovered')
        })

        // Click → show popup + notify parent
        marker.on('click', (e: any) => {
          const containerPoint = map.latLngToContainerPoint(e.latlng)
          setPopupPosition({ x: containerPoint.x, y: containerPoint.y })
          setPopupListing(listing)
          setActivePopupId(listing.id)
          onMarkerClick?.(listing.id)
          
          // Pan map so popup is visible
          map.panTo([listing.lat, listing.lng], { animate: true, duration: 0.3 })
        })

        marker.addTo(map)
        markersRef.current.set(listing.id, marker)
      })
    }

    renderMarkers()
  }, [listings, isMapReady, selectedListingId, hoveredListingId])

  // ── UPDATE MARKER STYLES when selection changes ──
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement()?.querySelector('.pin-bubble')
      if (!el) return
      if (id === selectedListingId) {
        el.classList.add('active')
      } else {
        el.classList.remove('active')
      }
    })
  }, [selectedListingId])

  // ── PLANNING ZONE POLYGONS ──
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return

    const renderZones = async () => {
      const L = (await import('leaflet')).default
      const map = mapInstanceRef.current

      // Remove old polygons
      polygonsRef.current.forEach(p => map.removeLayer(p))
      polygonsRef.current = []

      if (!showPlanningLayer) return

      HANOI_PLANNING_ZONES.forEach(zone => {
        const polygon = L.polygon(zone.coordinates, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: zone.fillOpacity,
          weight: 2,
          opacity: 0.8,
          dashArray: zone.type === 'transport' ? '8,6' : undefined,
        })

        // Popup on click
        polygon.on('click', () => {
          const center = polygon.getBounds().getCenter()
          const typeInfo = PLANNING_ZONE_TYPES[zone.type as keyof typeof PLANNING_ZONE_TYPES]
          
          const popupContent = `
            <div style="padding:16px;min-width:240px;font-family:Inter,sans-serif">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
                <div style="width:12px;height:12px;border-radius:3px;background:${zone.color}"></div>
                <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">
                  ${typeInfo?.label || zone.type}
                </span>
              </div>
              <p style="font-size:15px;font-weight:700;color:#1a2744;margin:0 0 12px 0;line-height:1.3">
                ${zone.name}
              </p>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
                <div style="background:#f8fafc;border-radius:8px;padding:8px">
                  <div style="font-size:9px;color:#94a3b8;margin-bottom:2px">Quy hoạch</div>
                  <div style="font-size:13px;font-weight:700;color:#1a2744">${zone.planYear}</div>
                </div>
                <div style="background:#f8fafc;border-radius:8px;padding:8px">
                  <div style="font-size:9px;color:#94a3b8;margin-bottom:2px">Hệ số SDĐ</div>
                  <div style="font-size:13px;font-weight:700;color:#1a2744">${zone.floorAreaRatio || 'N/A'}</div>
                </div>
                <div style="background:#f8fafc;border-radius:8px;padding:8px">
                  <div style="font-size:9px;color:#94a3b8;margin-bottom:2px">Chiều cao tối đa</div>
                  <div style="font-size:12px;font-weight:600;color:#1a2744">${zone.maxHeight}</div>
                </div>
                <div style="background:#f8fafc;border-radius:8px;padding:8px">
                  <div style="font-size:9px;color:#94a3b8;margin-bottom:2px">Quận</div>
                  <div style="font-size:12px;font-weight:600;color:#1a2744">${zone.district}</div>
                </div>
              </div>
              <div style="background:${zone.type === 'residential' ? '#dcfce7' : zone.type === 'transport' ? '#fef9c3' : '#dbeafe'};
                          border-radius:8px;padding:8px;font-size:11px;font-weight:600;
                          color:${zone.type === 'residential' ? '#166534' : zone.type === 'transport' ? '#713f12' : '#1e40af'}">
                ✅ ${zone.status}
              </div>
            </div>
          `

          L.popup({ 
            className: 'planning-popup',
            closeButton: true,
            maxWidth: 280,
          })
            .setLatLng(center)
            .setContent(popupContent)
            .openOn(map)
        })

        // Hover effects
        polygon.on('mouseover', function(this: any) {
          this.setStyle({ fillOpacity: zone.fillOpacity + 0.2, weight: 3 })
        })
        polygon.on('mouseout', function(this: any) {
          this.setStyle({ fillOpacity: zone.fillOpacity, weight: 2 })
        })

        polygon.addTo(map)
        polygonsRef.current.push(polygon)
      })
    }

    renderZones()
  }, [showPlanningLayer, isMapReady])

  // ── FLY TO selected listing ──
  useEffect(() => {
    if (!selectedListingId || !mapInstanceRef.current) return
    const listing = listings.find(l => l.id === selectedListingId)
    if (listing) {
      mapInstanceRef.current.flyTo([listing.lat, listing.lng], 16, {
        duration: 0.8,
        easeLinearity: 0.5,
      })
    }
  }, [selectedListingId, listings])

  // ── FLY TO target district ──
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return
    if (targetDistrict && targetDistrict !== 'Tất cả quận' && targetDistrict !== 'all') {
      const target = HANOI_DISTRICT_CENTERS[targetDistrict]
      if (target) {
        mapInstanceRef.current.flyTo([target.lat, target.lng], target.zoom, {
          duration: 1,
          easeLinearity: 0.25,
        })
      }
    } else if (targetDistrict === 'Tất cả quận' || targetDistrict === 'all') {
      mapInstanceRef.current.flyTo(HANOI_CENTER, 13, {
        duration: 1,
        easeLinearity: 0.25,
      })
    }
  }, [targetDistrict, isMapReady])

  // ── GET USER LOCATION ──
  const handleLocateMe = useCallback(() => {
    if (!mapInstanceRef.current) return
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        setUserLocation([lat, lng])
        mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1 })
      },
      () => {}
    )
  }, [])

  // ── ZOOM CONTROLS ──
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn()
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut()

  // ── CLOSE POPUP ──
  const closePopup = useCallback(() => {
    setActivePopupId(null)
    setPopupListing(null)
  }, [])

  // ── CLOSE POPUP ON MAP CLICK ──
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return
    const map = mapInstanceRef.current
    const handler = () => closePopup()
    map.on('click', handler)
    return () => map.off('click', handler)
  }, [isMapReady, closePopup])

  const popupPrice = popupListing
    ? popupListing.price < 1000000
      ? popupListing.price * 1_000_000_000
      : popupListing.price
    : 0

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden">
      {/* ── Leaflet Map Container ── */}
      <div ref={mapRef} className="w-full h-full" />

      {/* ── Loading Overlay ── */}
      <AnimatePresence>
        {!isMapReady && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 bg-[#1a2744] flex items-center 
                       justify-center z-[500]"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 border-4 border-navy border-t-orange-500 
                             rounded-full"
                />
                <span className="absolute inset-0 flex items-center 
                                 justify-center text-2xl">🗺️</span>
              </div>
              <p className="text-white/70 text-sm font-medium">
                Đang tải bản đồ Hà Nội...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Custom Zoom Controls (top-right) ── */}
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

        {/* Locate Me */}
        <motion.button
          onClick={handleLocateMe}
          whileHover={{ scale: 1.05, backgroundColor: '#f97316' }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-white dark:bg-gray-800 rounded-2xl 
                     shadow-lg border border-gray-200 dark:border-gray-700
                     flex items-center justify-center text-navy dark:text-white
                     hover:text-white transition-all"
          title="Vị trí của tôi"
        >
          <Locate size={16} />
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
                {Object.entries(TILE_LAYERS).map(([key, tile]) => (
                  <motion.button
                    key={key}
                    onClick={() => {
                      setMapLayer(key as typeof mapLayer)
                      setShowLayerPanel(false)
                    }}
                    whileHover={{ x: 2 }}
                    className={`w-full flex items-center gap-2 px-3 py-2 
                               rounded-xl text-sm font-medium transition-all ${
                      mapLayer === key
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

      {/* ── Listing Count Badge (top-left) ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isMapReady ? 1 : 0, y: isMapReady ? 0 : -10 }}
        className="absolute top-4 left-4 z-[400] bg-white/95 dark:bg-gray-800/95 
                   backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 
                   dark:border-gray-700 px-4 py-2.5 flex items-center gap-2"
      >
        <MapPin size={14} className="text-orange-500" />
        <span className="text-sm font-bold text-navy dark:text-white">
          {listings.length}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          bất động sản
        </span>
      </motion.div>

      {/* ── Planning Legend (bottom-left, shows when layer active) ── */}
      <AnimatePresence>
        {showPlanningLayer && isMapReady && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-4 z-[400] bg-white/95 dark:bg-gray-800/95 
                       backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 
                       dark:border-gray-700 p-4 max-w-[200px]"
          >
            <p className="text-xs font-bold text-navy dark:text-white mb-3 
                          uppercase tracking-wide">Chú giải quy hoạch</p>
            <div className="space-y-2">
              {Object.entries(PLANNING_ZONE_TYPES).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-4 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: val.color, opacity: 0.7 }} />
                  <span className="text-xs text-gray-600 dark:text-gray-300 
                                   leading-tight">
                    {val.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hover Popup Card (custom, not Leaflet popup) ── */}
      <AnimatePresence>
        {popupListing && activePopupId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            style={{
              position: 'absolute',
              left: Math.min(popupPosition.x - 150, (mapRef.current?.offsetWidth || 700) - 310),
              top: Math.max(popupPosition.y - 220, 10),
              zIndex: 450,
            }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl 
                       border border-gray-200 dark:border-gray-700 
                       overflow-hidden w-[300px]"
          >
            {/* Close */}
            <motion.button
              onClick={(e) => { e.stopPropagation(); closePopup() }}
              whileHover={{ scale: 1.1 }}
              className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/80 
                         dark:bg-gray-700/80 backdrop-blur-sm rounded-full 
                         flex items-center justify-center text-gray-500 
                         hover:text-red-500 transition-colors shadow-sm"
            >
              <X size={13} />
            </motion.button>

            {/* Image */}
            <div className="relative h-[140px] bg-gray-100 dark:bg-gray-700 overflow-hidden">
              {popupListing.images && popupListing.images[0] ? (
                <img
                  src={popupListing.images[0]}
                  alt={popupListing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  {TYPE_ICONS[popupListing.type]}
                </div>
              )}
              {/* Type badge */}
              <div className="absolute top-2 left-2 bg-navy/80 backdrop-blur-sm 
                              text-white text-xs font-semibold px-2 py-1 rounded-lg">
                {TYPE_ICONS[popupListing.type]}{' '}
                {popupListing.type === 'house' ? 'Nhà phố'
                  : popupListing.type === 'apartment' ? 'Chung cư'
                  : popupListing.type === 'land' ? 'Đất nền'
                  : 'Biệt thự'}
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-1.5">
                <span className="text-xl font-black text-orange-500">
                  {formatPriceShort(popupPrice)}
                </span>
                <span className="text-xs text-gray-400">VNĐ</span>
                <span className="text-xs text-gray-400 ml-auto">
                  {formatPriceShort(popupPrice / popupListing.area)}/m²
                </span>
              </div>

              {/* Title */}
              <p className="text-sm font-semibold text-navy dark:text-white 
                            line-clamp-1 mb-2">
                {popupListing.title}
              </p>

              {/* Stats */}
              <div className="flex gap-3 text-xs text-gray-500 mb-3">
                <span>📐 {popupListing.area}m²</span>
                <span>📍 {popupListing.district}</span>
              </div>

              {/* Action */}
              <a
                href={`/listings/${popupListing.id}`}
                className="flex items-center justify-center gap-2 w-full 
                           bg-orange-500 hover:bg-orange-600 text-white text-sm 
                           font-semibold py-2.5 rounded-xl transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <Eye size={14} /> Xem chi tiết
                <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
