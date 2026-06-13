import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { DEFAULT_REGION } from '../config';
import { Carpark, Coordinates, AvailabilityMap } from '../types';
import { availabilityColor } from '../utils/availability';

interface Props {
  mapRef: React.RefObject<MapView | null>;
  carparks: Carpark[];
  availability: AvailabilityMap;
  destinationLocation: Coordinates | null;
  onMarkerPress: (carpark: Carpark) => void;
}

export function CarparkMap({
  mapRef,
  carparks,
  availability,
  destinationLocation,
  onMarkerPress,
}: Props) {
  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      initialRegion={DEFAULT_REGION}
      showsCompass={false}
      toolbarEnabled={false}
      showsUserLocation
      showsMyLocationButton={false}
    >
      {carparks.map((cp) => (
        <Marker
          key={cp.carpark_id}
          coordinate={{ latitude: parseFloat(String(cp.lat)), longitude: parseFloat(String(cp.lon)) }}
          pinColor={availabilityColor(availability, cp.carpark_id)}
          title={cp.carpark_name || cp.carpark_id}
          onPress={() => onMarkerPress(cp)}
        />
      ))}

      {destinationLocation && (
        <Marker
          coordinate={{ latitude: destinationLocation.lat, longitude: destinationLocation.lon }}
          title="Destination"
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
