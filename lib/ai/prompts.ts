export interface AIValuationInput {
  address: string;
  district: string;
  property_type: string;
  price: number;
  area: number;
  bedrooms?: number;
  direction?: string;
  legal_status?: string;
  planning_zone?: string;
  nearby_projects?: Array<{ name: string; type: string; distance: number }>;
  amenities?: Array<{ name: string; type: string; distance: number }>;
}

export function buildRealEstateAnalysisPrompt(input: AIValuationInput): string {
  return `
Bạn là một chuyên gia thẩm định và phân tích đầu tư Bất Động Sản hàng đầu tại Hà Nội với 20 năm kinh nghiệm.
Hãy phân tích dữ liệu BĐS sau đây và trả về kết quả định dạng JSON thuần túy (không kèm markdown format ngoài JSON):

THÔNG TIN BẤT ĐỘNG SẢN:
- Địa chỉ: ${input.address}, Quận: ${input.district}, Hà Nội
- Loại hình: ${input.property_type}
- Diện tích: ${input.area} m²
- Mức giá chào bán: ${(input.price / 1_000_000_000).toFixed(2)} Tỷ VNĐ (~${((input.price / input.area) / 1_000_000).toFixed(1)} triệu/m²)
- Hướng nhà: ${input.direction || 'Chưa rõ'}
- Pháp lý: ${input.legal_status || 'Sổ đỏ chính chủ'}
- Quy hoạch khu vực: ${input.planning_zone || 'Đất ở đô thị'}
- Dự án lân cận: ${JSON.stringify(input.nearby_projects || [])}
- Tiện ích xung quanh: ${JSON.stringify(input.amenities || [])}

YÊU CẦU ĐẦU RA (JSON Object duy nhất):
{
  "overview_summary": "Tóm tắt đánh giá vị trí và đặc điểm căn nhà (2-3 câu)",
  "planning_evaluation": "Phân tích chi tiết về quy hoạch đô thị Hà Nội tác động đến BĐS này",
  "price_appraisal": "Đánh giá mức giá hiện tại (Rẻ / Hợp lý / Cao hơn thị trường khu vực và lý do)",
  "growth_potential_score": 85, // Thang điểm 0 - 100
  "liquidity_score": 80,        // Điểm thanh khoản 0 - 100
  "pros": ["Ưu điểm 1", "Ưu điểm 2", "Ưu điểm 3"],
  "cons": ["Nhược điểm / Lưu ý 1", "Nhược điểm / Lưu ý 2"],
  "investment_recommendation": "Khuyến nghị cụ thể cho người mua ở hoặc nhà đầu tư lướt sóng/dài hạn",
  "legal_risk_assessment": "Đánh giá rủi ro pháp lý và lưu ý khi công chứng/đặt cọc"
}
`;
}

export function buildPlanningPDFAnalysisPrompt(fileName: string, districtHint?: string): string {
  return `
Bạn là một Chuyên gia Quy hoạch Đô thị & Kỹ sư Hệ thống GIS Hà Nội cấp cao.
Nhiệm vụ của bạn là phân tích tài liệu đồ án / bản vẽ quy hoạch sau (Tên file: "${fileName}", Gợi ý quận: "${districtHint || 'Hà Nội'}").

Hãy đọc toàn bộ tài liệu và bóc tách các phân khu quy hoạch, ranh giới và các ký hiệu sử dụng đất theo quy chuẩn quy hoạch xây dựng Việt Nam (QCVN 01:2021/BXD).

YÊU CẦU PHÂN TÍCH:
1. Xác định quận / huyện chính của đồ án tại Hà Nội.
2. Bóc tách danh sách từ 3 đến 6 phân khu quy hoạch chức năng chi tiết trong đồ án.
3. Với mỗi phân khu, phân loại chính xác theo ký hiệu quy chuẩn Việt Nam:
   - "ODT": Đất ở đô thị (màu #ffdd29)
   - "TMD": Đất thương mại dịch vụ (màu #ef4444)
   - "HH": Đất hỗn hợp cao tầng (màu #8b5cf6)
   - "CX": Đất công viên cây xanh / mặt nước (màu #22c55e)
   - "GT": Đất công trình hạ tầng giao thông / ga metro (màu #3b82f6)
   - "DGD": Đất giáo dục - trường học (màu #6366f1)
   - "YT": Đất y tế / bệnh viện (màu #ec4899)
   - "CN": Đất công nghiệp / kho tàng (màu #64748b)
4. Trích xuất các chỉ tiêu: Mật độ xây dựng (%), Chiều cao tối đa (tầng), Hệ số sử dụng đất (FAR), Diện tích quy hoạch (ha).

TRẢ VỀ DUY NHẤT ĐỊNH DẠNG JSON HỢP LỆ (không bọc codeblock markdown):
{
  "projectTitle": "Tên đầy đủ của đồ án quy hoạch",
  "district": "Tên quận huyện (VD: Cầu Giấy)",
  "planYear": 2030,
  "zones": [
    {
      "code": "ODT-01",
      "name": "Khu đất ở đô thị cải tạo chỉnh trang",
      "type": "residential",
      "color": "#ffdd29",
      "density": "65%",
      "maxFloors": 5,
      "maxHeight": "21m (5 tầng)",
      "floorAreaRatio": 3.5,
      "areaHa": 145,
      "description": "Khu dân cư hiện hữu kết hợp chỉnh trang đồng bộ hạ tầng"
    }
  ]
}
`;
}

