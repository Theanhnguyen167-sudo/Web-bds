import { NextRequest, NextResponse } from 'next/server';
import {
  getNearbyAmenitiesAndProjects,
  haversineDistanceMeters,
  formatDistanceFriendly,
  estimateTravelTime,
  createGoogleMapsUrls,
  HANOI_GEO_POIS,
  HANOI_INFRASTRUCTURE_PROJECTS,
  HANOI_GEO_PLANNING_ZONES,
} from '@/lib/data/hanoi-geo-poi';

export const dynamic = 'force-dynamic';

/**
 * GET /api/map/nearby-amenities
 * Query parameters:
 * - lat: latitude (bắt buộc)
 * - lng: longitude (bắt buộc)
 * - radius: bán kính tìm kiếm bằng mét (mặc định 4000)
 * - category: lọc theo danh mục (all, metro, hospital, school, mall, park, infrastructure)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const radiusParam = searchParams.get('radius');
    const categoryParam = searchParams.get('category');

    if (!latParam || !lngParam) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Thiếu thông số tọa độ lat và lng hợp lệ',
            code: 'MISSING_COORDINATES',
          },
        },
        { status: 400 }
      );
    }

    const lat = parseFloat(latParam);
    const lng = parseFloat(lngParam);
    const radius = radiusParam ? parseInt(radiusParam, 10) : 4000;

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Tọa độ lat hoặc lng không hợp lệ',
            code: 'INVALID_COORDINATES',
          },
        },
        { status: 400 }
      );
    }

    // Trích xuất dữ liệu không gian tính từ tọa độ
    const spatialData = getNearbyAmenitiesAndProjects(lat, lng, radius);

    // Lọc theo danh mục nếu có yêu cầu
    let filteredAmenities = spatialData.amenities;
    if (categoryParam && categoryParam !== 'all') {
      filteredAmenities = filteredAmenities.filter(
        (a) => a.category.toLowerCase() === categoryParam.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        origin: { lat, lng },
        radiusMeters: radius,
        projectsCount: spatialData.projects.length,
        amenitiesCount: filteredAmenities.length,
        projects: spatialData.projects,
        amenities: filteredAmenities,
        nearestMetro: spatialData.nearestMetro,
        planningZones: HANOI_GEO_PLANNING_ZONES,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/map/nearby-amenities:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error?.message || 'Lỗi xử lý truy vấn dữ liệu không gian tiện ích',
          code: 'INTERNAL_SERVER_ERROR',
        },
      },
      { status: 500 }
    );
  }
}
