import * as Location from 'expo-location';
import { useCallback } from 'react';

import { Coordinates } from '../types';

/** Wraps expo-location with the permission request the web app got for free in the browser. */
export function useUserLocation() {
  const getCurrentCoords = useCallback(async (): Promise<Coordinates> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }

    const position = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timed out getting your location')), 10000)
      ),
    ]);

    return { lat: position.coords.latitude, lon: position.coords.longitude };
  }, []);

  return { getCurrentCoords };
}
