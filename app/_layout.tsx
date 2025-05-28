import React from "react";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { FONTS } from "@/constants/fonts";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";
import { MenuProvider } from "react-native-popup-menu";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
