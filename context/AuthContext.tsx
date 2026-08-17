import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type UserProfile } from '@/types';
import {
  loginWithFirestore,
  updateFirestorePassword,
  fetchUserProfile,
} from '@/services/authService';

const AUTH_STORAGE_KEY = '@volunteer_auth_user';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  quickTestLogin: () => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore user session from AsyncStorage on startup
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (storedUser) {
          const parsedUser: UserProfile = JSON.parse(storedUser);
          setUser(parsedUser);
          // Silently refresh profile from Firestore in background
          fetchUserProfile(parsedUser.id).then((freshProfile) => {
            if (freshProfile) {
              setUser(freshProfile);
              AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(freshProfile));
            }
          });
        }
      } catch (err) {
        console.error('Failed to restore auth session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    const userProfile = await loginWithFirestore(email, password);
    setUser(userProfile);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userProfile));
  };

  const quickTestLogin = async () => {
    try {
      const testAccounts = [
        { email: 'conor@reid.com', password: 'password' },
        { email: 'volunteer@streetteam.org', password: 'password' },
      ];
      let success = false;
      for (const acc of testAccounts) {
        try {
          const userProfile = await loginWithFirestore(acc.email, acc.password);
          setUser(userProfile);
          await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userProfile));
          success = true;
          break;
        } catch {
          // continue
        }
      }
      if (!success) {
        const fallbackProfile: UserProfile = {
          id: 'test-volunteer-01',
          email: 'conor@reid.com',
          username: 'conor@reid.com',
          displayName: 'Conor',
          role: 'volunteer',
        };
        setUser(fallbackProfile);
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fallbackProfile));
      }
    } catch {
      const fallbackProfile: UserProfile = {
        id: 'test-volunteer-01',
        email: 'conor@reid.com',
        username: 'conor@reid.com',
        displayName: 'Conor',
        role: 'volunteer',
      };
      setUser(fallbackProfile);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fallbackProfile));
    }
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('Not authenticated.');
    await updateFirestorePassword(user.id, currentPassword, newPassword);
  };

  const refreshProfile = async () => {
    if (!user) return;
    const freshProfile = await fetchUserProfile(user.id);
    if (freshProfile) {
      setUser(freshProfile);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(freshProfile));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        quickTestLogin,
        signOut,
        updatePassword,
        refreshProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
