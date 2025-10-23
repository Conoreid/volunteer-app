import { Stack } from "expo-router";
import { ThemeProvider } from "@/components/ThemeProvider"; // adjust the import path if needed

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
