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
