import {
  View,
  ViewProps,
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
import { Mail, Lock, Eye, EyeOff, HeartHandshake, Zap } from 'lucide-react-native';

interface LoginFormProps extends ViewProps {
  className?: string;
}

export default function LoginForm({ className = '', ...props }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { signIn, quickTestLogin } = useAuth();
  const { isDark } = useAppTheme();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Please enter both your email and password.');
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

  const handleQuickTestLogin = async () => {
    setIsLoggingIn(true);
    try {
      await quickTestLogin();
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Test Login Failed', error.message || 'Could not log in.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View
      className={`w-full max-w-md rounded-3xl border p-8 py-10 shadow-xl ${
        isDark
          ? 'border-gray-800 bg-surface-dark-card shadow-black/50'
          : 'border-slate-100 bg-white shadow-slate-200/80'
      } ${className}`}
      {...props}>
      {/* Brand Header */}
      <View className="mb-7 items-center">
        <View className="mb-3.5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <HeartHandshake size={36} color="#006767" strokeWidth={2} />
        </View>
        <Text
          className={`text-3xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-on-surface'
          }`}>
          Volunteer App
        </Text>
        <Text
          className={`mt-2 max-w-[280px] text-center text-sm leading-5 ${
            isDark ? 'text-gray-400' : 'text-on-surface-variant'
          }`}>
          Sign in to access volunteer alerts and live incident dispatch.
        </Text>
      </View>

      {/* Form Fields */}
      <View className="w-full gap-4">
        {/* Email Input */}
        <View
          className={`flex h-16 flex-row items-center gap-4 rounded-2xl border px-5 ${
            isDark
              ? 'border-gray-700/80 bg-gray-800/60'
              : 'border-slate-200/80 bg-surface-container-low'
          }`}>
          <Mail size={22} color={isDark ? '#9ca3af' : '#64748b'} />
          <TextInput
            placeholder="Email Address"
            placeholderTextColor={isDark ? '#9ca3af' : '#94a3b8'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className={`flex-1 text-base ${isDark ? 'text-white' : 'text-on-surface'}`}
          />
        </View>

        {/* Password Input */}
        <View
          className={`flex h-16 flex-row items-center gap-4 rounded-2xl border px-5 ${
            isDark
              ? 'border-gray-700/80 bg-gray-800/60'
              : 'border-slate-200/80 bg-surface-container-low'
          }`}>
          <Lock size={22} color={isDark ? '#9ca3af' : '#64748b'} />
          <TextInput
            placeholder="Password"
            placeholderTextColor={isDark ? '#9ca3af' : '#94a3b8'}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            className={`flex-1 text-base ${isDark ? 'text-white' : 'text-on-surface'}`}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="p-1.5 active:opacity-70">
            {showPassword ? (
              <EyeOff size={22} color={isDark ? '#9ca3af' : '#64748b'} />
            ) : (
              <Eye size={22} color={isDark ? '#9ca3af' : '#64748b'} />
            )}
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoggingIn}
          className={`mt-3 h-14 w-full items-center justify-center rounded-2xl bg-primary shadow-md shadow-teal-900/30 active:scale-[0.99] ${
            isLoggingIn ? 'opacity-70' : 'opacity-100'
          }`}>
          {isLoggingIn ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-lg font-semibold text-white">Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Quick Test Login Button */}
        <TouchableOpacity
          onPress={handleQuickTestLogin}
          disabled={isLoggingIn}
          className={`h-12 w-full flex-row items-center justify-center gap-2 rounded-2xl border ${
            isDark ? 'border-amber-500/30 bg-amber-500/10' : 'border-amber-200 bg-amber-50'
          } active:opacity-80`}>
          <Zap size={18} color={isDark ? '#fbbf24' : '#d97706'} />
          <Text className={`text-sm font-bold ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
            Quick Test Login (One-Tap)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
