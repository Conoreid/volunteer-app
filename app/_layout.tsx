import React, { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      {children}
    </SafeAreaView>
  );
}
