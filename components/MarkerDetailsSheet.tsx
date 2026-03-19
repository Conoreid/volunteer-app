import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { LatLng } from 'react-native-maps';
import { MARKERS_DATA, type MarkerData } from '@/data/markers';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import JobList from './JobList';
import Submission from './Submission';

interface MarkerCoordinate extends LatLng {}

interface MarkerDetailsSheetProps {
  data: MarkerData;
  onSelectNewMarker?: (marker: MarkerData) => void;
}

// This component renders the data inside the bottom sheet
const MarkerDetailsSheet = ({ data, onSelectNewMarker }: MarkerDetailsSheetProps) => {
  const [distance, setDistance] = useState<string | null>(null);
  const [accept, setAccept] = useState<boolean | null>(false);

  const moveSelection = (direction: number) => {
    if (onSelectNewMarker) {
      // This is a simplified example. You'd need actual logic to determine the 'next' marker.
      // For instance, finding the current marker in MARKERS_DATA and getting the next one.
      const len = MARKERS_DATA.length;
      const currentIndex = MARKERS_DATA.findIndex((m) => m.id === data.id);
      const nextIndex = direction > 0 ? (currentIndex + 1) % len : (currentIndex - 1 + len) % len;

      const nextMarker = MARKERS_DATA[nextIndex]; // Make sure MARKERS_DATA is accessible here
      if (nextMarker) {
        onSelectNewMarker(nextMarker);
      }
    }
  };

  useEffect(() => {
    // Start Loading
    setDistance(null);

    let active = true;

    const calculateDistance = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const R = 6371; // km

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

    return () => {
      active = false;
    };
  }, [data]);

  if (!data) return null; // Should never happen, but safe check

  

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const acceptMarker = (condition: boolean) => {
    setAccept(condition);
  };

  return (
    <BottomSheetView style={styles.sheetContent}>
      {accept == false ? (
        <JobList
          marker={data}
          distance={distance}
          onNext={() => moveSelection(1)}
          onPrev={() => moveSelection(-1)}
          onAccept={() => acceptMarker(true)}
        />
      ) : (
        <Submission onAccept={() => acceptMarker(false)} />
      )}
    </BottomSheetView>
  );
};

export default MarkerDetailsSheet;

const styles = StyleSheet.create({
  sheetContent: {
    padding: 20,
    alignItems: 'flex-start',
  },
  condition: {
    fontSize: 13,
    paddingStart: 10,
    fontWeight: 'bold',
  },
  dropshadow: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  red: {
    shadowColor: '#ef4444',
  },
  amber: {
    shadowColor: '#f59e0b',
  },
  green: {
    shadowColor: '#22c55e',
  },
});
