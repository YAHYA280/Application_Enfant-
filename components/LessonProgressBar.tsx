import React from "react";
import * as Progress from "react-native-progress";
import { View, Text, StyleSheet } from "react-native";

import { SIZES, COLORS } from "../constants";
import { useTheme } from "../theme/ThemeProvider";

interface LessonProgressBarProps {
  numberOfLessonsCompleted: number;
  totalNumberOfLessons: number;
}

// Couleurs modifiées selon les nouvelles exigences
const colors = {
  good: "#4CAF50", // Vert pour > 75%
  intermediate: "#fda120", // Orange pour intermédiaire
  medium: "#fbd027", // Jaune pour moyen
  poor: "#F44336", // Rouge pour < 35%
};

const LessonProgressBar: React.FC<LessonProgressBarProps> = ({
  numberOfLessonsCompleted,
  totalNumberOfLessons,
}) => {
  const progress =
    totalNumberOfLessons > 0
      ? numberOfLessonsCompleted / totalNumberOfLessons
      : 0;
  const { dark } = useTheme();

  // Logique de couleur modifiée selon les nouvelles exigences
  const getProgressColor = () => {
    if (progress > 0.75) return colors.good; // Vert pour > 75%
    if (progress >= 0.35) {
      // Entre 35% et 75%, garder les couleurs existantes
      if (progress >= 0.5) return colors.intermediate;
      return colors.medium;
    }
    return colors.poor; // Rouge pour < 35%
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
      <Text style={[styles.progressText, { color: COLORS.white }]}>
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
    minWidth: 30,
  },
});

export default LessonProgressBar;
