import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/ai/gemini';
import { buildRealEstateAnalysisPrompt } from '@/lib/ai/prompts';
import { ApiResponse, AIReportData } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, district, property_type, price, area, direction, legal_status } = body;

    if (!address || !price || !area) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: 'Thiếu thông tin địa chỉ, giá hoặc diện tích' } },
        { status: 400 }
      );
    }

    const prompt = buildRealEstateAnalysisPrompt({
      address,
      district: district || 'Hà Nội',
      property_type: property_type || 'Nhà riêng',
      price: Number(price),
      area: Number(area),
      direction,
      legal_status,
      nearby_projects: [
        { name: 'Tuyến Metro 3 Nhổn - Ga Hà Nội', type: 'metro', distance: 800 },
        { name: 'Công viên Cầu Giấy', type: 'park', distance: 1200 }
      ],
      amenities: [
        { name: 'Trường ĐH Quốc Gia Hà Nội', type: 'school', distance: 950 },
        { name: 'Bệnh viện 19-8 Bộ Công An', type: 'hospital', distance: 1500 }
      ]
    });

    let aiAnalysisResult;

    if (process.env.GEMINI_API_KEY) {
      const model = getGeminiModel();
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      try {
        const cleanedText = text.replace(/```json|```/g, '').trim();
        aiAnalysisResult = JSON.parse(cleanedText);
      } catch {
        aiAnalysisResult = {
          overview_summary: text.slice(0, 300),
          planning_evaluation: 'Đang cập nhật đánh giá quy hoạch...',
          price_appraisal: 'Mức giá cạnh tranh khu vực.',
          growth_potential_score: 85,
          liquidity_score: 80,
          pros: ['Vị trí thuận tiện', 'Gần hạ tầng giao thông lớn'],
          cons: ['Mật độ dân cư cao'],
          investment_recommendation: 'Phù hợp đầu tư trung hạn và dài hạn',
          legal_risk_assessment: 'Pháp lý an toàn theo quy hoạch'
        };
      }
    } else {
      // Fallback mock report data when GEMINI_API_KEY is not configured yet
      aiAnalysisResult = {
        overview_summary: `Bất động sản tại ${address}, ${district} sở hữu vị trí chiến lược, thuận tiện kết nối các trục đường chính.`,
        planning_evaluation: 'Nằm trong quy hoạch phân khu đô thị trung tâm Hà Nội, hạ tầng ổn định.',
        price_appraisal: 'Định giá hợp lý so với các BĐS tương đương cùng phân khúc.',
        growth_potential_score: 86,
        liquidity_score: 82,
        pros: ['Giao thông thuận tiện', 'Hạ tầng tiện ích đầy đủ', 'Thanh khoản tốt'],
        cons: ['Cần lưu ý giờ cao điểm'],
        investment_recommendation: 'Khuyến nghị mua để ở kết hợp kinh doanh hoặc giữ tài sản sinh lời.',
        legal_risk_assessment: 'Sổ đỏ chính chủ, không vướng tranh chấp hay quy hoạch treo.'
      };
    }

    const reportResponse: AIReportData = {
      user_id: 'current-user-id',
      address,
      district: district || 'Hà Nội',
      price: Number(price),
      area: Number(area),
      planning_info: {
        zone_type: 'residential',
        zone_name: 'Đất ở đô thị hiện hữu',
        is_affected_by_planning: false,
        plan_year: 2030,
        color_code: '#3b82f6',
      },
      nearby_projects: [
        {
          name: 'Tuyến Metro 3 Nhổn - Ga Hà Nội',
          project_type: 'metro',
          distance_meters: 800,
          status: 'construction',
          expected_completion: '2026',
        }
      ],
      amenities: [
        {
          name: 'Trường Đại học Quốc gia Hà Nội',
          type: 'school',
          distance_meters: 950,
          travel_time_minutes: 5,
          lat: 21.0378,
          lng: 105.7816
        }
      ],
      ai_analysis: aiAnalysisResult,
      generated_at: new Date().toISOString(),
    };

    return NextResponse.json<ApiResponse<AIReportData>>({
      success: true,
      data: reportResponse,
    });
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: error.message || 'Lỗi phân tích AI', code: 'AI_ERROR' } },
      { status: 500 }
    );
  }
}
