import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export async function GET(req: NextRequest) {
  const apiKey = process.env.STITCH_API_KEY || 'AQ.Ab8RN6IZHLmSH1J7xdlYndtnZm6fJi2_YExaS4HA6Fqfr7YlTw';

  return NextResponse.json<ApiResponse>({
    success: true,
    data: {
      connected: true,
      service: 'Google Stitch AI Design System',
      apiKeyMasked: `${apiKey.slice(0, 8)}...${apiKey.slice(-6)}`,
      lastSyncedAt: new Date().toISOString(),
      syncedScreens: [
        { id: 'screen-01', name: 'HaNoi Realty - Homepage Split Map', status: 'synchronized', componentsCount: 14 },
        { id: 'screen-02', name: 'Property Detail & AI Scorecard', status: 'synchronized', componentsCount: 9 },
        { id: 'screen-03', name: '5-Step Create Listing Wizard', status: 'synchronized', componentsCount: 12 },
        { id: 'screen-04', name: 'AI Valuation & Planning Report', status: 'synchronized', componentsCount: 8 },
        { id: 'screen-05', name: 'Membership Pricing & VIP Table', status: 'synchronized', componentsCount: 6 },
        { id: 'screen-06', name: 'User Management Dashboard', status: 'synchronized', componentsCount: 11 },
      ],
      designTokens: {
        primary: '#1a2744',
        accent: '#f97316',
        pageBg: '#f8fafc',
        fontFamily: 'Inter',
      }
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        message: 'Đồng bộ Google Stitch thành công!',
        syncedAt: new Date().toISOString(),
        status: 'active'
      }
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: error.message || 'Lỗi đồng bộ Stitch' } },
      { status: 500 }
    );
  }
}
