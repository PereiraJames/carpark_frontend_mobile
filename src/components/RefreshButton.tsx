import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

import { BUTTON_SIZE, CARD_SHADOW, COLORS } from '../styles/shared';

interface Props {
  top: number;
  refreshing: boolean;
  onPress: () => void;
}

/** Round FAB that manually triggers an availability refresh, spinning while in flight. */
export function RefreshButton({ top, refreshing, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, { top }]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={refreshing}
    >
      {refreshing ? (
        <ActivityIndicator size="small" color={COLORS.primary} />
      ) : (
        <MaterialIcons name="refresh" size={22} color={COLORS.muted} />
      )}
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
