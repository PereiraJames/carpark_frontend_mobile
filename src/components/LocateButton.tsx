import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { BUTTON_SIZE, CARD_SHADOW, COLORS } from '../styles/shared';

interface Props {
  top: number;
  active: boolean;
  onPress: () => void;
}

/** Round "recenter on my location" FAB, styled after the Google Maps location button. */
export function LocateButton({ top, active, onPress }: Props) {
  return (
    <TouchableOpacity style={[styles.button, { top }]} onPress={onPress} activeOpacity={0.8}>
      <MaterialIcons name="my-location" size={22} color={active ? COLORS.primary : COLORS.muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 10,
    zIndex: 10,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...CARD_SHADOW,
  },
});
