import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  bottom: number;
  active: boolean;
  onPress: () => void;
}

/** Round "recenter on my location" FAB, styled after the Google Maps location button. */
export function LocateButton({ bottom, active, onPress }: Props) {
  return (
    <TouchableOpacity style={[styles.button, { bottom }]} onPress={onPress}>
      <MaterialIcons name="my-location" size={22} color={active ? '#2a81cb' : '#666'} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 10,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
});
