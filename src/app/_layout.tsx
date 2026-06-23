import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import '../../global.css';
import { useAppStore } from "@/store";
import { useShallow } from 'zustand/react/shallow';
import ErrorBoundary from '@/components/ErrorBoundary';

import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "sans-regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-light": require("../../assets/fonts/PlusJakartaSans-Light.ttf"),
    "sans-medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-extrabold": require("../../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  });

  const { hasHydrated, isAuthenticated, currentBusiness } = useAppStore(
    useShallow((s) => ({
      hasHydrated: s.hasHydrated,
      isAuthenticated: s.isAuthenticated,
      currentBusiness: s.currentBusiness
    }))
  );
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loaded && hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [loaded, hasHydrated]);

  useEffect(() => {
    if (!loaded || !hasHydrated) return;
    
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    const inProtected = segments[0] === '(app)';

    if (!isAuthenticated && inProtected) {
      router.replace('/onboarding');
      return;
    }
    if (isAuthenticated && !currentBusiness && inProtected) {
      router.replace('/(auth)/sign-up');
      return;
    }
    if (isAuthenticated && currentBusiness && (inAuthGroup || inOnboarding)) {
      router.replace('/(app)/(dashboard)/dashboard');
      return;
    }
  }, [loaded, hasHydrated, isAuthenticated, currentBusiness, segments]);

  if (!loaded || !hasHydrated) {
    return null;
  }

  return (
    <ErrorBoundary>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </ErrorBoundary>
  );
}
