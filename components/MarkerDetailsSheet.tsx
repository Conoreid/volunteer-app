import { StyleSheet, Text } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { LatLng } from 'react-native-maps';

interface MarkerCoordinate extends LatLng {}
interface MarkerData {
  id: string;
  name: string;
  description: string;
  coordinate: MarkerCoordinate;
  details: string;
}

interface MarkerDetailsSheetProps {
  data: MarkerData;
}

// This component renders the data inside the bottom sheet
const MarkerDetailsSheet = ({ data }: MarkerDetailsSheetProps) => {
  if (!data) return null; // Should never happen, but safe check

  return (
    <BottomSheetView style={styles.sheetContent}>
      <Text style={styles.title}>{data.name}</Text>
      <Text style={styles.description}>{data.description}</Text>
      <Text style={styles.details}>{data.details}</Text>
    </BottomSheetView>
  );
};

export default MarkerDetailsSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  sheetContent: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  details: {
    fontSize: 14,
  },
});
