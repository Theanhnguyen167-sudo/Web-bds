export const HANOI_COORDINATES = {
  lng: 105.8342,
  lat: 21.0278,
  zoom: 12,
  pitch: 35,
  bearing: 0,
};

export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export const MAP_STYLES = {
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
};

export const PLANNING_ZONE_COLORS = {
  residential: '#3b82f6', // Xanh dương - Đất ở
  commercial: '#ef4444',  // Đỏ - Thương mại / Dịch vụ
  green: '#10b981',       // Xanh lá - Cây xanh, công viên
  transport: '#f59e0b',   // Vàng cam - Giao thông
  industrial: '#8b5cf6',  // Tím - Công nghiệp
  public: '#06b6d4',      // Xanh ngọc - Công trình công cộng
};
