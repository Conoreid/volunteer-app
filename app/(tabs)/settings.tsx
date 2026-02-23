// app/(tabs)/index.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { auth } from '@/FirebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter, Redirect } from 'expo-router';

export default function HomeScreen() {
  const user = auth.currentUser;
  const router = useRouter();


  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Sign-out successful. Navigating to login...');
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View className="mt-10 flex items-center justify-center gap-10">
      <TouchableOpacity
        className="align-center max-w-[100px] rounded-lg bg-blue-500 p-4 text-center"
        onPress={handleSignOut}>
        <Text className="text-center text-xl font-semibold text-white">Sign Out</Text>
        
      </TouchableOpacity>
    </View>
  );
}
