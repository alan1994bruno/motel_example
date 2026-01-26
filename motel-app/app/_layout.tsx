import { useUserStore } from "@/store/user-store";
import theme from "@/theme";
import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components/native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, hasHydrated } = useUserStore();
  const segments = useSegments();
  const router = useRouter();

  const rootNavigationState = useRootNavigationState();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (hasHydrated) {
      setIsReady(true);
    }
  }, [hasHydrated]);

  useEffect(() => {
    if (!rootNavigationState?.key) return;

    if (!isReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    SplashScreen.hideAsync();

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    } else if (!isAuthenticated && segments[0] !== "(auth)") {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, segments, isReady, rootNavigationState?.key]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="suite/[id]" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}
