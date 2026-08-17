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
import {
  type MarkerData,
  type ReportData,
  type CompletedJobItem,
  mapDocToMarkerData,
  mapDocToReportData,
} from '@/types';

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

/**
 * Subscribes to real-time updates for submitted reports.
 */
export function subscribeReports(
  onUpdate: (reports: ReportData[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(collection(db, REPORTS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const reports: ReportData[] = snapshot.docs
        .map((docSnap) => mapDocToReportData(docSnap.id, docSnap.data()))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      onUpdate(reports);
    },
    (error) => {
      console.error('Error fetching reports from Firestore:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Subscribes to completed jobs joined with their incident reports.
 */
export function subscribeCompletedJobs(
  onUpdate: (jobs: CompletedJobItem[]) => void,
  onError?: (error: Error) => void
) {
  let latestMarkers: MarkerData[] = [];
  let latestReports: ReportData[] = [];

  const emitJoined = () => {
    const completedMarkers = latestMarkers.filter((m) => m.status === 'completed');
    const items: CompletedJobItem[] = completedMarkers.map((marker) => {
      const report = latestReports.find((r) => r.markerId === marker.id);
      return {
        marker,
        report,
      };
    });
    // Sort newest first based on report creation or marker time
    items.sort((a, b) => {
      const timeA = a.report?.createdAt?.getTime() ?? a.marker.time?.getTime() ?? 0;
      const timeB = b.report?.createdAt?.getTime() ?? b.marker.time?.getTime() ?? 0;
      return timeB - timeA;
    });
    onUpdate(items);
  };

  const unsubMarkers = subscribeMarkers(
    (markers) => {
      latestMarkers = markers;
      emitJoined();
    },
    (err) => {
      if (onError) onError(err);
    }
  );

  const unsubReports = subscribeReports(
    (reports) => {
      latestReports = reports;
      emitJoined();
    },
    (err) => {
      if (onError) onError(err);
    }
  );

  return () => {
    unsubMarkers();
    unsubReports();
  };
}
