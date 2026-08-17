import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import {
  ThemeProvider as NavigationThemeProvider,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ isDark: false, toggleTheme: () => {} });

export const useAppTheme = () => useContext(ThemeContext);

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#2dd4bf',
    background: '#000000',
    card: '#121212',
    text: '#ffffff',
    border: '#1f2937',
  },
};

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#006767',
    background: '#faf8fe',
    card: '#ffffff',
    text: '#1a1b1f',
    border: '#e2e8f0',
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
      <NavigationThemeProvider value={isDark ? CustomDarkTheme : CustomLightTheme}>
        <StatusBar
          style={isDark ? 'light' : 'dark'}
          backgroundColor={isDark ? '#121212' : '#ffffff'}
        />
        {children}
      </NavigationThemeProvider>
    </ThemeContext.Provider>
  );
}
