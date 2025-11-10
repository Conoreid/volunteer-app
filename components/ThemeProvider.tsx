import { ReactNode } from "react";
import { ThemeProvider as NavigationThemeProvider, DefaultTheme, Theme } from "@react-navigation/native";
import React from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  // You can start from DefaultTheme and override colors you want to change
  const theme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#007AFF",      // iOS-style blue
      background: "#FFFFFF",   // app background
      card: "#FFFFFF",         // header/tab background
      text: "#000000",         // default text color
      border: "#CCCCCC",       // border color
      notification: "#007AFF", // notification color
    },
  };

  return (
    <NavigationThemeProvider value={theme}>
      {children}
    </NavigationThemeProvider>
  );
}
