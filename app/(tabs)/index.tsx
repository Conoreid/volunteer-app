import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import {
  MapPin,
  CalendarCheck,
  ClipboardList,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAppTheme } from '@/components/ThemeProvider';

export default function GuideScreen() {
  const { isDark } = useAppTheme();

  return (
    <ScrollView
      className={`flex-1 ${isDark ? 'bg-surface-dark' : 'bg-surface'}`}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}>
      <View className="px-5 pb-16 pt-5">
        {/* Hero Banner Card */}
        <View
          className={`rounded-3xl border p-6 shadow-sm ${
            isDark ? 'border-gray-800 bg-surface-dark-card' : 'border-slate-100 bg-white'
          }`}>
          <View className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles size={26} color="#006767" />
          </View>
          <Text
            className={`text-2xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-on-surface'
            }`}>
            Getting Started Guide
          </Text>
          <Text
            className={`mt-2 text-sm leading-5 ${
              isDark ? 'text-gray-400' : 'text-on-surface-variant'
            }`}>
            Welcome to the Volunteer App. Learn how to locate street alerts, respond to vulnerable
            individuals, and submit incident resolution reports across Glasgow.
          </Text>
        </View>

        {/* Feature Bento Grid */}
        <View className="mt-6 gap-3.5">
          {/* Card 1: Interactive Live Map */}
          <View
            className={`rounded-3xl border p-5 shadow-sm ${
              isDark ? 'border-gray-800 bg-surface-dark-card' : 'border-slate-100 bg-white'
            }`}>
            <View className="mb-3 flex-row items-center gap-3">
              <View className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <MapPin size={22} color="#006767" />
              </View>
              <View className="flex-1">
                <Text
                  className={`text-base font-bold ${isDark ? 'text-white' : 'text-on-surface'}`}>
                  1. Live Map & Navigation
                </Text>
                <Text className="text-xs font-semibold text-primary dark:text-teal-400">
                  Real-time GPS alerts
                </Text>
              </View>
            </View>
            <Text
              className={`text-xs leading-5 ${
                isDark ? 'text-gray-400' : 'text-on-surface-variant'
              }`}>
              Open the Map tab to view real-time pins across Glasgow city centre. Tap any pin to see
              walking distance, reporting timestamp, and risk conditions.
            </Text>
          </View>

          {/* Card 2: Priority Severity Tiers */}
          <View
            className={`rounded-3xl border p-5 shadow-sm ${
              isDark ? 'border-gray-800 bg-surface-dark-card' : 'border-slate-100 bg-white'
            }`}>
            <View className="mb-3 flex-row items-center gap-3">
              <View className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <AlertTriangle size={22} color="#d97706" />
              </View>
              <View className="flex-1">
                <Text
                  className={`text-base font-bold ${isDark ? 'text-white' : 'text-on-surface'}`}>
                  2. Priority & Condition Flags
                </Text>
                <Text className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  Triaged response indicators
                </Text>
              </View>
            </View>

            <View className="gap-2 pt-1">
              <View className="flex-row items-center justify-between rounded-xl border border-red-200/50 bg-red-50 p-2.5 dark:border-red-900/40 dark:bg-red-950/30">
                <View className="flex-row items-center gap-2.5">
                  <Image
                    source={require('@/assets/marker_high.png')}
                    style={{ width: 22, height: 22 }}
                    resizeMode="contain"
                  />
                  <Text className="text-xs font-bold text-red-700 dark:text-red-400">
                    High Priority
                  </Text>
                </View>
                <Text className="text-[11px] font-medium text-red-600/80 dark:text-red-400/80">
                  3 active risk factors
                </Text>
              </View>

              <View className="flex-row items-center justify-between rounded-xl border border-amber-200/50 bg-amber-50 p-2.5 dark:border-amber-900/40 dark:bg-amber-950/30">
                <View className="flex-row items-center gap-2.5">
                  <Image
                    source={require('@/assets/marker_medium.png')}
                    style={{ width: 22, height: 22 }}
                    resizeMode="contain"
                  />
                  <Text className="text-xs font-bold text-amber-700 dark:text-amber-400">
                    Medium Priority
                  </Text>
                </View>
                <Text className="text-[11px] font-medium text-amber-600/80 dark:text-amber-400/80">
                  2 active risk factors
                </Text>
              </View>

              <View className="flex-row items-center justify-between rounded-xl border border-teal-200/50 bg-teal-50 p-2.5 dark:border-teal-900/40 dark:bg-teal-950/30">
                <View className="flex-row items-center gap-2.5">
                  <Image
                    source={require('@/assets/marker_low.png')}
                    style={{ width: 22, height: 22 }}
                    resizeMode="contain"
                  />
                  <Text className="text-xs font-bold text-teal-700 dark:text-teal-400">
                    Low Priority
                  </Text>
                </View>
                <Text className="text-[11px] font-medium text-teal-600/80 dark:text-teal-400/80">
                  1 active risk factor
                </Text>
              </View>
            </View>
          </View>

          {/* Card 3: Incident Acceptance & Dispatch */}
          <View
            className={`rounded-3xl border p-5 shadow-sm ${
              isDark ? 'border-gray-800 bg-surface-dark-card' : 'border-slate-100 bg-white'
            }`}>
            <View className="mb-3 flex-row items-center gap-3">
              <View className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <CalendarCheck size={22} color="#006767" />
              </View>
              <View className="flex-1">
                <Text
                  className={`text-base font-bold ${isDark ? 'text-white' : 'text-on-surface'}`}>
                  3. Incident Acceptance
                </Text>
                <Text className="text-xs font-semibold text-primary dark:text-teal-400">
                  Volunteer commitment
                </Text>
              </View>
            </View>
            <Text
              className={`text-xs leading-5 ${
                isDark ? 'text-gray-400' : 'text-on-surface-variant'
              }`}>
              Tap &quot;Accept Assignment&quot; to claim an incident. Other volunteers will
              immediately see the task as assigned to avoid duplicate responses.
            </Text>
          </View>

          {/* Card 4: Resolution & Reporting */}
          <View
            className={`rounded-3xl border p-5 shadow-sm ${
              isDark ? 'border-gray-800 bg-surface-dark-card' : 'border-slate-100 bg-white'
            }`}>
            <View className="mb-3 flex-row items-center gap-3">
              <View className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                <ClipboardList size={22} color="#016b1b" />
              </View>
              <View className="flex-1">
                <Text
                  className={`text-base font-bold ${isDark ? 'text-white' : 'text-on-surface'}`}>
                  4. Incident Resolution & Notes
                </Text>
                <Text className="text-xs font-semibold text-green-700 dark:text-green-400">
                  Post-incident logging
                </Text>
              </View>
            </View>
            <Text
              className={`text-xs leading-5 ${
                isDark ? 'text-gray-400' : 'text-on-surface-variant'
              }`}>
              Once the situation is resolved, enter brief assistance notes and tap &quot;Complete
              &amp; Submit Report&quot;. If unable to attend, tap &quot;Return Job&quot; to return
              it to dispatch.
            </Text>
          </View>
        </View>

        {/* Safety & Protocol Card */}
        <View
          className={`mt-6 rounded-3xl border p-5 shadow-sm ${
            isDark ? 'border-gray-800 bg-surface-dark-card' : 'border-slate-100 bg-white'
          }`}>
          <View className="mb-3 flex-row items-center gap-2.5">
            <ShieldAlert size={20} color="#dc2626" />
            <Text className="text-sm font-bold text-red-600 dark:text-red-400">
              Safety & Emergency Protocol
            </Text>
          </View>
          <Text
            className={`text-xs leading-5 ${isDark ? 'text-gray-300' : 'text-on-surface-variant'}`}>
            Always patrol in pairs. If an individual is unresponsive, exhibiting acute medical
            distress, or posing immediate danger, contact emergency services immediately (999).
          </Text>
        </View>

        {/* Primary Action Button */}
        <View className="mt-7">
          <TouchableOpacity
            className="h-[52px] w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-sm shadow-teal-900/30 active:scale-[0.99]"
            onPress={() => router.push('/(tabs)/explore')}>
            <Text className="text-[17px] font-semibold text-white">Open Live Map</Text>
            <ArrowRight size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
