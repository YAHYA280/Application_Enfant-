import React from "react";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { FONTS } from "@/constants/fonts";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";
import { MenuProvider } from "react-native-popup-menu";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
      <ThemeProvider value={DefaultTheme}>
        <MenuProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="home" />
            <Stack.Screen name="chatAiAcceuil" />
            <Stack.Screen name="chatAiRecherche" />
            <Stack.Screen name="+not-found" />

            {/* Learning Section */}
            <Stack.Screen name="learning" />
            <Stack.Screen name="lessondetailsmore" />
            <Stack.Screen name="exerciseview" />
            <Stack.Screen name="reviewlesson" />

            {/* Challenge Section - Updated Names */}
            <Stack.Screen name="ChallengeListScreen" />
            <Stack.Screen name="ChallengeDetailsScreen" />
            <Stack.Screen name="ChallengeScreen" />
            <Stack.Screen name="ChallengeResultScreen" />
          </Stack>
          <StatusBar style="auto" />
        </MenuProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
