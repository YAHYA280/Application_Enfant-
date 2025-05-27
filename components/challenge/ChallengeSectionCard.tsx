import type { GestureResponderEvent } from "react-native";

import React, { useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

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
  const { colors, dark } = useTheme();
  const animatedScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Background and text colors
  const backgroundColor = dark ? COLORS.dark2 : "#FFFFFF";
  const textColor = dark ? "#FFFFFF" : "#222222";
  const subtitleColor = dark ? "#E0E0E0" : "#333333";
  const metaBackgroundColor = dark
    ? "rgba(255,255,255,0.08)"
    : "rgba(248,248,248,1)";

  // Animation for card press effect
  const onPressIn = () => {
    // All animations use the same driver type (native)
    Animated.parallel([
      Animated.spring(animatedScale, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 40,
        bounciness: 4,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onPressOut = () => {
    // All animations use the same driver type (native)
    Animated.parallel([
      Animated.spring(animatedScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 5,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animatedStyle = {
    transform: [{ scale: animatedScale }],
    opacity: fadeAnim,
  };

  // Dynamic colors for points based on point value
  const getPointsColor = () => {
    if (exercice.pointQuestion >= 10) return "#D32F2F";
    if (exercice.pointQuestion >= 5) return "#F57C00";
    return "#2E7D32";
  };

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.75}
        style={[styles.container, { backgroundColor }]}
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
          <LinearGradient
            colors={
              isCompleted ? ["#FFF2EE", "#FFE5DE"] : ["#FFFFFF", "#F9F9F9"]
            }
            style={[
              styles.numContainer,
              {
                borderColor: isCompleted
                  ? "rgba(255, 142, 105, 0.3)"
                  : "rgba(0, 0, 0, 0.05)",
              },
            ]}
          >
            <Text style={[styles.num, { color: "#000000" }]}>
              {exercice.id.toString().slice(-2)}
            </Text>
          </LinearGradient>
        </View>

        {/* Content section with repositioned elements */}
        <View style={styles.contentContainer}>
          {/* Top row with title and badge */}
          <View style={styles.topRow}>
            <Text
              style={[styles.title, { color: textColor }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {exercice.titre}
            </Text>

            {/* Status badge now on top right */}
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

          {/* Middle section with description */}
          <View style={styles.middleRow}>
            <Text
              style={[styles.contentPreview, { color: subtitleColor }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {exercice.contenu}
            </Text>
          </View>

          {/* Bottom row with time and action button */}
          <View style={styles.bottomRow}>
            <View style={styles.leftBottomSection}>
              <View
                style={[
                  styles.timeContainer,
                  { backgroundColor: metaBackgroundColor },
                ]}
              >
                <Ionicons name="time-outline" size={14} color="#000000" />
                <Text style={[styles.duration, { color: "#000000" }]}>
                  {exercice.dureeQuestion} sec
                </Text>
              </View>
            </View>

            <View style={styles.rightBottomSection}>
              {/* Points indicator in bottom right */}
              <View
                style={[
                  styles.pointsContainer,
                  {
                    backgroundColor: "rgba(248,248,248,1)",
                    borderLeftWidth: 3,
                    borderLeftColor: getPointsColor(),
                  },
                ]}
              >
                <MaterialIcons name="star" size={14} color={getPointsColor()} />
                <Text
                  style={[
                    styles.pointsText,
                    { color: "#000000", fontWeight: "700" },
                  ]}
                >
                  {exercice.pointQuestion} pts
                </Text>
              </View>

              {/* Action button */}
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
                    styles.arrowIconContainer,
                    {
                      backgroundColor: "#F5F5F5",
                      borderWidth: 1,
                      borderColor: "rgba(0,0,0,0.05)",
                    },
                  ]}
                >
                  <SimpleLineIcons
                    name="arrow-right"
                    size={14}
                    color="#333333"
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 16,
    width: "100%",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 20,
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
    borderRadius: 20,
    zIndex: -1,
    margin: -2,
  },
  leftSection: {
    marginRight: 16,
  },
  numContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
  },
  num: {
    fontSize: 20,
    fontFamily: "bold",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  middleRow: {
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftBottomSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightBottomSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: "bold",
    flex: 1,
    marginRight: 8,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
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
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  pendingText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "medium",
  },
  contentPreview: {
    fontSize: 14,
    fontFamily: "regular",
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  duration: {
    fontSize: 12,
    marginLeft: 6,
    fontFamily: "medium",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 12,
    marginLeft: 6,
    fontFamily: "semiBold",
  },
  iconButtonGradient: {
    width: 33,
    height: 33,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  arrowIconContainer: {
    width: 33,
    height: 33,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChallengeSectionCard;
