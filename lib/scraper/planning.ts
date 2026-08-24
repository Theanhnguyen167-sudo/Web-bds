export interface ScrapedPlanningZone {
  name: string;
  district: string;
  zone_type: string;
  plan_year: number;
  description: string;
  raw_coordinates?: number[][][];
}

/**
 * Scraper utility to extract planning data
 */
export async function scrapeHanoiPlanningData(districtName: string): Promise<ScrapedPlanningZone[]> {
  console.log(`[Scraper] Starting crawl planning data for district: ${districtName}`);
  
  // Scraper implementation template for Hanoi planning portals
  return [
    {
      name: `Quy hoạch phân khu đô thị H2-2 (${districtName})`,
      district: districtName,
      zone_type: 'residential',
      plan_year: 2030,
      description: `Đất nhóm nhà ở xây dựng mới và cải tạo chỉnh trang thuộc quận ${districtName}`,
    },
    {
      name: `Khu phức hợp thương mại dịch vụ ${districtName}`,
      district: districtName,
      zone_type: 'commercial',
      plan_year: 2030,
      description: `Khu vực phát triển trung tâm thương mại và văn phòng kết nối tuyến Metro`,
    }
  ];
}
