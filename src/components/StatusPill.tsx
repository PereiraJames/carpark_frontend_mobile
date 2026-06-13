import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  text: {
    fontSize: 13,
  },
});
