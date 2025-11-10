// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/components/ThemeProvider';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/FirebaseConfig';

// This is the main layout for the entire app.
export default function RootLayout() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Subscribe to auth changes ONCE; keep user state updated.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('[Auth] State changed. User:', user ? user.email : 'null');
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // Navigation is handled in app/index.tsx and app/(tabs)/_layout.tsx.

  // This <Stack> navigator defines all the "top-level" routes
  // your app knows about.
  return (
    <ThemeProvider>
      <Stack>
        {/* Your login screen at app/index.tsx */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Your main app screens in the app/(tabs) directory */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Your modal screen at app/modal.tsx */}
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
