import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import {
  ThemeProvider as NavigationThemeProvider,
  DefaultTheme,
  DarkTheme,
  Theme,
} from '@react-navigation/native';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ isDark: false, toggleTheme: () => {} });

export const useAppTheme = () => useContext(ThemeContext);

const lightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0d9488',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#000000',
    border: '#CCCCCC',
  },
};

const darkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#14b8a6',
    background: '#111827',
    card: '#1f2937',
    text: '#f9fafb',
    border: '#374151',
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useNativeColorScheme();
  const { setColorScheme: setNativeWindColorScheme } = useNativeWindColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  // Sync with NativeWind color scheme
  useEffect(() => {
    setNativeWindColorScheme(isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationThemeProvider value={isDark ? darkTheme : lightTheme}>
        {children}
      </NavigationThemeProvider>
    </ThemeContext.Provider>
  );
}
