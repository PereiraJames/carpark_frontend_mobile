import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { DEFAULT_REGION, DESTINATION_COLOR, NEAREST_LIMIT } from '../config';
import { Carpark, Coordinates, AvailabilityMap } from '../types';
import { availabilityColor, typeBorderColor } from '../utils/availability';

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
  // Coloured pips (occupancy fill + carpark-type border) are only used for the
  // short "nearest" lists. Rendering thousands of custom-view markers for
  // "Show All" causes severe lag, so that case falls back to plain pins.
  const useDetailedPips = carparks.length <= NEAREST_LIMIT;

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
      {carparks.map((cp) => {
        const coordinate = { latitude: parseFloat(String(cp.lat)), longitude: parseFloat(String(cp.lon)) };
        const fill = availabilityColor(availability, cp.carpark_id);

        if (!useDetailedPips) {
          return (
            <Marker
              key={cp.carpark_id}
              coordinate={coordinate}
              pinColor={fill}
              title={cp.carpark_name || cp.carpark_id}
              onPress={() => onMarkerPress(cp)}
            />
          );
        }

        const border = typeBorderColor(cp.carpark_type);
        return (
          <Marker
            key={`${cp.carpark_id}-${fill}-${border}`}
            coordinate={coordinate}
            anchor={{ x: 0.5, y: 0.5 }}
            title={cp.carpark_name || cp.carpark_id}
            onPress={() => onMarkerPress(cp)}
          >
            <View style={[styles.dot, { backgroundColor: fill, borderColor: border }]} />
          </Marker>
        );
      })}

      {destinationLocation && (
        <Marker
          coordinate={{ latitude: destinationLocation.lat, longitude: destinationLocation.lon }}
          anchor={{ x: 0.5, y: 1 }}
          title="Destination"
        >
          <MaterialIcons name="place" size={36} color={DESTINATION_COLOR} />
        </Marker>
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
  },
});
