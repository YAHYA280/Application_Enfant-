/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
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

import HomeIcon from "./icons/HomeIcon";
import BookIcon from "./icons/BookIcon";
import SearchIcon from "./icons/SearchIcon";
import TrophyIcon from "./icons/TrophyIcon";

const { width: screenWidth } = Dimensions.get("window");

const MENU_ITEMS = [
  {
    name: "AI Devoir",
    IconComponent: HomeIcon,
    link: "chatAiAcceuil",
    colors: ["#FF8A50", "#FF6B35"] as const,
    activeColors: ["#FF7043", "#FF5722"] as const,
  },
  {
    name: "J'apprends",
    IconComponent: BookIcon,
    link: "learning",
    colors: ["#FFB74D", "#FF9800"] as const,
    activeColors: ["#FF9800", "#F57C00"] as const,
  },
  {
    name: "Challenge",
    IconComponent: TrophyIcon,
    link: "ChallengeListScreen",
    colors: ["#FFCC02", "#FF9500"] as const,
    activeColors: ["#FF9500", "#E65100"] as const,
  },
  {
    name: "AI Recherche",
    IconComponent: SearchIcon,
    link: "chatAiRecherche",
    colors: ["#FF7043", "#D84315"] as const,
    activeColors: ["#D84315", "#BF360C"] as const,
  },
];

