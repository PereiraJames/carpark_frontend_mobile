import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DESTINATION_COLOR, TYPE_BORDER_COLORS } from '../config';

const AVAILABILITY_ROWS: Array<{ color: string; label: string }> = [
  { color: '#2ecc71', label: 'Many lots' },
  { color: '#f39c12', label: 'Few lots' },
  { color: '#e74c3c', label: 'Full' },
  { color: '#999999', label: 'Unknown' },
];

const TYPE_ROWS: Array<{ border: string; label: string }> = [
  { border: TYPE_BORDER_COLORS.HDB, label: 'HDB' },
  { border: TYPE_BORDER_COLORS.LTA, label: 'LTA' },
];

export function Legend() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Availability</Text>
      {AVAILABILITY_ROWS.map(({ color, label }) => (
        <View key={label} style={styles.row}>
          <View style={[styles.swatch, { backgroundColor: color, borderColor: color }]} />
          <Text style={styles.label}>{label}</Text>
        </View>
      ))}

      <Text style={[styles.title, styles.titleSpaced]}>Type (border)</Text>
      {TYPE_ROWS.map(({ border, label }) => (
        <View key={label} style={styles.row}>
          <View style={[styles.swatch, { backgroundColor: '#fff', borderColor: border }]} />
          <Text style={styles.label}>{label}</Text>
        </View>
      ))}

      <View style={styles.row}>
        <MaterialIcons name="place" size={16} color={DESTINATION_COLOR} style={styles.pin} />
        <Text style={styles.label}>Destination</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    zIndex: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  title: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  titleSpaced: {
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  pin: {
    width: 12,
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
  },
});
