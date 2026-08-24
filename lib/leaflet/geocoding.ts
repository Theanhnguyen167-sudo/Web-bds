// Nominatim geocoding — free, no API key needed

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'
const USER_AGENT = 'HaNoiRealty/1.0 (hanoirealty.vn)'

// Rate limiting: 1 request per second
let lastRequestTime = 0
const RATE_LIMIT_MS = 1100

async function rateLimit() {
  const now = Date.now()
  const elapsed = now - lastRequestTime
  if (elapsed < RATE_LIMIT_MS) {
    await new Promise(r => setTimeout(r, RATE_LIMIT_MS - elapsed))
  }
  lastRequestTime = Date.now()
}

export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number; displayName: string } | null> {
  try {
    await rateLimit()
    const query = `${address}, Hà Nội, Việt Nam`
    const url = `${NOMINATIM_BASE}/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=vn`
    
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'vi' }
    })
    
    if (!res.ok) return null
    const data = await res.json()
    
    if (data[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      }
    }
    return null
  } catch {
    return null
  }
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{
  displayName: string
  district: string
  ward: string
  road: string
  houseNumber: string
}> {
  try {
    await rateLimit()
    const url = `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=vi`
    
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT }
    })
    
    if (!res.ok) throw new Error('Geocoding failed')
    const data = await res.json()
    
    const addr = data.address || {}
    return {
      displayName: data.display_name || 'Không xác định được địa chỉ',
      district: addr.city_district || addr.suburb || addr.district || '',
      ward: addr.quarter || addr.neighbourhood || '',
      road: addr.road || addr.pedestrian || '',
      houseNumber: addr.house_number || '',
    }
  } catch {
    return {
      displayName: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      district: '',
      ward: '',
      road: '',
      houseNumber: '',
    }
  }
}

export async function searchAddress(query: string): Promise<Array<{
  lat: number
  lng: number
  displayName: string
  shortName: string
}>> {
  try {
    await rateLimit()
    const q = `${query}, Hà Nội, Việt Nam`
    const url = `${NOMINATIM_BASE}/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=vn&addressdetails=1`
    
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'vi' }
    })
    
    if (!res.ok) return []
    const data = await res.json()
    
    return data.map((item: any) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name,
      shortName: item.display_name.split(',').slice(0, 2).join(',').trim(),
    }))
  } catch {
    return []
  }
}
