import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { type MarkerData } from '@/data/markers';
import { FontAwesome } from '@expo/vector-icons';
import { MoveLeft } from 'lucide-react-native';
import { MoveRight } from 'lucide-react-native';
import { Check } from 'lucide-react-native';
import { getTime, getPriority } from '@/utils/markerUtils';

interface JobListProps {
    marker: MarkerData;
    distance: string | null;
    onNext: () => void;
    onPrev: () => void;
    onAccept: () => void;
}


const JobList = ({marker, distance, onNext, onPrev, onAccept}: JobListProps) => {
  return (
    <View>
          <View className="flex flex-row gap-20">
            <View>
              <View className="flex flex-col items-start justify-center">
                <View className="flex flex-row items-center justify-center gap-2">
                  <FontAwesome className="w-8 text-center" name="clock-o" size={24} color="black" />
                  <Text className="text-sm font-bold">
                    <Text className="text-sm font-normal italic">Reported </Text>
                    {getTime(marker)}
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
                {marker.conditions.intoxicated ? (
                  <Text style={styles.condition}>• Intoxicated</Text>
                ) : null}
                {marker.conditions.distressed ? (
                  <Text style={styles.condition}>• Distressed</Text>
                ) : null}
                {marker.conditions.vulnerable ? (
                  <Text style={styles.condition}>• Vulnerable</Text>
                ) : null}
              </View>
            </View>
            <View className="flex h-32 flex-row gap-2">
              <Text className="font-bold">Priority:</Text>
              {getPriority(marker.conditions) === 'high' ? (
                <View
                  style={[styles.dropshadow, styles.red]}
                  className="h-6 w-11 rounded-lg bg-red-600"
                />
              ) : getPriority(marker.conditions) === 'medium' ? (
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
            <TouchableOpacity onPress={onPrev}>
              <View className="flex flex-row items-center rounded-lg border-[1px] border-slate-200 px-7 py-3 drop-shadow-lg ">
                <MoveLeft />
                <Text className="text-2xl"> Back</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onNext}>
              <View className="flex flex-row items-center rounded-lg border-[1px] border-slate-200 px-7 py-3 drop-shadow-lg">
                <Text className="text-2xl">Next </Text>
                <MoveRight />
              </View>
            </TouchableOpacity>
          </View>
          <View className="mx-auto flex max-w-lg flex-row items-center gap-20 p-3">
            <TouchableOpacity onPress={onAccept}>
              <View className="flex flex-row items-center gap-3 rounded-lg border-[1px] border-slate-200 bg-green-500 px-24 py-5 drop-shadow-lg">
                <Text className="text-2xl font-bold text-white">Accept Job</Text>
                <Check color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
  )
}

export default JobList


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