// Responsive calculations with 2px gap
const ITEM_WIDTH = Math.min(screenWidth / 5, 80) - 2;
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
  isSelected: boolean;
  selectedIndex: number | null;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const KidMenuItem: React.FC<MenuItemProps> = ({
  item,
  index,
  onPress,
  isReady,
  isSelected,
  selectedIndex,
}) => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const translateY = useSharedValue(0);

  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (!isReady) {
      return () => {}; // Always return cleanup function
    }

    // Reset transforms
    runOnUI(() => {
      "worklet";

      translateY.value = 15;
      scale.value = 0.8;
      rotate.value = 0;
    });

    const entranceDelay = index * 150;

    const entranceTimeout = setTimeout(() => {
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 250,
        mass: 0.8,
      });
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 250,
        mass: 0.8,
      });
    }, entranceDelay);

    // Subtle idle animation
    const idleTimeout = setTimeout(() => {
      rotate.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 4000 }),
          withTiming(-0.5, { duration: 4000 }),
          withTiming(0, { duration: 4000 })
        ),
        -1,
        true
      );
    }, entranceDelay + 1000);

    return () => {
      clearTimeout(entranceTimeout);
      clearTimeout(idleTimeout);
      cancelAnimation(rotate);
    };
  }, [isReady, index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}deg` },
        { translateY: translateY.value },
      ],
    };
  });

  const handlePressIn = () => {
    setIsPressed(true);
    scale.value = withSpring(0.92, {
      damping: 25,
      stiffness: 400,
      mass: 0.8,
    });
  };

  const handlePressOut = () => {
    setIsPressed(false);
    scale.value = withSpring(1, {
      damping: 25,
      stiffness: 400,
      mass: 0.8,
    });
  };

  const handlePress = () => {
    // Enhanced feedback animation
    scale.value = withSequence(
      withSpring(0.88, { damping: 25, stiffness: 500, mass: 0.8 }),
      withSpring(1.05, { damping: 20, stiffness: 350, mass: 0.8 }),
      withSpring(1, { damping: 25, stiffness: 400, mass: 0.8 })
    );

    onPress();
  };

  // Fallback style for initial state (only used during initial 100ms)
  const fallbackStyle = {
    transform: [{ scale: 1 }, { rotate: "0deg" }, { translateY: 0 }],
  };

  const IconComponent = item.IconComponent;

  return (
    <AnimatedTouchable
      style={[styles.menuItem, isReady ? animatedStyle : fallbackStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <View style={styles.itemContainer}>
        <LinearGradient
          colors={isSelected ? item.activeColors : item.colors}
          style={styles.itemBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Sparkle effects for selected item */}
        <View style={styles.sparkleOverlay}>
          {isSelected && (
            <>
              <View style={[styles.sparkle, styles.sparkle1]} />
              <View style={[styles.sparkle, styles.sparkle2]} />
              <View style={[styles.sparkle, styles.sparkle3]} />
              <View style={[styles.sparkle, styles.sparkle4]} />
            </>
          )}
        </View>

        <View style={styles.iconContainer}>
          <IconComponent size={ITEM_WIDTH * 0.45} color="white" />
        </View>

        <Text style={styles.itemLabel} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
    </AnimatedTouchable>
  );
};

const SelectionIndicator: React.FC<{
  selectedIndex: number | null;
  itemWidth: number;
}> = ({ selectedIndex, itemWidth }) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    if (selectedIndex === null) {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
    } else {
      const containerWidth = Math.min(
        screenWidth - 40,
        MENU_ITEMS.length * (ITEM_WIDTH + 15) + 30
      );
      const totalItemSpace = containerWidth - 30;
      const itemSpacing = totalItemSpace / MENU_ITEMS.length;
      const indicatorWidth = itemWidth * 0.8;

      const targetX =
        selectedIndex * itemSpacing + (itemSpacing - indicatorWidth) / 2;

      translateX.value = withSpring(targetX, {
        damping: 20,
        stiffness: 300,
        mass: 0.8,
      });
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [selectedIndex, itemWidth]);

  // FIXED: Corrected the animatedStyle that had incorrect variable references
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }, { scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.selectionIndicator, animatedStyle]}>
      <LinearGradient
        colors={["#FF8A50", "#FF6B35", "#FFB74D", "#FF9800"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.indicatorGradient}
      />
    </Animated.View>
  );
};

const FloatingOrb: React.FC<{ delay: number }> = ({ delay }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.3);
  const scale = useSharedValue(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-20, { duration: 3000 }),
          withTiming(0, { duration: 3000 })
        ),
        -1,
        true
      );

      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 2500 }),
          withTiming(0.8, { duration: 2500 })
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
        colors={["rgba(255, 138, 80, 0.3)", "rgba(255, 107, 53, 0.3)"]}
        style={styles.orbGradient}
      />
    </Animated.View>
  );
};

const KidFriendlyMenu: React.FC<KidFriendlyMenuProps> = ({ onNavigate }) => {
  const [isComponentReady, setIsComponentReady] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const containerScale = useSharedValue(0.9);
  const containerOpacity = useSharedValue(0.7);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComponentReady(true);
    }, 100); // Reduced delay for faster initialization

    containerScale.value = withSpring(1, {
      damping: 20,
      stiffness: 300,
      mass: 0.8,
    });
    containerOpacity.value = withSpring(1, {
      damping: 20,
      stiffness: 300,
      mass: 0.8,
    });

    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (link: string, index: number) => {
    setSelectedIndex(index);

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
      <Animated.View style={[styles.menuContainer, containerStyle]}>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.98)", "rgba(248, 248, 248, 0.95)"]}
          style={styles.menuBackground}
        />

        <View style={styles.itemsContainer}>
          {MENU_ITEMS.map((item, index) => (
            <KidMenuItem
              key={`menu-${item.link}-${index}`}
              item={item}
              index={index}
              onPress={() => handleNavigation(item.link, index)}
              isReady={isComponentReady}
              isSelected={selectedIndex === index}
              selectedIndex={selectedIndex}
            />
          ))}
        </View>

        <View style={styles.indicatorContainer}>
          <SelectionIndicator
            selectedIndex={selectedIndex}
            itemWidth={ITEM_WIDTH}
          />
        </View>
      </Animated.View>
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
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
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
    paddingBottom: 15,
  },
  menuItem: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT - 15,
    marginHorizontal: 3,
  },
  itemContainer: {
    flex: 1,
    borderRadius: 22,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  itemBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 22,
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
    width: 5,
    height: 5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 2.5,
  },
  sparkle1: {
    top: 6,
    right: 8,
  },
  sparkle2: {
    top: 18,
    left: 6,
  },
  sparkle3: {
    bottom: 12,
    right: 10,
  },
  sparkle4: {
    bottom: 6,
    left: 12,
  },
  iconContainer: {
    marginBottom: 6,
  },
  itemLabel: {
    color: "white",
    fontSize: Math.max(9, ITEM_WIDTH * 0.15),
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 8,
    left: 15,
    right: 15,
    height: 4,
  },
  selectionIndicator: {
    position: "absolute",
    width: ITEM_WIDTH * 0.8,
    height: 4,
    borderRadius: 2,
  },
  indicatorGradient: {
    flex: 1,
    borderRadius: 2,
  },
  floatingOrb: {
    position: "absolute",
    width: 25,
    height: 25,
    borderRadius: 12.5,
    bottom: MENU_HEIGHT + 30,
    left: "15%",
  },
  orbGradient: {
    flex: 1,
    borderRadius: 12.5,
  },
});

export default KidFriendlyMenu;
