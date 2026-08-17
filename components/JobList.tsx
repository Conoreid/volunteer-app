import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { type MarkerData } from '@/types';
import {
  MoveLeft,
  MoveRight,
  CheckCircle2,
  Clock,
  Navigation,
  AlertTriangle,
} from 'lucide-react-native';
import { getTime, getPriority } from '@/utils/markerUtils';
import { useAppTheme } from '@/components/ThemeProvider';

interface JobListProps {
  marker: MarkerData;
  distance: string | null;
  onNext: () => void;
  onPrev: () => void;
  onAccept: () => void;
  isLoading?: boolean;
}

const JobList = ({ marker, distance, onNext, onPrev, onAccept, isLoading }: JobListProps) => {
  const { isDark } = useAppTheme();
  const priority = getPriority(marker.conditions);

  const priorityStyles = {
    high: {
      bg: isDark ? 'bg-red-950/40' : 'bg-red-50',
      text: isDark ? 'text-red-400' : 'text-red-700',
      border: isDark ? 'border-red-900/50' : 'border-red-200',
      label: 'HIGH PRIORITY',
    },
    medium: {
      bg: isDark ? 'bg-amber-950/40' : 'bg-amber-50',
      text: isDark ? 'text-amber-400' : 'text-amber-700',
      border: isDark ? 'border-amber-900/50' : 'border-amber-200',
      label: 'MEDIUM PRIORITY',
    },
    low: {
      bg: isDark ? 'bg-teal-950/40' : 'bg-teal-50',
      text: isDark ? 'text-teal-400' : 'text-teal-700',
      border: isDark ? 'border-teal-900/50' : 'border-teal-200',
      label: 'LOW PRIORITY',
    },
  }[priority];

  return (
    <View className="w-full">
      {/* Header Row: Priority & Time */}
      <View className="mb-3 flex-row items-center justify-between">
        <View
          className={`flex-row items-center rounded-full border px-3 py-1 ${priorityStyles.bg} ${priorityStyles.border}`}>
          <Text className={`text-[11px] font-bold tracking-wider ${priorityStyles.text}`}>
            {priorityStyles.label}
          </Text>
        </View>

        <View className="flex-row items-center gap-1.5">
          <Clock size={14} color={isDark ? '#9ca3af' : '#64748b'} />
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Reported {getTime(marker)} ago
          </Text>
        </View>
      </View>

      {/* Incident Title & Location */}
      <View className="mb-4">
        <Text
          className={`text-xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-on-surface'
          }`}>
          Incident #{marker.id}
        </Text>
        <Text className={`mt-0.5 text-xs ${isDark ? 'text-gray-400' : 'text-on-surface-variant'}`}>
          Glasgow City Centre • Street Alert
        </Text>
      </View>

      {/* Bento Grid: Distance & Conditions */}
      <View className="mb-5 flex-row gap-3">
        {/* Distance Card */}
        <View
          className={`flex-1 items-center justify-center rounded-2xl border p-3.5 ${
            isDark
              ? 'border-gray-800 bg-surface-dark-card shadow-sm'
              : 'border-slate-100 bg-surface-container-low shadow-sm'
          }`}>
          <View className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Navigation size={16} color="#006767" />
          </View>
          <Text
            className={`text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Distance
          </Text>
          <Text className={`mt-0.5 text-sm font-bold ${isDark ? 'text-white' : 'text-on-surface'}`}>
            {distance === null ? 'Calculating...' : distance}
          </Text>
        </View>

        {/* Conditions Card */}
        <View
          className={`flex-1 items-center justify-center rounded-2xl border p-3.5 ${
            isDark
              ? 'border-gray-800 bg-surface-dark-card shadow-sm'
              : 'border-slate-100 bg-surface-container-low shadow-sm'
          }`}>
          <View className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
            <AlertTriangle size={16} color="#d97706" />
          </View>
          <Text
            className={`text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Conditions
          </Text>
          <View className="mt-1 flex-row flex-wrap justify-center gap-1">
            {marker.conditions.intoxicated && (
              <Text className="text-[11px] font-semibold text-red-600 dark:text-red-400">
                Intoxicated
              </Text>
            )}
            {marker.conditions.distressed && (
              <Text className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                • Distressed
              </Text>
            )}
            {marker.conditions.vulnerable && (
              <Text className="text-[11px] font-semibold text-green-600 dark:text-green-400">
                • Vulnerable
              </Text>
            )}
            {!marker.conditions.intoxicated &&
              !marker.conditions.distressed &&
              !marker.conditions.vulnerable && (
                <Text className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  Standard
                </Text>
              )}
          </View>
        </View>
      </View>

      {/* Primary Action: Accept Job */}
      <TouchableOpacity
        onPress={onAccept}
        disabled={isLoading}
        className={`h-[52px] w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary shadow-sm shadow-teal-900/30 active:scale-[0.99] ${
          isLoading ? 'opacity-70' : 'opacity-100'
        }`}>
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <CheckCircle2 size={18} color="white" strokeWidth={2.2} />
            <Text className="text-[17px] font-semibold text-white">Accept Assignment</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Navigation Switcher: Previous / Next */}
      <View className="mt-3 flex-row gap-3">
        <TouchableOpacity
          onPress={onPrev}
          className={`h-11 flex-1 flex-row items-center justify-center gap-2 rounded-xl border ${
            isDark
              ? 'border-gray-800 bg-surface-dark-card'
              : 'border-slate-200 bg-surface-container-low'
          } active:opacity-75`}>
          <MoveLeft size={16} color={isDark ? '#e5e7eb' : '#334155'} />
          <Text className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNext}
          className={`h-11 flex-1 flex-row items-center justify-center gap-2 rounded-xl border ${
            isDark
              ? 'border-gray-800 bg-surface-dark-card'
              : 'border-slate-200 bg-surface-container-low'
          } active:opacity-75`}>
          <Text className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Next
          </Text>
          <MoveRight size={16} color={isDark ? '#e5e7eb' : '#334155'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JobList;
