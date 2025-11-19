import React, { useRef, useCallback, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, LatLng } from 'react-native-maps';
import { View, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import MarkerDetailsSheet from '@/components/MarkerDetailsSheet';

interface MarkerCoordinate extends LatLng {}
interface MarkerData {
  id: string;
  name: string;
  description: string;
  coordinate: MarkerCoordinate;
  details: string;
}

const INITIAL_REGION = {
  latitude: 55.861486896052135,
  longitude: -4.2423500238778145,
  latitudeDelta: 0.0002,
  longitudeDelta: 0.0002,
};

const MARKERS_DATA: MarkerData[] = [
  {
    id: '1',
    name: 'Glasgow Cathedral Cleanup',
    description: 'Tidying the grounds around the historic cathedral.',
    coordinate: { latitude: 55.8655, longitude: -4.2407 },
    details: 'Meet by the main entrance at 10 AM. Gloves provided.',
  },
  {
    id: '2',
    name: 'Kelvingrove Museum Guides',
    description: 'Training session for new volunteer museum guides.',
    coordinate: { latitude: 55.8724, longitude: -4.2934 },
    details: 'Must complete a 2-hour art history module beforehand.',
  },
  {
    id: '3',
    name: 'People’s Palace Food Bank',
    description: 'Sorting food donations and stocking shelves for distribution.',
    coordinate: { latitude: 55.8526, longitude: -4.2415 },
    details: 'Need assistance with heavy lifting from 1 PM to 4 PM.',
  },
  {
    id: '4',
    name: 'Clyde Riverbank Cleanup',
    description: 'Collecting litter and debris along the River Clyde path.',
    coordinate: { latitude: 55.856, longitude: -4.27 },
    details: 'Meeting point is near the Glasgow Science Centre.',
  },
  {
    id: '5',
    name: 'University Library Support',
    description: 'Help re-shelve books and organize returned materials.',
    coordinate: { latitude: 55.8722, longitude: -4.2882 },
    details: 'Evening shift available (6 PM - 9 PM) at the main library.',
  },
  {
    id: '6',
    name: 'Glasgow Central Station Welcome',
    description: 'Greeting visitors and providing directions/information.',
    coordinate: { latitude: 55.8587, longitude: -4.258 },
    details: 'Requires excellent local knowledge and communication skills.',
  },
  {
    id: '7',
    name: 'Pollok Country Park Gardening',
    description: 'Weeding and maintaining the walled garden area.',
    coordinate: { latitude: 55.8285, longitude: -4.309 },
    details: 'Bring sturdy footwear; all tools are supplied.',
  },
  {
    id: '8',
    name: 'Garnethill Community Hub Tech',
    description: 'Teach basic computer skills to older residents.',
    coordinate: { latitude: 55.866, longitude: -4.257 },
    details: 'Focus on email and internet safety.',
  },
  {
    id: '9',
    name: 'Dennistoun Dog Shelter Walks',
    description: 'Walk and socialize dogs awaiting adoption.',
    coordinate: { latitude: 55.859, longitude: -4.218 },
    details: 'Mandatory training for handling large breeds.',
  },
  {
    id: '10',
    name: 'The Lighthouse Architecture Tour',
    description: 'Volunteer training for leading tours of the MacKintosh building.',
    coordinate: { latitude: 55.8606, longitude: -4.2566 },
    details: 'Focus on design and structural history.',
  },
  {
    id: '11',
    name: 'Merchant City Festival Crew',
    description: 'Help with site setup and tear-down for the weekend festival.',
    coordinate: { latitude: 55.858, longitude: -4.248 },
    details: 'Shifts available Friday and Sunday.',
  },
  {
    id: '12',
    name: 'East End Youth Mentoring',
    description: 'One-on-one reading and homework help for secondary students.',
    coordinate: { latitude: 55.853, longitude: -4.225 },
    details: 'Requires PVG scheme membership.',
  },
  {
    id: '13',
    name: 'Citizens Advice Bureau Support',
    description: 'Admin and filing support at the city center office.',
    coordinate: { latitude: 55.862, longitude: -4.256 },
    details: 'Strict confidentiality guidelines apply.',
  },
  {
    id: '14',
    name: 'Mitchell Library Archive Scanning',
    description: 'Digitizing historic Glasgow photographs and documents.',
    coordinate: { latitude: 55.8624, longitude: -4.27 },
    details: 'Requires steady hands and attention to detail.',
  },
  {
    id: '15',
    name: 'Gorbals Community Garden Build',
    description: 'Help build raised beds and compost bins.',
    coordinate: { latitude: 55.848, longitude: -4.25 },
    details: 'Carpentry skills are a bonus!',
  },
  {
    id: '16',
    name: 'Glasgow Airport Passenger Help',
    description: 'Assisting travelers with luggage and navigation.',
    coordinate: { latitude: 55.8659, longitude: -4.4337 },
    details: 'Early morning shifts available (5 AM - 8 AM).',
  },
  {
    id: '17',
    name: 'South Side Art Class Assistant',
    description: 'Prepare materials and clean up for children’s art classes.',
    coordinate: { latitude: 55.839, longitude: -4.27 },
    details: 'Every Saturday morning.',
  },
  {
    id: '18',
    name: 'Hutcheson’s Hall Fundraising Gala',
    description: 'Event set-up, ushering, and guest management.',
    coordinate: { latitude: 55.858, longitude: -4.251 },
    details: 'Formal attire required for the evening event.',
  },
  {
    id: '19',
    name: 'West End Cycling Advocacy',
    description: 'Distribute leaflets advocating for new bike lanes.',
    coordinate: { latitude: 55.875, longitude: -4.305 },
    details: 'Requires cycling around the West End.',
  },
  {
    id: '20',
    name: 'SECC (OVO Hydro) Event Marshall',
    description: 'Directing crowds and assisting with venue entry.',
    coordinate: { latitude: 55.86, longitude: -4.285 },
    details: 'Available for evening concerts and events.',
  },
];

export default function App() {
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedMarkerData, setSelectedMarkerData] = useState<MarkerData | null>(null);

  const snapPoints = ['35%', '45%', '55%'];

  const handleMarkerPress = useCallback((markerData: MarkerData) => {
    setSelectedMarkerData(markerData);
    // Open the sheet to the second snap point (45% height)
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
        {MARKERS_DATA.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>
      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints} enablePanDownToClose>
        {selectedMarkerData && <MarkerDetailsSheet data={selectedMarkerData} />}
      </BottomSheet>
    </View>
  );
}
