import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  CheckCircle2,
  Clock,
  MapPin,
  User,
  FileText,
  Search,
  ShieldCheck,
} from 'lucide-react-native';
import { useAppTheme } from '@/components/ThemeProvider';
import { useCompletedJobs } from '@/hooks/useCompletedJobs';
import { getPriority } from '@/utils/markerUtils';

type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

const MARKER_IMAGES = {
  high: require('@/assets/marker_high.png'),
  medium: require('@/assets/marker_medium.png'),
  low: require('@/assets/marker_low.png'),
};

const PRIORITY_BADGES = {
  high: {
    label: 'High Priority',
    color: '#F85A65',
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    text: 'text-red-700 dark:text-red-400',
  },
  medium: {
    label: 'Medium Priority',
    color: '#FF9F0A',
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
  },
  low: {
    label: 'Low Priority',
    color: '#008B8B',
    bg: 'bg-teal-500/10 dark:bg-teal-500/20',
    text: 'text-teal-700 dark:text-teal-400',
  },
};

function formatDateTime(date?: Date | null): string {
  if (!date) return 'Recently completed';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Recently completed';
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface FilterChipProps {
  label: string;
  count: number;
  isActive: boolean;
  isDark: boolean;
  onPress: () => void;
}

function FilterChip({ label, count, isActive, isDark, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        borderRadius: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: isActive ? '#006767' : isDark ? '#1f2937' : '#e2e8f0',
        backgroundColor: isActive ? '#006767' : isDark ? '#1a1b1f' : '#ffffff',
      }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '700',
          color: isActive ? '#ffffff' : isDark ? '#d1d5db' : '#334155',
        }}>
        {label}
      </Text>
      <View
        style={{
          borderRadius: 999,
          paddingHorizontal: 6,
          paddingVertical: 2,
          backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : isDark ? '#374151' : '#f1f5f9',
        }}>
        <Text
          style={{
            fontSize: 10,
            fontWeight: '700',
            color: isActive ? '#ffffff' : isDark ? '#9ca3af' : '#475569',
          }}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function CompletedJobsScreen() {
  const { isDark } = useAppTheme();
  const { data: jobs, isLoading, error } = useCompletedJobs();

  const [selectedFilter, setSelectedFilter] = useState<PriorityFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Priority count aggregates
  const stats = useMemo(() => {
    let high = 0;
    let medium = 0;
    let low = 0;
    if (Array.isArray(jobs)) {
      jobs.forEach((item) => {
        if (!item || !item.marker) return;
        const p = getPriority(item.marker.conditions);
        if (p === 'high') high++;
        else if (p === 'medium') medium++;
        else if (p === 'low') low++;
      });
    }
    return { total: jobs?.length ?? 0, high, medium, low };
  }, [jobs]);

  // Filtered jobs list
  const filteredJobs = useMemo(() => {
    if (!Array.isArray(jobs)) return [];
    return jobs.filter((item) => {
      if (!item || !item.marker) return false;
      const priority = getPriority(item.marker.conditions);
      if (selectedFilter !== 'all' && priority !== selectedFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const volunteerName = (
          item.report?.submittedByName ??
          item.marker?.acceptedByName ??
          ''
        ).toLowerCase();
        const notes = (item.report?.message ?? '').toLowerCase();
        const markerId = (item.marker?.id ?? '').toLowerCase();
        return volunteerName.includes(q) || notes.includes(q) || markerId.includes(q);
      }
      return true;
    });
  }, [jobs, selectedFilter, searchQuery]);

  return (
    <ScrollView
      className={`flex-1 ${isDark ? 'bg-surface-dark' : 'bg-surface'}`}
      showsVerticalScrollIndicator={false}>
      <View className="px-5 pb-16 pt-5">
        {/* Header Hero Banner */}
        <View
          className={`rounded-3xl border p-5 shadow-sm ${
            isDark ? 'border-gray-800 bg-surface-dark-card' : 'border-slate-100 bg-white'
          }`}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 dark:bg-teal-500/20">
                <ShieldCheck size={26} color="#006767" />
              </View>
              <View>
                <Text
                  className={`text-xl font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-on-surface'
                  }`}>
                  Completed Jobs
                </Text>
                <Text className="text-xs font-semibold text-primary dark:text-teal-400">
                  Resolved incident log & field reports
                </Text>
              </View>
            </View>
          </View>

          {/* Bento Stats Counter Row */}
          <View className="mt-5 flex-row gap-2.5">
            <View
              className={`flex-1 items-center rounded-2xl border p-3 ${
                isDark ? 'border-gray-800 bg-gray-900/60' : 'border-slate-100 bg-slate-50'
              }`}>
              <Text className="text-lg font-bold text-red-600 dark:text-red-400">{stats.high}</Text>
              <Text className="mt-0.5 text-[10px] font-semibold uppercase text-slate-500 dark:text-gray-400">
                High Risk
              </Text>
            </View>

            <View
              className={`flex-1 items-center rounded-2xl border p-3 ${
                isDark ? 'border-gray-800 bg-gray-900/60' : 'border-slate-100 bg-slate-50'
              }`}>
              <Text className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {stats.medium}
              </Text>
              <Text className="mt-0.5 text-[10px] font-semibold uppercase text-slate-500 dark:text-gray-400">
                Medium Risk
              </Text>
            </View>

            <View
              className={`flex-1 items-center rounded-2xl border p-3 ${
                isDark ? 'border-gray-800 bg-gray-900/60' : 'border-slate-100 bg-slate-50'
              }`}>
              <Text className="text-lg font-bold text-teal-600 dark:text-teal-400">
                {stats.low}
              </Text>
              <Text className="mt-0.5 text-[10px] font-semibold uppercase text-slate-500 dark:text-gray-400">
                Low Risk
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View className="mt-5">
          <View
            className={`flex h-12 flex-row items-center gap-3 rounded-2xl border px-4 ${
              isDark
                ? 'border-gray-700/80 bg-gray-800/60'
                : 'border-slate-200/80 bg-surface-container-low'
            }`}>
            <Search size={18} color={isDark ? '#9ca3af' : '#64748b'} />
            <TextInput
              placeholder="Search reports by volunteer notes or ID..."
              placeholderTextColor={isDark ? '#9ca3af' : '#94a3b8'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className={`flex-1 text-sm ${isDark ? 'text-white' : 'text-on-surface'}`}
            />
          </View>
        </View>

        {/* Priority Filter Chips */}
        <View className="mt-4 flex-row gap-2">
          <FilterChip
            label="All"
            count={stats.total}
            isActive={selectedFilter === 'all'}
            isDark={isDark}
            onPress={() => setSelectedFilter('all')}
          />
          <FilterChip
            label="High"
            count={stats.high}
            isActive={selectedFilter === 'high'}
            isDark={isDark}
            onPress={() => setSelectedFilter('high')}
          />
          <FilterChip
            label="Medium"
            count={stats.medium}
            isActive={selectedFilter === 'medium'}
            isDark={isDark}
            onPress={() => setSelectedFilter('medium')}
          />
          <FilterChip
            label="Low"
            count={stats.low}
            isActive={selectedFilter === 'low'}
            isDark={isDark}
            onPress={() => setSelectedFilter('low')}
          />
        </View>

        {/* Job List Container */}
        <View className="mt-6 gap-4">
          {isLoading ? (
            <View className="items-center justify-center py-16">
              <ActivityIndicator size="large" color="#006767" />
              <Text className="mt-3 text-sm text-slate-500 dark:text-gray-400">
                Loading completed missions...
              </Text>
            </View>
          ) : error ? (
            <View className="items-center justify-center py-12">
              <Text className="text-base text-red-600">Failed to load completed jobs</Text>
              <Text className="mt-1 text-xs text-gray-500">{String(error)}</Text>
            </View>
          ) : filteredJobs.length === 0 ? (
            /* Empty State */
            <View
              className={`items-center rounded-3xl border p-8 shadow-sm ${
                isDark ? 'border-gray-800 bg-surface-dark-card' : 'border-slate-100 bg-white'
              }`}>
              <View className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <CheckCircle2 size={34} color="#006767" strokeWidth={1.8} />
              </View>
              <Text
                className={`text-lg font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-on-surface'
                }`}>
                {searchQuery.trim() ? 'No Matching Records' : 'No Completed Jobs Yet'}
              </Text>
              <Text
                className={`mt-1.5 max-w-[260px] text-center text-xs leading-5 ${
                  isDark ? 'text-gray-400' : 'text-slate-500'
                }`}>
                {searchQuery.trim()
                  ? 'Try searching with different keywords or clearing your active filters.'
                  : 'When volunteers accept incidents on the map and submit resolution reports, they will be archived here.'}
              </Text>

              <View className="mt-5 flex-row items-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 dark:bg-primary/20">
                <ShieldCheck size={16} color="#006767" />
                <Text className="text-xs font-semibold text-primary dark:text-teal-400">
                  Select a filter above or view map tab
                </Text>
              </View>
            </View>
          ) : (
            filteredJobs.map((item) => {
              const priority = getPriority(item.marker.conditions);
              const badge = PRIORITY_BADGES[priority];
              const resolvedTime = item.report?.createdAt ?? item.marker.time;
              const volunteerName =
                item.report?.submittedByName || item.marker.acceptedByName || 'Volunteer Team';
              const reportMessage =
                item.report?.message && item.report.message.trim().length > 0
                  ? item.report.message
                  : 'Task completed safely on scene. Standard welfare checks performed with no escalation required.';

              return (
                <View
                  key={item.marker.id}
                  className={`rounded-3xl border p-5 shadow-sm ${
                    isDark ? 'border-gray-800 bg-surface-dark-card' : 'border-slate-100 bg-white'
                  }`}>
                  {/* Card Header: Priority & Time */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2.5">
                      <Image
                        source={MARKER_IMAGES[priority]}
                        style={{ width: 22, height: 22 }}
                        resizeMode="contain"
                      />
                      <View className={`rounded-full px-2.5 py-1 ${badge.bg}`}>
                        <Text className={`text-[11px] font-bold ${badge.text}`}>{badge.label}</Text>
                      </View>
                    </View>

                    <View className="flex-row items-center gap-1.5">
                      <Clock size={12} color={isDark ? '#9ca3af' : '#64748b'} />
                      <Text
                        className={`text-xs font-medium ${
                          isDark ? 'text-gray-400' : 'text-slate-500'
                        }`}>
                        {formatDateTime(resolvedTime)}
                      </Text>
                    </View>
                  </View>

                  {/* Incident Conditions Tag Row */}
                  <View className="mt-3.5 flex-row flex-wrap gap-1.5">
                    {item.marker.conditions.intoxicated && (
                      <View className="rounded-lg bg-slate-100 px-2.5 py-1 dark:bg-gray-800">
                        <Text className="text-[11px] font-medium text-slate-600 dark:text-gray-300">
                          Intoxicated
                        </Text>
                      </View>
                    )}
                    {item.marker.conditions.distressed && (
                      <View className="rounded-lg bg-slate-100 px-2.5 py-1 dark:bg-gray-800">
                        <Text className="text-[11px] font-medium text-slate-600 dark:text-gray-300">
                          Distressed
                        </Text>
                      </View>
                    )}
                    {item.marker.conditions.vulnerable && (
                      <View className="rounded-lg bg-slate-100 px-2.5 py-1 dark:bg-gray-800">
                        <Text className="text-[11px] font-medium text-slate-600 dark:text-gray-300">
                          Vulnerable
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Location Coordinate Subtext */}
                  <View className="mt-3 flex-row items-center gap-1.5">
                    <MapPin size={13} color={isDark ? '#9ca3af' : '#64748b'} />
                    <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      Glasgow City Centre • ({item.marker.location.latitude.toFixed(4)},{' '}
                      {item.marker.location.longitude.toFixed(4)})
                    </Text>
                  </View>

                  {/* Resolution Report Quote Box */}
                  <View
                    className={`mt-4 rounded-2xl border p-3.5 ${
                      isDark
                        ? 'border-gray-700/60 bg-gray-800/50'
                        : 'border-slate-100 bg-surface-container-low'
                    }`}>
                    <View className="mb-1.5 flex-row items-center gap-1.5">
                      <FileText size={13} color="#006767" />
                      <Text className="text-xs font-bold text-primary dark:text-teal-400">
                        Resolution Notes
                      </Text>
                    </View>
                    <Text
                      className={`text-xs leading-5 ${
                        isDark ? 'text-gray-300' : 'text-slate-700'
                      }`}>
                      {`"${reportMessage}"`}
                    </Text>

                    {/* Volunteer Credit */}
                    <View className="mt-3 flex-row items-center justify-between border-t border-slate-200/50 pt-2.5 dark:border-gray-700/50">
                      <View className="flex-row items-center gap-1.5">
                        <User size={12} color={isDark ? '#9ca3af' : '#64748b'} />
                        <Text
                          className={`text-[11px] font-medium ${
                            isDark ? 'text-gray-400' : 'text-slate-500'
                          }`}>
                          Resolved by: <Text className="font-bold">{volunteerName}</Text>
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-1">
                        <CheckCircle2 size={12} color="#016b1b" />
                        <Text className="text-[11px] font-bold text-green-700 dark:text-green-400">
                          Archived
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
}
