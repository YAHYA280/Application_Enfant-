import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { COLORS } from "@/constants";

const AnimatedAvatar = () => {
  // Animation values
  const waveAnimation = useRef(new Animated.Value(0)).current;
  const bounceAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  }, [waveAnimation, bounceAnimation]);

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
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    position: "relative",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 142, 105, 0.3)", // Fixed: using rgba instead of string concatenation
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
});

export default AnimatedAvatar;
