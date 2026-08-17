import React, { useRef, useCallback, useState, useMemo } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import {
  ChevronDown,
  Filter,
  Navigation as NavigationIcon,
  Crosshair,
  Plus,
  Minus,
} from 'lucide-react-native';
import MarkerDetailsSheet from '@/components/MarkerDetailsSheet';
import { type MarkerData } from '@/types';
import { useMarkers } from '@/hooks/useMarkers';
import { getPriority } from '@/utils/markerUtils';
import { useAppTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/context/AuthContext';

const INITIAL_REGION = {
  latitude: 55.8625,
  longitude: -4.2465,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

const PRIORITY_CONFIG: Record<PriorityFilter, { label: string; color: string }> = {
  all: { label: 'All Markers', color: '#008B8B' },
  high: { label: 'High', color: '#F85A65' },
  medium: { label: 'Medium', color: '#FF9F0A' },
  low: { label: 'Low', color: '#008B8B' },
};

const MARKER_IMAGES = {
  high: require('@/assets/marker_high.png'),
  medium: require('@/assets/marker_medium.png'),
  low: require('@/assets/marker_low.png'),
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

function MapMarkerItem({ marker, onPress }: { marker: MarkerData; onPress: () => void }) {
  const priority = getPriority(marker.conditions);
  const imageSource = MARKER_IMAGES[priority];

  return (
    <Marker
      coordinate={marker.location}
      image={imageSource}
      anchor={{ x: 0.5, y: 1.0 }}
      onPress={onPress}
    />
  );
}

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedMarkerData, setSelectedMarkerData] = useState<MarkerData | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const { isDark } = useAppTheme();
  const { user } = useAuth();
  const { data: markersList, isLoading, error } = useMarkers();
  const allMarkers: MarkerData[] = markersList.filter((m) => m.status !== 'completed');

  const markers =
    priorityFilter === 'all'
      ? allMarkers
      : allMarkers.filter((m) => getPriority(m.conditions) === priorityFilter);

  const snapPoints = useMemo(() => ['48%', '56%'], []);

  const handleMarkerPress = useCallback((markerData: MarkerData) => {
    setSelectedMarkerData(markerData);
    mapRef.current?.animateToRegion(
      {
        latitude: markerData.location.latitude,
        longitude: markerData.location.longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      },
      500
    );
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleSwitchMarkerFromSheet = useCallback((newMarkerData: MarkerData) => {
    setSelectedMarkerData(newMarkerData);
    mapRef.current?.animateToRegion(
      {
        latitude: newMarkerData.location.latitude,
        longitude: newMarkerData.location.longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      },
      500
    );
  }, []);

  const handleCloseSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setSelectedMarkerData(null);
  }, []);

  // Automatically dismiss sheet if selected job is completed/removed in Firestore
  React.useEffect(() => {
    if (selectedMarkerData) {
      const activeMatch = allMarkers.find((m) => m.id === selectedMarkerData.id);
      if (!activeMatch) {
        bottomSheetRef.current?.close();
        setSelectedMarkerData(null);
      } else if (
        activeMatch.status !== selectedMarkerData.status ||
        activeMatch.acceptedById !== selectedMarkerData.acceptedById
      ) {
        setSelectedMarkerData(activeMatch);
      }
    }
  }, [allMarkers, selectedMarkerData]);

  // Dismiss bottom sheet if active filter changes and excludes the selected marker
  React.useEffect(() => {
    if (selectedMarkerData && priorityFilter !== 'all') {
      const currentPriority = getPriority(selectedMarkerData.conditions);
      if (currentPriority !== priorityFilter) {
        bottomSheetRef.current?.close();
        setSelectedMarkerData(null);
      }
    }
  }, [priorityFilter, selectedMarkerData]);

  const handleSelectFilter = (key: PriorityFilter) => {
    setPriorityFilter(key);
    setFilterOpen(false);
    if (selectedMarkerData && key !== 'all') {
      const currentPriority = getPriority(selectedMarkerData.conditions);
      if (currentPriority !== key) {
        bottomSheetRef.current?.close();
        setSelectedMarkerData(null);
      }
    }
  };

  const handleLocateMe = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is needed to centre on your position.'
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      mapRef.current?.animateToRegion(
        {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        },
        600
      );
    } catch (e) {
      console.warn('Could not retrieve user location:', e);
    } finally {
      setIsLocating(false);
    }
  };

  const handleZoomIn = async () => {
    const camera = await mapRef.current?.getCamera();
    if (camera && camera.zoom !== undefined) {
      mapRef.current?.animateCamera({ zoom: camera.zoom + 1 }, { duration: 250 });
    }
  };

  const handleZoomOut = async () => {
    const camera = await mapRef.current?.getCamera();
    if (camera && camera.zoom !== undefined) {
      mapRef.current?.animateCamera({ zoom: camera.zoom - 1 }, { duration: 250 });
    }
  };

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
        customMapStyle={isDark ? DARK_MAP_STYLE : []}
        userInterfaceStyle={isDark ? 'dark' : 'light'}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        ref={mapRef}>
        {markers.map((marker) => (
          <MapMarkerItem
            key={marker.id}
            marker={marker}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>
      {isLoading && (
        <View className="absolute left-0 right-0 top-2 items-center">
          <ActivityIndicator size="small" color={isDark ? '#14b8a6' : '#0d9488'} />
        </View>
      )}

      {/* Top Left: Filter Pill Selector */}
      <View className="absolute left-4 top-4 z-20">
        <TouchableOpacity
          className={`flex flex-row items-center gap-2 rounded-2xl border px-3.5 py-2.5 shadow-md ${
            isDark
              ? 'border-gray-800 bg-surface-dark-card shadow-black/40'
              : 'border-slate-200/80 bg-white shadow-slate-200/60'
          }`}
          onPress={() => setFilterOpen(!filterOpen)}>
          <Filter size={15} color={isDark ? '#d1d5db' : '#374151'} />
          <View
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: PRIORITY_CONFIG[priorityFilter].color }}
          />
          <Text className={`text-xs font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            {PRIORITY_CONFIG[priorityFilter].label}
          </Text>
          <ChevronDown
            size={15}
            color={isDark ? '#d1d5db' : '#374151'}
            style={{ transform: [{ rotate: filterOpen ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>

        {filterOpen && (
          <View
            className={`mt-1.5 min-w-[150px] overflow-hidden rounded-2xl border shadow-xl ${
              isDark
                ? 'border-gray-800 bg-surface-dark-card shadow-black/50'
                : 'border-slate-200/80 bg-white shadow-slate-300/60'
            }`}>
            {(Object.keys(PRIORITY_CONFIG) as PriorityFilter[]).map((key) => {
              const { label, color } = PRIORITY_CONFIG[key];
              const isActive = priorityFilter === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => handleSelectFilter(key)}
                  className={`flex flex-row items-center gap-2.5 px-4 py-2.5 ${
                    isActive ? (isDark ? 'bg-gray-800' : 'bg-slate-100') : ''
                  }`}>
                  <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <Text
                    className={`text-xs font-semibold ${
                      isActive
                        ? isDark
                          ? 'text-white'
                          : 'text-gray-900'
                        : isDark
                          ? 'text-gray-400'
                          : 'text-gray-500'
                    }`}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Top Right: Intuitive Floating Action Stack */}
      <View className="absolute right-4 top-4 z-20 items-center gap-2.5">
        {/* Find My GPS Location */}
        <TouchableOpacity
          onPress={handleLocateMe}
          disabled={isLocating}
          className={`h-11 w-11 items-center justify-center rounded-2xl border shadow-md active:scale-95 ${
            isDark
              ? 'border-gray-800 bg-surface-dark-card shadow-black/40'
              : 'border-slate-200/80 bg-white shadow-slate-200/60'
          }`}>
          {isLocating ? (
            <ActivityIndicator size="small" color="#006767" />
          ) : (
            <Crosshair size={20} color="#006767" />
          )}
        </TouchableOpacity>

        {/* Re-center Sector (Glasgow City Centre) */}
        <TouchableOpacity
          onPress={() => {
            mapRef.current?.animateToRegion(INITIAL_REGION, 500);
          }}
          className={`h-11 w-11 items-center justify-center rounded-2xl border shadow-md active:scale-95 ${
            isDark
              ? 'border-gray-800 bg-surface-dark-card shadow-black/40'
              : 'border-slate-200/80 bg-white shadow-slate-200/60'
          }`}>
          <NavigationIcon size={19} color="#006767" />
        </TouchableOpacity>

        {/* Zoom In & Zoom Out Pill */}
        <View
          className={`w-11 items-center overflow-hidden rounded-2xl border shadow-md ${
            isDark
              ? 'border-gray-800 bg-surface-dark-card shadow-black/40'
              : 'border-slate-200/80 bg-white shadow-slate-200/60'
          }`}>
          <TouchableOpacity
            onPress={handleZoomIn}
            className="h-10 w-full items-center justify-center active:opacity-60">
            <Plus size={18} color={isDark ? '#e5e7eb' : '#334155'} />
          </TouchableOpacity>
          <View className={`h-[1px] w-7 ${isDark ? 'bg-gray-800' : 'bg-slate-200'}`} />
          <TouchableOpacity
            onPress={handleZoomOut}
            className="h-10 w-full items-center justify-center active:opacity-60">
            <Minus size={18} color={isDark ? '#e5e7eb' : '#334155'} />
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={(index) => {
          if (index === -1) {
            setSelectedMarkerData(null);
          }
        }}
        handleIndicatorStyle={{
          backgroundColor: isDark ? '#4b5563' : '#cbd5e1',
          width: 44,
          height: 5,
        }}
        backgroundStyle={
          isDark
            ? {
                backgroundColor: '#1a1b1f',
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                borderTopWidth: 1,
                borderColor: '#2f3034',
              }
            : {
                backgroundColor: '#ffffff',
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                borderTopWidth: 1,
                borderColor: '#f1f5f9',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.06,
                shadowRadius: 16,
              }
        }>
        {selectedMarkerData && (
          <MarkerDetailsSheet
            data={selectedMarkerData}
            markers={markers}
            onSelectNewMarker={handleSwitchMarkerFromSheet}
            onClose={handleCloseSheet}
            currentUserId={user?.id ?? ''}
            currentUserName={user?.displayName ?? user?.name ?? user?.email ?? 'Volunteer'}
          />
        )}
      </BottomSheet>
    </View>
  );
}
