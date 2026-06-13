import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BUTTON_SIZE, CARD_SHADOW, COLORS, RADIUS } from '../styles/shared';

interface Props {
  top: number;
  showNearestOnly: boolean;
  onToggleNearest: () => void;
}

export function ControlButtons({ top, showNearestOnly, onToggleNearest }: Props) {
  return (
    <View style={[styles.container, { top }]}>
      <TouchableOpacity
        style={[styles.button, showNearestOnly && styles.buttonActive]}
        onPress={onToggleNearest}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, showNearestOnly && styles.buttonTextActive]}>
          {showNearestOnly ? 'Show All' : 'Nearest 10'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 10,
    zIndex: 10,
  },
  button: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 16,
    height: BUTTON_SIZE,
    minWidth: BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    ...CARD_SHADOW,
  },
  buttonActive: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  buttonTextActive: {
    color: COLORS.surface,
  },
});
