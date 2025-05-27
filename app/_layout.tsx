import React from "react";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { MenuProvider } from "react-native-popup-menu";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { FONTS } from "@/constants/fonts";
import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts(FONTS);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <MenuProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="chatAiAcceuil" />
          <Stack.Screen name="chatAiRecherche" />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="lessondetailsmore" />
          <Stack.Screen name="exerciseview" />
          <Stack.Screen name="reviewlesson" />
          <Stack.Screen name="challengedetailsmore" />
          <Stack.Screen name="questionviewsreen" />
          <Stack.Screen name="learning" />
          <Stack.Screen name="defi" />
        </Stack>
        <StatusBar style="auto" />
      </MenuProvider>
    </ThemeProvider>
  );
}
