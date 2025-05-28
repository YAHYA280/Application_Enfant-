import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  interpolate,
  runOnJS,
  withTiming,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Menu configuration
const MENU_ITEMS = [
  { name: "AI Devoir", icon: "home" as const, link: "chatAiAcceuil" },
  { name: "J'apprends", icon: "library-books" as const, link: "learning" },
  { name: "Challenge", icon: "emoji-events" as const, link: "defi" },
  { name: "AI Recherche", icon: "search" as const, link: "chatAiRecherche" },
];

// Responsive calculations
const MENU_RADIUS = Math.min(screenWidth, screenHeight) * 0.4;
const ITEM_SIZE = screenWidth * 0.2;
const CENTER_X = screenWidth / 2;
const CENTER_Y = screenHeight * 0.6;

interface CurvedMenuProps {
  onNavigate?: (link: string) => void;
}

interface MenuItemProps {
  item: (typeof MENU_ITEMS)[0];
  index: number;
  totalItems: number;
  rotationOffset: Animated.SharedValue<number>;
  activeIndex: Animated.SharedValue<number>;
  onPress: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const CurvedMenuItem: React.FC<MenuItemProps> = ({
  item,
  index,
  totalItems,
  rotationOffset,
  activeIndex,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    // Calculate angle for this item
    const baseAngle = (index / totalItems) * Math.PI * 2;
    const currentAngle = baseAngle + rotationOffset.value;

    // Calculate position
    const x = Math.cos(currentAngle - Math.PI / 2) * MENU_RADIUS;
    const y = Math.sin(currentAngle - Math.PI / 2) * MENU_RADIUS;

    // Check if this item is active (closest to top)
    const normalizedRotation =
      ((rotationOffset.value % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const targetAngle = Math.PI * 2 - (index / totalItems) * Math.PI * 2;
    const angleDiff = Math.min(
      Math.abs(normalizedRotation - targetAngle),
      Math.abs(normalizedRotation - targetAngle + Math.PI * 2),
      Math.abs(normalizedRotation - targetAngle - Math.PI * 2)
    );

    const isActive = angleDiff < Math.PI / totalItems;

    if (isActive && activeIndex.value !== index) {
      activeIndex.value = index;
    }

    // Scale animation for active item
    const itemScale = interpolate(
      angleDiff,
      [0, Math.PI / totalItems],
      [1.2, 0.9],
      "clamp"
    );

    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { scale: itemScale * scale.value },
      ],
      zIndex: isActive ? 10 : 1,
    };
  });

  const gradientColors = ["#ff6b35", "#f7931e"];
  const activeGradientColors = ["#ff8c42", "#ff6b35"];

  const iconStyle = useAnimatedStyle(() => {
    const isActive = activeIndex.value === index;
    return {
      opacity: withTiming(isActive ? 1 : 0.7, { duration: 200 }),
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    const isActive = activeIndex.value === index;
    return {
      opacity: withTiming(isActive ? 1 : 0.8, { duration: 200 }),
      transform: [{ scale: withTiming(isActive ? 1.1 : 1, { duration: 200 }) }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedTouchable
      style={[styles.menuItem, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <View style={styles.itemContainer}>
        <LinearGradient
          colors={gradientColors as any}
          style={styles.itemBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <Animated.View style={[styles.iconContainer, iconStyle]}>
          <MaterialIcons
            name={item.icon}
            size={ITEM_SIZE * 0.4}
            color="white"
          />
        </Animated.View>

        <Animated.Text style={[styles.itemLabel, labelStyle]}>
          {item.name}
        </Animated.Text>
      </View>
    </AnimatedTouchable>
  );
};

const CurvedMenu: React.FC<CurvedMenuProps> = ({ onNavigate }) => {
  const rotationOffset = useSharedValue(0);
  const activeIndex = useSharedValue(0);
  const lastRotation = useSharedValue(0);

  const handleNavigation = (link: string) => {
    if (onNavigate) {
      onNavigate(link);
    }
  };

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startRotation: number }
  >({
    onStart: (_, context) => {
      context.startRotation = rotationOffset.value;
    },
    onActive: (event, context) => {
      // Convert horizontal pan to rotation
      const rotationDelta = event.translationX / MENU_RADIUS;
      rotationOffset.value = context.startRotation + rotationDelta;
    },
    onEnd: (event) => {
      // Snap to nearest item
      const velocity = event.velocityX / MENU_RADIUS;
      const snapAngle = (Math.PI * 2) / MENU_ITEMS.length;

      // Calculate target snap position
      const currentRotation = rotationOffset.value;
      const targetIndex = Math.round(currentRotation / snapAngle);
      const targetRotation = targetIndex * snapAngle;

      // Apply spring animation with velocity
      rotationOffset.value = withSpring(targetRotation, {
        velocity,
        damping: 20,
        stiffness: 150,
        mass: 1,
      });

      lastRotation.value = targetRotation;
    },
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: CENTER_X }, { translateY: CENTER_Y }],
    };
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.menuContainer, containerStyle]}>
          {MENU_ITEMS.map((item, index) => (
            <CurvedMenuItem
              key={item.link}
              item={item}
              index={index}
              totalItems={MENU_ITEMS.length}
              rotationOffset={rotationOffset}
              activeIndex={activeIndex}
              onPress={() => handleNavigation(item.link)}
            />
          ))}

          {/* Center indicator */}
          <View style={styles.centerIndicator}>
            <LinearGradient
              colors={["rgba(255, 107, 53, 0.3)", "rgba(247, 147, 30, 0.3)"]}
              style={styles.centerGradient}
            />
          </View>
        </Animated.View>
      </PanGestureHandler>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Swipe left or right to navigate
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    position: "absolute",
    width: MENU_RADIUS * 2,
    height: MENU_RADIUS * 2,
  },
  menuItem: {
    position: "absolute",
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    left: -ITEM_SIZE / 2,
    top: -ITEM_SIZE / 2,
  },
  itemContainer: {
    flex: 1,
    borderRadius: ITEM_SIZE / 2,
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
    borderRadius: ITEM_SIZE / 2,
  },
  iconContainer: {
    marginBottom: 4,
  },
  itemLabel: {
    color: "white",
    fontSize: Math.max(10, ITEM_SIZE * 0.12),
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  centerIndicator: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    left: -10,
    top: -MENU_RADIUS - 10,
    overflow: "hidden",
  },
  centerGradient: {
    flex: 1,
    borderRadius: 10,
  },
  instructionsContainer: {
    position: "absolute",
    bottom: screenHeight * 0.15,
    paddingHorizontal: 20,
  },
  instructionsText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default CurvedMenu;
