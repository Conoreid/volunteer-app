// app/(tabs)/index.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { auth } from '@/FirebaseConfig';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';

export default function HomeScreen() {
  const handleSignOut = async () => {
    try {
      // The button's ONLY job is to sign out.
      await signOut(auth);
      // The listener in _layout.tsx will handle the redirect.
      console.log('Sign-out successful. Navigating to login...');
      // Fallback navigation to ensure UI moves immediately even if listener timing varies
      router.replace('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View>
      <Text>Home Tab</Text>
      <TouchableOpacity
        className="max-w-[100px] rounded-lg bg-blue-500 p-4 text-center"
        onPress={handleSignOut}>
        <Text className="text-center text-xl font-semibold text-white">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
