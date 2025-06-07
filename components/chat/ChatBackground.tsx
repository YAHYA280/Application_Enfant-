import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

/**
 * A decorative background component for the chat UI
 * Creates a fun, child-friendly background with shapes and an orange-white gradient
 */
const ChatBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <View style={styles.container}>
      {/* Gradient background */}
      <LinearGradient
        colors={["rgba(255, 240, 230, 0.6)", "rgba(255, 255, 255, 0.9)"]}
        style={styles.gradient}
      >
        {/* Decorative shapes */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.square} />

        {/* Content */}
        <View style={styles.content}>{children}</View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  circle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -50,
    right: -50,
    backgroundColor: "rgba(255, 142, 105, 0.2)",
    opacity: 0.7,
  },
  circle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    bottom: 100,
    left: -50,
    backgroundColor: "rgba(255, 142, 105, 0.15)",
    opacity: 0.5,
  },
  square: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 30,
    transform: [{ rotate: "45deg" }],
    top: "30%",
    right: -30,
    backgroundColor: "rgba(255, 142, 105, 0.1)",
    opacity: 0.6,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default ChatBackground;
