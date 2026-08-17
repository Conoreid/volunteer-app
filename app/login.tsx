import { View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React from 'react';
import LoginForm from '../components/LoginForm';
import { router } from 'expo-router';
import { useAppTheme } from '@/components/ThemeProvider';
import { ArrowLeft } from 'lucide-react-native';

export default function LoginScreen() {
  const { isDark } = useAppTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className={`flex-1 ${isDark ? 'bg-surface-dark' : 'bg-surface'}`}>
      {/* Decorative ambient background glows */}
      <View className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
        <View
          className={`absolute -left-16 -top-16 h-72 w-72 rounded-full ${
            isDark ? 'bg-teal-900/20' : 'bg-teal-600/5'
          }`}
        />
        <View
          className={`absolute -bottom-20 -right-20 h-80 w-80 rounded-full ${
            isDark ? 'bg-blue-900/15' : 'bg-blue-600/5'
          }`}
        />
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Top Bar with Back Button */}
        <View className="px-6 pt-12">
          <TouchableOpacity
            onPress={() => router.replace('/')}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
              isDark ? 'border-gray-800 bg-surface-dark-card' : 'border-slate-200/80 bg-white'
            } active:opacity-70`}>
            <ArrowLeft size={22} color={isDark ? '#f9fafb' : '#1e293b'} />
          </TouchableOpacity>
        </View>

        {/* Centered Login Card */}
        <View className="flex-1 items-center justify-center px-6 py-8">
          <LoginForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
