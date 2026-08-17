import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAppTheme } from '@/components/ThemeProvider';

export default function SettingsScreen() {
  const { user, signOut, updatePassword } = useAuth();
  const router = useRouter();
  const { isDark } = useAppTheme();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

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
    <View className={`flex-1 px-6 pt-10 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Profile Section */}
      <View
        className={`items-center rounded-lg p-6 shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <View className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-teal-600">
          <FontAwesome name="user" size={28} color="white" />
        </View>
        <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>
          {user?.displayName ?? user?.name ?? 'Volunteer'}
        </Text>
        <View className="mt-2 flex flex-row items-center gap-2">
          <FontAwesome name="envelope" size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {user?.email ?? 'No email'}
          </Text>
        </View>
      </View>

      {/* Change Password */}
      <View className={`mt-6 rounded-lg p-6 shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <TouchableOpacity
          className="flex flex-row items-center justify-between"
          onPress={() => setShowPasswordForm(!showPasswordForm)}>
          <View className="flex flex-row items-center gap-3">
            <FontAwesome name="lock" size={20} color="#0d9488" />
            <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
              Change Password
            </Text>
          </View>
          <FontAwesome
            name={showPasswordForm ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={isDark ? '#9ca3af' : '#6b7280'}
          />
        </TouchableOpacity>

        {showPasswordForm && (
          <View className="mt-4 gap-3">
            <TextInput
              secureTextEntry
              placeholder="Current password"
              placeholderTextColor={isDark ? '#6b7280' : undefined}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              autoCapitalize="none"
              className={`rounded-lg border px-4 py-3 ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-slate-300'}`}
            />
            <TextInput
              secureTextEntry
              placeholder="New password"
              placeholderTextColor={isDark ? '#6b7280' : undefined}
              value={newPassword}
              onChangeText={setNewPassword}
              autoCapitalize="none"
              className={`rounded-lg border px-4 py-3 ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-slate-300'}`}
            />
            <TextInput
              secureTextEntry
              placeholder="Confirm new password"
              placeholderTextColor={isDark ? '#6b7280' : undefined}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              className={`rounded-lg border px-4 py-3 ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-slate-300'}`}
            />
            <TouchableOpacity
              className={`items-center rounded-lg py-3 ${isUpdating ? 'bg-teal-300' : 'bg-teal-600'}`}
              onPress={handleChangePassword}
              disabled={isUpdating}>
              {isUpdating ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base font-bold text-white">Update Password</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Sign Out */}
      <View className="mt-6 items-center">
        <TouchableOpacity
          className="w-full items-center rounded-lg bg-red-500 py-4"
          onPress={handleSignOut}>
          <Text className="text-lg font-bold text-white">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
