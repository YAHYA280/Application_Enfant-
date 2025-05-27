import { Image } from "react-native";
import { useNavigation } from "expo-router";
import React, { useRef, useState, useCallback } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { COLORS, images } from "@/constants";
import CurvedMenuItem from "@/components/CurvedMenuItem";
import AnimatedAvatar from "@/components/AnimatedAvatar";
import NotificationBell from "@/components/notifications/NotificationBell";

const { width, height } = Dimensions.get("window");

// Responsive calculations
const getResponsiveValues = () => {
  const isSmallScreen = width < 375;
  const isLargeScreen = width > 414;
  const isTablet = width > 768;

  return {
    radius: isTablet ? 500 : isSmallScreen ? 320 : isLargeScreen ? 420 : 380,
    baseY: isTablet ? 800 : isSmallScreen ? 550 : isLargeScreen ? 650 : 600,
    itemSize: isTablet ? 140 : 130,
    sensitivity: isTablet ? 0.8 : isSmallScreen ? 1.2 : 1.0,
  };
};

const menuItems: {
  name: string;
  icon: "home" | "library-books" | "emoji-events" | "search";
  link: string;
}[] = [
  { name: "AI Devoir", icon: "home", link: "chatAiAcceuil" },
  { name: "J'apprends", icon: "library-books", link: "learning" },
  { name: "Challenge", icon: "emoji-events", link: "defi" },
  { name: "AI Recherche", icon: "search", link: "chatAiRecherche" },
];

