'use client'
import { useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Satellite, Map, Eye, EyeOff } from 'lucide-react'
import L from 'leaflet'
import LassoSearch from './LassoSearch'

// Fix Leaflet default marker icon for Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
  })
}

// Dynamically import Leaflet components (no SSR)
const MapContainer = dynamic(
  () => import('react-leaflet').then(m => m.MapContainer), 
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then(m => m.TileLayer), 
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then(m => m.Marker), 
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then(m => m.Popup), 
  { ssr: false }
)
const Polygon = dynamic(
  () => import('react-leaflet').then(m => m.Polygon), 
  { ssr: false }
)
const Circle = dynamic(
  () => import('react-leaflet').then(m => m.Circle), 
  { ssr: false }
)

// Map tile configurations
const MAP_TILES = {
  vector: {
    id: 'vector',
    label: 'Bản đồ',
    icon: Map,
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '©OpenStreetMap ©CartoDB',
    maxZoom: 19,
    description: 'Bản đồ vector tối giản'
  },
  satellite: {
    id: 'satellite', 
    label: 'Vệ tinh',
    icon: Satellite,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '©Esri ©DigitalGlobe',
    maxZoom: 19,
    description: 'Ảnh vệ tinh thực tế'
  },
  hybrid: {
    id: 'hybrid',
    label: 'Hybrid',
    icon: Layers,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    labelUrl: 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
    attribution: '©Esri ©CartoDB',
    maxZoom: 19,
    description: 'Vệ tinh + tên đường'
  },
  street: {
    id: 'street',
    label: 'Đường phố',
    icon: Map,
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '©OpenStreetMap contributors',
    maxZoom: 19,
    description: 'Bản đồ đường phố'
  }
}

// Planning zone overlay data (mock GeoJSON polygons)
const PLANNING_ZONES = [
  {
    id: 'zone1',
    name: 'Đất ở đô thị - Đống Đa Trung tâm',
    type: 'residential',
    color: '#22c55e',
    opacity: 0.35,
    positions: [
      [21.0285, 105.8412], [21.0310, 105.8450],
      [21.0290, 105.8480], [21.0255, 105.8445],
    ] as [number, number][]
  },
  {
    id: 'zone2',
    name: 'Đất thương mại dịch vụ - Hàng Bài',
    type: 'commercial',
    color: '#ef4444',
    opacity: 0.35,
    positions: [
      [21.0340, 105.8510], [21.0360, 105.8540],
      [21.0330, 105.8565], [21.0305, 105.8535],
    ] as [number, number][]
  },
  {
    id: 'zone3',
    name: 'Hành lang giao thông - Metro Line 2',
    type: 'transport',
    color: '#f59e0b',
    opacity: 0.4,
    positions: [
      [21.0210, 105.8350], [21.0220, 105.8400],
      [21.0380, 105.8560], [21.0370, 105.8510],
    ] as [number, number][]
  },
  {
    id: 'zone4',
    name: 'Đất công cộng - Hồ Tây',
    type: 'public',
    color: '#3b82f6',
    opacity: 0.3,
    positions: [
      [21.0480, 105.8180], [21.0520, 105.8260],
      [21.0490, 105.8310], [21.0430, 105.8220],
    ] as [number, number][]
  },
]

const LAYER_CONTROLS = [
  { id: 'planning', label: 'Quy hoạch 2030', color: 'text-green-400', default: true },
  { id: 'projects', label: 'Dự án thi công', color: 'text-yellow-400', default: true },
  { id: 'amenities', label: 'Tiện ích công cộng', color: 'text-blue-400', default: false },
  { id: 'heatmap', label: 'Mật độ giá', color: 'text-red-400', default: false },
]

export interface HybridMapListing {
  id: string
  title: string
  price: number
  area: number
  lat: number
  lng: number
  type: string
  district: string
  address?: string
  images?: string[]
}

interface HybridMapProps {
  listings: HybridMapListing[]
  onListingClick?: (listingId: string) => void
  selectedListingId?: string | null
}

