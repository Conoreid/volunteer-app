// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { router, Stack } from 'expo-router';
import { ThemeProvider } from '@/components/ThemeProvider';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/FirebaseConfig';

// This is the main layout for the entire app.
export default function RootLayout() {

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
