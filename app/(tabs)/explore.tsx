import React, { useRef, useCallback, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { MapPin, ChevronDown, Filter } from 'lucide-react-native';
import MarkerDetailsSheet from '@/components/MarkerDetailsSheet';
import { type MarkerData } from '@/types';
import { useMarkers } from '@/hooks/useMarkers';
import { getPriority } from '@/utils/markerUtils';
import { useAppTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/context/AuthContext';

const INITIAL_REGION = {
  latitude: 55.861486896052135,
  longitude: -4.2423500238778145,
  latitudeDelta: 0.0002,
  longitudeDelta: 0.0002,
};

type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

const PRIORITY_CONFIG: Record<PriorityFilter, { label: string; color: string }> = {
  all: { label: 'All', color: '#0d9488' },
  high: { label: 'High', color: '#dc2626' },
  medium: { label: 'Medium', color: '#eab308' },
  low: { label: 'Low', color: '#22c55e' },
};

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#373737' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c3c3c' }] },
  { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] },
];

function MyCustomMarkerView({ conditions }: MarkerData) {
  const conditionCount = Object.values(conditions).filter(Boolean).length;
  const color =
    conditionCount === 3
      ? '#dc2626'
      : conditionCount === 2
        ? '#eab308'
        : conditionCount === 1
          ? '#22c55e'
          : '#22c55e';

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
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const { isDark } = useAppTheme();
  const { user } = useAuth();
  const { data: markersList, isLoading, error } = useMarkers();
  const allMarkers: MarkerData[] = markersList.filter((m) => m.status !== 'completed');

  const markers =
    priorityFilter === 'all'
      ? allMarkers
      : allMarkers.filter((m) => getPriority(m.conditions) === priorityFilter);

  const snapPoints = ['35%', '45%', '55%', '65%', '75%', '85%', '100%'];

  const handleMarkerPress = useCallback((markerData: MarkerData) => {
    setSelectedMarkerData(markerData);
    mapRef.current?.animateToRegion(
      {
        latitude: markerData.location.latitude,
        longitude: markerData.location.longitude,
        latitudeDelta: INITIAL_REGION.latitudeDelta,
        longitudeDelta: INITIAL_REGION.longitudeDelta,
      },
      500
    );
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handleSwitchMarkerFromSheet = useCallback((newMarkerData: MarkerData) => {
    setSelectedMarkerData(newMarkerData);
    mapRef.current?.animateToRegion(
      {
        latitude: newMarkerData.location.latitude,
        longitude: newMarkerData.location.longitude,
        latitudeDelta: INITIAL_REGION.latitudeDelta,
        longitudeDelta: INITIAL_REGION.longitudeDelta,
      },
      500
    );
  }, []);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center gap-2 px-8">
        <Text className="text-lg text-red-600">Error loading markers</Text>
        <Text className="text-sm text-gray-500">{String(error)}</Text>
      </View>
    );
  }

  return (
    <View className="h-full w-full flex-1">
      <MapView
        initialRegion={INITIAL_REGION}
        provider={PROVIDER_GOOGLE}
        style={{ height: '100%', width: '100%' }}
        customMapStyle={isDark ? DARK_MAP_STYLE : undefined}
        showsUserLocation
        showsMyLocationButton
        ref={mapRef}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.location}
            onPress={() => handleMarkerPress(marker)}>
            <MyCustomMarkerView {...marker} />
          </Marker>
        ))}
      </MapView>
      {isLoading && (
        <View className="absolute left-0 right-0 top-2 items-center">
          <ActivityIndicator size="small" color={isDark ? '#14b8a6' : '#0d9488'} />
        </View>
      )}

      {/* Priority filter dropdown */}
      <View className="absolute right-3 top-12">
        <TouchableOpacity
          className={`flex flex-row items-center gap-2 rounded-xl px-3 py-2 shadow-md ${isDark ? 'bg-gray-800/90' : 'bg-white/90'}`}
          onPress={() => setFilterOpen(!filterOpen)}>
          <Filter size={16} color={isDark ? '#d1d5db' : '#374151'} />
          <View
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: PRIORITY_CONFIG[priorityFilter].color }}
          />
          <Text className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            {PRIORITY_CONFIG[priorityFilter].label}
          </Text>
          <ChevronDown
            size={16}
            color={isDark ? '#d1d5db' : '#374151'}
            style={{ transform: [{ rotate: filterOpen ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>

        {filterOpen && (
          <View
            className={`mt-1 overflow-hidden rounded-xl shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {(Object.keys(PRIORITY_CONFIG) as PriorityFilter[]).map((key) => {
              const { label, color } = PRIORITY_CONFIG[key];
              const isActive = priorityFilter === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => {
                    setPriorityFilter(key);
                    setFilterOpen(false);
                  }}
                  className={`flex flex-row items-center gap-2 px-4 py-2.5 ${isActive ? (isDark ? 'bg-gray-700' : 'bg-gray-100') : ''}`}>
                  <View className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                  <Text
                    className={`text-sm font-semibold ${isActive ? (isDark ? 'text-white' : 'text-gray-900') : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={isDark ? { backgroundColor: '#1f2937' } : undefined}>
        {selectedMarkerData && (
          <MarkerDetailsSheet
            data={selectedMarkerData}
            markers={markers}
            onSelectNewMarker={handleSwitchMarkerFromSheet}
            currentUserId={user?.id ?? ''}
            currentUserName={user?.displayName ?? user?.name ?? user?.email ?? 'Volunteer'}
          />
        )}
      </BottomSheet>
    </View>
  );
}
