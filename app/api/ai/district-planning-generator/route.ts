import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/ai/gemini';
import { checkRateLimit } from '@/lib/api-utils';
import {
  HANOI_DISTRICTS_PLANNING_PROFILES,
  getDetailedPlanningForDistrict,
  PLANNING_STANDARD_SYMBOLS,
} from '@/lib/planning/hanoi-planning-db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting: 12 requests / 60s
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
    const rateCheck = checkRateLimit(`ai-planning-gen:${clientIp}`, 12, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Thao tác quá nhanh. Vui lòng thử lại sau ${rateCheck.retryAfterSec} giây.`,
            code: 'RATE_LIMIT_EXCEEDED',
          },
        },
        { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSec) } }
      );
    }

    const body = await req.json();
    const { district = 'Đống Đa', customRequirements } = body;

    const baseProfile = HANOI_DISTRICTS_PLANNING_PROFILES[district];

    // 2. Nếu có GEMINI_API_KEY, gọi Gemini AI để phân tích và số hóa chuyên sâu
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = getGeminiModel('gemini-1.5-pro');

        const prompt = `
Bạn là Kỹ sư trưởng Quy hoạch Đô thị & Chuyên gia Không gian GIS cấp cao của Viện Quy hoạch Xây dựng Hà Nội (HUPI).
Nhiệm vụ: Tìm kiếm, phân tích đồ án quy hoạch phân khu đô thị đã được UBND TP Hà Nội phê duyệt cho Quận: "${district}".
Yêu cầu bổ sung của Admin: "${customRequirements || 'Tự động bóc tách toàn bộ phân khu với đầy đủ ký hiệu màu sắc chuẩn BXD'}".

QUY CHUẨN KÝ HIỆU SỬ DỤNG ĐẤT BẮT BUỘC (QCVN 01:2021/BXD & TT 12/2016/TT-BXD):
Hãy bóc tách từ 4 đến 7 phân khu chức năng riêng biệt, bao gồm các loại hình:
- ODT: Đất ở đô thị hiện hữu cải tạo (Màu: #FFDD29)
- TMD: Đất thương mại, dịch vụ & tài chính (Màu: #EF4444)
- HH: Đất hỗn hợp cao tầng căn hộ & văn phòng (Màu: #8B5CF6)
- CX: Đất công viên cây xanh & hồ điều hòa mặt nước (Màu: #22C55E)
- GT: Đất hạ tầng giao thông, đầu mối bến bãi, ga metro (Màu: #3B82F6)
- CQ: Đất cơ quan, công trình văn hóa (Màu: #06B6D4)
- GD: Đất giáo dục, trường học các cấp (Màu: #6366F1)
- YT: Đất y tế, bệnh viện (Màu: #EC4899)
- QSQP: Đất an ninh quốc phòng (Màu: #DC2626)

TỌA ĐỘ WGS84:
- Tọa độ [Vĩ độ (Lat), Kinh độ (Lng)] tại Hà Nội phải nằm trong khoảng: Lat: 20.95 đến 21.15, Lng: 105.70 đến 105.95.
- Mỗi phân khu phải có mảng coordinates là một đa giác Polygon WGS84 khép kín ít nhất 4 - 5 điểm toạ độ [lat, lng], bám sát các địa danh thực tế của quận "${district}".

YÊU CẦU ĐẦU RA (CHỈ TRẢ VỀ DUY NHẤT ĐỊNH DẠNG JSON HỢP LỆ, KHÔNG BỌC CODEBLOCK MARKDOWN):
{
  "district": "${district}",
  "subdivisionCode": "Mã phân khu (VD: H1-3, H2-1...)",
  "legalBasis": "Căn cứ pháp lý Quyết định phê duyệt của UBND TP Hà Nội",
  "planYear": 2030,
  "zones": [
    {
      "code": "ODT-01",
      "name": "Tên chi tiết phân khu kèm địa danh",
      "type": "residential",
      "color": "#FFDD29",
      "areaHa": 145,
      "maxFloors": 5,
      "maxHeight": "21m (5 tầng)",
      "density": "65%",
      "floorAreaRatio": 3.5,
      "description": "Mô tả định hướng phát triển không gian kiến trúc",
      "coordinates": [
        [21.0200, 105.8200],
        [21.0250, 105.8250],
        [21.0230, 105.8300],
        [21.0180, 105.8260]
      ]
    }
  ]
}
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanedJson = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanedJson);

        if (parsed && Array.isArray(parsed.zones) && parsed.zones.length > 0) {
          const formattedZones = parsed.zones.map((z: any, idx: number) => ({
            id: `ai_${district}_${z.code || idx}`.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
            code: z.code || 'ODT-01',
            name: z.name || `Phân khu ${district}`,
            district: parsed.district || district,
            color: z.color || '#FFDD29',
            areaHa: Number(z.areaHa) || 120,
            maxFloors: Number(z.maxFloors) || 5,
            maxHeight: z.maxHeight || `${z.maxFloors || 5} tầng`,
            density: z.density || '60%',
            floorAreaRatio: Number(z.floorAreaRatio) || 3.5,
            status: 'published',
            type: z.type || 'residential',
            planYear: Number(parsed.planYear) || 2030,
            coordinates: z.coordinates && z.coordinates.length >= 3 ? z.coordinates : [
              [21.0285, 105.8542],
              [21.0350, 105.8600],
              [21.0300, 105.8700],
              [21.0220, 105.8620],
            ],
            sourceFile: parsed.legalBasis || 'Quyết định UBND TP Hà Nội',
          }));

          return NextResponse.json({
            success: true,
            data: {
              source: 'gemini-1.5-pro',
              district: parsed.district || district,
              subdivisionCode: parsed.subdivisionCode || baseProfile?.subdivisionCode || 'H1',
              legalBasis: parsed.legalBasis || baseProfile?.legalBasis || 'Quyết định UBND TP Hà Nội',
              planYear: parsed.planYear || 2030,
              zones: formattedZones,
            },
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini District Planning Generator fallback:', geminiError?.message);
      }
    }

    // 3. Fallback: Dùng Hệ cơ sở dữ liệu Quy hoạch Đô thị Hà Nội chuẩn hóa (GIS Engine)
    const detailedZones = getDetailedPlanningForDistrict(district);

    return NextResponse.json({
      success: true,
      data: {
        source: 'hanoi-gis-engine',
        district,
        subdivisionCode: baseProfile?.subdivisionCode || 'H1/H2',
        legalBasis: baseProfile?.legalBasis || `Quy hoạch phân khu đô thị ${district} tầm nhìn 2030 - 2045`,
        planYear: baseProfile?.planYear || 2030,
        zones: detailedZones,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { message: error.message || 'Lỗi khi khởi tạo bản đồ quy hoạch phân khu' },
      },
      { status: 500 }
    );
  }
}
