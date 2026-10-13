import { NextRequest, NextResponse } from 'next/server';
import {
  HanoiLocationItem,
  searchHanoiLocations,
  removeVietnameseTones,
} from '@/lib/data/hanoi-locations';

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

// In-memory cache for fast repeat requests
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
    if (cached && cached.length > 0) {
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

    // 0. Seed with instant local Hanoi database (streets, projects, and parsed address candidates)
    const localMatches = searchHanoiLocations(query, 6);
    for (const match of localMatches) {
      appendResult(match);
    }

    // Helper to query Photon
    const fetchPhoton = async (q: string): Promise<PhotonFeature[]> => {
      try {
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
          q
        )}&lat=21.0285&lon=105.8542&limit=8`;
        const ctrl = new AbortController();
        const tId = setTimeout(() => ctrl.abort(), 6000);
        const res = await fetch(url, {
          headers: { 'Accept-Language': 'vi,en' },
          signal: ctrl.signal,
        });
        clearTimeout(tId);
        if (!res.ok) return [];
        const json = await res.json();
        return json.features || [];
      } catch {
        return [];
      }
    };

    // 1. Photon Geocoding
    try {
      // Check for rural/suburban prefixes: "Đội 10 Nhị Khê", "Thôn 2...", "Xóm 3..."
      const subMatch = query.match(
        /^(đội\s+\d+|doi\s+\d+|thôn\s+\S+|thon\s+\S+|xóm\s+\S+|xom\s+\S+|ngõ\s+\d+|ngo\s+\d+|ngách\s+\d+|số\s+\d+|so\s+\d+)\s+(.+)$/i
      );

      let features = await fetchPhoton(query);
      if (features.length === 0) {
        features = await fetchPhoton(`${query} Hanoi`);
      }

      // If subdivision query (e.g. "Đội 10 Nhị Khê") didn't yield exact items, query the base location (e.g. "Nhị Khê")
      if (subMatch && features.length < 2) {
        const subPrefix = subMatch[1];
        const baseQuery = subMatch[2];
        const baseFeatures = await fetchPhoton(baseQuery);
        for (const bf of baseFeatures) {
          const coords = bf.geometry?.coordinates;
          if (!coords || coords.length < 2) continue;
          const [lng, lat] = coords;
          if (lat < 20.4 || lat > 21.6 || lng < 105.2 || lng > 106.3) continue;

          const baseName = bf.properties.name || baseQuery;
          const subTitle = `${subPrefix.charAt(0).toUpperCase() + subPrefix.slice(1)}, ${baseName}`;
          appendResult({
            id: `sub-${lat.toFixed(5)}-${lng.toFixed(5)}`,
            name: subTitle,
            category: 'address',
            district: bf.properties.district || bf.properties.city || 'Hà Nội',
            lat,
            lng,
            zoom: 17,
            description: `${baseName}, Hà Nội`,
            houseNumber: subPrefix,
            street: baseName,
          });
        }
      }

      for (const feat of features) {
        const props = feat.properties;
        const coords = feat.geometry?.coordinates;
        if (!coords || coords.length < 2) continue;

        const [lng, lat] = coords;

        // Filter roughly within Hanoi & surrounding area [lat: 20.4 - 21.6, lng: 105.2 - 106.3]
        if (lat < 20.4 || lat > 21.6 || lng < 105.2 || lng > 106.3) {
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
          } else if (
            props.osm_key === 'highway' ||
            props.type === 'street' ||
            poiName.toLowerCase().startsWith('phố') ||
            poiName.toLowerCase().startsWith('đường')
          ) {
            category = 'street';
            zoom = 16.5;
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
          street: cleanStreet || undefined,
        });
      }
    } catch {
      // Photon fallback
    }

    // 2. OSM Nominatim fallback if results are sparse (< 2)
    if (results.length < 2) {
      try {
        const nominatimQuery = `${query}, Hà Nội, Việt Nam`;
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          nominatimQuery
        )}&countrycodes=vn&limit=5&addressdetails=1`;

        const nomController = new AbortController();
        const nomTimeout = setTimeout(() => nomController.abort(), 4000);

        const nomRes = await fetch(nominatimUrl, {
          headers: {
            'User-Agent': 'HanoiRealty-Platform/1.0 (contact@hanoirealty.vn)',
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
            } else if (road) {
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

    // Only cache if we actually found results!
    if (results.length > 0) {
      setCache(cacheKey, results);
    }

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
