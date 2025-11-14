import React, { useRef, useCallback } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const INITIAL_REGION = {
  latitude: 55.861486896052135,
  longitude: -4.2423500238778145,
  latitudeDelta: 0.0002,
  longitudeDelta: 0.0002,
};

export default function App() {
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = ['1%', '35%', '60%'];

  const handleMarkerPress = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
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
        <Marker
          onPress={handleMarkerPress}
          coordinate={{ latitude: 55.861486896052135, longitude: -4.2423500238778145 }}
        />
      </MapView>
      <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
        <BottomSheetView>
          <Text className="p-20">Marker Details Menu!</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
