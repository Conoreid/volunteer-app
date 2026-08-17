import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import {
  MapPin,
  Check,
  CircleArrowLeft,
  ClipboardCheck,
  MoveLeft,
  MoveRight,
} from 'lucide-react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppTheme } from '@/components/ThemeProvider';

function PriorityMarker({
  color,
  label,
  conditions,
  isDark,
}: {
  color: string;
  label: string;
  conditions: string;
  isDark: boolean;
}) {
  return (
    <View
      className={`flex flex-row items-center gap-4 rounded-lg px-4 py-3 shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <MapPin size="36" color={isDark ? 'white' : 'black'} fill={color} strokeWidth="1.5" />
      <View className="flex-1">
        <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>{label}</Text>
        <Text
          className={`flex-shrink text-sm leading-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {conditions}
        </Text>
      </View>
    </View>
  );
}

function StepCard({
  number,
  title,
  description,
  isDark,
}: {
  number: string;
  title: string;
  description: string;
  isDark: boolean;
}) {
  return (
    <View className="flex flex-row items-start gap-4">
      <View className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600">
        <Text className="text-lg font-bold text-white">{number}</Text>
      </View>
      <View className="flex-1">
        <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>{title}</Text>
        <Text
          className={`flex-shrink text-sm leading-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {description}
        </Text>
      </View>
    </View>
  );
}

function ButtonPreview({
  color,
  label,
  icon,
  bordered,
  isDark,
}: {
  color: string;
  label: string;
  icon: React.ReactNode;
  bordered?: boolean;
  isDark: boolean;
}) {
  return (
    <View
      className={`flex flex-row items-center justify-center gap-3 rounded-lg px-5 py-3 ${bordered ? (isDark ? 'border border-gray-600' : 'border border-slate-300') : ''}`}
      style={{
        backgroundColor: color === 'transparent' ? (isDark ? '#374151' : 'transparent') : color,
      }}>
      {icon}
      <Text
        className={`text-base font-bold ${bordered ? (isDark ? 'text-gray-200' : 'text-slate-800') : 'text-white'}`}>
        {label}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const { isDark } = useAppTheme();

  return (
    <ScrollView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      showsVerticalScrollIndicator={false}>
      <View className="px-6 pb-10">
        {/* Header */}
        <View className="mt-6 items-center">
          <Text className="text-4xl font-bold text-teal-600">Volunteer App</Text>
          <Text
            className={`mt-3 text-center text-base leading-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Helping volunteers coordinate their efforts by showing locations of people in need as
            markers on a map around Glasgow city centre.
          </Text>
        </View>

        {/* How It Works */}
        <View className="mt-8">
          <Text className={`mb-4 text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            How It Works
          </Text>
          <View className="gap-5">
            <StepCard
              number="1"
              title="View the Map"
              description="Open the Map tab to see markers across Glasgow. Each marker represents a reported person in need."
              isDark={isDark}
            />
            <StepCard
              number="2"
              title="Tap a Marker"
              description="Tap any marker to see details including conditions, distance, time reported, and priority level."
              isDark={isDark}
            />
            <StepCard
              number="3"
              title="Accept & Help"
              description="Accept a job to help, then submit a report when you're done. You can also release a job if needed."
              isDark={isDark}
            />
          </View>
        </View>

        {/* Marker Priority Guide */}
        <View className="mt-8">
          <Text className={`mb-4 text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            Marker Priority Guide
          </Text>
          <View className="gap-3">
            <PriorityMarker
              color="#dc2626"
              label="High Priority"
              conditions="3 conditions: Intoxicated, Distressed & Vulnerable"
              isDark={isDark}
            />
            <PriorityMarker
              color="#eab308"
              label="Medium Priority"
              conditions="2 conditions present"
              isDark={isDark}
            />
            <PriorityMarker
              color="#22c55e"
              label="Low Priority"
              conditions="1 condition present"
              isDark={isDark}
            />
          </View>
        </View>

        {/* Conditions Explained */}
        <View className="mt-8">
          <Text className={`mb-4 text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            Conditions
          </Text>
          <View className={`gap-3 rounded-lg p-4 shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <View className="flex flex-row items-start gap-3">
              <FontAwesome name="exclamation-triangle" size={18} color="#dc2626" />
              <Text
                className={`flex-1 text-base leading-5 ${isDark ? 'text-gray-200' : 'text-black'}`}>
                <Text className="font-bold">Intoxicated</Text> — Person appears to be under the
                influence
              </Text>
            </View>
            <View className="flex flex-row items-start gap-3">
              <FontAwesome name="exclamation-triangle" size={18} color="#eab308" />
              <Text
                className={`flex-1 text-base leading-5 ${isDark ? 'text-gray-200' : 'text-black'}`}>
                <Text className="font-bold">Distressed</Text> — Person is showing signs of distress
              </Text>
            </View>
            <View className="flex flex-row items-start gap-3">
              <FontAwesome name="exclamation-triangle" size={18} color="#22c55e" />
              <Text
                className={`flex-1 text-base leading-5 ${isDark ? 'text-gray-200' : 'text-black'}`}>
                <Text className="font-bold">Vulnerable</Text> — Person is in a vulnerable situation
              </Text>
            </View>
          </View>
        </View>

        {/* Button Guide */}
        <View className="mt-8">
          <Text className={`mb-4 text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            Screen Buttons
          </Text>
          <View className="gap-4">
            <View>
              <Text
                className={`mb-2 text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Job Details View
              </Text>
              <View className="gap-2">
                <ButtonPreview
                  color="#22c55e"
                  label="Accept Job"
                  icon={<Check color="white" size={18} />}
                  isDark={isDark}
                />
                <View className="flex flex-row gap-2">
                  <View className="flex-1">
                    <ButtonPreview
                      color="transparent"
                      label="Back"
                      icon={<MoveLeft color={isDark ? '#d1d5db' : '#334155'} size={18} />}
                      bordered
                      isDark={isDark}
                    />
                  </View>
                  <View className="flex-1">
                    <ButtonPreview
                      color="transparent"
                      label="Next"
                      icon={<MoveRight color={isDark ? '#d1d5db' : '#334155'} size={18} />}
                      bordered
                      isDark={isDark}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View>
              <Text
                className={`mb-2 text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Submission View
              </Text>
              <View className="gap-2">
                <ButtonPreview
                  color="#ef4444"
                  label="Return Job"
                  icon={<CircleArrowLeft color="white" size={18} />}
                  isDark={isDark}
                />
                <ButtonPreview
                  color="#22c55e"
                  label="Submit Job"
                  icon={<ClipboardCheck color="white" size={18} />}
                  isDark={isDark}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Map Details */}
        <View className="mt-8">
          <Text className={`mb-4 text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            Map Details
          </Text>
          <View className={`gap-3 rounded-lg p-4 shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <View className="flex flex-row items-start gap-3">
              <FontAwesome name="clock-o" size={18} color={isDark ? '#d1d5db' : 'black'} />
              <Text
                className={`flex-1 text-base leading-5 ${isDark ? 'text-gray-200' : 'text-black'}`}>
                <Text className="font-bold">Time Reported</Text> — How long ago the person was
                reported
              </Text>
            </View>
            <View className="flex flex-row items-start gap-3">
              <FontAwesome name="map-marker" size={18} color={isDark ? '#d1d5db' : 'black'} />
              <Text
                className={`flex-1 text-base leading-5 ${isDark ? 'text-gray-200' : 'text-black'}`}>
                <Text className="font-bold">Distance</Text> — How far the marker is from your
                location
              </Text>
            </View>
            <View className="flex flex-row items-start gap-3">
              <FontAwesome name="location-arrow" size={18} color={isDark ? '#d1d5db' : 'black'} />
              <Text
                className={`flex-1 text-base leading-5 ${isDark ? 'text-gray-200' : 'text-black'}`}>
                <Text className="font-bold">Get Directions</Text> — Navigate to the marker&apos;s
                location
              </Text>
            </View>
          </View>
        </View>

        {/* Get Started */}
        <View className="mt-10 items-center">
          <TouchableOpacity
            className="w-64 items-center rounded-lg bg-teal-600 py-4"
            onPress={() => router.push('/(tabs)/explore')}>
            <Text className="text-lg font-bold text-white">Go to Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
