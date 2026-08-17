import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { HeartHandshake, Zap } from 'lucide-react-native';
import { router, Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/components/ThemeProvider';

import '../global.css';

const Index: React.FC = () => {
  const { user, isLoading, quickTestLogin } = useAuth();
  const { isDark } = useAppTheme();

  if (isLoading) {
    return (
      <View
        className={`flex-1 items-center justify-center ${isDark ? 'bg-surface-dark' : 'bg-surface'}`}>
        <ActivityIndicator size="large" color="#006767" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View
      className={`relative flex-1 items-center justify-between px-6 py-16 ${isDark ? 'bg-surface-dark' : 'bg-surface'}`}>
      {/* Decorative ambient background glows */}
      <View className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
        <View
          className={`absolute -left-16 -top-16 h-72 w-72 rounded-full ${isDark ? 'bg-teal-900/20' : 'bg-teal-600/5'}`}
        />
        <View
          className={`absolute -bottom-20 -right-20 h-80 w-80 rounded-full ${isDark ? 'bg-blue-900/15' : 'bg-blue-600/5'}`}
        />
      </View>

      {/* Main Content Area */}
      <View className="w-full flex-1 items-center justify-center">
        {/* Brand Icon in Squircle */}
        <View
          className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border shadow-sm ${
            isDark
              ? 'border-gray-800 bg-surface-dark-card'
              : 'border-slate-200/60 bg-surface-container-low'
          }`}>
          <HeartHandshake size={44} color="#006767" strokeWidth={1.75} />
        </View>

        {/* Brand Title & Subtitle */}
        <Text
          className={`text-center text-4xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-on-surface'
          }`}>
          Volunteer App
        </Text>
        <Text
          className={`mx-auto mt-3 max-w-[300px] text-center text-base leading-6 ${
            isDark ? 'text-gray-400' : 'text-on-surface-variant'
          }`}>
          Real-time volunteer coordination and street incident response in Glasgow.
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="w-full max-w-sm gap-3">
        <TouchableOpacity
          onPress={() => router.replace('/login')}
          className="h-[52px] w-full items-center justify-center rounded-xl bg-primary shadow-sm shadow-teal-900/20 active:opacity-90">
          <Text className="text-center text-[17px] font-semibold text-white">
            Log In to Volunteer
          </Text>
        </TouchableOpacity>

        {/* Quick Test Login for Development */}
        <TouchableOpacity
          onPress={async () => {
            await quickTestLogin();
            router.replace('/(tabs)');
          }}
          className={`h-[52px] w-full flex-row items-center justify-center gap-2 rounded-xl border transition-colors active:opacity-80 ${
            isDark ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-300 bg-amber-50'
          }`}>
          <Zap size={18} color={isDark ? '#fbbf24' : '#d97706'} />
          <Text
            className={`text-center text-[15px] font-bold ${
              isDark ? 'text-amber-400' : 'text-amber-800'
            }`}>
            Quick Test Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Index;
