'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Layers, ZoomIn, ZoomOut, 
  ExternalLink, Navigation, CheckCircle2, 
  Sparkles, Train 
} from 'lucide-react'
import { 
  HANOI_PLANNING_ZONES, 
  PLANNING_ZONE_TYPES, 
  HANOI_METRO_STATIONS 
} from '@/lib/leaflet/hanoi-data'
import { fixLeafletIcons } from '@/lib/leaflet/fix-icons'

interface ListingDetailMapProps {
  lat: number
  lng: number
  title: string
  address: string
  price: number
  district: string
  planningZone?: string
  planningYear?: number
  height?: string
}

function formatPriceShort(price: number): string {
  if (price >= 1_000_000_000) {
    const val = price / 1_000_000_000
    return val % 1 === 0 ? `${val} Tỷ` : `${val.toFixed(1)} Tỷ`
  }
  if (price >= 1_000_000) {
    return `${Math.round(price / 1_000_000)} Triệu`
  }
  return price.toLocaleString('vi-VN')
}

export default function ListingDetailMap({
  lat,
  lng,
  title,
  address,
  price,
  district,
  planningZone,
  planningYear = 2030,
  height = '320px',
}: ListingDetailMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [mapStyle, setMapStyle] = useState<'voyager' | 'dark' | 'satellite'>('voyager')
  const tileLayerRef = useRef<any>(null)

  // ── TILE STYLES ──
  const TILE_URLS = {
    voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  }

  // ── INIT MAP ──
  useEffect(() => {
    if (typeof window === 'undefined' || mapInstanceRef.current) return

    const initMap = async () => {
      const L = (await import('leaflet')).default
      fixLeafletIcons()
      if (!mapRef.current || mapInstanceRef.current) return

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
        scrollWheelZoom: true,
      })

      // Tile layer
      const tile = L.tileLayer(TILE_URLS.voyager, {
        attribution: '©OpenStreetMap ©CartoDB',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)
      tileLayerRef.current = tile

      // ── 500m Walking Radius Circle ──
      L.circle([lat, lng], {
        radius: 500,
        color: '#f97316',
        fillColor: '#f97316',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '6,6',
      }).addTo(map).bindTooltip('Bán kính đi bộ 500m', {
        permanent: false,
        direction: 'top',
        className: 'planning-tooltip',
      })

      // ── Planning Zones for this District ──
      const districtZones = HANOI_PLANNING_ZONES.filter(
        z => z.district.toLowerCase() === district.toLowerCase()
      )
      districtZones.forEach(zone => {
        L.polygon(zone.coordinates, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.18,
          weight: 1.5,
        }).addTo(map).bindTooltip(`🏛️ ${zone.name} (${zone.planYear})`, {
          permanent: false,
          direction: 'center',
          className: 'planning-tooltip',
        })
      })

      // ── Nearby Metro Stations ──
      HANOI_METRO_STATIONS.forEach(station => {
        // Only show if reasonably close (< 3km)
        const dLat = Math.abs(station.lat - lat)
        const dLng = Math.abs(station.lng - lng)
        if (dLat < 0.03 && dLng < 0.03) {
          const metroIcon = L.divIcon({
            html: `
              <div style="background:#8b5cf6;color:white;padding:3px 6px;border-radius:12px;font-size:10px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.3);white-space:nowrap;display:flex;align-items:center;gap:3px;border:1.5px solid white;">
                🚇 ${station.name}
              </div>
            `,
            className: 'metro-pin',
            iconSize: [80, 24],
            iconAnchor: [40, 12],
          })
          L.marker([station.lat, station.lng], { icon: metroIcon }).addTo(map)
        }
      })

      // ── Main Property Marker ──
      const propertyIcon = L.divIcon({
        html: `
          <div class="hanoi-price-pin" style="transform: scale(1.1);">
            <div class="pin-bubble" style="background:#f97316;color:#ffffff;box-shadow: 0 4px 14px rgba(249,115,22,0.5);">
              <span class="pin-type">🏠</span>
              <span class="pin-price">${formatPriceShort(price)}</span>
            </div>
            <div class="pin-pointer" style="border-top-color:#f97316;"></div>
          </div>
        `,
        className: 'custom-leaflet-marker',
        iconSize: [60, 36],
        iconAnchor: [30, 36],
      })

      const marker = L.marker([lat, lng], { icon: propertyIcon }).addTo(map)

      // Popup Content
      const popupHtml = `
        <div style="padding:10px;min-width:200px;font-family:sans-serif">
          <p style="font-size:13px;font-weight:800;color:#1e293b;margin:0 0 4px 0;line-height:1.3">
            ${title}
          </p>
          <p style="font-size:11px;color:#64748b;margin:0 0 8px 0;">
            📍 ${address}
          </p>
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:14px;font-weight:900;color:#f97316;">${formatPriceShort(price)}</span>
            <a href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="font-size:11px;font-weight:700;color:#2563eb;text-decoration:none;">
              Google Maps ↗
            </a>
          </div>
        </div>
      `
      marker.bindPopup(popupHtml, { maxWidth: 260 }).openPopup()

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
  }, [lat, lng, price, title, address, district])

  // ── SWITCH STYLE ──
  const switchMapStyle = useCallback(async (styleKey: 'voyager' | 'dark' | 'satellite') => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return
    const L = (await import('leaflet')).default
    mapInstanceRef.current.removeLayer(tileLayerRef.current)

    const newTile = L.tileLayer(TILE_URLS[styleKey], {
      attribution: '©OpenStreetMap ©CartoDB',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current)

    tileLayerRef.current = newTile
    setMapStyle(styleKey)
  }, [])

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border bg-slate-900 shadow-sm" style={{ height }}>
      {/* Map DOM */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Loading overlay */}
      {!isMapReady && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-500">Đang tải bản đồ tọa độ...</span>
          </div>
        </div>
      )}

      {/* Controls Overlay Top Right */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-1.5">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-white hover:bg-orange-500 hover:text-white transition-colors border-b border-slate-100 dark:border-slate-700"
          >
            +
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-white hover:bg-orange-500 hover:text-white transition-colors"
          >
            −
          </button>
        </div>

        {/* Style selector */}
        <div className="flex bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-0.5 gap-0.5 text-[10px] font-bold">
          <button
            onClick={() => switchMapStyle('voyager')}
            className={`px-2 py-1 rounded-lg transition-all ${
              mapStyle === 'voyager' ? 'bg-orange-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            Phố
          </button>
          <button
            onClick={() => switchMapStyle('satellite')}
            className={`px-2 py-1 rounded-lg transition-all ${
              mapStyle === 'satellite' ? 'bg-orange-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            Vệ tinh
          </button>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-2 left-2 right-2 z-[400] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2 truncate">
          <span className="inline-flex items-center gap-1 font-bold text-slate-800 dark:text-white">
            <MapPin size={12} className="text-orange-500 shrink-0" />
            {district}, Hà Nội
          </span>
          {planningZone && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-md font-semibold">
              🏛️ {planningZone}
            </span>
          )}
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-orange-600 hover:text-orange-700 transition-colors shrink-0 ml-2"
        >
          <ExternalLink size={11} />
          <span>Google Maps</span>
        </a>
      </div>
    </div>
  )
}
