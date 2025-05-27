import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { COLORS } from "@/constants";

type CurvedMenuItemProps = {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onPress?: () => void;
};

// Smooth spring configuration
const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
  overshootClamping: false,
};

// Quick timing config for press feedback
const timingConfig = {
  duration: 100,
};

const CurvedMenuItem: React.FC<CurvedMenuItemProps> = ({
  icon,
  label,
  isActive = false,
  onPress,
}) => {
  // Shared values for smooth animations
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const pressed = useSharedValue(false);

  // Tap gesture with smooth animations
  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      pressed.value = true;
      scale.value = withSpring(0.95, springConfig);
      opacity.value = withTiming(0.8, timingConfig);
    })
    .onFinalize(() => {
      pressed.value = false;
      scale.value = withSpring(1, springConfig);
      opacity.value = withTiming(1, timingConfig);
    })
    .onEnd(() => {
      if (onPress) {
        // Small delay for visual feedback
        setTimeout(() => onPress(), 50);
      }
    });

  // Animated styles for the container
  const animatedContainerStyle = useAnimatedStyle(() => {
    // Active state animation
    const activeScale = isActive ? 1.05 : 1;
    const combinedScale = scale.value * activeScale;

    return {
      transform: [{ scale: withSpring(combinedScale, springConfig) }],
      opacity: opacity.value,
    };
  });

  // Animated styles for the background
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const shadowOpacity = isActive ? 0.25 : 0.12;
    const elevation = isActive ? 10 : 6;

    return {
      shadowOpacity: withSpring(shadowOpacity, springConfig),
      elevation: withSpring(elevation, springConfig),
    };
  });

  // Animated styles for the icon container
  const animatedIconStyle = useAnimatedStyle(() => {
    const iconScale = pressed.value ? 0.9 : 1;
    const activeIconScale = isActive ? 1.1 : 1;
    const combinedIconScale = iconScale * activeIconScale;

    return {
      transform: [{ scale: withSpring(combinedIconScale, springConfig) }],
    };
  });

  // Animated styles for the label
  const animatedLabelStyle = useAnimatedStyle(() => {
    const labelOpacity = pressed.value ? 0.7 : 1;

    return {
      opacity: withTiming(labelOpacity, timingConfig),
    };
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        {/* Card Background */}
        <Animated.View
          style={[
            styles.background,
            isActive && styles.backgroundActive,
            animatedBackgroundStyle,
          ]}
        >
          <LinearGradient
            colors={isActive ? ["#FFFFFF", "#F8F8F8"] : ["#FAFAFA", "#F0F0F0"]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        {/* Icon Container with Gradient Background */}
        <Animated.View
          style={[
            styles.iconContainer,
            isActive && styles.iconContainerActive,
            animatedIconStyle,
          ]}
        >
          <LinearGradient
            colors={isActive ? ["#ff9e7c", "#ff6040"] : ["#ff8e69", "#ff5030"]}
            style={styles.iconGradient}
          >
            <View style={styles.iconWrapper}>{icon}</View>
          </LinearGradient>
        </Animated.View>

        {/* Label */}
        <Animated.Text
          style={[
            styles.label,
            isActive && styles.labelActive,
            animatedLabelStyle,
          ]}
        >
          {label}
        </Animated.Text>

        {/* Active Indicator with proper entering/exiting animations */}
        {isActive && (
          <Animated.View
            style={styles.activeIndicator}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
          />
        )}
      </Animated.View>
    </GestureDetector>
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
    shadowOpacity: 0.12,
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
    shadowOpacity: 0.15,
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
