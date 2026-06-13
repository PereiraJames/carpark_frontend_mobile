import { API_BASE_URL, GOOGLE_MAPS_API_KEY } from '../config';
import { AvailabilityMap, Carpark, Coordinates } from '../types';

interface CarparkDetailsResponse {
  allCarparks?: Carpark[];
}

interface CarparkAvailabilityResponse {
  carparkAvailiability?: AvailabilityMap;
}

interface GeocodeResponse {
  status: string;
  results: Array<{ geometry: { location: { lat: number; lng: number } } }>;
}

export interface LiveData {
  allCarparks: Carpark[];
  availability: AvailabilityMap;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`${path} request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchCarparkDetails(): Promise<Carpark[]> {
  const data = await fetchJson<CarparkDetailsResponse>('/api/carpark_details');
  if (!data.allCarparks) throw new Error('Unexpected API response shape: carpark_details');
  return data.allCarparks;
}

export async function fetchCarparkAvailability(): Promise<AvailabilityMap> {
  const data = await fetchJson<CarparkAvailabilityResponse>('/api/carpark_availability');
  if (!data.carparkAvailiability) throw new Error('Unexpected API response shape: carpark_availability');
  return data.carparkAvailiability;
}

/** Fetch both details and live availability in parallel. */
export async function fetchLiveData(): Promise<LiveData> {
  const [allCarparks, availability] = await Promise.all([fetchCarparkDetails(), fetchCarparkAvailability()]);
  return { allCarparks, availability };
}

/** Submit a user-reported issue (wrong info, closed, etc.) for a carpark. */
export async function submitCarparkReport(carparkId: string, category: string, message: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/carpark_report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ carpark_id: carparkId, category, message }),
  });
  if (!response.ok) {
    throw new Error(`carpark_report request failed: ${response.status}`);
  }
}

/** Resolve a free-text address or postal code to coordinates via the Google Geocoding API. */
export async function geocodeAddress(query: string): Promise<Coordinates> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    query
  )}&region=sg&key=${GOOGLE_MAPS_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Geocode request failed: ${response.status}`);

  const data = (await response.json()) as GeocodeResponse;
  if (data.status !== 'OK' || !data.results || !data.results[0]) {
    throw new Error(`Geocode failed: ${data.status}`);
  }

  const loc = data.results[0].geometry.location;
  return { lat: loc.lat, lon: loc.lng };
}
