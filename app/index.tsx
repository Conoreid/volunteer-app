import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import LoginForm from '../components/LoginForm';

// Firebase is imported by modules that need it; no side-effect import necessary
import '../global.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/FirebaseConfig';
import { router } from 'expo-router';

const Index: React.FC = () => {
  // If already signed in, go straight to tabs
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('[Login] User already signed in -> redirecting to /(tabs)');
        setTimeout(() => router.replace('/(tabs)'), 0);
      }
    });
    return unsub;
  }, []);
  return (
    <SafeAreaView>
      <View>
        <Text className="mb-4 mt-20 flex items-center justify-center text-center text-2xl font-bold">
          Volunteer App
        </Text>
        <LoginForm className="" />
      </View>
    </SafeAreaView>
  );
};

export default Index;
