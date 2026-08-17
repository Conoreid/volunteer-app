import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBZseBXAb4bDrK8bOqqj-BVSVz-CihK3Ic',
  authDomain: 'volunteer-app-fe240.firebaseapp.com',
  projectId: 'volunteer-app-fe240',
  storageBucket: 'volunteer-app-fe240.firebasestorage.app',
  messagingSenderId: '898562480771',
  appId: '1:898562480771:web:88391c13a58c3f713159b6',
  measurementId: 'G-QX8DREQWD1',
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
