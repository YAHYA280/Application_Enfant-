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
  completed: COLORS.greeen,
};

const LessonProgressBar: React.FC<LessonProgressBarProps> = ({
  numberOfLessonsCompleted,
  totalNumberOfLessons,
}) => {
  const progress = numberOfLessonsCompleted / totalNumberOfLessons;
  const { dark } = useTheme();

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={progress}
        width={SIZES.width - 280}
        unfilledColor={dark ? COLORS.grayscale700 : "#EEEEEE"}
        borderColor={dark ? "transparent" : "#FFF"}
        borderWidth={dark ? 0 : 1}
        animated
        indeterminateAnimationDuration={2000}
        animationType="decay"
        color={
          progress === 1
            ? colors.completed
            : progress >= 0.75
              ? colors.advanced
              : progress >= 0.5
                ? colors.intermediate
                : progress >= 0.35
                  ? colors.medium
                  : colors.weak
        }
      />
      <Text style={styles.title}>
        {numberOfLessonsCompleted} / {totalNumberOfLessons}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.width - 280,
    marginVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 12,
    fontFamily: "medium",
    color: "white",
    marginHorizontal: 12,
  },
});

export default LessonProgressBar;
