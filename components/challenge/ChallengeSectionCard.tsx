import type { GestureResponderEvent } from "react-native";

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import { Ionicons, SimpleLineIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import type { Exercice } from "@/services/mock";

import { COLORS, SIZES } from "@/constants";
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
          },
        ]}
      >
        {/* Gradient border effect for completed exercises */}
        {isCompleted ? (
          <LinearGradient
            colors={[COLORS.primary, "#FF7538"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          />
        ) : null}

        {/* Left section with question number */}
        <View style={styles.leftSection}>
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
        </View>

        {/* Middle section with content */}
        <View style={styles.contentSection}>
          <View style={styles.headerSection}>
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

            {/* Status badge */}
            {isCompleted ? (
              <View style={styles.completedBadge}>
                <MaterialIcons name="check-circle" size={12} color="#FFFFFF" />
                <Text style={styles.completedText}>Complété</Text>
              </View>
            ) : (
              <View style={styles.pendingBadge}>
                <MaterialIcons name="schedule" size={12} color="#FFFFFF" />
                <Text style={styles.pendingText}>À faire</Text>
              </View>
            )}
          </View>

          {/* Exercise preview - truncated content */}
          <Text
            style={[
              styles.contentPreview,
              { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
            ]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {exercice.contenu}
          </Text>

          {/* Footer with details */}
          <View style={styles.detailsRow}>
            <View style={styles.timeContainer}>
              <Ionicons
                name="time-outline"
                size={12}
                color={dark ? COLORS.greyscale500 : COLORS.gray}
              />
              <Text style={styles.duration}>{exercice.dureeQuestion} sec</Text>
            </View>

            <View style={styles.pointsContainer}>
              <MaterialIcons name="star" size={12} color={getPointsColor()} />
              <Text style={[styles.pointsText, { color: getPointsColor() }]}>
                {exercice.pointQuestion} points
              </Text>
            </View>
          </View>
        </View>

        {/* Right section with action button */}
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
                name="arrow-right"
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
    marginBottom: 16,
    width: "100%",
    borderRadius: 16,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  gradientBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    zIndex: -1,
    margin: -2,
  },
  leftSection: {
    marginRight: 12,
  },
  numContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  num: {
    fontSize: 16,
    fontFamily: "bold",
  },
  contentSection: {
    flex: 1,
    marginRight: 8,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontFamily: "semiBold",
    flex: 1,
    marginRight: 8,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  completedText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "medium",
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9800",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  pendingText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "medium",
  },
  contentPreview: {
    fontSize: 13,
    fontFamily: "regular",
    lineHeight: 18,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    marginLeft: 8,
  },
  iconButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  lockIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChallengeSectionCard;
