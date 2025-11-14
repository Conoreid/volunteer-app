import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <View className="h-full w-full flex-1">
      <MapView
        initialRegion={{
          latitude: 55.861486896052135,
          longitude: -4.2423500238778145,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        style={{ height: '100%', width: '100%' }}
      />
    </View>
  );
}
