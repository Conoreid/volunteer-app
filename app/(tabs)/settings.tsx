import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { useAppTheme } from '@/components/ThemeProvider';
import {
  User,
  Mail,
  Lock,
  ChevronDown,
  ChevronUp,
  LogOut,
  MapPin,
  CheckCircle2,
  AtSign,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { user, signOut, updatePassword } = useAuth();
  const { isDark } = useAppTheme();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const displayName =
    user?.displayName ||
    user?.name ||
    user?.username ||
    (user?.email ? user.email.split('@')[0] : 'Volunteer');
  const accountEmail = user?.email || 'No email registered';
  const usernameHandle = user?.username || (user?.email ? user.email.split('@')[0] : 'volunteer');

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Missing fields', 'Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Weak password', 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords don't match", 'New password and confirmation must match.');
      return;
    }

    setIsUpdating(true);
    try {
      await updatePassword(currentPassword, newPassword);
      Alert.alert('Success', 'Password updated successfully in Firestore.');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Password change error:', error);
      Alert.alert('Error', error.message || 'Failed to update password. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ScrollView
      className={`flex-1 ${isDark ? 'bg-surface-dark' : 'bg-surface'}`}
      showsVerticalScrollIndicator={false}>
      <View className="px-5 pb-16 pt-5">
        {/* Profile Card */}
        <View
          className={`items-center rounded-3xl border p-6 shadow-sm ${
            isDark ? 'border-gray-800 bg-surface-dark-card' : 'border-slate-100 bg-white'
          }`}>
          {/* Avatar Squircle */}
          <View className="mb-3.5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-sm shadow-teal-900/30">
            <User size={38} color="white" strokeWidth={2} />
          </View>

          {/* User Display Name */}
          <Text
            className={`text-2xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-on-surface'
            }`}>
            {displayName}
          </Text>

          {/* Account Email under Name */}
          <View className="mt-1 flex-row items-center gap-1.5">
            <Mail size={13} color={isDark ? '#9ca3af' : '#64748b'} />
            <Text
              className={`text-xs font-medium ${
                isDark ? 'text-gray-400' : 'text-on-surface-variant'
              }`}>
              {accountEmail}
            </Text>
          </View>

          {/* Status Badges */}
          <View className="mt-3.5 flex-row gap-2">
            <View className="flex-row items-center gap-1.5 rounded-full border border-teal-200/50 bg-teal-500/10 px-3 py-1 dark:border-teal-800/40 dark:bg-teal-500/20">
              <CheckCircle2 size={12} color="#006767" />
              <Text className="text-[11px] font-bold text-primary dark:text-teal-400">
                ACTIVE STATUS
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 dark:border-gray-700 dark:bg-gray-800">
              <MapPin size={12} color={isDark ? '#9ca3af' : '#64748b'} />
              <Text className="text-[11px] font-bold text-slate-600 dark:text-gray-300">
                GLASGOW
              </Text>
            </View>
          </View>
        </View>

        {/* Username Info Card */}
        <View
          className={`mt-6 rounded-2xl border p-4 shadow-sm ${
            isDark ? 'border-gray-800 bg-surface-dark-card' : 'border-slate-100 bg-white'
          }`}>
          <View className="flex-row items-center gap-3">
            <View className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <AtSign size={20} color="#006767" />
            </View>
            <View className="flex-1">
              <Text
                className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                Volunteer Username
              </Text>
              <Text
                numberOfLines={1}
                className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-on-surface'}`}>
                {usernameHandle}
              </Text>
            </View>
          </View>
        </View>

        {/* Change Password Section */}
        <View
          className={`mt-6 rounded-3xl border p-5 shadow-sm ${
            isDark ? 'border-gray-800 bg-surface-dark-card' : 'border-slate-100 bg-white'
          }`}>
          <TouchableOpacity
            className="flex-row items-center justify-between"
            onPress={() => setShowPasswordForm(!showPasswordForm)}>
            <View className="flex-row items-center gap-3">
              <View className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Lock size={18} color="#006767" />
              </View>
              <Text
                className={`text-base font-semibold ${isDark ? 'text-white' : 'text-on-surface'}`}>
                Security & Password
              </Text>
            </View>
            {showPasswordForm ? (
              <ChevronUp size={20} color={isDark ? '#9ca3af' : '#64748b'} />
            ) : (
              <ChevronDown size={20} color={isDark ? '#9ca3af' : '#64748b'} />
            )}
          </TouchableOpacity>

          {showPasswordForm && (
            <View className="mt-4 gap-3 border-t border-slate-100 pt-4 dark:border-gray-800">
              <TextInput
                secureTextEntry
                placeholder="Current password"
                placeholderTextColor={isDark ? '#9ca3af' : '#94a3b8'}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                autoCapitalize="none"
                className={`h-13 rounded-xl border px-4 py-3 text-sm ${
                  isDark
                    ? 'border-gray-700/80 bg-gray-800/60 text-white'
                    : 'border-slate-200/80 bg-surface-container-low text-on-surface'
                }`}
              />
              <TextInput
                secureTextEntry
                placeholder="New password (min 6 chars)"
                placeholderTextColor={isDark ? '#9ca3af' : '#94a3b8'}
                value={newPassword}
                onChangeText={setNewPassword}
                autoCapitalize="none"
                className={`h-13 rounded-xl border px-4 py-3 text-sm ${
                  isDark
                    ? 'border-gray-700/80 bg-gray-800/60 text-white'
                    : 'border-slate-200/80 bg-surface-container-low text-on-surface'
                }`}
              />
              <TextInput
                secureTextEntry
                placeholder="Confirm new password"
                placeholderTextColor={isDark ? '#9ca3af' : '#94a3b8'}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
                className={`h-13 rounded-xl border px-4 py-3 text-sm ${
                  isDark
                    ? 'border-gray-700/80 bg-gray-800/60 text-white'
                    : 'border-slate-200/80 bg-surface-container-low text-on-surface'
                }`}
              />
              <TouchableOpacity
                className={`mt-1 h-12 items-center justify-center rounded-xl bg-primary shadow-sm shadow-teal-900/30 active:scale-[0.99] ${
                  isUpdating ? 'opacity-70' : 'opacity-100'
                }`}
                onPress={handleChangePassword}
                disabled={isUpdating}>
                {isUpdating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-base font-semibold text-white">Update Password</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Sign Out Button */}
        <View className="mt-6">
          <TouchableOpacity
            className="h-[52px] w-full flex-row items-center justify-center gap-2 rounded-xl bg-red-600 shadow-sm shadow-red-900/30 active:scale-[0.99]"
            onPress={handleSignOut}>
            <LogOut size={18} color="white" />
            <Text className="text-[17px] font-semibold text-white">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
