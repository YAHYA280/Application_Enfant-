/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Animated, {
  runOnUI,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  useSharedValue,
  cancelAnimation,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width: screenWidth } = Dimensions.get("window");

// Menu configuration with orange gradient colors
const MENU_ITEMS = [
  {
    name: "AI Devoir",
    icon: "home" as const,
    link: "chatAiAcceuil",
    colors: ["#FF8A50", "#FF6B35"] as const,
    activeColors: ["#FF7043", "#FF5722"] as const,
  },
  {
    name: "J'apprends",
    icon: "library-books" as const,
    link: "learning",
    colors: ["#FFB74D", "#FF9800"] as const,
    activeColors: ["#FF9800", "#F57C00"] as const,
  },
  {
    name: "Challenge",
    icon: "emoji-events" as const,
    link: "ChallengeListScreen",
    colors: ["#FFCC02", "#FF9500"] as const,
    activeColors: ["#FF9500", "#E65100"] as const,
  },
  {
    name: "AI Recherche",
    icon: "search" as const,
    link: "chatAiRecherche",
    colors: ["#FF7043", "#D84315"] as const,
    activeColors: ["#D84315", "#BF360C"] as const,
  },
];

// Responsive calculations
const ITEM_WIDTH = Math.min(screenWidth / 5, 80);
const ITEM_HEIGHT = ITEM_WIDTH + 20;
const MENU_HEIGHT = ITEM_HEIGHT + 40;

interface KidFriendlyMenuProps {
  onNavigate?: (link: string) => void;
}

interface MenuItemProps {
  item: (typeof MENU_ITEMS)[0];
  index: number;
  onPress: () => void;
  isReady: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const KidMenuItem: React.FC<MenuItemProps> = ({
  item,
  index,
  onPress,
  isReady,
}) => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (!isReady) return;

    runOnUI(() => {
      "worklet";

      opacity.value = 1;
      translateY.value = 0;
      scale.value = 1;
      rotate.value = 0;
    })();

    const entranceDelay = index * 100;

    translateY.value = -10;
    opacity.value = 0.7;

    setTimeout(() => {
      opacity.value = withSpring(1, { damping: 12, stiffness: 200 });
      translateY.value = withSpring(0, { damping: 12, stiffness: 200 });
    }, entranceDelay);