export default function HybridMap({ 
  listings, 
  onListingClick,
  selectedListingId
}: HybridMapProps) {
  const [lassoFilteredIds, setLassoFilteredIds] = useState<string[]>([])
  const [mapMode, setMapMode] = useState<keyof typeof MAP_TILES>('vector')
  const [showModePanel, setShowModePanel] = useState(false)
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>(
    Object.fromEntries(LAYER_CONTROLS.map(l => [l.id, l.default]))
  )
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const [opacity, setOpacity] = useState(0.35)

  const displayedListings = lassoFilteredIds.length > 0
    ? listings.filter(l => lassoFilteredIds.includes(l.id))
    : listings

  const toggleLayer = useCallback((layerId: string) => {
    setActiveLayers(prev => ({ ...prev, [layerId]: !prev[layerId] }))
  }, [])

  const formatPrice = (price: number) => {
    if (price >= 1000000000) return `${(price / 1000000000).toFixed(1)} tỷ`
    return `${(price / 1000000).toFixed(0)} tr`
  }

  const currentTile = MAP_TILES[mapMode]

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      
      {/* ── Leaflet Map ── */}
      <MapContainer
        center={[21.0285, 105.8542]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        {/* Base tile layer */}
        <TileLayer
          key={`base-${mapMode}`}
          url={currentTile.url}
          attribution={currentTile.attribution}
          maxZoom={currentTile.maxZoom}
        />
        
        {/* Label overlay for hybrid mode */}
        {mapMode === 'hybrid' && MAP_TILES.hybrid.labelUrl && (
          <TileLayer
            key="hybrid-labels"
            url={MAP_TILES.hybrid.labelUrl}
            attribution=""
          />
        )}

        {/* Planning Zone Polygons */}
        {activeLayers.planning && PLANNING_ZONES.map(zone => (
          <Polygon
            key={zone.id}
            positions={zone.positions}
            pathOptions={{
              color: zone.color,
              fillColor: zone.color,
              fillOpacity: hoveredZone === zone.id ? opacity + 0.2 : opacity,
              weight: hoveredZone === zone.id ? 3 : 1.5,
              opacity: 0.9
            }}
            eventHandlers={{
              mouseover: () => setHoveredZone(zone.id),
              mouseout: () => setHoveredZone(null)
            }}
          >
            <Popup>
              <div className="p-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" 
                       style={{ backgroundColor: zone.color }} />
                  <span className="font-bold text-sm text-navy">
                    {zone.name}
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>📅 Quy hoạch 2030</p>
                  <p>✅ Cho phép xây dựng</p>
                </div>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Project Impact Circles */}
        {activeLayers.projects && (
          <>
            <Circle
              center={[21.0350, 105.8470]}
              radius={500}
              pathOptions={{ 
                color: '#f59e0b', fillColor: '#f59e0b', 
                fillOpacity: 0.1, weight: 2, dashArray: '6,4'
              }}
            >
              <Popup>🚇 Metro Line 2 · Đang thi công · 2027</Popup>
            </Circle>
            <Circle
              center={[21.0290, 105.8550]}
              radius={800}
              pathOptions={{ 
                color: '#3b82f6', fillColor: '#3b82f6',
                fillOpacity: 0.08, weight: 2, dashArray: '6,4'
              }}
            >
              <Popup>🏥 Bệnh viện Ung Bướu mới · 2026</Popup>
            </Circle>
          </>
        )}

        {/* Listing Markers */}
        {displayedListings.filter(l => l.lat && l.lng).map(listing => (
          <Marker
            key={listing.id}
            position={[listing.lat, listing.lng]}
            eventHandlers={{
              click: () => onListingClick?.(listing.id)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <p className="font-bold text-navy text-sm line-clamp-1">
                  {listing.title}
                </p>
                <p className="text-orange-500 font-bold text-lg">
                  {formatPrice(listing.price)}
                </p>
                <div className="flex gap-3 text-xs text-gray-500 mb-3">
                  <span>📐 {listing.area}m²</span>
                  <span>📍 {listing.district}</span>
                </div>
                <a 
                  href={`/listings/${listing.id}`}
                  className="block w-full bg-orange-500 text-white text-xs 
                             text-center py-2 rounded-lg font-medium 
                             hover:bg-orange-600 transition-colors"
                >
                  Xem chi tiết →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* ── MAP MODE SWITCHER (top-right) ── */}
      <div className="absolute top-4 right-4 z-[500] flex flex-col gap-2">
        <motion.button
          onClick={() => setShowModePanel(!showModePanel)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white/95 backdrop-blur-sm shadow-lg rounded-xl 
                     px-3 py-2 flex items-center gap-2 border border-gray-200
                     text-navy font-medium text-sm"
        >
          {(() => {
            const Icon = currentTile.icon
            return <Icon size={16} className="text-orange-500" />
          })()}
          <span>{currentTile.label}</span>
          <motion.span
            animate={{ rotate: showModePanel ? 180 : 0 }}
            className="text-gray-400 text-xs"
          >
            ▼
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {showModePanel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white/95 backdrop-blur-sm shadow-xl rounded-xl 
                         border border-gray-200 overflow-hidden w-64"
            >
              {/* Tile mode selection */}
              <div className="p-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Loại bản đồ
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(MAP_TILES).map(tile => {
                    const Icon = tile.icon
                    return (
                      <motion.button
                        key={tile.id}
                        onClick={() => {
                          setMapMode(tile.id as keyof typeof MAP_TILES)
                          setShowModePanel(false)
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg 
                                   text-xs font-medium transition-all ${
                          mapMode === tile.id
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon size={18} />
                        <span>{tile.label}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Layer controls */}
              <div className="p-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Lớp hiển thị
                </p>
                <div className="space-y-2">
                  {LAYER_CONTROLS.map(layer => (
                    <label
                      key={layer.id}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className={`text-xs font-medium ${layer.color}`}>
                        {layer.label}
                      </span>
                      <motion.button
                        type="button"
                        onClick={() => toggleLayer(layer.id)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          activeLayers[layer.id] ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                      >
                        <motion.div
                          animate={{ x: activeLayers[layer.id] ? 20 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </motion.button>
                    </label>
                  ))}
                </div>
              </div>

              {/* Opacity slider */}
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Độ mờ lớp phủ
                </p>
                <input
                  type="range"
                  min="0.1"
                  max="0.7"
                  step="0.05"
                  value={opacity}
                  onChange={e => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Trong</span>
                  <span>{Math.round(opacity * 100)}%</span>
                  <span>Đục</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── PLANNING LEGEND (bottom-left) ── */}
      <AnimatePresence>
        {activeLayers.planning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 z-[500] bg-white/95 
                       backdrop-blur-sm shadow-lg rounded-xl p-3 
                       border border-gray-200"
          >
            <p className="text-xs font-bold text-navy mb-2">Chú giải quy hoạch</p>
            <div className="space-y-1.5">
              {[
                { color: '#22c55e', label: 'Đất ở đô thị (ODT)' },
                { color: '#ef4444', label: 'Thương mại (TMD)' },
                { color: '#f59e0b', label: 'Giao thông (GT)' },
                { color: '#3b82f6', label: 'Công cộng (CCC)' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm opacity-80"
                       style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAP MODE INDICATOR badge (bottom-right) ── */}
      <motion.div
        key={mapMode}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute bottom-4 right-4 z-[500] bg-black/60 
                   backdrop-blur-sm text-white text-xs px-2.5 py-1 
                   rounded-lg flex items-center gap-1.5"
      >
        {mapMode === 'satellite' && '🛰️'}
        {mapMode === 'vector' && '🗺️'}
        {mapMode === 'hybrid' && '🌍'}
        {mapMode === 'street' && '🚗'}
        <span>{currentTile.description}</span>
      </motion.div>

      {/* ── LASSO / POLYGON FREEHAND SEARCH OVERLAY ── */}
      <LassoSearch
        listings={listings}
        onFilteredListings={(ids) => setLassoFilteredIds(ids)}
      />
    </div>
  )
}
