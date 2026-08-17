import { BottomSheetView } from '@gorhom/bottom-sheet';
import { type MarkerData } from '@/types';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import JobList from './JobList';
import Submission from './Submission';
import {
  acceptMarker,
  releaseMarker,
  completeMarker,
  createReport,
} from '@/services/markerService';

interface MarkerDetailsSheetProps {
  data: MarkerData;
  markers: MarkerData[];
  onSelectNewMarker?: (marker: MarkerData) => void;
  onClose?: () => void;
  currentUserId: string;
  currentUserName: string;
}

const MarkerDetailsSheet = ({
  data,
  markers,
  onSelectNewMarker,
  onClose,
  currentUserId,
  currentUserName,
}: MarkerDetailsSheetProps) => {
  const [distance, setDistance] = useState<string | null>(null);
  const [showSubmission, setShowSubmission] = useState(
    data.status === 'accepted' && data.acceptedById === currentUserId
  );
  const [isAccepting, setIsAccepting] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync submission view with marker status when marker changes
  useEffect(() => {
    setShowSubmission(data.status === 'accepted' && data.acceptedById === currentUserId);
  }, [data.id, data.status, data.acceptedById, currentUserId]);

  const moveSelection = (direction: number) => {
    if (onSelectNewMarker && markers.length > 0) {
      const currentIndex = markers.findIndex((m) => m.id === data.id);
      const nextIndex =
        direction > 0
          ? (currentIndex + 1) % markers.length
          : (currentIndex - 1 + markers.length) % markers.length;
      const nextMarker = markers[nextIndex];
      if (nextMarker) {
        onSelectNewMarker(nextMarker);
      }
    }
  };

  useEffect(() => {
    setDistance(null);

    const calculateDistance = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const R = 6371;
      const dLat = deg2rad(location.coords.latitude - data.location.latitude);
      const dLon = deg2rad(location.coords.longitude - data.location.longitude);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(deg2rad(location.coords.latitude)) *
          Math.cos(deg2rad(data.location.latitude)) *
          Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      setDistance(`${d.toFixed(2)}km`);
    };

    calculateDistance();
  }, [data]);

  if (!data) return null;

  const deg2rad = (deg: number) => deg * (Math.PI / 180);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await acceptMarker(data.id, currentUserId, currentUserName);
      setShowSubmission(true);
    } catch (err) {
      console.error('Accept marker failed:', err);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleRelease = async () => {
    setIsReleasing(true);
    try {
      await releaseMarker(data.id);
      setShowSubmission(false);
    } catch (err) {
      console.error('Release marker failed:', err);
    } finally {
      setIsReleasing(false);
    }
  };

  const handleComplete = async (message: string) => {
    setIsSubmitting(true);
    try {
      await createReport({
        markerId: data.id,
        submittedById: currentUserId,
        submittedByName: currentUserName,
        message: message || 'No notes provided.',
      });
      await completeMarker(data.id);
      setShowSubmission(false);
      onClose?.();
    } catch (err) {
      console.error('Submit report and complete marker failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheetView className="w-full px-5 pb-8 pt-1">
      {!showSubmission ? (
        <JobList
          marker={data}
          distance={distance}
          onNext={() => moveSelection(1)}
          onPrev={() => moveSelection(-1)}
          onAccept={handleAccept}
          isLoading={isAccepting}
        />
      ) : (
        <Submission
          onRelease={handleRelease}
          onSubmit={handleComplete}
          isReleasing={isReleasing}
          isSubmitting={isSubmitting}
        />
      )}
    </BottomSheetView>
  );
};

export default MarkerDetailsSheet;
