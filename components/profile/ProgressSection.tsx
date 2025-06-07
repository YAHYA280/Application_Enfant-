// components/profile/ProgressSection.tsx
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, Animated, StyleSheet } from "react-native";

import { COLORS } from "@/constants";

interface ProgressSectionProps {
  totalProgress: number;
  subjectProgress: {
    [key: string]: number;
  };
}

interface ProgressBarProps {
  progress: number;
  color: string;
  label: string;

  delay?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  label,
  delay = 0,
}) => {
  const animatedWidth = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress / 100,
      duration: 800,
      delay,
      useNativeDriver: false,
    }).start();
  }, [animatedWidth, progress, delay]);

  return (
    <View style={styles.progressItemContainer}>
      <View style={styles.progressLabelContainer}>
        <Text style={[styles.progressLabel, { color: "rgba(0,0,0,0.6)" }]}>
          {label}
        </Text>
        <Text style={[styles.progressValue, { color }]}>{progress}%</Text>
      </View>
      <View
        style={[
          styles.progressBarBackground,
          {
            backgroundColor: "rgba(0,0,0,0.05)",
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
};

const ProgressSection: React.FC<ProgressSectionProps> = ({
  totalProgress,
  subjectProgress,
}) => {
  const getProgressColor = (value: number) => {
    if (value >= 75) return COLORS.greeen;
    if (value >= 50) return COLORS.primary;
    if (value >= 25) return COLORS.secondary;
    return COLORS.error;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.progressCard, { backgroundColor: COLORS.white }]}>
        <LinearGradient
          colors={["rgba(255,96,64,0.05)", "transparent"]}
          style={styles.cardGradient}
        >
          <Text style={[styles.sectionTitle, { color: COLORS.black }]}>
            Progrès global
          </Text>

          <ProgressBar
            progress={totalProgress}
            color={getProgressColor(totalProgress)}
            label="Taux de réussite global"
          />
        </LinearGradient>
      </View>

      <View style={[styles.progressCard, { backgroundColor: COLORS.white }]}>
        <LinearGradient
          colors={["rgba(255,96,64,0.02)", "transparent"]}
          style={styles.cardGradient}
        >
          <Text style={[styles.sectionTitle, { color: COLORS.black }]}>
            Progrès par matière
          </Text>

          {Object.entries(subjectProgress).map(([subject, progress], index) => (
            <ProgressBar
              key={subject}
              progress={progress}
              color={getProgressColor(progress)}
              label={subject.charAt(0).toUpperCase() + subject.slice(1)}
              delay={index * 100}
            />
          ))}
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  progressCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardGradient: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  progressItemContainer: {
    marginBottom: 16,
  },
  progressLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: "medium",
  },
  progressValue: {
    fontSize: 14,
    fontFamily: "bold",
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
});

export default ProgressSection;
