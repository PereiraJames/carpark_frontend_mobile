import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AvailabilityMap, Carpark } from '../types';
import { lotsSummary } from '../utils/availability';
import { COLORS, RADIUS } from '../styles/shared';

interface Props {
  carpark: Carpark | null;
  availability: AvailabilityMap;
  onClose: () => void;
}

/** Bottom sheet shown when a carpark marker is tapped - replaces the web app's map popup. */
export function CarparkDetailsSheet({ carpark, availability, onClose }: Props) {
  if (!carpark) return null;

  const lots = lotsSummary(availability, carpark.carpark_id);

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${carpark.lat},${carpark.lon}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.sheet}>
      <View style={styles.handle} />
      <Text style={styles.title}>{carpark.carpark_name || carpark.carpark_id}</Text>

      <Row label="Type" value={carpark.carpark_type} />
      <Row label="Postal Code" value={carpark.postal_code || '-'} />
      <Row label="Weekday Rate" value={carpark.weekdays_rate_1 || '-'} />
      <Row label="Saturday Rate" value={carpark.saturday_rate || '-'} />
      <Row label="Sunday / PH Rate" value={carpark.sunday_publicholiday_rate || '-'} />

      {lots && (
        <View style={styles.lotsBlock}>
          <Text style={styles.lotsTitle}>Lots Available</Text>
          {lots.map((line) => (
            <Text key={line} style={styles.lotLine}>
              {line}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.navButton} onPress={handleNavigate} activeOpacity={0.85}>
          <Text style={styles.navButtonText}>Navigate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.85}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value ?? '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d8d8d8',
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  label: {
    fontSize: 13,
    color: COLORS.muted,
  },
  value: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  lotsBlock: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  lotsTitle: {
    fontWeight: '700',
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 4,
  },
  lotLine: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  navButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: 13,
    alignItems: 'center',
  },
  navButtonText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 14,
  },
  closeButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: RADIUS.sm,
    paddingVertical: 13,
    alignItems: 'center',
  },
  closeButtonText: {
    fontWeight: '700',
    fontSize: 14,
    color: COLORS.text,
  },
});
