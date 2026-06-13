import React from 'react';
import { Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AvailabilityMap, Carpark } from '../types';
import { lotsSummary } from '../utils/availability';

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
    <Modal animationType="slide" transparent visible onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
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
          <TouchableOpacity style={styles.navButton} onPress={handleNavigate}>
            <Text style={styles.navButtonText}>Navigate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    paddingBottom: 28,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  label: {
    fontWeight: '600',
    fontSize: 13,
  },
  value: {
    fontSize: 13,
  },
  lotsBlock: {
    marginTop: 6,
  },
  lotsTitle: {
    fontWeight: '600',
    fontSize: 13,
  },
  lotLine: {
    fontSize: 13,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#2a81cb',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontWeight: 'bold',
  },
});
