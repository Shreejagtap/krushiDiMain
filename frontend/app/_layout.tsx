import GlobalProvider from "@/context/GlobalContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./globals.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import Constants from "expo-constants";

export default function RootLayout() {
  return (
    <GlobalProvider>
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <LanguageProvider>
          <Stack />
          <StatusBar style="dark" />
        </LanguageProvider>
      </ClerkProvider>
    </GlobalProvider>
  );
}
