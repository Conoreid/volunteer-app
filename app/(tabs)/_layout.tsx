import React, { useEffect } from 'react';
import { Tabs, router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/FirebaseConfig';

export default function TabsLayout() {
  // Guard: if user signs out while inside tabs, kick them to login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log('[TabsLayout] User signed out -> redirecting to /');
        // Slight defer ensures navigator is ready
        setTimeout(() => router.replace('/'), 0);
      }
    });
    return unsub;
  }, []);

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
    </Tabs>
  );
}
