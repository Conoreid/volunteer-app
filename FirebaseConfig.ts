import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBLxXlJl4zT-slnoVnBVj9qfg1V5AB6A-I',

  authDomain: 'a4g-2026.firebaseapp.com',

  projectId: 'a4g-2026',

  storageBucket: 'a4g-2026.firebasestorage.app',

  messagingSenderId: '303798777456',

  appId: '1:303798777456:web:29f0366c34ec4e43bde6b5',

  measurementId: 'G-37MB828YFK',
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
