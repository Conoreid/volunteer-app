import { type MarkerData, type Conditions } from '@/types';
import { getPriority } from '@/utils/markerUtils';

/**
 * Firestore Marker Document Schema
 */
export interface FirestoreMarkerDoc {
  id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  conditions: {
    intoxicated: boolean;
    distressed: boolean;
    vulnerable: boolean;
  };
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'accepted' | 'completed';
  time: any; // Firestore Timestamp | Date
  acceptedById: string | null;
  acceptedByName: string | null;
  acceptedAt: any | null; // Firestore Timestamp | Date | null
}

/**
 * Validates a marker object against the structural schema.
 * Throws an Error if any required field is missing or invalid.
 */
export function validateMarker(marker: Partial<MarkerData> & { id: string }): FirestoreMarkerDoc {
  if (!marker.id || typeof marker.id !== 'string') {
    throw new Error(`Invalid marker ID: "${marker.id}"`);
  }

  if (
    !marker.location ||
    typeof marker.location.latitude !== 'number' ||
    typeof marker.location.longitude !== 'number' ||
    isNaN(marker.location.latitude) ||
    isNaN(marker.location.longitude) ||
    marker.location.latitude < -90 ||
    marker.location.latitude > 90 ||
    marker.location.longitude < -180 ||
    marker.location.longitude > 180
  ) {
    throw new Error(
      `Invalid coordinates for marker ${marker.id}: ${JSON.stringify(marker.location)}`
    );
  }

  const conditions: Conditions = {
    intoxicated: Boolean(marker.conditions?.intoxicated),
    distressed: Boolean(marker.conditions?.distressed),
    vulnerable: Boolean(marker.conditions?.vulnerable),
  };

  const validStatuses = ['open', 'accepted', 'completed'];
  const status =
    marker.status && validStatuses.includes(marker.status)
      ? (marker.status as 'open' | 'accepted' | 'completed')
      : 'open';

  const priority = getPriority(conditions);

  return {
    id: marker.id,
    location: {
      latitude: marker.location.latitude,
      longitude: marker.location.longitude,
    },
    conditions,
    priority,
    status,
    time: marker.time || new Date(),
    acceptedById: marker.acceptedById ?? null,
    acceptedByName: marker.acceptedByName ?? null,
    acceptedAt: marker.acceptedAt ?? null,
  };
}
