import type { GestureResponderEvent } from "react-native";

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons, SimpleLineIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import type { Exercice } from "@/services/mock";

import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";

interface ChallengeSectionCardProps {
  exercice: Exercice;
  isCompleted: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

const ChallengeSectionCard: React.FC<ChallengeSectionCardProps> = ({
  exercice,
  isCompleted,
  onPress,
}) => {
  const { dark } = useTheme();
  const animatedScale = new Animated.Value(1);

  // Animation for card press effect
  const onPressIn = () => {
    Animated.spring(animatedScale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(animatedScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const getPointsColor = () => {
    if (exercice.pointQuestion >= 10) return "#F44336";
    if (exercice.pointQuestion >= 5) return "#FF9800";
    return "#4CAF50";
  };

  return (
    <Animated.View
      style={[styles.cardWrapper, { transform: [{ scale: animatedScale }] }]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          styles.container,
          {
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            borderColor: isCompleted
              ? COLORS.primary
              : dark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
          },
        ]}
      >
        {/* Indicator line to show completion status */}
        {isCompleted && <View style={styles.completionIndicator} />}

        <View style={styles.viewLeft}>
          <View
            style={[
              styles.numContainer,
              {
                backgroundColor: isCompleted
                  ? "rgba(255, 142, 105, 0.2)"
                  : dark
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.05)",
              },
            ]}
          >
            <Text
              style={[
                styles.num,
                {
                  color: isCompleted
                    ? COLORS.primary
                    : dark
                      ? COLORS.white
                      : COLORS.dark1,
                },
              ]}
            >
              {exercice.id.toString().slice(-2)}
            </Text>
          </View>

          <View style={styles.textContainer}>
            <Text
              style={[
                styles.title,
                {
                  color: dark ? COLORS.white : COLORS.dark1,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {exercice.titre}
            </Text>

            <View style={styles.detailsRow}>
              <View style={styles.timeContainer}>
                <Ionicons
                  name="time-outline"
                  size={12}
                  color={dark ? COLORS.greyscale500 : COLORS.gray}
                />
                <Text style={styles.duration}>
                  {exercice.dureeQuestion} sec
                </Text>
              </View>

              <View style={styles.pointsContainer}>
                <MaterialIcons name="star" size={12} color={getPointsColor()} />
                <Text style={[styles.pointsText, { color: getPointsColor() }]}>
                  {exercice.pointQuestion} pts
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          {isCompleted ? (
            <LinearGradient
              colors={["#ff6040", "#ff8e69"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.iconButtonGradient}
            >
              <Ionicons name="play" size={16} color="#FFFFFF" />
            </LinearGradient>
          ) : (
            <View
              style={[
                styles.lockIconContainer,
                { backgroundColor: dark ? COLORS.dark3 : "rgba(0,0,0,0.05)" },
              ]}
            >
              <SimpleLineIcons
                name="lock"
                size={14}
                color={dark ? COLORS.greyscale500 : COLORS.gray}
              />
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 12,
    borderRadius: 16,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
    overflow: "hidden",
  },
  completionIndicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  viewLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  numContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  num: {
    fontSize: 14,
    fontFamily: "bold",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: "semiBold",
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  duration: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 4,
    fontFamily: "medium",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pointsText: {
    fontSize: 12,
    marginLeft: 4,
    fontFamily: "semiBold",
  },
  iconButton: {
    marginLeft: 10,
  },
  iconButtonGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  lockIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChallengeSectionCard;
