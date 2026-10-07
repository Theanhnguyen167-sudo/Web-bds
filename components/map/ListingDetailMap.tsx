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
  district?: string
  planningZone?: string
  planningYear?: number
  height?: string
}

function formatPriceShort(price?: number): string {
  if (!price && price !== 0) return 'Thoả thuận'
  if (price >= 1_000_000_000) {
    const val = price / 1_000_000_000
    return val % 1 === 0 ? `${val} Tỷ` : `${val.toFixed(1)} Tỷ`
  }
  if (price >= 1_000_000) {
    return `${Math.round(price / 1_000_000)} Triệu`
  }
  return Number(price).toLocaleString('vi-VN')
}

export default function ListingDetailMap({
  lat,
  lng,
  title,
  address,
  price,
  district = 'Hà Nội',
  planningZone,
  planningYear = 2030,
  height = '320px',
}: ListingDetailMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [mapStyle, setMapStyle] = useState<'googleStreet' | 'googleHybrid' | 'dark'>('googleStreet')
  const tileLayerRef = useRef<any>(null)

  // ── TILE STYLES (Chuẩn Google Maps) ──
  const TILE_URLS = {
    googleStreet: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    googleHybrid: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  }

  // ── INIT MAP ──
  useEffect(() => {
    if (typeof window === 'undefined' || mapInstanceRef.current) return

    const initMap = async () => {
      const L = (await import('leaflet')).default
      fixLeafletIcons()
      if (!mapRef.current || mapInstanceRef.current) return

      const safeLat = typeof lat === 'number' && !isNaN(lat) && lat !== 0 ? lat : 21.0285;
      const safeLng = typeof lng === 'number' && !isNaN(lng) && lng !== 0 ? lng : 105.8542;
      const safeDistrict = (district || 'Hà Nội').trim();

      const map = L.map(mapRef.current, {
        center: [safeLat, safeLng],
        zoom: 16,
        zoomControl: false,
        scrollWheelZoom: true,
      })

      // Tile layer
      const tile = L.tileLayer(TILE_URLS.googleStreet, {
        attribution: '©Google Maps',
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
      }).addTo(map)
      tileLayerRef.current = tile

      // ── 500m Walking Radius Circle ──
      L.circle([safeLat, safeLng], {
        radius: 500,
        color: '#f97316',
        fillColor: '#f97316',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '6,6',
      }).addTo(map).bindTooltip(
        `<div style="font-family:Inter,sans-serif;padding:8px 12px;background:rgba(15,23,42,0.95);color:white;border-radius:10px;font-size:11px;font-weight:600;border:1px solid rgba(255,255,255,0.14);box-shadow:0 8px 20px rgba(0,0,0,0.3);">🚶 Bán kính đi bộ 500m</div>`,
        {
          permanent: false,
          direction: 'top',
          className: 'planning-tooltip',
        }
      )

      // ── Planning Zones for this District ──
      const districtZones = safeDistrict
        ? HANOI_PLANNING_ZONES.filter(
            z => z.district && z.district.toLowerCase() === safeDistrict.toLowerCase()
          )
        : []
      districtZones.forEach(zone => {
        L.polygon(zone.coordinates, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.18,
          weight: 1.5,
        }).addTo(map).bindTooltip(
          `<div style="font-family:Inter,sans-serif;padding:10px 14px;background:rgba(15,23,42,0.95);color:white;border-radius:12px;font-size:11px;font-weight:600;border:1px solid rgba(255,255,255,0.14);box-shadow:0 8px 20px rgba(0,0,0,0.3);">🏛️ ${zone.name} (${zone.planYear})</div>`,
          {
            permanent: false,
            direction: 'center',
            className: 'planning-tooltip',
          }
        )
      })

      // ── Geodesic Distance Helper (Haversine formula in meters) ──
      const getDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3; // metres
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
      };

      // ── Find Nearest Metro Station (Metro TOD Trắc Địa) ──
      let nearestMetro: { name: string; lat: number; lng: number; line: string; distance: number } | null = null;
      let minMetroDist = Infinity;

      HANOI_METRO_STATIONS.forEach(station => {
        const dist = getDistanceMeters(safeLat, safeLng, station.lat, station.lng);
        if (dist < minMetroDist) {
          minMetroDist = dist;
          nearestMetro = { ...station, distance: dist };
        }
      });

      // ── Render All Stations within 3.5km & Draw Glowing Polyline to Nearest ──
      HANOI_METRO_STATIONS.forEach(station => {
        const dist = getDistanceMeters(safeLat, safeLng, station.lat, station.lng);
        if (dist <= 3500) {
          const isNearest = nearestMetro && nearestMetro.name === station.name;
          const metroIcon = L.divIcon({
            html: `
              <div style="background:${isNearest ? '#6366f1' : '#8b5cf6'};color:white;padding:${isNearest ? '4px 8px' : '3px 6px'};border-radius:12px;font-size:10px;font-weight:700;box-shadow:${isNearest ? '0 0 12px rgba(99,102,241,0.8), 0 2px 6px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.3)'};white-space:nowrap;display:flex;align-items:center;gap:4px;border:${isNearest ? '2px solid #ffffff' : '1.5px solid rgba(255,255,255,0.8)'};transform:${isNearest ? 'scale(1.08)' : 'scale(1)'};">
                🚇 ${station.name} ${isNearest ? `· ${dist}m` : ''}
              </div>
            `,
            className: 'metro-pin',
            iconSize: [isNearest ? 100 : 80, 26],
            iconAnchor: [isNearest ? 50 : 40, 13],
          });
          L.marker([station.lat, station.lng], { icon: metroIcon })
            .addTo(map)
            .bindTooltip(
              `<div style="font-family:Inter,sans-serif;padding:6px 10px;background:#0f172a;color:white;border-radius:8px;font-size:11px;font-weight:600;">
                🚇 ${station.name} (${station.line})<br/>
                <span style="color:#a5b4fc">Khoảng cách: ${dist >= 1000 ? (dist / 1000).toFixed(1) + 'km' : dist + 'm'}</span>
              </div>`,
              { direction: 'top', className: 'planning-tooltip' }
            );
        }
      });

      // ── Draw Glowing Trắc Địa Polyline to Nearest Metro Station ──
      if (nearestMetro && minMetroDist <= 4000) {
        const walkingMinutes = Math.max(1, Math.round(minMetroDist / 80)); // 80m/phút đi bộ

        // Outer glow polyline
        L.polyline(
          [
            [safeLat, safeLng],
            [(nearestMetro as any).lat, (nearestMetro as any).lng],
          ],
          {
            color: '#6366f1',
            weight: 6,
            opacity: 0.35,
            lineCap: 'round',
          }
        ).addTo(map);

        // Core dashed dynamic line
        const metroLine = L.polyline(
          [
            [safeLat, safeLng],
            [(nearestMetro as any).lat, (nearestMetro as any).lng],
          ],
          {
            color: '#818cf8',
            weight: 2.5,
            dashArray: '6, 8',
            opacity: 0.95,
          }
        ).addTo(map);

        // Middle Point Tooltip for Walking Time
        const midLat = (safeLat + (nearestMetro as any).lat) / 2;
        const midLng = (safeLng + (nearestMetro as any).lng) / 2;
        L.tooltip({
          permanent: true,
          direction: 'center',
          className: 'metro-tod-badge',
        })
          .setLatLng([midLat, midLng])
          .setContent(
            `<div style="font-family:Inter,sans-serif;padding:4px 9px;background:#1e1b4b;color:#c7d2fe;border:1px solid #6366f1;border-radius:9999px;font-size:10px;font-weight:700;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.35);display:flex;align-items:center;gap:4px;">
              <span>🚶</span> <strong>${minMetroDist >= 1000 ? (minMetroDist / 1000).toFixed(1) + 'km' : minMetroDist + 'm'}</strong> · ~${walkingMinutes} phút đi bộ
            </div>`
          )
          .addTo(map);
      }

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

      const marker = L.marker([safeLat, safeLng], { icon: propertyIcon }).addTo(map)

      // Popup Content
      const popupHtml = `
        <div style="padding:14px 16px;min-width:220px;font-family:Inter,sans-serif">
          <p style="font-size:13px;font-weight:800;color:#1e293b;margin:0 0 6px 0;line-height:1.4">
            ${title || 'Bất động sản Hà Nội'}
          </p>
          <p style="font-size:11px;color:#64748b;margin:0 0 12px 0;line-height:1.4">
            📍 ${address || safeDistrict}
          </p>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding-top:8px;border-top:1px solid #f1f5f9;">
            <span style="font-size:15px;font-weight:900;color:#f97316;">${formatPriceShort(price)}</span>
            <a href="https://www.google.com/maps/search/?api=1&query=${safeLat},${safeLng}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:4px;background:rgba(249,115,22,0.12);border:1px solid rgba(249,115,22,0.35);padding:4px 9px;border-radius:8px;font-size:11px;font-weight:700;color:#ea580c;text-decoration:none;">
              Mở Google Maps ↗
            </a>
          </div>
        </div>
      `
      marker.bindPopup(popupHtml, { maxWidth: 280 }).openPopup()

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
  const switchMapStyle = useCallback(async (styleKey: 'googleStreet' | 'googleHybrid' | 'dark') => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return
    const L = (await import('leaflet')).default
    mapInstanceRef.current.removeLayer(tileLayerRef.current)

    const newTile = L.tileLayer(TILE_URLS[styleKey], {
      attribution: styleKey === 'dark' ? '©CartoDB' : '©Google Maps',
      subdomains: styleKey === 'dark' ? ['a', 'b', 'c', 'd'] : ['0', '1', '2', '3'],
      maxZoom: styleKey === 'dark' ? 19 : 20,
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
            onClick={() => switchMapStyle('googleStreet')}
            className={`px-2 py-1 rounded-lg transition-all ${
              mapStyle === 'googleStreet' ? 'bg-orange-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            Google
          </button>
          <button
            onClick={() => switchMapStyle('googleHybrid')}
            className={`px-2 py-1 rounded-lg transition-all ${
              mapStyle === 'googleHybrid' ? 'bg-orange-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
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
          <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md font-bold border border-indigo-200/50">
            🚇 Metro TOD Connected
          </span>
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
