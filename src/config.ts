/** App-wide constants. Values come from `.env` (see `.env.example`). */

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://192.168.1.39:5000';

export const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

export const CACHE_KEYS = {
  details: 'carpark_details_cache',
  availability: 'carpark_availability_cache',
} as const;

export const ONLINE_POLL_MS = 60000;
export const OFFLINE_POLL_MS = 10000;

/** Number of carparks shown when "Nearest" mode is active. */
export const NEAREST_LIMIT = 10;

/** Initial map region: Singapore, wide enough to show the whole island. */
export const DEFAULT_REGION = {
  latitude: 1.3521,
  longitude: 103.8198,
  latitudeDelta: 0.3,
  longitudeDelta: 0.3,
};

/** Region delta used when zooming in on a located/searched point. */
export const FOCUSED_DELTA = {
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};
