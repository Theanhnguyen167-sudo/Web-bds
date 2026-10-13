import { PropertyType, ListingStatus } from './database';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  slug?: string | null;
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
  // Fields required by Single Source of Truth
  ownerId?: string;
  city?: string;
  seller?: SellerSnapshot;
  rejectionReason?: string | null;
  publishedAt?: string | null;
  appointments?: number;
}

export interface SellerSnapshot {
  fullName: string;
  phone: string;
  email?: string;
  sellerType?: string;
  companyName?: string;
  contactAddress?: string;
  showPhone?: boolean;
  allowEmailContact?: boolean;
  showCompany?: boolean;
  isPhoneVerified?: boolean;
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

export interface ListingFilters {
  page?: number;
  limit?: number;
  district?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  status?: string;
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
