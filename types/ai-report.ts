export interface Amenity {
  name: string;
  type: 'school' | 'hospital' | 'metro' | 'mall' | 'park' | 'market';
  distance_meters: number;
  travel_time_minutes: number;
  lat: number;
  lng: number;
}

export interface AIReportData {
  id?: string;
  listing_id?: string;
  user_id: string;
  address: string;
  district: string;
  price: number;
  area: number;
  planning_info: {
    zone_type: string;
    zone_name: string;
    is_affected_by_planning: boolean;
    plan_year: number;
    color_code: string;
  };
  nearby_projects: {
    name: string;
    project_type: string;
    distance_meters: number;
    status: string;
    expected_completion: string;
  }[];
  amenities: Amenity[];
  ai_analysis: {
    overview_summary: string;
    planning_evaluation: string;
    price_appraisal: string;
    growth_potential_score: number; // 1-100
    liquidity_score: number; // 1-100
    pros: string[];
    cons: string[];
    investment_recommendation: string;
    legal_risk_assessment: string;
  };
  pdf_url?: string;
  generated_at: string;
}
