import { NextRequest, NextResponse } from 'next/server';
import { HanoiLocationItem, searchHanoiLocations, removeVietnameseTones } from '@/lib/data/hanoi-locations';

interface PhotonFeature {
  geometry: {
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    name?: string;
    housenumber?: string;
    street?: string;
    district?: string;
    suburb?: string;
    locality?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    type?: string;
    osm_key?: string;
    osm_value?: string;
  };
}

interface NominatimItem {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  type?: string;
  class?: string;
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city_district?: string;
    district?: string;
    city?: string;
    quarter?: string;
    neighbourhood?: string;
  };
}

// Simple in-memory cache for fast repeat requests
const GEOCODE_CACHE = new Map<string, { timestamp: number; data: HanoiLocationItem[] }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_SIZE = 300;

function getCached(key: string): HanoiLocationItem[] | null {
  const item = GEOCODE_CACHE.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    GEOCODE_CACHE.delete(key);
    return null;
  }
  return item.data;
}

function setCache(key: string, data: HanoiLocationItem[]) {
  if (GEOCODE_CACHE.size >= MAX_CACHE_SIZE) {
    const firstKey = GEOCODE_CACHE.keys().next().value;
    if (firstKey) GEOCODE_CACHE.delete(firstKey);
  }
  GEOCODE_CACHE.set(key, { timestamp: Date.now(), data });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const cacheKey = query.toLowerCase();
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
      });
    }

    const results: HanoiLocationItem[] = [];
    const seenCoordinates = new Set<string>();
    const seenNames = new Set<string>();

    const appendResult = (item: HanoiLocationItem) => {
      // Coords key rounded to ~10 meters & name key to deduplicate
      const coordKey = `${item.lat.toFixed(4)},${item.lng.toFixed(4)}`;
      const nameKey = item.name.toLowerCase().trim();
      if (seenCoordinates.has(coordKey) || seenNames.has(nameKey)) return;
      seenCoordinates.add(coordKey);
      seenNames.add(nameKey);
      results.push(item);
    };

    // 0. Seed with instant local Hanoi database (includes streets, projects, and parsed address candidates)
    const localMatches = searchHanoiLocations(query, 5);
    for (const match of localMatches) {
      appendResult(match);
    }

    // 1. Primary online geocoder: Photon (Elasticsearch OSM Geocoder - optimized for autocomplete & house numbers)
    try {
      const photonQuery = `${query} Hanoi`;
      const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(
        photonQuery
      )}&lat=21.0285&lon=105.8542&limit=8`;

      const photonController = new AbortController();
      const photonTimeout = setTimeout(() => photonController.abort(), 7000);

      const photonRes = await fetch(photonUrl, {
        headers: {
          'Accept-Language': 'vi,en',
        },
        signal: photonController.signal,
      });
      clearTimeout(photonTimeout);

      if (photonRes.ok) {
        const photonJson = await photonRes.json();
        const features: PhotonFeature[] = photonJson.features || [];

        for (const feat of features) {
          const props = feat.properties;
          const coords = feat.geometry?.coordinates;
          if (!coords || coords.length < 2) continue;

          const [lng, lat] = coords;

          // Filter roughly within Hanoi bounding box [lat: 20.5 - 21.6, lng: 105.2 - 106.2]
          if (lat < 20.5 || lat > 21.6 || lng < 105.2 || lng > 106.2) {
            continue;
          }

          const houseNum = props.housenumber?.trim();
          let cleanStreet = (props.street || '').trim();
          cleanStreet = cleanStreet.replace(/\s+Street$/i, '').replace(/^Street\s+/i, 'Đường ');
          const poiName = props.name?.trim();
          const district =
            props.district?.trim() ||
            props.suburb?.trim() ||
            props.locality?.trim() ||
            'Hà Nội';
          const ward = props.locality?.trim() || props.suburb?.trim() || '';

          let displayName = '';
          let category: HanoiLocationItem['category'] = 'landmark';
          let zoom = 16;

          if (houseNum && poiName && cleanStreet) {
            category = 'address';
            zoom = 17.5;
            if (poiName.toLowerCase().includes(cleanStreet.toLowerCase())) {
              displayName = poiName;
            } else {
              displayName = `${poiName} (Số ${houseNum} ${cleanStreet})`;
            }
          } else if (houseNum && cleanStreet) {
            category = 'address';
            zoom = 17.5;
            if (cleanStreet.startsWith(houseNum)) {
              displayName = `Số ${cleanStreet}`;
            } else {
              displayName = `Số ${houseNum} ${cleanStreet}`;
            }
          } else if (houseNum && poiName) {
            category = 'address';
            zoom = 17.5;
            displayName = `${poiName} (Số ${houseNum})`;
          } else if (poiName) {
            displayName = poiName;
            if (props.osm_key === 'building' || props.type === 'house') {
              category = 'address';
              zoom = 17.5;
            } else if (props.osm_key === 'highway' || props.type === 'street') {
              category = 'street';
              zoom = 16;
            } else {
              category = 'landmark';
              zoom = 16.5;
            }
          } else if (cleanStreet) {
            displayName = cleanStreet;
            category = 'street';
            zoom = 16;
          } else {
            displayName = query;
          }

          const descParts: string[] = [];
          if (ward && !displayName.includes(ward)) descParts.push(ward);
          if (district && !displayName.includes(district)) descParts.push(district);
          descParts.push('Hà Nội');

          appendResult({
            id: `photon-${lat.toFixed(5)}-${lng.toFixed(5)}`,
            name: displayName,
            category,
            district,
            lat,
            lng,
            zoom,
            description: descParts.join(', '),
            houseNumber: houseNum,
            street: streetName,
          });
        }
      }
    } catch {
      // Photon fallback silently continue to Nominatim
    }

    // 2. Secondary fallback: OSM Nominatim if Photon results are sparse (< 3)
    if (results.length < 3) {
      try {
        const nominatimQuery = `${query}, Hà Nội, Việt Nam`;
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          nominatimQuery
        )}&countrycodes=vn&limit=5&addressdetails=1`;

        const nomController = new AbortController();
        const nomTimeout = setTimeout(() => nomController.abort(), 3500);

        const nomRes = await fetch(nominatimUrl, {
          headers: {
            'User-Agent': 'HanoiRealtyApp/1.0 (contact@hanoirealty.vn)',
            'Accept-Language': 'vi',
          },
          signal: nomController.signal,
        });
        clearTimeout(nomTimeout);

        if (nomRes.ok) {
          const nomItems: NominatimItem[] = await nomRes.json();
          for (const item of nomItems) {
            const lat = parseFloat(item.lat);
            const lng = parseFloat(item.lon);
            if (isNaN(lat) || isNaN(lng)) continue;

            const addr = item.address || {};
            const houseNum = addr.house_number;
            const road = addr.road;
            const district =
              addr.city_district || addr.suburb || addr.district || 'Hà Nội';
            const ward = addr.quarter || addr.neighbourhood || '';

            let category: HanoiLocationItem['category'] = 'landmark';
            let zoom = 16;
            let displayName = item.name || item.display_name.split(',')[0];

            if (houseNum && road) {
              category = 'address';
              zoom = 17.5;
              displayName = `Số ${houseNum} ${road}`;
            } else if (road && (item.type === 'secondary' || item.type === 'primary' || item.type === 'residential')) {
              category = 'street';
              zoom = 16;
            }

            const descParts: string[] = [];
            if (ward) descParts.push(ward);
            if (district && !district.includes('Hà Nội')) descParts.push(district);
            descParts.push('Hà Nội');

            appendResult({
              id: `nom-${item.place_id}`,
              name: displayName,
              category,
              district,
              lat,
              lng,
              zoom,
              description: descParts.join(', '),
              houseNumber: houseNum,
              street: road,
            });
          }
        }
      } catch {
        // Silently continue
      }
    }

    // Cache the result
    setCache(cacheKey, results);

    return NextResponse.json({
      success: true,
      data: results.slice(0, 8),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Lỗi tra cứu toạ độ địa chỉ',
          code: 'GEOCODE_ERROR',
        },
      },
      { status: 500 }
    );
  }
}
