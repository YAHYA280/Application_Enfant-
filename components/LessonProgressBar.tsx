import React from "react";
import * as Progress from "react-native-progress";
import { View, Text, StyleSheet } from "react-native";

import { SIZES, COLORS } from "../constants";
import { useTheme } from "../theme/ThemeProvider";

interface LessonProgressBarProps {
  numberOfLessonsCompleted: number;
  totalNumberOfLessons: number;
}

const colors = {
  advanced: "#ff566e",
  intermediate: "#fda120",
  medium: "#fbd027",
  weak: "#26c2a3",
  completed: COLORS.primary,
};

const LessonProgressBar: React.FC<LessonProgressBarProps> = ({
  numberOfLessonsCompleted,
  totalNumberOfLessons,
}) => {
  const progress = numberOfLessonsCompleted / totalNumberOfLessons;
  const { dark } = useTheme();

  // Get the appropriate color based on progress
  const getProgressColor = () => {
    if (progress === 1) return colors.completed;
    if (progress >= 0.75) return colors.advanced;
    if (progress >= 0.5) return colors.intermediate;
    if (progress >= 0.35) return colors.medium;
    return colors.weak;
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Progress.Bar
          progress={progress}
          width={SIZES.width - 280}
          height={6}
          unfilledColor={dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.05)"}
          borderColor="transparent"
          borderWidth={0}
          borderRadius={3}
          animated
          color={getProgressColor()}
        />
      </View>
      <Text
        style={[
          styles.progressText,
          { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 },
        ]}
      >
        {Math.round(progress * 100)}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressContainer: {
    marginRight: 8,
  },
  progressText: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.grayscale700,
    minWidth: 30,
  },
});

export default LessonProgressBar;
