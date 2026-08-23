import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Listing } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district');
    const propertyType = searchParams.get('type');
    
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
