'use client'
import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenLine, X, RotateCcw, Search, Maximize2 } from 'lucide-react'

interface Point { x: number; y: number }
interface LatLng { lat: number; lng: number }

export interface LassoSearchProps {
  listings: Array<{ id: string; lat: number; lng: number; title: string; price: number }>
  mapBounds?: { north: number; south: number; east: number; west: number }
  containerWidth?: number
  containerHeight?: number
  onFilteredListings: (ids: string[]) => void
}

function pointInPolygon(point: LatLng, polygon: LatLng[]): boolean {
  let inside = false
  const { lat: x, lng: y } = point
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].lng
    const xj = polygon[j].lat, yj = polygon[j].lng
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside
    }
  }
  return inside
}

// Default Hanoi viewport bounds
const DEFAULT_BOUNDS = {
  north: 21.08,
  south: 20.96,
  east: 105.93,
  west: 105.72
}

export default function LassoSearch({
  listings,
  mapBounds = DEFAULT_BOUNDS,
  containerWidth = 800,
  containerHeight = 600,
  onFilteredListings,
}: LassoSearchProps) {
  const [mode, setMode] = useState<'idle' | 'drawing' | 'drawn'>('idle')
  const [points, setPoints] = useState<Point[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [foundCount, setFoundCount] = useState(0)
  const [foundPriceRange, setFoundPriceRange] = useState<string>('')
  const svgRef = useRef<SVGSVGElement>(null)

  // Convert pixel point to lat/lng
  const pixelToLatLng = useCallback((point: Point): LatLng => {
    const currentBounds = mapBounds || DEFAULT_BOUNDS
    const width = containerWidth || 800
    const height = containerHeight || 600
    const lat = currentBounds.north - (point.y / height) * (currentBounds.north - currentBounds.south)
    const lng = currentBounds.west + (point.x / width) * (currentBounds.east - currentBounds.west)
    return { lat, lng }
  }, [mapBounds, containerWidth, containerHeight])

  const calculatePriceRange = (foundListings: typeof listings) => {
    if (foundListings.length === 0) return ''
    const prices = foundListings.map(l => l.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const format = (p: number) => {
      if (p >= 1e9) return `${(p / 1e9).toFixed(1)} tỷ`
      return `${(p / 1e6).toFixed(0)} tr`
    }
    return min === max ? format(min) : `${format(min)} — ${format(max)}`
  }

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (mode !== 'drawing') return
    const rect = svgRef.current!.getBoundingClientRect()
    setIsDrawing(true)
    setPoints([{ x: e.clientX - rect.left, y: e.clientY - rect.top }])
  }, [mode])

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || mode !== 'drawing') return
    const rect = svgRef.current!.getBoundingClientRect()
    setPoints(prev => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top }])
  }, [isDrawing, mode])

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return
    setIsDrawing(false)
    if (points.length < 5) { setPoints([]); return }
    
    setMode('drawn')

    // Convert to lat/lng and find listings in polygon
    const polygon = points.map(pixelToLatLng)
    const found = listings.filter(l => l.lat && l.lng && pointInPolygon({ lat: l.lat, lng: l.lng }, polygon))
    setFoundCount(found.length)
    setFoundPriceRange(calculatePriceRange(found))
    onFilteredListings(found.map(l => l.id))
  }, [isDrawing, points, listings, pixelToLatLng, onFilteredListings])

  const handleReset = useCallback(() => {
    setMode('idle')
    setPoints([])
    setFoundCount(0)
    setFoundPriceRange('')
    onFilteredListings([])
  }, [onFilteredListings])

  const pathData = points.length > 0
    ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`
    : ''

  return (
    <>
      {/* ── SVG Drawing Layer (overlay on map) ── */}
      {mode !== 'idle' && (
        <svg
          ref={svgRef}
          className={`absolute inset-0 z-[400] w-full h-full ${
            mode === 'drawing' ? 'cursor-crosshair' : 'pointer-events-none'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          // Touch support
          onTouchStart={e => {
            const touch = e.touches[0]
            const rect = svgRef.current!.getBoundingClientRect()
            setIsDrawing(true)
            setPoints([{ x: touch.clientX - rect.left, y: touch.clientY - rect.top }])
          }}
          onTouchMove={e => {
            if (!isDrawing) return
            const touch = e.touches[0]
            const rect = svgRef.current!.getBoundingClientRect()
            setPoints(prev => [...prev, { 
              x: touch.clientX - rect.left, 
              y: touch.clientY - rect.top 
            }])
          }}
          onTouchEnd={handleMouseUp}
        >
          {/* Drawing guide hint */}
          {mode === 'drawing' && points.length === 0 && (
            <text x="50%" y="50%" textAnchor="middle" 
                  fill="rgba(249,115,22,0.85)" fontSize="16" fontWeight="600"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}>
              ✍️ Giữ và vẽ vùng tìm kiếm trên bản đồ
            </text>
          )}

          {/* Live drawing path */}
          {points.length > 1 && (
            <>
              {/* Fill */}
              <path
                d={pathData}
                fill="rgba(249, 115, 22, 0.18)"
                stroke="none"
              />
              {/* Animated stroke */}
              <path
                d={pathData}
                fill="none"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={mode === 'drawn' ? 'none' : '8,4'}
              />
            </>
          )}

          {/* Start point indicator */}
          {points.length > 0 && (
            <circle
              cx={points[0].x}
              cy={points[0].y}
              r={6}
              fill="#f97316"
              stroke="white"
              strokeWidth={2}
            />
          )}
        </svg>
      )}

      {/* ── Control Button (inside map, top) ── */}
      <div className="absolute top-16 right-4 z-[500] flex flex-col gap-2">
        {mode === 'idle' && (
          <motion.button
            onClick={() => setMode('drawing')}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 
                       rounded-xl px-3 py-2 flex items-center gap-2 
                       text-navy font-medium text-sm hover:border-orange-300 
                       hover:text-orange-500 transition-all group"
          >
            <PenLine size={16} className="text-orange-500 group-hover:scale-110 transition-transform" />
            <span>Vẽ vùng tìm kiếm</span>
          </motion.button>
        )}

        {mode === 'drawing' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-orange-500 text-white rounded-xl px-3.5 py-2 
                       shadow-lg shadow-orange-500/30 text-sm font-medium
                       flex items-center gap-2"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-2 h-2 bg-white rounded-full"
            />
            <span>Đang vẽ... (thả chuột để hoàn tất)</span>
          </motion.div>
        )}

        {mode === 'drawing' && (
          <motion.button
            onClick={handleReset}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/95 backdrop-blur-sm border border-gray-200 
                       rounded-xl px-3 py-2 text-gray-600 text-sm 
                       flex items-center gap-2 shadow-sm hover:text-red-500 
                       hover:border-red-300 transition-all"
          >
            <X size={14} /> Hủy
          </motion.button>
        )}
      </div>

      {/* ── Results Panel (after drawing) ── */}
      <AnimatePresence>
        {mode === 'drawn' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute top-16 right-4 z-[500] bg-white/95 backdrop-blur-sm 
                       shadow-xl rounded-2xl border border-gray-200 p-4 min-w-[240px]"
          >
            {/* Result header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 font-medium">Kết quả tìm kiếm</p>
                <p className="text-2xl font-bold text-navy">{foundCount}</p>
                <p className="text-xs text-gray-500">bất động sản trong vùng vẽ</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Search size={18} className="text-orange-500" />
              </div>
            </div>

            {foundCount > 0 ? (
              <>
                {/* Price range if listings found */}
                <div className="bg-orange-50 rounded-xl p-3 mb-3 text-xs">
                  <p className="text-gray-500">Khoảng giá trong vùng</p>
                  <p className="text-orange-600 font-bold mt-0.5">
                    {foundPriceRange || 'Đang cập nhật'}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white 
                             rounded-xl py-2.5 text-sm font-medium transition-colors
                             flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
                >
                  <Maximize2 size={14} />
                  Xem {foundCount} BĐS đã lọc
                </motion.button>
              </>
            ) : (
              <div className="text-center py-2">
                <p className="text-gray-400 text-xs mb-2">
                  Không tìm thấy BĐS trong vùng này
                </p>
              </div>
            )}

            {/* Reset & Redraw */}
            <div className="flex gap-2 mt-3">
              <motion.button
                onClick={() => { setMode('drawing'); setPoints([]) }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-2 rounded-xl border border-gray-200 
                           text-gray-600 text-xs flex items-center justify-center gap-1
                           hover:border-orange-300 hover:text-orange-500 transition-all font-medium"
              >
                <RotateCcw size={12} /> Vẽ lại
              </motion.button>
              <motion.button
                onClick={handleReset}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-2 rounded-xl border border-gray-200 
                           text-gray-600 text-xs flex items-center justify-center gap-1
                           hover:border-red-300 hover:text-red-500 transition-all font-medium"
              >
                <X size={12} /> Xóa vùng
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Radius Search Preset Buttons ── */}
      <AnimatePresence>
        {mode === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[500]
                       bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl 
                       border border-gray-200 px-4 py-3"
          >
            <p className="text-xs text-gray-500 text-center mb-2 font-medium">
              🎯 Tìm kiếm nhanh theo bán kính trung tâm
            </p>
            <div className="flex gap-2">
              {[
                { label: '500m', radius: 500, icon: '🚶' },
                { label: '1km', radius: 1000, icon: '🚲' },
                { label: '2km', radius: 2000, icon: '🚗' },
                { label: '5km', radius: 5000, icon: '🏙️' },
              ].map(option => (
                <motion.button
                  key={option.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const centerLat = (mapBounds.north + mapBounds.south) / 2
                    const centerLng = (mapBounds.east + mapBounds.west) / 2
                    
                    const found = listings.filter(l => {
                      if (!l.lat || !l.lng) return false
                      const R = 6371000
                      const dLat = (l.lat - centerLat) * Math.PI / 180
                      const dLng = (l.lng - centerLng) * Math.PI / 180
                      const a = Math.sin(dLat/2)**2 + 
                                Math.cos(centerLat*Math.PI/180) * 
                                Math.cos(l.lat*Math.PI/180) * 
                                Math.sin(dLng/2)**2
                      const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
                      return distance <= option.radius
                    })
                    
                    setFoundCount(found.length)
                    setFoundPriceRange(calculatePriceRange(found))
                    onFilteredListings(found.map(l => l.id))
                    setMode('drawn')
                  }}
                  className="flex flex-col items-center px-3 py-2 rounded-xl 
                             bg-gray-50 hover:bg-orange-50 border border-gray-200 
                             hover:border-orange-300 transition-all text-xs cursor-pointer"
                >
                  <span className="text-base">{option.icon}</span>
                  <span className="font-medium text-navy mt-0.5">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
