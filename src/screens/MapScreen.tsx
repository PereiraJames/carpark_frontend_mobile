import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { geocodeAddress } from '../api/carparkApi';
import { CarparkDetailsSheet } from '../components/CarparkDetailsSheet';
import { CarparkMap } from '../components/CarparkMap';
import { ControlButtons } from '../components/ControlButtons';
import { Legend } from '../components/Legend';
import { LocateButton } from '../components/LocateButton';
import { OfflineBanner } from '../components/OfflineBanner';
import { SearchBar } from '../components/SearchBar';
import { StatusPill } from '../components/StatusPill';
import { FOCUSED_DELTA, NEAREST_LIMIT } from '../config';
import { useCarparkData } from '../hooks/useCarparkData';
import { useUserLocation } from '../hooks/useUserLocation';
import { Carpark, Coordinates } from '../types';
import { haversineKm } from '../utils/distance';

export function MapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const { getCurrentCoords } = useUserLocation();
  const { allCarparks, availability, isOffline, loadStatus } = useCarparkData();

  const [showNearestOnly, setShowNearestOnly] = useState(true);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<Coordinates | null>(null);
  const [selectedCarpark, setSelectedCarpark] = useState<Carpark | null>(null);
  const [searchStatus, setSearchStatus] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const focusOn = useCallback((coords: Coordinates) => {
    mapRef.current?.animateToRegion(
      { latitude: coords.lat, longitude: coords.lon, ...FOCUSED_DELTA },
      500
    );
  }, []);

  // Tries to get a GPS fix and centre the map on it. If it fails and we're
  // relying on "nearest" mode with no destination set, fall back to showing
  // everything rather than an empty map.
  const locateUser = useCallback(async () => {
    try {
      const coords = await getCurrentCoords();
      setUserLocation(coords);
      setLocationError(null);
      focusOn(coords);
    } catch (err) {
      console.warn('Geolocation unavailable:', err);
      const message = err instanceof Error ? err.message : 'Could not get your location';
      setLocationError(
        message === 'Location permission not granted'
          ? 'Location permission denied - enable it in your phone settings'
          : `Location unavailable: ${message}`
      );
      setShowNearestOnly((prev) => {
        if (prev && !destinationLocation) return false;
        return prev;
      });
    }
  }, [getCurrentCoords, focusOn, destinationLocation]);

  // Open the map centred on the user's current location on first launch.
  useEffect(() => {
    locateUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLocatePress = useCallback(() => {
    setDestinationLocation(null);
    locateUser();
  }, [locateUser]);

  const handleToggleNearest = useCallback(() => {
    const next = !showNearestOnly;
    setShowNearestOnly(next);
    if (next && !userLocation && !destinationLocation) {
      locateUser();
    }
  }, [showNearestOnly, userLocation, destinationLocation, locateUser]);

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchStatus(`Looking up "${query}"...`);
      try {
        const loc = await geocodeAddress(query);
        setSearchStatus(null);
        setDestinationLocation(loc);
        setShowNearestOnly(true);
        focusOn(loc);
      } catch (err) {
        console.warn('Geocoding failed:', err);
        setSearchStatus(`No location found matching "${query}"`);
      }
    },
    [focusOn]
  );

  // Carparks currently shown on the map: either the nearest N to the
  // reference point (destination, or failing that the user's location), or
  // every carpark with coordinates.
  const visibleCarparks = useMemo<Carpark[]>(() => {
    const withCoords = allCarparks.filter((cp) => cp.lat && cp.lon);
    const referencePoint = destinationLocation || userLocation;

    if (showNearestOnly && !referencePoint) return [];

    if (showNearestOnly && referencePoint) {
      return withCoords
        .map((cp) => ({
          cp,
          distanceKm: haversineKm(
            referencePoint.lat,
            referencePoint.lon,
            parseFloat(String(cp.lat)),
            parseFloat(String(cp.lon))
          ),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, NEAREST_LIMIT)
        .map(({ cp }) => cp);
    }

    return withCoords;
  }, [allCarparks, showNearestOnly, destinationLocation, userLocation]);

  const statusMessage = useMemo(() => {
    if (searchStatus) return searchStatus;
    if (allCarparks.length === 0) return loadStatus;

    const referencePoint = destinationLocation || userLocation;
    if (showNearestOnly && !referencePoint) {
      return locationError || 'Locating you...';
    }

    let message: string;
    if (showNearestOnly && referencePoint) {
      message = destinationLocation
        ? `Showing ${visibleCarparks.length} nearest carparks to destination`
        : `Showing ${visibleCarparks.length} nearest carparks`;
    } else {
      message = `${visibleCarparks.length} of ${allCarparks.length} carparks shown`;
    }

    return locationError ? `${message} (${locationError})` : message;
  }, [
    searchStatus,
    allCarparks,
    loadStatus,
    showNearestOnly,
    destinationLocation,
    userLocation,
    visibleCarparks,
    locationError,
  ]);

  // Layout: shift the search box/controls/status down when the offline
  // banner is showing, same as the web app's CSS transition.
  const baseTop = insets.top + 10;
  const shift = isOffline ? 36 : 0;
  const controlsTop = baseTop + shift;
  const statusTop = baseTop + 50 + shift;

  return (
    <View style={styles.container}>
      <CarparkMap
        mapRef={mapRef}
        carparks={visibleCarparks}
        availability={availability}
        destinationLocation={destinationLocation}
        onMarkerPress={setSelectedCarpark}
      />

      <OfflineBanner visible={isOffline} top={insets.top} />
      <SearchBar top={controlsTop} onSearch={handleSearch} />
      <StatusPill top={statusTop} message={statusMessage} />
      <ControlButtons
        top={controlsTop}
        showNearestOnly={showNearestOnly}
        onToggleNearest={handleToggleNearest}
      />
      <LocateButton bottom={insets.bottom + 90} active={!!userLocation} onPress={handleLocatePress} />
      <Legend />

      <CarparkDetailsSheet
        carpark={selectedCarpark}
        availability={availability}
        onClose={() => setSelectedCarpark(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
