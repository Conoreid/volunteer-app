import React, { useRef, useCallback, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, LatLng } from 'react-native-maps';
import { View, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { MapPin } from 'lucide-react-native';
import MarkerDetailsSheet from '@/components/MarkerDetailsSheet';

interface MarkerCoordinate extends LatLng {}

interface MarkerData {
  id: string;
  location: MarkerCoordinate;
  conditions: Conditions;
  time: Date;
}

export type Conditions = {
  intoxicated: boolean;
  distressed: boolean;
  vulnerable: boolean;
};

const INITIAL_REGION = {
  latitude: 55.861486896052135,
  longitude: -4.2423500238778145,
  latitudeDelta: 0.0002,
  longitudeDelta: 0.0002,
};

export const MARKERS_DATA: MarkerData[] = [
  {
    id: '1',
    location: { latitude: 55.86156842949501, longitude: -4.242320186831703 },
    conditions: {
      intoxicated: true,
      distressed: true,
      vulnerable: true,
    },
    time: new Date(2026, 1, 16, 12, 44),
  },
  {
    id: '2',
    location: { latitude: 55.864237, longitude: -4.251806 }, // George Square
    conditions: {
      intoxicated: false,
      distressed: true,
      vulnerable: false,
    },
    time: new Date(2026, 1, 16, 11, 15),
  },
  {
    id: '3',
    location: { latitude: 55.860916, longitude: -4.251433 }, // Central Station
    conditions: {
      intoxicated: true,
      distressed: false,
      vulnerable: false,
    },
    time: new Date(2026, 1, 16, 10, 30),
  },
  {
    id: '4',
    location: { latitude: 55.858422, longitude: -4.259468 }, // Finnieston
    conditions: {
      intoxicated: false,
      distressed: true,
      vulnerable: true,
    },
    time: new Date(2026, 1, 16, 9, 50),
  },
  {
    id: '5',
    location: { latitude: 55.866149, longitude: -4.238214 }, // Merchant City
    conditions: {
      intoxicated: true,
      distressed: true,
      vulnerable: false,
    },
    time: new Date(2026, 1, 16, 8, 20),
  },
  {
    id: '6',
    location: { latitude: 55.863993, longitude: -4.244831 }, // Buchanan Street
    conditions: {
      intoxicated: false,
      distressed: false,
      vulnerable: true,
    },
    time: new Date(2026, 1, 16, 7, 40),
  },
  {
    id: '7',
    location: { latitude: 55.859902, longitude: -4.246512 }, // Argyle Street
    conditions: {
      intoxicated: true,
      distressed: false,
      vulnerable: true,
    },
    time: new Date(2026, 1, 16, 6, 10),
  },
  {
    id: '8',
    location: { latitude: 55.867721, longitude: -4.255098 }, // Sauchiehall Street
    conditions: {
      intoxicated: true,
      distressed: true,
      vulnerable: true,
    },
    time: new Date(2026, 1, 16, 5, 5),
  },
  {
    id: '9',
    location: { latitude: 55.862431, longitude: -4.235991 }, // High Street
    conditions: {
      intoxicated: false,
      distressed: true,
      vulnerable: false,
    },
    time: new Date(2026, 1, 16, 4, 25),
  },
  {
    id: '10',
    location: { latitude: 55.85732, longitude: -4.243801 }, // Clyde Street
    conditions: {
      intoxicated: true,
      distressed: false,
      vulnerable: false,
    },
    time: new Date(2026, 1, 16, 3, 55),
  },
  {
    id: '11',
    location: { latitude: 55.865003, longitude: -4.24111 }, // Cathedral Street
    conditions: {
      intoxicated: false,
      distressed: false,
      vulnerable: true,
    },
    time: new Date(2026, 1, 16, 2, 45),
  },
];

function MyCustomMarkerView({ conditions }: MarkerData) {
  const conditionCount = Object.values(conditions).filter(Boolean).length;
  const color =
    conditionCount === 3
      ? '#dc2626' // Tailwind red-600
      : conditionCount === 2
        ? '#eab308' // Tailwind yellow-500
        : conditionCount === 1
          ? '#22c55e' // Tailwind green-500
          : '#22c55e'; // Default to green if no conditions

  return (
    <View className="items-center justify-center">
      <MapPin size="30" color="black" fill={color} strokeWidth="1" />
    </View>
  );
}

export default function App() {
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedMarkerData, setSelectedMarkerData] = useState<MarkerData | null>(null);

  const snapPoints = ['35%', '45%', '55%'];

  const handleMarkerPress = useCallback((markerData: MarkerData) => {
    setSelectedMarkerData(markerData);
    // Animate map to the selected marker's location
    mapRef.current?.animateToRegion({
      latitude: markerData.location.latitude,
      longitude: markerData.location.longitude,
      latitudeDelta: INITIAL_REGION.latitudeDelta,
      longitudeDelta: INITIAL_REGION.longitudeDelta,
    }, 500); // 500ms animation duration
    bottomSheetRef.current?.snapToIndex(1); // Open the sheet to the second snap point
  }, []);

  // New function to handle switching markers from within the sheet
  const handleSwitchMarkerFromSheet = useCallback((newMarkerData: MarkerData) => {
    setSelectedMarkerData(newMarkerData);
    // Animate map to the new selected marker's location
    mapRef.current?.animateToRegion({
      latitude: newMarkerData.location.latitude,
      longitude: newMarkerData.location.longitude,
      latitudeDelta: INITIAL_REGION.latitudeDelta,
      longitudeDelta: INITIAL_REGION.longitudeDelta,
    }, 500);
    // The sheet will automatically re-render with the new data because selectedMarkerData changed.
  }, []);

  return (
    <View className="h-full w-full flex-1">
      <MapView
        initialRegion={INITIAL_REGION}
        provider={PROVIDER_GOOGLE}
        style={{ height: '100%', width: '100%' }}
        showsUserLocation
        showsMyLocationButton
        ref={mapRef}>
        {MARKERS_DATA.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.location}
            onPress={() => handleMarkerPress(marker)}>
            <MyCustomMarkerView {...marker} />
          </Marker>
        ))}
      </MapView>
      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints} enablePanDownToClose>
        {selectedMarkerData && (
          <MarkerDetailsSheet
            data={selectedMarkerData}
            onSelectNewMarker={handleSwitchMarkerFromSheet} // Pass the callback
          />
        )}
      </BottomSheet>
    </View>
  );
}
