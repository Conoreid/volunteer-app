import React, { useRef, useCallback, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, LatLng } from 'react-native-maps';
import { View, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { MapPin } from 'lucide-react-native';
import MarkerDetailsSheet from '@/components/MarkerDetailsSheet';
import { MARKERS_DATA, type MarkerData } from '@/data/markers'



const INITIAL_REGION = {
  latitude: 55.861486896052135,
  longitude: -4.2423500238778145,
  latitudeDelta: 0.0002,
  longitudeDelta: 0.0002,
};


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

  const snapPoints = ['35%', '45%', '55%', '65%', '75%', '85%', '100%'];

  const handleMarkerPress = useCallback((markerData: MarkerData) => {
    setSelectedMarkerData(markerData);
    // Animate map to the selected marker's location
    mapRef.current?.animateToRegion(
      {
        latitude: markerData.location.latitude,
        longitude: markerData.location.longitude,
        latitudeDelta: INITIAL_REGION.latitudeDelta,
        longitudeDelta: INITIAL_REGION.longitudeDelta,
      },
      500
    ); // 500ms animation duration
    bottomSheetRef.current?.snapToIndex(1); // Open the sheet to the second snap point
  }, []);

  // New function to handle switching markers from within the sheet
  const handleSwitchMarkerFromSheet = useCallback((newMarkerData: MarkerData) => {
    setSelectedMarkerData(newMarkerData);
    // Animate map to the new selected marker's location
    mapRef.current?.animateToRegion(
      {
        latitude: newMarkerData.location.latitude,
        longitude: newMarkerData.location.longitude,
        latitudeDelta: INITIAL_REGION.latitudeDelta,
        longitudeDelta: INITIAL_REGION.longitudeDelta,
      },
      500
    );
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
