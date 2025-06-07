import React, { useRef, useEffect } from "react";
import { View, Text, Easing, Animated, StyleSheet } from "react-native";

import { COLORS } from "@/constants";

const ChatAiWelcome = () => {
  // Animation values
  const waveAnimation = useRef(new Animated.Value(0)).current;
  const bounceAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Wave animation for the hand
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnimation, {
          toValue: 0,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Bounce animation for the avatar
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnimation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnimation, {
          toValue: 0,
          duration: 1000,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [waveAnimation, bounceAnimation, fadeAnimation]);

  // Interpolate animation values
  const waveRotation = waveAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "30deg"],
  });

  const bounceTranslation = bounceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnimation,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.avatarContainer,
          {
            transform: [{ translateY: bounceTranslation }],
          },
        ]}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🤖</Text>
        </View>

        <Animated.View
          style={[
            styles.handContainer,
            {
              transform: [{ rotate: waveRotation }],
            },
          ]}
        >
          <Text style={styles.handText}>👋</Text>
        </Animated.View>
      </Animated.View>

      <Text style={styles.welcomeText}>
        Bonjour, merci de poser ta question
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginHorizontal: 16,
    backgroundColor: COLORS.greyscale100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: "relative",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 142, 105, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarText: {
    fontSize: 40,
  },
  handContainer: {
    position: "absolute",
    right: -5,
    bottom: 10,
    transform: [{ rotate: "0deg" }],
    transformOrigin: "bottom right",
  },
  handText: {
    fontSize: 25,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: "medium",
    textAlign: "center",
    color: COLORS.greyscale900,
    lineHeight: 22,
  },
});

export default ChatAiWelcome;
