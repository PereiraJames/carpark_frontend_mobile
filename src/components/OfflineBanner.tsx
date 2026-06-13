import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../styles/shared';

interface Props {
  visible: boolean;
  top: number;
}

export function OfflineBanner({ visible, top }: Props) {
  if (!visible) return null;

  return (
    <View style={[styles.banner, { top }]}>
      <MaterialIcons name="cloud-off" size={14} color={COLORS.surface} />
      <Text style={styles.text}>Offline Mode - Not connected to servers</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: COLORS.danger,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  text: {
    color: COLORS.surface,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
});
