import { Text, View, TouchableOpacity } from 'react-native';
import React, { use, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

// Firebase is imported by modules that need it; no side-effect import necessary
import '../global.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/FirebaseConfig';
import { useRouter } from 'expo-router';

const localImageSource = require('../assets/nintchdbpict000320681476-1014010427.jpg');

const Index: React.FC = () => {
  const router = useRouter();

  const loginPage = () => {
    router.replace('/(tabs)/explore');
  };


  return (
    <View className="flex h-[500px] items-center justify-center">
      <Image
        source={localImageSource}
        className="bg-slate-400"
        style={{ width: '100%', flex: 1 }}
        contentFit="cover"
        transition={1000}
      />
      <Text className="mt-20 text-5xl font-bold text-blue-600">Volunteer App</Text>
      <TouchableOpacity
        onPress={loginPage}
        className="mt-20 w-40 items-center rounded-md bg-blue-600 p-4">
        <Text className="text-center text-xl text-white">Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Index;
