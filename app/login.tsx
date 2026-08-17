import { Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import LoginForm from '../components/LoginForm';
import { router } from 'expo-router';
import { useAppTheme } from '@/components/ThemeProvider';

export default function LoginScreen() {
  const { isDark } = useAppTheme();

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <TouchableOpacity className="mb-4 mt-20 items-center" onPress={() => router.replace('/')}>
        <Text className="text-3xl font-bold text-teal-600">Volunteer App</Text>
      </TouchableOpacity>
      <LoginForm className="" />
    </View>
  );
}
