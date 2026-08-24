import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/client';
import { ListingFilters, PropertyType, ListingStatus } from '@/types';

export interface CreateListingInput {
  user_id: string;
  title: string;
  description?: string;
  property_type: 'house' | 'apartment' | 'land' | 'villa';
  price: number;
  area: number;
  address: string;
  district: string;
  ward?: string;
  lat: number;
  lng: number;
  images: string[];
}

// Get paginated listings with filters
export async function getListings({
  page = 1,
  limit = 18,
  district,
  propertyType,
  minPrice,
  maxPrice,
  minArea,
  maxArea,
  status = 'active'
}: ListingFilters = {}) {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from('listings')
    .select('*, users(full_name, avatar_url, phone)', { count: 'exact' })
    .eq('status', status as any)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (district && district !== 'all') query = query.eq('district', district);
  if (propertyType && propertyType !== 'all') query = query.eq('property_type', propertyType as any);
  if (minPrice) query = query.gte('price', minPrice);
  if (maxPrice) query = query.lte('price', maxPrice);
  if (minArea) query = query.gte('area', minArea);
  if (maxArea) query = query.lte('area', maxArea);

  return query;
}

// Get single listing by ID + increment views
export async function getListingById(id: string) {
  const supabase = createServerSupabaseClient();
  try {
    await (supabase.rpc as any)('increment_views', { listing_id: id });
  } catch (err) {
    // Ignore RPC error if not deployed yet
  }

  return (supabase
    .from('listings') as any)
    .select('*, users(full_name, avatar_url, phone, role)')
    .eq('id', id)
    .single();
}

// Get nearby listings using PostGIS
export async function getNearbyListings(
  lat: number,
  lng: number,
  radiusMeters: number = 2000
) {
  const supabase = createServerSupabaseClient();
  return (supabase.rpc as any)('get_nearby_listings', {
    lat,
    lng,
    radius_meters: radiusMeters
  });
}

// Create listing
export async function createListing(data: CreateListingInput) {
  const supabase = createClient();
  const locationWKT = `POINT(${data.lng} ${data.lat})`;
  const pricePerM2 = Math.round(data.price / (data.area || 1));

  return (supabase
    .from('listings') as any)
    .insert({
      user_id: data.user_id,
      title: data.title,
      description: data.description || null,
      property_type: data.property_type,
      price: data.price,
      area: data.area,
      price_per_m2: pricePerM2,
      address: data.address,
      district: data.district,
      ward: data.ward || null,
      location: locationWKT,
      images: data.images,
      status: 'pending',
      is_featured: false,
      views: 0
    })
    .select()
    .single();
}

// Get planning zone for a point using PostGIS
export async function getPlanningZoneForPoint(lat: number, lng: number) {
  const supabase = createServerSupabaseClient();
  return (supabase.rpc as any)('get_planning_zone_at_point', { lat, lng });
}

// Get projects within radius using PostGIS
export async function getProjectsNearby(
  lat: number,
  lng: number,
  radiusMeters: number = 2000
) {
  const supabase = createServerSupabaseClient();
  return (supabase.rpc as any)('get_projects_nearby', {
    lat,
    lng,
    radius_meters: radiusMeters
  });
}
