import { createClient } from '@/lib/supabase/client';
import { PlanningZoneItem, normalizeLatLng } from '@/lib/planning/planning-utils';

export interface SupabasePlanningZoneRow {
  id: string;
  name?: string;
  zone_type?: string;
  zone_code?: string;
  zone_name?: string;
  district: string;
  description: string | null;
  color_code: string | null;
  area_ha?: number | null;
  max_floors?: number | null;
  density?: string | null;
  plan_year?: number | null;
  status?: string | null;
  boundary?: any;
  geom?: any;
  created_at?: string;
}

/**
 * Lấy danh sách toàn bộ phân khu quy hoạch từ Supabase
 */
export async function getPlanningZonesFromSupabase(): Promise<PlanningZoneItem[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('planning_zones')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((row: any): PlanningZoneItem => {
      // Chuyển đổi boundary / geom GeoJSON sang mảng coordinates [lat, lng] cho Leaflet
      let coordinates: [number, number][] = [];
      const geomData = row.geom || row.boundary;

      if (geomData) {
        if (geomData.coordinates && Array.isArray(geomData.coordinates[0])) {
          // GeoJSON Polygon coordinates: [[ [lng, lat], [lng, lat], ... ]]
          const ring = geomData.coordinates[0];
          coordinates = ring.map((pt: [number, number]) => normalizeLatLng([pt[1], pt[0]]));
        } else if (Array.isArray(geomData)) {
          coordinates = geomData.map((pt: [number, number]) => normalizeLatLng(pt));
        }
      }

      return {
        id: row.id,
        code: row.zone_code || row.zone_type || 'ODT',
        name: row.zone_name || row.name || 'Phân khu quy hoạch',
        district: row.district || 'Hà Nội',
        color: row.color_code || '#f97316',
        areaHa: Number(row.area_ha) || 150,
        maxFloors: Number(row.max_floors) || 5,
        density: row.density || '60%',
        status: (row.status as any) || 'published',
        type: (row.zone_type as any) || 'residential',
        planYear: Number(row.plan_year) || 2030,
        coordinates: coordinates.length >= 3 ? coordinates : [
          [21.0285, 105.8542],
          [21.0350, 105.8600],
          [21.0300, 105.8700],
          [21.0220, 105.8620],
        ],
      };
    });
  } catch (err) {
    console.warn('[Supabase] Lỗi tải planning_zones:', err);
    return [];
  }
}

/**
 * Lưu hoặc cập nhật một phân khu quy hoạch vào Supabase PostGIS
 */
export async function savePlanningZoneToSupabase(
  zone: Partial<PlanningZoneItem>
): Promise<{ success: boolean; data?: any; error?: string }> {
  const supabase = createClient();
  try {
    // Chuyển đổi coordinates [lat, lng] sang GeoJSON Polygon coordinates [lng, lat]
    const coords = zone.coordinates && zone.coordinates.length >= 3 
      ? zone.coordinates 
      : [
          [21.0300, 105.7800],
          [21.0400, 105.7900],
          [21.0350, 105.8000],
          [21.0250, 105.7900],
          [21.0300, 105.7800],
        ];

    // Đảm bảo khép kín vòng polygon (điểm đầu = điểm cuối)
    const closedCoords = [...coords];
    const first = closedCoords[0];
    const last = closedCoords[closedCoords.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      closedCoords.push(first);
    }

    const geoJsonPolygon = {
      type: 'Polygon',
      coordinates: [closedCoords.map((pt) => [pt[1], pt[0]])], // [lng, lat] chuẩn WGS84
    };

    const payload: any = {
      name: zone.name || 'Phân khu quy hoạch mới',
      zone_type: zone.type || 'residential',
      zone_code: zone.code || 'ODT',
      zone_name: zone.name || 'Phân khu quy hoạch mới',
      district: zone.district || 'Cầu Giấy',
      color_code: zone.color || '#f97316',
      area_ha: Number(zone.areaHa) || 100,
      max_floors: Number(zone.maxFloors) || 5,
      density: zone.density || '60%',
      plan_year: Number(zone.planYear) || 2030,
      status: zone.status || 'published',
      boundary: geoJsonPolygon,
      geom: geoJsonPolygon,
    };

    if (zone.id && !zone.id.startsWith('zone_')) {
      payload.id = zone.id;
    }

    const { data, error } = await supabase
      .from('planning_zones')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi khi lưu phân khu vào Supabase' };
  }
}

/**
 * Xóa một phân khu quy hoạch khỏi Supabase
 */
export async function deletePlanningZoneFromSupabase(id: string): Promise<boolean> {
  const supabase = createClient();
  try {
    const { error } = await supabase.from('planning_zones').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Lỗi khi xóa phân khu trên Supabase:', err);
    return false;
  }
}
