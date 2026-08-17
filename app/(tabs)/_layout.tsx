import React from 'react';
import { Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { BookOpen, Map, CheckSquare, User, Sun, Moon } from 'lucide-react-native';
import { useAppTheme } from '@/components/ThemeProvider';

function ThemeToggle() {
  const { isDark, toggleTheme } = useAppTheme();
  return (
    <TouchableOpacity onPress={toggleTheme} className="mr-4 p-1 active:opacity-70">
      {isDark ? <Sun size={20} color="#fbbf24" /> : <Moon size={20} color="#374151" />}
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  const { isDark } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#2dd4bf' : '#006767',
        tabBarInactiveTintColor: isDark ? '#9ca3af' : '#64748b',
        tabBarStyle: {
          backgroundColor: isDark ? '#121212' : '#ffffff',
          borderTopColor: isDark ? '#1f2937' : '#f1f5f9',
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: isDark ? '#121212' : '#ffffff',
          borderBottomColor: isDark ? '#1f2937' : '#f1f5f9',
          borderBottomWidth: 1,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: isDark ? '#ffffff' : '#1a1b1f',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: isDark ? '#ffffff' : '#1a1b1f',
        },
        headerRight: () => <ThemeToggle />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Guide',
          tabBarIcon: ({ color, size }) => <BookOpen size={size ?? 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => <Map size={size ?? 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="completed"
        options={{
          title: 'Completed',
          tabBarIcon: ({ color, size }) => <CheckSquare size={size ?? 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size ?? 24} color={color} />,
        }}
      />
    </Tabs>
  );
}
