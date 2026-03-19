import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Conditions, MarkerData, MARKERS_DATA } from '@/data/markers';
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { MoveLeft } from 'lucide-react-native';
import { MoveRight } from 'lucide-react-native';
import { Check } from 'lucide-react-native';

interface MarkerDetailsSheetProps {
  data: MarkerData;
  onSelectNewMarker?: (marker: MarkerData) => void;
}

// This component renders the data inside the bottom sheet
const MarkerDetailsSheet = ({ data, onSelectNewMarker }: MarkerDetailsSheetProps) => {
  const [distance, setDistance] = useState<string | null>(null);
  const [accept, setAccept] = useState<boolean | null>(false);

  const handleNextMarkerPress = (direction: number) => {
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

  const priority = (data: Conditions) => {
    const n = Object.values(data).filter((c, i) => c).length;

    if (n === 3) return 'high';
    if (n === 2) return 'medium';
    return 'low';
  };

  const getTime = (data: MarkerData) => {
    const now = Date.now();
    const diffSeconds = Math.floor((now - data.time.getTime()) / 1000);

    const days = Math.floor(diffSeconds / 86400);
    const hours = Math.floor((diffSeconds % 86400) / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    }

    if (hours > 0) {
      return hours > 3
        ? `${hours} hour${hours > 1 ? 's' : ''}`
        : `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} min${minutes !== 1 ? 's' : ''}`;
    }

    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const acceptJob = (condition: boolean) => {
    setAccept(condition);
  };

  return (
    <BottomSheetView style={styles.sheetContent}>
      {accept == false ? (
        <View>
          <View className="flex flex-row gap-20">
            <View>
              <View className="flex flex-col items-start justify-center">
                <View className="flex flex-row items-center justify-center gap-2">
                  <FontAwesome className="w-8 text-center" name="clock-o" size={24} color="black" />
                  <Text className="text-sm font-bold">
                    <Text className="text-sm font-normal italic">Reported </Text>
                    {getTime(data)}
                    <Text className="text-sm font-normal italic"> ago</Text>
                  </Text>
                </View>

                <View className="flex flex-row items-center justify-center gap-2">
                  <FontAwesome
                    className="w-8 text-center"
                    name="map-marker"
                    size={24}
                    color="black"
                  />
                  <Text className="text-sm font-bold">
                    {distance === null ? ' Calculating distance...' : distance}
                    <Text className="text-sm font-normal italic">
                      {distance === null ? '' : ' away'}
                    </Text>
                  </Text>
                </View>
              </View>
              <View>
                <Text className="text-md italic">Conditions:</Text>
                {data.conditions.intoxicated ? (
                  <Text style={styles.condition}>• Intoxicated</Text>
                ) : null}
                {data.conditions.distressed ? (
                  <Text style={styles.condition}>• Distressed</Text>
                ) : null}
                {data.conditions.vulnerable ? (
                  <Text style={styles.condition}>• Vulnerable</Text>
                ) : null}
              </View>
            </View>
            <View className="flex h-32 flex-row gap-2">
              <Text className="font-bold">Priority:</Text>
              {priority(data.conditions) === 'high' ? (
                <View
                  style={[styles.dropshadow, styles.red]}
                  className="h-6 w-11 rounded-lg bg-red-600"
                />
              ) : priority(data.conditions) === 'medium' ? (
                <View
                  style={[styles.dropshadow, styles.amber]}
                  className="h-6 w-11 rounded-lg bg-amber-500"
                />
              ) : (
                <View
                  style={[styles.dropshadow, styles.green]}
                  className="h-6 w-11 rounded-lg bg-green-500"
                />
              )}
            </View>
          </View>
          <View className="mx-auto flex max-w-lg flex-row items-center gap-20 p-3">
            <TouchableOpacity onPress={() => handleNextMarkerPress(-1)}>
              <View className="flex flex-row items-center rounded-lg border-[1px] border-slate-200 px-7 py-3 drop-shadow-lg ">
                <MoveLeft />
                <Text className="text-2xl"> Back</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNextMarkerPress(1)}>
              <View className="flex flex-row items-center rounded-lg border-[1px] border-slate-200 px-7 py-3 drop-shadow-lg">
                <Text className="text-2xl">Next </Text>
                <MoveRight />
              </View>
            </TouchableOpacity>
          </View>
          <View className="mx-auto flex max-w-lg flex-row items-center gap-20 p-3">
            <TouchableOpacity onPress={() => acceptJob(true)}>
              <View className="flex flex-row items-center gap-3 rounded-lg border-[1px] border-slate-200 bg-green-500 px-24 py-5 drop-shadow-lg">
                <Text className="text-2xl font-bold text-white">Accept Job</Text>
                <Check color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <Text>test</Text>
          <TouchableOpacity onPress={() => acceptJob(false)}>
            <Text>testing</Text>
          </TouchableOpacity>
        </View>
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
