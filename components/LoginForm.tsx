import {
  View,
  ViewProps,
  StyleProp,
  ViewStyle,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { useAppTheme } from '@/components/ThemeProvider';

interface LoginFormProps extends ViewProps {
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export default function LoginForm({ className = '', style, ...props }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { signIn } = useAuth();
  const { isDark } = useAppTheme();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Please enter both email and password.');
      return;
    }

    setIsLoggingIn(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Sign In Failed', error.message || 'Invalid email or password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View
      className={`flex flex-col items-center justify-center rounded-lg p-4 ${className}`}
      style={style}
      {...props}>
      <TextInput
        placeholder="Email"
        placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className={`mb-10 h-16 w-60 rounded-lg p-3 pl-4 text-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-[#F5F5FA] text-black'}`}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        className={`mb-10 h-16 w-60 rounded-lg p-3 pl-4 text-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-[#F5F5FA] text-black'}`}
      />
      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoggingIn}
        className={`h-16 w-60 items-center justify-center rounded-lg p-3 ${isLoggingIn ? 'bg-teal-400' : 'bg-teal-600'} hover:opacity-70`}>
        {isLoggingIn ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-xl font-semibold text-white">Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