    const idleTimeout = setTimeout(() => {
      rotate.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 3000 }),
          withTiming(-1, { duration: 3000 }),
          withTiming(0, { duration: 3000 })
        ),
        -1,
        true
      );
    }, entranceDelay + 800);

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(idleTimeout);
      cancelAnimation(rotate);

      runOnUI(() => {
        "worklet";

        opacity.value = 1;
        translateY.value = 0;
        scale.value = 1;
        rotate.value = 0;
      })();
    };
  }, [isReady, index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}deg` },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    setIsPressed(true);
    scale.value = withSpring(0.9, { damping: 20, stiffness: 300 });
  };

  const handlePressOut = () => {
    setIsPressed(false);
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  };

  const handlePress = () => {
    // Quick feedback animation
    scale.value = withSequence(
      withSpring(0.85, { damping: 20, stiffness: 400 }),
      withSpring(1, { damping: 20, stiffness: 300 })
    );

    onPress();
  };

  // Fallback: render without animation if something goes wrong
  const fallbackStyle = {
    transform: [{ scale: 1 }, { rotate: "0deg" }, { translateY: 0 }],
    opacity: 1,
  };

  return (
    <AnimatedTouchable
      style={[styles.menuItem, isReady ? animatedStyle : fallbackStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <View style={styles.itemContainer}>
        <LinearGradient
          colors={item.colors}
          style={styles.itemBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Sparkle effects */}
        <View style={styles.sparkleOverlay}>
          <View style={[styles.sparkle, styles.sparkle1]} />
          <View style={[styles.sparkle, styles.sparkle2]} />
          <View style={[styles.sparkle, styles.sparkle3]} />
        </View>

        <View style={styles.iconContainer}>
          <MaterialIcons
            name={item.icon}
            size={ITEM_WIDTH * 0.45}
            color="white"
          />
        </View>

        <Text style={styles.itemLabel} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
    </AnimatedTouchable>
  );
};

const FloatingOrb: React.FC<{ delay: number }> = ({ delay }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.4);
  const scale = useSharedValue(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-15, { duration: 2500 }),
          withTiming(0, { duration: 2500 })
        ),
        -1,
        true
      );

      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 2000 }),
          withTiming(0.9, { duration: 2000 })
        ),
        -1,
        true
      );
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimation(translateY);
      cancelAnimation(scale);
    };
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.floatingOrb, animatedStyle]}>
      <LinearGradient
        colors={["rgba(255, 138, 80, 0.2)", "rgba(255, 107, 53, 0.2)"]}
        style={styles.orbGradient}
      />
    </Animated.View>
  );
};

const KidFriendlyMenu: React.FC<KidFriendlyMenuProps> = ({ onNavigate }) => {
  const [isComponentReady, setIsComponentReady] = useState(false);
  const containerScale = useSharedValue(1); // Start visible
  const containerOpacity = useSharedValue(1); // Start visible

  useEffect(() => {
    // Ensure component is ready immediately
    setIsComponentReady(true);

    // Optional entrance animation for the container
    containerScale.value = 0.95;
    containerOpacity.value = 0.8;

    containerScale.value = withSpring(1, { damping: 15, stiffness: 200 });
    containerOpacity.value = withSpring(1, { damping: 15, stiffness: 200 });

    return () => {
      // Ensure visibility on cleanup
      runOnUI(() => {
        "worklet";

        containerScale.value = 1;
        containerOpacity.value = 1;
      })();
    };
  }, []);

  const handleNavigation = (link: string) => {
    if (onNavigate) {
      onNavigate(link);
    }
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
    opacity: containerOpacity.value,
  }));

  // Fallback container style
  const fallbackContainerStyle = {
    transform: [{ scale: 1 }],
    opacity: 1,
  };

  return (
    <View style={styles.container}>
      {/* Floating orbs */}
      <FloatingOrb delay={500} />

      <Animated.View
        style={[
          styles.menuContainer,
          isComponentReady ? containerStyle : fallbackContainerStyle,
        ]}
      >
        {/* Background */}
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.95)", "rgba(248, 248, 248, 0.95)"]}
          style={styles.menuBackground}
        />

        {/* Menu items - always render, animations are optional */}
        <View style={styles.itemsContainer}>
          {MENU_ITEMS.map((item, index) => (
            <KidMenuItem
              key={`menu-${item.link}-${index}`}
              item={item}
              index={index}
              onPress={() => handleNavigation(item.link)}
              isReady={isComponentReady}
            />
          ))}
        </View>

        {/* Bottom indicator */}
        <View style={styles.bottomIndicator}>
          <LinearGradient
            colors={["#FF8A50", "#FF6B35", "#FFB74D", "#FF9800"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.indicatorGradient}
          />
        </View>
      </Animated.View>

      {/* Emoji decorations */}
      <Text style={[styles.emoji, styles.emoji1]}>🌟</Text>
      <Text style={[styles.emoji, styles.emoji2]}>🚀</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: MENU_HEIGHT + 20,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
  },
  menuContainer: {
    width: Math.min(
      screenWidth - 40,
      MENU_ITEMS.length * (ITEM_WIDTH + 15) + 30
    ),
    height: MENU_HEIGHT,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 12,
    // Fallback styles to ensure visibility
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  menuBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 25,
  },
  itemsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  menuItem: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT - 10,
    marginHorizontal: 2,
  },
  itemContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  itemBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  sparkleOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sparkle: {
    position: "absolute",
    width: 4,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 2,
  },
  sparkle1: {
    top: 8,
    right: 8,
  },
  sparkle2: {
    top: 15,
    left: 10,
  },
  sparkle3: {
    bottom: 10,
    right: 12,
  },
  iconContainer: {
    marginBottom: 4,
  },
  itemLabel: {
    color: "white",
    fontSize: Math.max(9, ITEM_WIDTH * 0.15),
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bottomIndicator: {
    height: 4,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 2,
    overflow: "hidden",
  },
  indicatorGradient: {
    flex: 1,
    borderRadius: 2,
  },
  floatingOrb: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    bottom: MENU_HEIGHT + 25,
    left: "20%",
  },
  orbGradient: {
    flex: 1,
    borderRadius: 15,
  },
  emoji: {
    position: "absolute",
    fontSize: 18,
  },
  emoji1: {
    top: -35,
    left: 30,
  },
  emoji2: {
    top: -30,
    right: 40,
  },
});

export default KidFriendlyMenu;
