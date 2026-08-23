import { ZoneType, ProjectStatus } from './database';

export interface PlanningZone {
  id: string;
  name: string;
  zone_type: ZoneType;
  plan_year: number;
  district: string;
  color_code: string;
  description: string | null;
  source_url: string | null;
  boundary: GeoJSON.Polygon | GeoJSON.MultiPolygon;
  created_at: string;
}

export interface InfrastructureProject {
  id: string;
  name: string;
  project_type: string;
  lat: number;
  lng: number;
  status: ProjectStatus;
  expected_completion: string | null;
  impact_radius_meters: number;
  description: string | null;
  created_at: string;
}

export interface PlanningLegendItem {
  type: ZoneType;
  name: string;
  color: string;
  description: string;
}
