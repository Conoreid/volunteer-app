import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

import '../global.css';

const Index: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/(tabs)');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0d9488" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <View className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-teal-50">
        <MapPin size="52" color="#0d9488" fill="#0d9488" strokeWidth="1" />
      </View>
      <Text className="text-4xl font-bold text-teal-600">Volunteer App</Text>
      <Text className="mt-3 text-lg text-gray-500">Find. Help. Report.</Text>
      <TouchableOpacity
        onPress={() => router.replace('/login')}
        className="mt-12 w-56 items-center rounded-lg bg-teal-600 py-4">
        <Text className="text-xl font-bold text-white">Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Index;
