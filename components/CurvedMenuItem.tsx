import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "@/constants";

type CurvedMenuItemProps = {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onPress?: () => void;
};

const CurvedMenuItem: React.FC<CurvedMenuItemProps> = ({
  icon,
  label,
  isActive = false,
  onPress,
}) => {
  // Create animated value for simple animation effects
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Handle press animations
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
      >
        {/* Card Background */}
        <View style={[styles.background, isActive && styles.backgroundActive]}>
          <LinearGradient
            colors={isActive ? ["#FFFFFF", "#F0F0F0"] : ["#F8F8F8", "#EFEFEF"]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </View>

        {/* Icon Container with Gradient Background */}
        <View
          style={[styles.iconContainer, isActive && styles.iconContainerActive]}
        >
          <LinearGradient
            colors={isActive ? ["#ff9e7c", "#ff6040"] : ["#ff8e69", "#ff5030"]}
            style={styles.iconGradient}
          >
            <View style={styles.iconWrapper}>{icon}</View>
          </LinearGradient>
        </View>

        {/* Label */}
        <Text style={[styles.label, isActive && styles.labelActive]}>
          {label}
        </Text>

        {/* Active Indicator */}
        {isActive && <View style={styles.activeIndicator} />}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 130,
    height: 125,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  backgroundActive: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  gradient: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    overflow: "hidden",
  },
  iconContainerActive: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  iconGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    color: "#505050",
    marginTop: 5,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
});

export default CurvedMenuItem;
