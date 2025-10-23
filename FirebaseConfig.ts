// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBZseBXAb4bDrK8bOqqj-BVSVz-CihK3Ic',
  authDomain: 'volunteer-app-fe240.firebaseapp.com',
  projectId: 'volunteer-app-fe240',
  storageBucket: 'volunteer-app-fe240.firebasestorage.app',
  messagingSenderId: '898562480771',
  appId: '1:898562480771:web:88391c13a58c3f713159b6',
  measurementId: 'G-QX8DREQWD1',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
