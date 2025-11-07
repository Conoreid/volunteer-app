// app/(tabs)/index.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { auth } from '@/FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { router } from 'expo-router';

export default function HomeScreen() {
  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      if (!user) router.replace('/');
    });

    return () => unsubscribe();
  }, []);

  return (
    <View>
      <Text>Home Tab</Text>
      <TouchableOpacity
        className="max-w-[100px] rounded-lg bg-blue-500 p-4 text-center"
        onPress={() => auth.signOut()}>
        <Text className="text-center text-xl font-semibold text-white">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
