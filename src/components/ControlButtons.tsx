import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    gap: 6,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  buttonActive: {
    backgroundColor: '#2a81cb',
  },
  buttonText: {
    fontSize: 15,
    textAlign: 'center',
  },
  buttonTextActive: {
    color: 'white',
  },
});
