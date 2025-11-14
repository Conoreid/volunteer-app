import { Text, View, TouchableOpacity } from 'react-native';
import React, { use, useEffect } from 'react';
import LoginForm from '../components/LoginForm';

// Firebase is imported by modules that need it; no side-effect import necessary
import '../global.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/FirebaseConfig';
import { useRouter } from 'expo-router';

const Index: React.FC = () => {
  const router = useRouter();

  const loginPage = () => {
    router.replace('/login');
  }

  return (
    <View className='flex justify-center items-center'>
      <TouchableOpacity onPress={loginPage} className='mt-20 items-center bg-blue-600 w-40 p-4 rounded-md'>
        <Text className='text-center text-white text-xl'>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Index;
