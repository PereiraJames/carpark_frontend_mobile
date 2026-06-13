import { AvailabilityMap, LotInfo } from '../types';

export interface AvailabilitySummary {
  pct: number | null;
  totalAvailable: number;
  totalLots: number;
}

/** Aggregate lot counts across all lot types for a carpark. */
export function availabilityInfo(availability: AvailabilityMap, carparkId: string): AvailabilitySummary | null {
  const entry = availability[carparkId];
  if (!entry || !entry.carpark_info || !entry.carpark_info.length) return null;

  let totalAvailable = 0;
  let totalLots = 0;
  entry.carpark_info.forEach((info: LotInfo) => {
    totalAvailable += Number(info.lots_available) || 0;
    totalLots += Number(info.total_lots) || 0;
  });

  if (totalLots === 0) return { pct: null, totalAvailable, totalLots };
  return { pct: totalAvailable / totalLots, totalAvailable, totalLots };
}

/** Marker fill colour: green (many free), orange (few), red (full), grey (unknown). */
export function availabilityColor(availability: AvailabilityMap, carparkId: string): string {
  const info = availabilityInfo(availability, carparkId);
  if (!info || info.pct === null) return '#999999';
  if (info.pct === 0) return '#e74c3c';
  if (info.pct < 0.3) return '#f39c12';
  return '#2ecc71';
}

/** Human-readable "lot_type: available/total" lines for the details sheet. */
export function lotsSummary(availability: AvailabilityMap, carparkId: string): string[] | null {
  const entry = availability[carparkId];
  if (!entry || !entry.carpark_info) return null;
  return entry.carpark_info.map((info) => `${info.lot_type}: ${info.lots_available}/${info.total_lots}`);
}
