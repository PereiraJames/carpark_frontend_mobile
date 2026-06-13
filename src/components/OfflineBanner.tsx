import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  visible: boolean;
  top: number;
}

export function OfflineBanner({ visible, top }: Props) {
  if (!visible) return null;

  return (
    <View style={[styles.banner, { top }]}>
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
    backgroundColor: '#c0392b',
    paddingVertical: 6,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
