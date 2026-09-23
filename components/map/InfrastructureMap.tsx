'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  Navigation,
  Train,
  Hospital,
  School,
  ShoppingBag,
  Trees,
  Maximize2,
  ExternalLink,
  Info,
  Compass,
  CheckCircle2,
  Sliders,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import {
  HANOI_GEO_POIS,
  HANOI_INFRASTRUCTURE_PROJECTS,
  HANOI_GEO_PLANNING_ZONES,
  haversineDistanceMeters,
  formatDistanceFriendly,
  estimateTravelTime,
  createGoogleMapsUrls,
  GeoPOIItem,
  InfrastructureProjectItem,
  PlanningPolygonZone,
} from '@/lib/data/hanoi-geo-poi';
import { fixLeafletIcons } from '@/lib/leaflet/fix-icons';

export interface FocusTarget {
  id?: string;
  name?: string;
  lat: number;
  lng: number;
  category?: string;
}

interface InfrastructureMapProps {
  propertyLat: number;
  propertyLng: number;
  propertyTitle: string;
  propertyAddress: string;
  propertyDistrict: string;
  focusTarget?: FocusTarget | null;
  onSelectItem?: (item: any) => void;
  height?: string;
  className?: string;
}

type MapTileStyle = 'googleStreet' | 'googleHybrid' | 'dark';
type CategoryFilter = 'all' | 'metro' | 'infrastructure' | 'hospital' | 'school' | 'mall' | 'park';

const MAP_TILES = {
  googleStreet: {
    label: 'Google Maps Đường Phố',
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: '© Google Maps',
  },
  googleHybrid: {
    label: 'Google Vệ Tinh (Hybrid)',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: '© Google Maps Satellite',
  },
  dark: {
    label: 'Bản Đồ Ban Đêm',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 19,
    attribution: '© CartoDB',
  },
};

