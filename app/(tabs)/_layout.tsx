import React, { useEffect } from 'react';
import { Tabs, router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/FirebaseConfig';

export default function TabsLayout() {

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
    </Tabs>
  );
}
