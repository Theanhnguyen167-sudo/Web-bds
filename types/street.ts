export interface StreetItem {
  id: string;
  name: string;
  district: string;
  lengthMeters?: number;
  widthMeters?: number;
  planningWidthMeters?: number; // Lộ giới quy hoạch mở rộng
  averagePricePerM2: number; // Đơn giá thị trường trung bình (VNĐ/m2)
  isMajorArtery?: boolean; // Trục đường huyết mạch
  metroLineNear?: string; // Gần tuyến Metro nào
  description?: string;
}

export interface MetroLineItem {
  id: string;
  code: string;
  name: string;
  route: string;
  status: 'operating' | 'construction' | 'planning';
  totalLengthKm: number;
  stationsCount: number;
  color: string;
  keyStations: string[];
}

export interface RingRoadItem {
  id: string;
  name: string;
  route: string;
  status: 'operating' | 'construction' | 'planning';
  width: string;
}