export default function InfrastructureMap({
  propertyLat,
  propertyLng,
  propertyTitle,
  propertyAddress,
  propertyDistrict,
  focusTarget,
  onSelectItem,
  height = '480px',
  className = '',
}: InfrastructureMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const polygonsLayerRef = useRef<any>(null);
  const circlesLayerRef = useRef<any>(null);
  const markersMapRef = useRef<Map<string, any>>(new Map());

  const [isMapReady, setIsMapReady] = useState(false);
  const [mapStyle, setMapStyle] = useState<MapTileStyle>('googleStreet');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [showPlanningZones, setShowPlanningZones] = useState<boolean>(true);
  const [showRadiusCircles, setShowRadiusCircles] = useState<boolean>(true);
  const [planningOpacity, setPlanningOpacity] = useState<number>(0.24);
  const [selectedItemDetails, setSelectedItemDetails] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ── 1. KHỞI TẠO BẢN ĐỒ LEAFLET VỚI LỚP GOOGLE MAPS ──
  useEffect(() => {
    if (typeof window === 'undefined' || mapInstanceRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      fixLeafletIcons();

      if (!mapRef.current || mapInstanceRef.current || !isMounted) return;

      const map = L.map(mapRef.current, {
        center: [propertyLat, propertyLng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
      });

      // Lớp Google Maps Base Layer
      const baseTile = L.tileLayer(MAP_TILES.googleStreet.url, {
        subdomains: MAP_TILES.googleStreet.subdomains,
        maxZoom: MAP_TILES.googleStreet.maxZoom,
        attribution: MAP_TILES.googleStreet.attribution,
      }).addTo(map);
      tileLayerRef.current = baseTile;

      // Layer Groups
      const circlesGroup = L.layerGroup().addTo(map);
      const polygonsGroup = L.layerGroup().addTo(map);
      const markersGroup = L.layerGroup().addTo(map);

      circlesLayerRef.current = circlesGroup;
      polygonsLayerRef.current = polygonsGroup;
      markersLayerRef.current = markersGroup;

      mapInstanceRef.current = map;
      setIsMapReady(true);
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [propertyLat, propertyLng]);

  // ── 2. ĐỔI KIỂU BẢN ĐỒ (Google Maps Thường vs Vệ Tinh vs Tối) ──
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    const switchTile = async () => {
      const L = (await import('leaflet')).default;
      mapInstanceRef.current.removeLayer(tileLayerRef.current);

      const targetConfig = MAP_TILES[mapStyle];
      const newTile = L.tileLayer(targetConfig.url, {
        subdomains: targetConfig.subdomains,
        maxZoom: targetConfig.maxZoom,
        attribution: targetConfig.attribution,
      }).addTo(mapInstanceRef.current);

      // Đẩy lớp tile xuống dưới cùng
      newTile.bringToBack();
      tileLayerRef.current = newTile;
    };

    switchTile();
  }, [mapStyle]);

  // ── 3. VẼ VÒNG TRÒN BÁN KÍNH TỪ BẤT ĐỘNG SẢN (500m, 1.5km, 3km) ──
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !circlesLayerRef.current) return;

    const drawCircles = async () => {
      const L = (await import('leaflet')).default;
      circlesLayerRef.current.clearLayers();

      if (!showRadiusCircles) return;

      // Vòng tròn 500m (Đi bộ ~6 phút)
      L.circle([propertyLat, propertyLng], {
        radius: 500,
        color: '#f97316',
        weight: 1.5,
        dashArray: '5, 5',
        fillColor: '#f97316',
        fillOpacity: 0.06,
      })
        .addTo(circlesLayerRef.current)
        .bindTooltip('Bán kính đi bộ 500m (~6 phút)', {
          permanent: false,
          direction: 'top',
          className: 'px-2 py-1 text-[11px] font-bold rounded shadow',
        });

      // Vòng tròn 1500m (Xe máy ~4 phút)
      L.circle([propertyLat, propertyLng], {
        radius: 1500,
        color: '#3b82f6',
        weight: 1.2,
        dashArray: '6, 6',
        fillColor: '#3b82f6',
        fillOpacity: 0.03,
      })
        .addTo(circlesLayerRef.current)
        .bindTooltip('Bán kính 1.5km (~4 phút xe máy)', {
          permanent: false,
          direction: 'top',
          className: 'px-2 py-1 text-[11px] font-bold rounded shadow',
        });

      // Vòng tròn 3000m (Vùng tác động hạ tầng 3km)
      L.circle([propertyLat, propertyLng], {
        radius: 3000,
        color: '#8b5cf6',
        weight: 1,
        dashArray: '8, 8',
        fillColor: '#8b5cf6',
        fillOpacity: 0.015,
      })
        .addTo(circlesLayerRef.current)
        .bindTooltip('Vùng ảnh hưởng hạ tầng 3km', {
          permanent: false,
          direction: 'top',
          className: 'px-2 py-1 text-[11px] font-bold rounded shadow',
        });
    };

    drawCircles();
  }, [isMapReady, propertyLat, propertyLng, showRadiusCircles]);

  // ── 4. VẼ CÁC PHÂN KHU QUY HOẠCH ĐÔ THỊ (PLANNING POLYGONS) ──
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !polygonsLayerRef.current) return;

    const drawPlanningZones = async () => {
      const L = (await import('leaflet')).default;
      polygonsLayerRef.current.clearLayers();

      if (!showPlanningZones) return;

      HANOI_GEO_PLANNING_ZONES.forEach((zone) => {
        const polygon = L.polygon(zone.coordinates, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: planningOpacity,
          weight: 2,
          dashArray: '2, 4',
        }).addTo(polygonsLayerRef.current);

        const tooltipContent = `
          <div style="font-family: inherit; font-size: 11px; font-weight: 700;">
            <div style="color:${zone.color}; font-size:12px; margin-bottom:2px;">🏛️ ${zone.name}</div>
            <div style="color:#64748b; font-weight:600;">Mã: ${zone.code} · ${zone.typeLabel}</div>
            <div style="color:#0f172a; margin-top:2px;">Mật độ: ${zone.density} · Tầng cao: ${zone.maxHeight}</div>
          </div>
        `;

        polygon.bindTooltip(tooltipContent, {
          direction: 'center',
          className: 'planning-zone-tooltip shadow-md rounded-lg p-2 border border-slate-200',
        });

        polygon.on('click', () => {
          setSelectedItemDetails({
            isPlanningZone: true,
            title: zone.name,
            code: zone.code,
            type: zone.typeLabel,
            district: zone.district,
            density: zone.density,
            far: zone.floorAreaRatio,
            maxHeight: zone.maxHeight,
            description: zone.description,
            status: zone.status,
            color: zone.color,
          });
        });
      });
    };

    drawPlanningZones();
  }, [isMapReady, showPlanningZones, planningOpacity]);

  // ── 5. VẼ CÁC MARKER: BẤT ĐỘNG SẢN, DỰ ÁN HẠ TẦNG & TIỆN ÍCH GOOGLE MAPS ──
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !markersLayerRef.current) return;

    const drawMarkers = async () => {
      const L = (await import('leaflet')).default;
      markersLayerRef.current.clearLayers();
      markersMapRef.current.clear();

      // ── A. Marker Bất Động Sản Trung Tâm ──
      const propertyIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center" style="width: 48px; height: 48px;">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-60"></span>
            <div class="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-xl ring-4 ring-white dark:ring-slate-900 font-black text-sm transform transition-transform hover:scale-110">
              🏠
            </div>
            <div class="absolute -bottom-1.5 w-2 h-2 bg-orange-600 rotate-45"></div>
          </div>
        `,
        className: 'custom-property-center-pin',
        iconSize: [48, 48],
        iconAnchor: [24, 44],
        popupAnchor: [0, -44],
      });

      const propMarker = L.marker([propertyLat, propertyLng], {
        icon: propertyIcon,
        zIndexOffset: 1000,
      }).addTo(markersLayerRef.current);

      const propPopupContent = `
        <div style="font-family: inherit; min-width: 240px; padding: 2px;">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">
            <span style="background:#ffedd5; color:#c2410c; padding:2px 8px; border-radius:6px; font-size:10px; font-weight:800; text-transform:uppercase;">
              Bất động sản mục tiêu
            </span>
          </div>
          <h4 style="font-size:13px; font-weight:800; color:#0f172a; margin:0 0 4px 0; line-height:1.3;">
            ${propertyTitle}
          </h4>
          <p style="font-size:11px; color:#64748b; margin:0 0 10px 0;">
            📍 ${propertyAddress}
          </p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; padding-top:6px; border-top:1px solid #e2e8f0; font-size:10px;">
            <div>
              <span style="color:#94a3b8;">Quận:</span> <strong style="color:#0f172a;">${propertyDistrict}</strong>
            </div>
            <div>
              <span style="color:#94a3b8;">Toạ độ:</span> <strong style="color:#0f172a;">${propertyLat.toFixed(4)}, ${propertyLng.toFixed(4)}</strong>
            </div>
          </div>
          <div style="margin-top:10px; display:flex; gap:6px;">
            <a href="https://www.google.com/maps/search/?api=1&query=${propertyLat},${propertyLng}" target="_blank" rel="noopener noreferrer" style="flex:1; text-align:center; background:#f97316; color:white; padding:6px 8px; border-radius:8px; font-size:11px; font-weight:700; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:4px;">
              <span>Mở Google Maps ↗</span>
            </a>
          </div>
        </div>
      `;

      propMarker.bindPopup(propPopupContent, { className: 'custom-leaflet-popup' });
      markersMapRef.current.set('property', propMarker);

      // ── B. Marker Các Dự Án Hạ Tầng Trọng Điểm ──
      if (activeCategory === 'all' || activeCategory === 'infrastructure' || activeCategory === 'metro') {
        HANOI_INFRASTRUCTURE_PROJECTS.forEach((proj) => {
          const distMeters = haversineDistanceMeters(propertyLat, propertyLng, proj.lat, proj.lng);
          const distFriendly = formatDistanceFriendly(distMeters);
          const travel = estimateTravelTime(distMeters);
          const urls = createGoogleMapsUrls(proj.name, proj.lat, proj.lng, propertyLat, propertyLng);

          // Icon theo loại
          const isMetro = proj.type === 'metro';
          const pinColor = isMetro ? '#8b5cf6' : '#f59e0b';
          const pinEmoji = isMetro ? '🚇' : proj.type === 'bridge' ? '🌉' : '🛣️';

          const infraIcon = L.divIcon({
            html: `
              <div class="relative group cursor-pointer" style="transform: scale(0.95); transition: all 0.2s;">
                <div style="background:${pinColor}; color:white; padding:4px 8px; border-radius:12px; font-size:11px; font-weight:800; box-shadow:0 3px 10px rgba(0,0,0,0.25); white-space:nowrap; display:flex; align-items:center; gap:4px; border:2px solid white;">
                  <span>${pinEmoji}</span>
                  <span style="max-width:120px; overflow:hidden; text-overflow:ellipsis;">${proj.name.split('(')[0].trim()}</span>
                  <span style="background:rgba(255,255,255,0.25); padding:1px 5px; border-radius:8px; font-size:10px;">${distFriendly}</span>
                </div>
                <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid ${pinColor}; margin:-1px auto 0 auto;"></div>
              </div>
            `,
            className: 'custom-infra-pin',
            iconSize: [160, 32],
            iconAnchor: [80, 32],
            popupAnchor: [0, -32],
          });

          const marker = L.marker([proj.lat, proj.lng], { icon: infraIcon }).addTo(
            markersLayerRef.current
          );

          const statusBadge =
            proj.status === 'completed'
              ? '<span style="background:#dcfce7; color:#15803d; padding:2px 6px; border-radius:6px; font-size:10px; font-weight:800;">ĐÃ HOÀN THÀNH</span>'
              : proj.status === 'construction'
              ? '<span style="background:#fef3c7; color:#b45309; padding:2px 6px; border-radius:6px; font-size:10px; font-weight:800;">ĐANG THI CÔNG</span>'
              : '<span style="background:#dbeafe; color:#1d4ed8; padding:2px 6px; border-radius:6px; font-size:10px; font-weight:800;">QUY HOẠCH</span>';

          const popupContent = `
            <div style="font-family: inherit; min-width: 250px; padding: 2px;">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                ${statusBadge}
                <span style="font-size:11px; font-weight:700; color:#64748b;">Năm ${proj.year}</span>
              </div>
              <h4 style="font-size:13px; font-weight:800; color:#0f172a; margin:0 0 4px 0; line-height:1.3;">
                ${proj.name}
              </h4>
              <p style="font-size:11px; color:#475569; margin:0 0 8px 0; line-height:1.4;">
                ${proj.description}
              </p>
              
              <div style="background:#f8fafc; border-radius:8px; padding:6px 8px; margin-bottom:8px; border:1px solid #e2e8f0; font-size:11px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                  <span style="color:#64748b;">Khoảng cách tới BĐS:</span>
                  <strong style="color:#f97316;">${distFriendly}</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span style="color:#64748b;">Thời gian di chuyển:</span>
                  <strong style="color:#0f172a;">${travel.motorbikeText}</strong>
                </div>
              </div>

              <div style="margin-bottom:10px; font-size:11px; color:#059669; font-weight:600;">
                📈 ${proj.priceImpactSummary}
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                <a href="${urls.searchUrl}" target="_blank" rel="noopener noreferrer" style="text-align:center; background:#f1f5f9; color:#334155; padding:6px 8px; border-radius:8px; font-size:10px; font-weight:700; text-decoration:none;">
                  📍 Mở Google Maps
                </a>
                <a href="${urls.directionsUrl}" target="_blank" rel="noopener noreferrer" style="text-align:center; background:#2563eb; color:white; padding:6px 8px; border-radius:8px; font-size:10px; font-weight:700; text-decoration:none;">
                  🚗 Chỉ đường Google
                </a>
              </div>
            </div>
          `;

          marker.bindPopup(popupContent, { className: 'custom-leaflet-popup' });
          marker.on('click', () => {
            onSelectItem?.({ ...proj, distFriendly, travel, urls });
          });

          markersMapRef.current.set(proj.id, marker);
        });
      }

      // ── C. Marker Các Tiện Ích Lân Cận (Bệnh viện, Trường học, TTTM, Công viên, Ga Metro) ──
      const filteredPois = HANOI_GEO_POIS.filter((poi) => {
        if (activeCategory === 'all') return true;
        if (activeCategory === 'metro') return poi.category === 'metro';
        if (activeCategory === 'hospital') return poi.category === 'hospital';
        if (activeCategory === 'school') return poi.category === 'school';
        if (activeCategory === 'mall') return poi.category === 'mall';
        if (activeCategory === 'park') return poi.category === 'park';
        return true;
      });

      filteredPois.forEach((poi) => {
        const distMeters = haversineDistanceMeters(propertyLat, propertyLng, poi.lat, poi.lng);
        const distFriendly = formatDistanceFriendly(distMeters);
        const travel = estimateTravelTime(distMeters);
        const urls = createGoogleMapsUrls(poi.name, poi.lat, poi.lng, propertyLat, propertyLng);

        let categoryColor = '#3b82f6';
        let categoryEmoji = '📍';

        switch (poi.category) {
          case 'metro':
            categoryColor = '#8b5cf6';
            categoryEmoji = '🚇';
            break;
          case 'hospital':
            categoryColor = '#ef4444';
            categoryEmoji = '🏥';
            break;
          case 'school':
            categoryColor = '#2563eb';
            categoryEmoji = '🎓';
            break;
          case 'mall':
            categoryColor = '#ec4899';
            categoryEmoji = '🛍️';
            break;
          case 'park':
            categoryColor = '#10b981';
            categoryEmoji = '🌳';
            break;
        }

        const poiIcon = L.divIcon({
          html: `
            <div class="relative group cursor-pointer" style="transform: scale(0.9);">
              <div style="background:${categoryColor}; color:white; padding:3px 7px; border-radius:10px; font-size:10px; font-weight:800; box-shadow:0 3px 8px rgba(0,0,0,0.25); white-space:nowrap; display:flex; align-items:center; gap:3px; border:2px solid white;">
                <span>${categoryEmoji}</span>
                <span style="max-width:100px; overflow:hidden; text-overflow:ellipsis;">${poi.name.split('(')[0].trim()}</span>
                <span style="background:rgba(255,255,255,0.25); padding:1px 4px; border-radius:6px; font-size:9px;">${distFriendly}</span>
              </div>
              <div style="width:0; height:0; border-left:4px solid transparent; border-right:4px solid transparent; border-top:5px solid ${categoryColor}; margin:-1px auto 0 auto;"></div>
            </div>
          `,
          className: 'custom-poi-pin',
          iconSize: [140, 28],
          iconAnchor: [70, 28],
          popupAnchor: [0, -28],
        });

        const marker = L.marker([poi.lat, poi.lng], { icon: poiIcon }).addTo(markersLayerRef.current);

        const popupContent = `
          <div style="font-family: inherit; min-width: 240px; padding: 2px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
              <span style="background:#f1f5f9; color:#475569; padding:2px 6px; border-radius:6px; font-size:10px; font-weight:800; text-transform:uppercase;">
                ${poi.categoryLabel}
              </span>
              ${poi.rating ? `<span style="font-size:11px; font-weight:800; color:#f59e0b;">⭐ ${poi.rating}</span>` : ''}
            </div>
            <h4 style="font-size:13px; font-weight:800; color:#0f172a; margin:0 0 4px 0; line-height:1.3;">
              ${poi.name}
            </h4>
            <p style="font-size:11px; color:#64748b; margin:0 0 8px 0; line-height:1.3;">
              📍 ${poi.address}
            </p>

            <div style="background:#f8fafc; border-radius:8px; padding:6px 8px; margin-bottom:8px; border:1px solid #e2e8f0; font-size:11px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                <span style="color:#64748b;">Khoảng cách tới BĐS:</span>
                <strong style="color:#f97316;">${distFriendly}</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span style="color:#64748b;">Thời gian:</span>
                <strong style="color:#0f172a;">${travel.walkingText}</strong>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
              <a href="${urls.searchUrl}" target="_blank" rel="noopener noreferrer" style="text-align:center; background:#f1f5f9; color:#334155; padding:6px 8px; border-radius:8px; font-size:10px; font-weight:700; text-decoration:none;">
                📍 Mở Google Maps
              </a>
              <a href="${urls.directionsUrl}" target="_blank" rel="noopener noreferrer" style="text-align:center; background:#2563eb; color:white; padding:6px 8px; border-radius:8px; font-size:10px; font-weight:700; text-decoration:none;">
                🚗 Chỉ đường Google
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, { className: 'custom-leaflet-popup' });
        marker.on('click', () => {
          onSelectItem?.({ ...poi, distFriendly, travel, urls });
        });

        markersMapRef.current.set(poi.id, marker);
      });
    };

    drawMarkers();
  }, [
    isMapReady,
    propertyLat,
    propertyLng,
    propertyTitle,
    propertyAddress,
    propertyDistrict,
    activeCategory,
    onSelectItem,
  ]);

  // ── 6. ĐỒNG BỘ FOCUS TARGET TỪ BÊN NGOÀI (KHI USER CLICK VÀO TIMELINE HOẶC TIỆN ÍCH) ──
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !focusTarget) return;

    const map = mapInstanceRef.current;
    map.flyTo([focusTarget.lat, focusTarget.lng], 16, {
      duration: 1.2,
      easeLinearity: 0.25,
    });

    if (focusTarget.id && markersMapRef.current.has(focusTarget.id)) {
      const targetMarker = markersMapRef.current.get(focusTarget.id);
      targetMarker.openPopup();
    }
  }, [focusTarget, isMapReady]);

  // Điều khiển Zoom & Re-center
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo([propertyLat, propertyLng], 15, { duration: 1 });
    const propMarker = markersMapRef.current.get('property');
    propMarker?.openPopup();
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-border shadow-sm bg-slate-900 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      } ${className}`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* ── BẢN ĐỒ LEAFLET CHÍNH ── */}
      <div ref={mapRef} className="w-full h-full z-0" />

      {/* ── THANH CÔNG CỤ BỘ LỌC DANH MỤC TRÊN BẢN ĐỒ ── */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-md pointer-events-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Tất cả tiện ích
          </button>

          <button
            onClick={() => setActiveCategory('metro')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all whitespace-nowrap ${
              activeCategory === 'metro'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Train className="h-3 w-3" />
            <span>Ga Metro</span>
          </button>

          <button
            onClick={() => setActiveCategory('infrastructure')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all whitespace-nowrap ${
              activeCategory === 'infrastructure'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Navigation className="h-3 w-3" />
            <span>Dự án hạ tầng</span>
          </button>

          <button
            onClick={() => setActiveCategory('hospital')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all whitespace-nowrap ${
              activeCategory === 'hospital'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Hospital className="h-3 w-3" />
            <span>Bệnh viện</span>
          </button>

          <button
            onClick={() => setActiveCategory('school')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all whitespace-nowrap ${
              activeCategory === 'school'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <School className="h-3 w-3" />
            <span>Trường học</span>
          </button>

          <button
            onClick={() => setActiveCategory('mall')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all whitespace-nowrap ${
              activeCategory === 'mall'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="h-3 w-3" />
            <span>TTTM</span>
          </button>

          <button
            onClick={() => setActiveCategory('park')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all whitespace-nowrap ${
              activeCategory === 'park'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Trees className="h-3 w-3" />
            <span>Công viên</span>
          </button>
        </div>

        {/* Map Styles & Layers Controls */}
        <div className="flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-md pointer-events-auto">
          {/* Kiểu bản đồ */}
          <select
            value={mapStyle}
            onChange={(e) => setMapStyle(e.target.value as MapTileStyle)}
            className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-200 border-none outline-none cursor-pointer"
          >
            <option value="googleStreet">☀️ Google Maps</option>
            <option value="googleHybrid">🛰️ Vệ tinh Google</option>
            <option value="dark">🌙 Ban đêm</option>
          </select>

          {/* Toggle Lớp Quy Hoạch */}
          <button
            onClick={() => setShowPlanningZones(!showPlanningZones)}
            title="Bật/Tắt Lớp Quy Hoạch Phân Khu"
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
              showPlanningZones
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>Quy hoạch</span>
          </button>

          {/* Toggle Bán Kính */}
          <button
            onClick={() => setShowRadiusCircles(!showRadiusCircles)}
            title="Bật/Tắt Vòng Bán Kính 500m - 1.5km - 3km"
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
              showRadiusCircles
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            <Compass className="h-3 w-3" />
            <span>Bán kính</span>
          </button>

          {/* Nút Toàn màn hình */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Phóng to toàn màn hình"
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

      {/* ── CÁC PHÍM ĐIỀU KHIỂN GÓC DƯỚI BẢN ĐỒ ── */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5">
        <button
          onClick={handleRecenter}
          title="Đưa về tâm Bất Động Sản"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-md border border-slate-200 dark:border-slate-800 text-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-all font-bold"
        >
          🏠
        </button>
        <button
          onClick={handleZoomIn}
          title="Phóng to"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold text-xs"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Thu nhỏ"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold text-xs"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
      </div>

      {/* ── CHÚ THÍCH GOOGLE MAPS & BÁN KÍNH DƯỚI CÙNG BÊN TRÁI ── */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-md text-[10px] space-y-1.5 max-w-[280px]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
          <span className="font-extrabold text-slate-800 dark:text-slate-200 truncate">
            {propertyAddress}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-semibold border-t border-slate-100 dark:border-slate-800 pt-1">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span> Đi bộ 500m
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span> Xe máy 1.5km
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span> Hạ tầng 3km
          </span>
        </div>
      </div>

      {/* ── MODAL CHI TIẾT PHÂN KHU QUY HOẠCH KHI CLICK POLYGON ── */}
      <AnimatePresence>
        {selectedItemDetails && selectedItemDetails.isPlanningZone && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-20 bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <span
                className="px-2 py-0.5 rounded text-[10px] font-black uppercase text-white"
                style={{ backgroundColor: selectedItemDetails.color }}
              >
                {selectedItemDetails.code}
              </span>
              <button
                onClick={() => setSelectedItemDetails(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
              {selectedItemDetails.title}
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              {selectedItemDetails.description}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
              <div>
                <span className="text-slate-400">Mật độ xây dựng:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{selectedItemDetails.density}</p>
              </div>
              <div>
                <span className="text-slate-400">Hệ số SDĐ:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{selectedItemDetails.far}</p>
              </div>
              <div>
                <span className="text-slate-400">Tầng cao khống chế:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{selectedItemDetails.maxHeight}</p>
              </div>
              <div>
                <span className="text-slate-400">Tình trạng:</span>
                <p className="font-bold text-emerald-600">{selectedItemDetails.status}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
