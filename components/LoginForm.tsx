import React from 'react';
import {
  View,
  ViewProps,
  StyleProp,
  ViewStyle,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useState } from 'react';
import { auth } from '../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';

interface ComponentNameProps extends ViewProps {
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export default function ComponentName({ className = '', style, ...props }: ComponentNameProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace('/(tabs)');
    } catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    }
  };

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) router.replace('/(tabs)');
    } catch (error: any) {
      console.log(error);
      alert('Sign up failed: ' + error.message);
    }
  };

  return (
    <View
      className={`flex flex-col items-center justify-center rounded-lg p-4 ${className}`}
      style={style}
      {...props}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="mb-10 h-16 w-60 rounded-lg  bg-[#F5F5FA] p-3 pl-4 text-xl"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        className="mb-10 h-16 w-60 rounded-lg bg-[#F5F5FA] p-3 pl-4 text-xl"
      />
      <TouchableOpacity
        onPress={signIn}
        className="h-16 w-60 items-center justify-center rounded-lg bg-blue-600 p-3 hover:opacity-70">
        <Text className="text-center text-xl font-semibold text-white">Login</Text>
      </TouchableOpacity>
    </View>
  );
}
