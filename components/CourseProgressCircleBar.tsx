import React from "react";
import { View, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";

import { COLORS } from "../constants";

const colors = {
  advanced: "#ff566e",
  intermediate: "#fda120",
  medium: "#fbd027",
  weak: "#26c2a3",
  completed: COLORS.primary,
};

interface CourseProgressCircleBarProps {
  numberOfCourseCompleted: number;
  totalNumberOfCourses: number;
}

const CourseProgressCircleBar: React.FC<CourseProgressCircleBarProps> = ({
  numberOfCourseCompleted,
  totalNumberOfCourses,
}) => {
  const progress = numberOfCourseCompleted / totalNumberOfCourses;

  const formatText = (): string => {
    const percentage = Math.round(progress * 100);
    return `${percentage}%`;
  };

  return (
    <View style={styles.container}>
      <Progress.Circle
        progress={progress}
        unfilledColor="#EEEEEE"
        borderColor="#FFF"
        borderWidth={1}
        thickness={6}
        size={72}
        showsText
        formatText={formatText}
        textStyle={{
          color: COLORS.black,
          fontFamily: "semiBold",
          fontSize: 16,
        }}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 64,
    marginVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 6,
  },
});

export default CourseProgressCircleBar;
