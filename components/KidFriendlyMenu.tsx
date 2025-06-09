import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Animated, {
  runOnJS,
  withDelay,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

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
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const KidMenuItem: React.FC<MenuItemProps> = ({ item, index, onPress }) => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Staggered entrance animation
    const entranceDelay = index * 150;

    opacity.value = withDelay(
      entranceDelay,
      withSpring(1, { damping: 15, stiffness: 150 })
    );

    translateY.value = withDelay(
      entranceDelay,
      withSpring(0, { damping: 15, stiffness: 150 })
    );

    // Fun idle animation with cleanup
    const startIdleAnimation = () => {
      rotate.value = withRepeat(
        withSequence(
          withTiming(2, { duration: 2000 }),
          withTiming(-2, { duration: 2000 }),
          withTiming(0, { duration: 2000 })
        ),
        -1,
        true
      );
    };

    const timeoutId = setTimeout(
      () => startIdleAnimation(),
      entranceDelay + 1000
    );

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      // Reset animations on cleanup
      opacity.value = 1;
      translateY.value = 0;
      scale.value = 1;
      rotate.value = 0;
    };
  }, [index, opacity, rotate, translateY, scale]);

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
    scale.value = withSpring(0.85, { damping: 15, stiffness: 400 });
    rotate.value = withSpring(5, { damping: 10, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    rotate.value = withSpring(0, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    // Quick press animation that doesn't interfere with visibility
    scale.value = withSequence(
      withSpring(0.9, { damping: 15, stiffness: 400 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );

    // Immediate navigation without delay
    onPress();
  };

  return (
    <AnimatedTouchable
      style={[styles.menuItem, animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <View style={styles.itemContainer}>
        <LinearGradient
          colors={item.colors}
          style={styles.itemBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Sparkle effect overlay */}
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
  const opacity = useSharedValue(0.6);
  const scale = useSharedValue(1);

  useEffect(() => {
    const animate = () => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-20, { duration: 2000 }),
          withTiming(0, { duration: 2000 })
        ),
        -1,
        true
      );

      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1500 }),
          withTiming(0.8, { duration: 1500 })
        ),
        -1,
        true
      );
    };

    const timeoutId = setTimeout(animate, delay);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      // Reset values on cleanup
      translateY.value = 0;
      scale.value = 1;
      opacity.value = 0.6;
    };
  }, [delay, scale, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.floatingOrb, animatedStyle]}>
      <LinearGradient
        colors={["rgba(255, 138, 80, 0.3)", "rgba(255, 107, 53, 0.3)"]}
        style={styles.orbGradient}
      />
    </Animated.View>
  );
};

const KidFriendlyMenu: React.FC<KidFriendlyMenuProps> = ({ onNavigate }) => {
  const containerScale = useSharedValue(0);
  const containerOpacity = useSharedValue(0);

  useEffect(() => {
    // Initial entrance animation
    containerOpacity.value = withTiming(1, { duration: 500 });
    containerScale.value = withSpring(1, { damping: 15, stiffness: 150 });

    // Cleanup function
    return () => {
      // Reset values on cleanup
      containerScale.value = 1;
      containerOpacity.value = 1;
    };
  }, [containerOpacity, containerScale]);

  const handleNavigation = (link: string) => {
    if (onNavigate) {
      onNavigate(link);
    }
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
    opacity: containerOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Floating background orbs */}
      <FloatingOrb delay={0} />
      <FloatingOrb delay={500} />
      <FloatingOrb delay={1000} />

      <Animated.View style={[styles.menuContainer, containerStyle]}>
        {/* Background with subtle gradient */}
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.95)", "rgba(248, 248, 248, 0.95)"]}
          style={styles.menuBackground}
        />

        {/* Menu items */}
        <View style={styles.itemsContainer}>
          {MENU_ITEMS.map((item, index) => (
            <KidMenuItem
              key={item.link}
              item={item}
              index={index}
              onPress={() => handleNavigation(item.link)}
            />
          ))}
        </View>

        {/* Fun bottom indicator */}
        <View style={styles.bottomIndicator}>
          <LinearGradient
            colors={["#FF8A50", "#FF6B35", "#FFB74D", "#FF9800"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.indicatorGradient}
          />
        </View>
      </Animated.View>

      {/* Fun emoji decorations */}
      <Text style={[styles.emoji, styles.emoji1]}>🌟</Text>
      <Text style={[styles.emoji, styles.emoji2]}>🚀</Text>
      <Text style={[styles.emoji, styles.emoji3]}>⭐</Text>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    bottom: MENU_HEIGHT + 30,
  },
  orbGradient: {
    flex: 1,
    borderRadius: 20,
  },
  emoji: {
    position: "absolute",
    fontSize: 20,
  },
  emoji1: {
    top: -40,
    left: 30,
  },
  emoji2: {
    top: -35,
    right: 40,
  },
  emoji3: {
    top: -25,
    left: screenWidth / 2,
  },
});

export default KidFriendlyMenu;
