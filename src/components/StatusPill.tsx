import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CARD_SHADOW, COLORS, RADIUS } from '../styles/shared';

interface Props {
  top: number;
  message: string;
}

export function StatusPill({ top, message }: Props) {
  return (
    <View style={[styles.container, { top }]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 10,
    zIndex: 10,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    ...CARD_SHADOW,
  },
  text: {
    fontSize: 13,
    color: COLORS.text,
  },
});