// Spring animation config for smooth, natural feel
const springConfig = {
  damping: 20,
  stiffness: 120,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

// Slower, smoother spring config for scrolling
const scrollSpringConfig = {
  damping: 25,
  stiffness: 80,
  mass: 1.2,
  overshootClamping: false,
};

export default function Home() {
  const { navigate } = useNavigation<{ navigate: (screen: string) => void }>();
  const refRBSheet = useRef<{ open: () => void } | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState(0);

  const { radius, baseY, itemSize, sensitivity } = getResponsiveValues();

  // Shared values for smooth animations
  const angleOffset = useSharedValue(1.2);
  const isGesturing = useSharedValue(false);

  // Gesture configuration
  const panGesture = Gesture.Pan()
    .onStart(() => {
      isGesturing.value = true;
    })
    .onUpdate((event) => {
      // Slower, more controlled scrolling
      const delta = (event.translationX * sensitivity) / (width * 1.8);
      const newAngle = 1.2 + delta;

      // Smooth bounds with elastic effect at edges
      if (newAngle < -0.2) {
        angleOffset.value = -0.2 + (newAngle + 0.2) * 0.3;
      } else if (newAngle > 2.4) {
        angleOffset.value = 2.4 + (newAngle - 2.4) * 0.3;
      } else {
        angleOffset.value = newAngle;
      }
    })
    .onEnd((event) => {
      isGesturing.value = false;

      // Calculate final position with momentum
      const velocity = (event.velocityX * sensitivity) / (width * 1.8);
      const finalAngle = angleOffset.value + velocity * 0.3;

      // Clamp to actual bounds and animate smoothly
      const clampedAngle = Math.max(-0.2, Math.min(2.4, finalAngle));

      angleOffset.value = withSpring(clampedAngle, scrollSpringConfig);
    })
    .minDistance(5);

  // Function to focus on active menu item
  const focusOnActiveItem = useCallback(
    (index: number) => {
      const targetAngle = 1.2 - index * 0.35;
      const clampedAngle = Math.max(-0.2, Math.min(2.4, targetAngle));

      angleOffset.value = withSpring(clampedAngle, springConfig);
    },
    [angleOffset]
  );

  // Navigation with smooth animation
  const handleNavigation = useCallback(
    (link: string, index: number) => {
      setActiveMenuItem(index);
      focusOnActiveItem(index);

      // Delay navigation for smooth UX
      setTimeout(() => navigate(link), 200);
    },
    [navigate, focusOnActiveItem]
  );

  // Create a custom hook for menu item animation
  const useMenuItemAnimation = (index: number) => {
    return useAnimatedStyle(() => {
      // Calculate arc position
      const progress = index / (menuItems.length - 1);
      const angle =
        interpolate(
          progress,
          [0, 1],
          [-Math.PI / 2.2, Math.PI / 8],
          Extrapolate.CLAMP
        ) + angleOffset.value;

      const x = Math.sin(angle) * radius;
      const y = -Math.cos(angle) * radius + baseY;

      // Calculate rotation for visual alignment
      const rotation = (angle * 180) / Math.PI;

      // Smooth scale animation based on position
      const centerDistance = Math.abs(x) / radius;
      const scale = interpolate(
        centerDistance,
        [0, 1],
        [1.05, 0.9],
        Extrapolate.CLAMP
      );

      // Opacity fade for items at edges
      const opacity = interpolate(
        centerDistance,
        [0, 0.8, 1],
        [1, 0.8, 0.6],
        Extrapolate.CLAMP
      );

      return {
        position: "absolute" as const,
        left: width / 2 + x - itemSize / 2,
        top: y,
        transform: [
          { rotate: `${rotation}deg` },
          { scale: withSpring(scale, springConfig) },
        ],
        opacity: withSpring(opacity, springConfig),
      };
    });
  };

  // Menu item component that properly uses the hook
  const MenuItemComponent: React.FC<{
    item: (typeof menuItems)[0];
    index: number;
  }> = ({ item, index }) => {
    const animatedStyle = useMenuItemAnimation(index);

    return (
      <Animated.View style={animatedStyle}>
        <CurvedMenuItem
          icon={
            <MaterialIcons name={item.icon} size={30} color={COLORS.white} />
          }
          label={item.name}
          isActive={index === activeMenuItem}
          onPress={() => handleNavigation(item.link, index)}
        />
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image source={images.logo} style={styles.logoImage} />
      </View>

      <View style={styles.profileContainer}>
        <NotificationBell style={styles.notificationBell} />
        <Menu>
          <MenuTrigger>
            <Image source={images.user1} style={styles.profileImage} />
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: styles.menuOptionsContainer,
            }}
          >
            <MenuOption onSelect={() => navigate("profil")}>
              <View style={styles.menuItemHeader}>
                <MaterialIcons name="person" size={24} color={COLORS.black} />
                <Text style={styles.menuTextHeader}>Mon Profil</Text>
              </View>
            </MenuOption>
            <MenuOption onSelect={() => refRBSheet.current?.open()}>
              <View style={styles.menuItemHeader}>
                <MaterialIcons name="logout" size={24} color="red" />
                <Text style={[styles.menuTextHeader, { color: "red" }]}>
                  Déconnexion
                </Text>
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );

  const renderGreeting = () => (
    <View style={styles.greetingContainer}>
      <Text style={styles.greetingText}>Bienvenue Peter,</Text>
      <AnimatedAvatar />
      <Text style={styles.helpText}>
        Comment puis-je vous aider aujourd&apos;hui ?
      </Text>
    </View>
  );

  const renderMenu = () => (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <MenuItemComponent key={index} item={item} index={index} />
        ))}
      </Animated.View>
    </GestureDetector>
  );

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        {renderHeader()}
        {renderGreeting()}
        {renderMenu()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#0002",
    padding: 2,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: COLORS.white,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  profileContainer: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  notificationBell: {
    marginLeft: 12,
  },
  menuOptionsContainer: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 55,
    marginLeft: 0,
  },
  menuItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  menuTextHeader: {
    fontSize: 16,
    marginLeft: 10,
    color: COLORS.black,
  },
  greetingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: COLORS.black,
  },
  helpText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
    color: COLORS.black,
  },
  menuContainer: {
    position: "relative",
    width: "100%",
    height: height * 0.55,
    overflow: "hidden",
  },
});
