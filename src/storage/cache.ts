import AsyncStorage from '@react-native-async-storage/async-storage';

import { CACHE_KEYS } from '../config';
import { AvailabilityMap, Carpark } from '../types';

export interface CachedData {
  allCarparks: Carpark[] | null;
  availability: AvailabilityMap | null;
}

/** Last-known-good carpark data, used when the backend is unreachable. */
export async function loadCachedData(): Promise<CachedData> {
  try {
    const [details, avail] = await Promise.all([
      AsyncStorage.getItem(CACHE_KEYS.details),
      AsyncStorage.getItem(CACHE_KEYS.availability),
    ]);
    return {
      allCarparks: details ? JSON.parse(details) : null,
      availability: avail ? JSON.parse(avail) : null,
    };
  } catch (err) {
    console.warn('Failed to read cached carpark data:', err);
    return { allCarparks: null, availability: null };
  }
}

export async function saveCachedData(allCarparks: Carpark[], availability: AvailabilityMap): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.setItem(CACHE_KEYS.details, JSON.stringify(allCarparks)),
      AsyncStorage.setItem(CACHE_KEYS.availability, JSON.stringify(availability)),
    ]);
  } catch (err) {
    console.warn('Failed to cache carpark data:', err);
  }
}
