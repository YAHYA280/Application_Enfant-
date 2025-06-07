import React from "react";
import * as Progress from "react-native-progress";
import { View, Text, StyleSheet } from "react-native";

import { SIZES } from "@/constants/theme";

import { COLORS } from "../constants";

interface ChallengeProgressBarProps {
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

const ChallengeProgressBar: React.FC<ChallengeProgressBarProps> = ({
  numberOfLessonsCompleted,
  totalNumberOfLessons,
}) => {
  const progress = numberOfLessonsCompleted / totalNumberOfLessons;

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={progress}
        width={SIZES.width - 280}
        unfilledColor="#EEEEEE"
        borderColor="#FFF"
        borderWidth={1}
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
    color: "gray",
    marginHorizontal: 12,
  },
});

export default ChallengeProgressBar;
