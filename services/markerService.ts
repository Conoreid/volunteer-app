import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
} from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import { type MarkerData, mapDocToMarkerData } from '@/types';

const MARKERS_COLLECTION = 'markers';
const REPORTS_COLLECTION = 'reports';

/**
 * Subscribes to real-time updates for all markers in Firestore.
 */
export function subscribeMarkers(
  onUpdate: (markers: MarkerData[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(collection(db, MARKERS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const markers: MarkerData[] = snapshot.docs.map((docSnap) =>
        mapDocToMarkerData(docSnap.id, docSnap.data())
      );
      onUpdate(markers);
    },
    (error) => {
      console.error('Error fetching markers from Firestore:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Fetches markers once from Firestore.
 */
export async function getMarkers(): Promise<MarkerData[]> {
  const snapshot = await getDocs(collection(db, MARKERS_COLLECTION));
  return snapshot.docs.map((docSnap) => mapDocToMarkerData(docSnap.id, docSnap.data()));
}

/**
 * Marks a task/marker as accepted by the volunteer.
 */
export async function acceptMarker(
  markerId: string,
  userId: string,
  userName: string
): Promise<void> {
  const markerRef = doc(db, MARKERS_COLLECTION, markerId);
  await updateDoc(markerRef, {
    status: 'accepted',
    acceptedById: userId,
    acceptedByName: userName,
    acceptedAt: serverTimestamp(),
  });
}

/**
 * Releases an accepted task back to open status.
 */
export async function releaseMarker(markerId: string): Promise<void> {
  const markerRef = doc(db, MARKERS_COLLECTION, markerId);
  await updateDoc(markerRef, {
    status: 'open',
    acceptedById: null,
    acceptedByName: null,
    acceptedAt: null,
  });
}

/**
 * Marks a task as completed.
 */
export async function completeMarker(markerId: string): Promise<void> {
  const markerRef = doc(db, MARKERS_COLLECTION, markerId);
  await updateDoc(markerRef, {
    status: 'completed',
  });
}

/**
 * Submits an incident report for a marker.
 */
export async function createReport(report: {
  markerId: string;
  submittedById: string;
  submittedByName: string;
  message: string;
}): Promise<string> {
  const reportRef = await addDoc(collection(db, REPORTS_COLLECTION), {
    markerId: report.markerId,
    submittedById: report.submittedById,
    submittedByName: report.submittedByName,
    message: report.message,
    createdAt: serverTimestamp(),
  });
  return reportRef.id;
}
