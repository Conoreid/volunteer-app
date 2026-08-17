import type { LatLng } from 'react-native-maps';

export type MarkerCoordinate = LatLng;

export type Conditions = {
  intoxicated: boolean;
  distressed: boolean;
  vulnerable: boolean;
};

export interface MarkerData {
  id: string;
  location: MarkerCoordinate;
  conditions: Conditions;
  time: Date;
  status: string;
  acceptedById: string | null;
  acceptedByName: string | null;
  acceptedAt: Date | null;
}

export interface ReportData {
  id?: string;
  markerId: string;
  submittedById: string;
  submittedByName: string;
  message: string;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  role?: string;
  [key: string]: any;
}

export function toDate(val: any): Date {
  if (!val) return new Date();
  if (val instanceof Date) return val;
  if (typeof val.toDate === 'function') return val.toDate();
  return new Date(val);
}

export function mapDocToMarkerData(id: string, data: any): MarkerData {
  return {
    id,
    location: {
      latitude: data.location?.latitude ?? data.lat ?? 0,
      longitude: data.location?.longitude ?? data.lng ?? 0,
    },
    conditions: {
      intoxicated: Boolean(data.conditions?.intoxicated ?? data.intoxicated),
      distressed: Boolean(data.conditions?.distressed ?? data.distressed),
      vulnerable: Boolean(data.conditions?.vulnerable ?? data.vulnerable),
    },
    time: toDate(data.time),
    status: data.status ?? 'open',
    acceptedById: data.acceptedById ?? null,
    acceptedByName: data.acceptedByName ?? null,
    acceptedAt: data.acceptedAt ? toDate(data.acceptedAt) : null,
  };
}
