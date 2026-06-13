/** Shapes returned by the Flask backend (carpark_app). */

export interface Carpark {
  id: number;
  carpark_id: string;
  carpark_type: string;
  carpark_name: string;
  postal_code: string | null;
  lat: string | number | null;
  lon: string | number | null;
  x_coord: string | number | null;
  y_coord: string | number | null;
  carpark_parking_details?: string | null;
  weekdays_rate_1?: string | null;
  weekdays_rate_2?: string | null;
  saturday_rate?: string | null;
  sunday_publicholiday_rate?: string | null;
  carpark_building?: string | null;
  type_of_parking_system?: string | null;
  short_term_parking?: string | null;
  free_parking?: string | null;
  night_parking?: string | null;
  last_updated?: string | null;
  carpark_availability?: unknown;
}

export interface LotInfo {
  lot_type: string;
  lots_available: number | string;
  total_lots: number | string;
}

export interface AvailabilityEntry {
  carpark_info: LotInfo[];
  [key: string]: unknown;
}

export type AvailabilityMap = Record<string, AvailabilityEntry>;

export interface Coordinates {
  lat: number;
  lon: number;
}
