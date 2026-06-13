import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { submitCarparkReport } from '../api/carparkApi';
import { AvailabilityMap, Carpark } from '../types';
import { lotsSummary } from '../utils/availability';
import { COLORS, RADIUS } from '../styles/shared';

const REPORT_CATEGORIES = ['Wrong info', 'Closed', 'Other'];

interface Props {
  carpark: Carpark | null;
  availability: AvailabilityMap;
  onClose: () => void;
}

/** Bottom sheet shown when a carpark marker is tapped - replaces the web app's map popup. */
export function CarparkDetailsSheet({ carpark, availability, onClose }: Props) {
  const [reportOpen, setReportOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [reportStatus, setReportStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');

  // Reset the report form whenever a different carpark is opened.
  useEffect(() => {
    setReportOpen(false);
    setCategory(null);
    setMessage('');
    setReportStatus('idle');
  }, [carpark?.carpark_id]);

  // Collapse the form a couple seconds after a successful submission.
  useEffect(() => {
    if (reportStatus !== 'sent') return;
    const timer = setTimeout(() => {
      setReportOpen(false);
      setReportStatus('idle');
      setCategory(null);
      setMessage('');
    }, 2000);
    return () => clearTimeout(timer);
  }, [reportStatus]);

  if (!carpark) return null;

  const lots = lotsSummary(availability, carpark.carpark_id);

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${carpark.lat},${carpark.lon}`;
    Linking.openURL(url);
  };

  const handleSubmitReport = async () => {
    if (!category) return;
    setReportStatus('submitting');
    try {
      await submitCarparkReport(carpark.carpark_id, category, message.trim());
      setReportStatus('sent');
    } catch (err) {
      console.warn('Report submission failed:', err);
      setReportStatus('error');
    }
  };

  return (
    <View style={styles.sheet}>
      <View style={styles.handle} />

      <View style={styles.titleRow}>
        <Text style={styles.title}>{carpark.carpark_name || carpark.carpark_id}</Text>
        <TouchableOpacity
          style={styles.reportLink}
          onPress={() => setReportOpen((open) => !open)}
          activeOpacity={0.7}
        >
          <MaterialIcons name="flag" size={14} color={COLORS.muted} />
          <Text style={styles.reportLinkText}>Report an issue</Text>
        </TouchableOpacity>
      </View>

      {reportOpen && (
        <View style={styles.reportBox}>
          {reportStatus === 'sent' ? (
            <Text style={styles.reportSentText}>Thanks - we've got your report.</Text>
          ) : (
            <>
              <View style={styles.chipRow}>
                {REPORT_CATEGORIES.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.chip, category === opt && styles.chipActive]}
                    onPress={() => setCategory(opt)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.chipText, category === opt && styles.chipTextActive]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.reportInput}
                placeholder="Add details (optional)"
                placeholderTextColor={COLORS.muted}
                value={message}
                onChangeText={setMessage}
                multiline
              />
              {reportStatus === 'error' && (
                <Text style={styles.reportErrorText}>Something went wrong - please try again.</Text>
              )}
              <TouchableOpacity
                style={[styles.reportSubmit, !category && styles.reportSubmitDisabled]}
                onPress={handleSubmitReport}
                disabled={!category || reportStatus === 'submitting'}
                activeOpacity={0.85}
              >
                <Text style={styles.reportSubmitText}>
                  {reportStatus === 'submitting' ? 'Sending...' : 'Submit report'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  reportLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginTop: 2,
  },
  reportLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.muted,
  },
  reportBox: {
    backgroundColor: '#f7f7f7',
    borderRadius: RADIUS.sm,
    padding: 10,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.text,
  },
  chipTextActive: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  reportInput: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    fontSize: 13,
    minHeight: 44,
    textAlignVertical: 'top',
    color: COLORS.text,
    marginBottom: 8,
  },
  reportSubmit: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: 10,
    alignItems: 'center',
  },
  reportSubmitDisabled: {
    backgroundColor: '#ccc',
  },
  reportSubmitText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 13,
  },
  reportSentText: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
    paddingVertical: 6,
  },
  reportErrorText: {
    fontSize: 12,
    color: COLORS.danger,
    marginBottom: 6,
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
    marginBottom: 30,
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
