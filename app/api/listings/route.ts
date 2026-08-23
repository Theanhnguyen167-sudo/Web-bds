import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ApiResponse, Listing } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district');
    const propertyType = searchParams.get('type');

    // In a live Supabase environment, execute PostGIS query:
    // const supabase = createServerSupabaseClient();
    // let query = supabase.from('listings').select('*').eq('status', 'active');
    // if (district) query = query.eq('district', district);
    
    return NextResponse.json<ApiResponse<Listing[]>>({
      success: true,
      data: [],
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: { message: error.message || 'Lỗi lấy danh sách BĐS', code: 'FETCH_ERROR' },
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate and insert into Supabase with PostGIS point:
    // ST_SetSRID(ST_MakePoint(body.lng, body.lat), 4326)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { id: 'new-listing-uuid', ...body },
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: { message: error.message || 'Lỗi tạo tin đăng BĐS', code: 'CREATE_ERROR' },
      },
      { status: 400 }
    );
  }
}
