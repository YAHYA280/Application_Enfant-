import React from "react";
import * as Progress from "react-native-progress";
import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "@/constants";
import { SIZES } from "@/constants/theme";
import { useTheme } from "@/theme/ThemeProvider";

interface ChallengeProgressBarProps {
  numberOfLessonsCompleted: number;
  totalNumberOfLessons: number;
  size?: "small" | "medium" | "large";
  showText?: boolean;
}

const progressColors = {
  completed: COLORS.greeen,
  advanced: "#ff566e",
  intermediate: "#fda120",
  medium: "#fbd027",
  beginner: "#26c2a3",
};

const ChallengeProgressBar: React.FC<ChallengeProgressBarProps> = ({
  numberOfLessonsCompleted,
  totalNumberOfLessons,
  size = "medium",
  showText = false,
}) => {
  const progress =
    totalNumberOfLessons > 0
      ? numberOfLessonsCompleted / totalNumberOfLessons
      : 0;
  const { dark } = useTheme();

  // Determine width based on size prop
  const getWidth = () => {
    switch (size) {
      case "small":
        return SIZES.width * 0.3;
      case "large":
        return SIZES.width * 0.7;
      case "medium":
      default:
        return SIZES.width * 0.5;
    }
  };

  // Determine bar height based on size prop
  const getHeight = () => {
    switch (size) {
      case "small":
        return 3;
      case "large":
        return 6;
      case "medium":
      default:
        return 4;
    }
  };

  // Determine progress color based on completion percentage
  const getProgressColor = () => {
    if (progress === 1) return progressColors.completed;
    if (progress >= 0.75) return progressColors.advanced;
    if (progress >= 0.5) return progressColors.intermediate;
    if (progress >= 0.25) return progressColors.medium;
    return progressColors.beginner;
  };

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={progress}
        width={getWidth()}
        height={getHeight()}
        borderRadius={getHeight() / 2}
        unfilledColor={dark ? COLORS.dark3 : "#EEEEEE"}
        borderColor={dark ? "transparent" : "#F5F5F5"}
        borderWidth={dark ? 0 : 1}
        animated
        color={getProgressColor()}
        animationType="timing"
      />

      {showText && (
        <Text
          style={[
            styles.progressText,
            { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
          ]}
        >
          {numberOfLessonsCompleted} / {totalNumberOfLessons}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressText: {
    fontSize: 12,
    fontFamily: "medium",
    marginLeft: 10,
  },
});

export default ChallengeProgressBar;
