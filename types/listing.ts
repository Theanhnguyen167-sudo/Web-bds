import { PropertyType, ListingStatus } from './database';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  property_type: PropertyType;
  price: number;
  area: number;
  price_per_m2: number;
  address: string;
  district: string;
  ward: string | null;
  street: string | null;
  location: GeoPoint;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  direction: string | null;
  legal_status: string | null;
  images: string[];
  status: ListingStatus;
  is_featured: boolean;
  views: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface ListingFilterParams {
  district?: string;
  ward?: string;
  property_type?: PropertyType;
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  bedrooms?: number;
  direction?: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface CreateListingDTO {
  title: string;
  description: string;
  property_type: PropertyType;
  price: number;
  area: number;
  address: string;
  district: string;
  ward?: string;
  street?: string;
  lat: number;
  lng: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  direction?: string;
  legal_status?: string;
  images: string[];
}
