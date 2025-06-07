import type { GestureResponderEvent } from "react-native";

import React, { useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "../constants";

import LessonProgressBar from "./LessonProgressBar";

interface LessonSectionCardProps {
  num: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  progress: number;
  onPress: (event: GestureResponderEvent) => void;
}

const LessonSectionCard: React.FC<LessonSectionCardProps> = ({
  num,
  title,
  duration,
  isCompleted,
  progress,
  onPress,
}) => {
  // Animation for press effect
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      speed: 20,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 20,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[
          styles.container,
          {
            backgroundColor: COLORS.white,
            borderColor: isCompleted
              ? "rgba(255, 142, 105, 0.3)"
              : "rgba(0, 0, 0, 0.05)",
          },
        ]}
      >
        {/* Left side with number in circle and gradient background */}
        <View style={styles.leftSection}>
          <LinearGradient
            colors={
              isCompleted ? ["#ff6040", "#ff8e50"] : ["#f5f5f5", "#e5e5e5"]
            }
            style={styles.numContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text
              style={[
                styles.numText,
                {
                  color: isCompleted ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            >
              {num}
            </Text>
          </LinearGradient>
        </View>

        {/* Middle content with title, duration and progress bar */}
        <View style={styles.contentSection}>
          <Text
            style={[
              styles.title,
              {
                color: COLORS.dark1,
                fontWeight: isCompleted ? "700" : "600",
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.durationContainer}>
              <Feather
                name="clock"
                size={14}
                color={isCompleted ? COLORS.primary : COLORS.gray}
                style={styles.durationIcon}
              />
              <Text
                style={[
                  styles.duration,
                  { color: isCompleted ? COLORS.primary : COLORS.gray },
                ]}
              >
                {duration}
              </Text>
            </View>

            <LessonProgressBar
              numberOfLessonsCompleted={progress}
              totalNumberOfLessons={1}
            />
          </View>
        </View>

        {/* Right side with action icon */}
        <View style={styles.iconSection}>
          {isCompleted ? (
            <LinearGradient
              colors={["#ff6040", "#ff8e50"]}
              style={styles.iconContainer}
            >
              <Ionicons name="play" size={18} color={COLORS.white} />
            </LinearGradient>
          ) : (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: COLORS.grayscale200 },
              ]}
            >
              <Ionicons name="lock-closed" size={16} color={COLORS.gray} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: "100%",
    marginBottom: 12,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  leftSection: {
    marginRight: 16,
  },
  numContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  numText: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.white,
  },
  contentSection: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: "medium",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationIcon: {
    marginRight: 4,
  },
  duration: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.gray,
  },
  iconSection: {
    marginLeft: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LessonSectionCard;
