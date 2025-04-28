import React from "react";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

import { COLORS, SIZES } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";
import { ChallengeProgressBar } from "@/components/challenge";
import { type Challenge, challengeExerciceMap } from "@/services/mock";

interface ChallengeLessonCardProps {
  challenge: Challenge;
  onPress: () => void;
}

const ChallengeLessonCard: React.FC<ChallengeLessonCardProps> = ({
  challenge,
  onPress,
}) => {
  const { dark } = useTheme();
  const animatedScale = new Animated.Value(1);

  const totalExercices = challengeExerciceMap[challenge.id]?.length || 0;
  const completedExercices = Math.floor(
    (challenge.pourcentageReussite / 100) * totalExercices
  );

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

  const animatedStyle = {
    transform: [{ scale: animatedScale }],
  };

  const handleCardPress = () => {
    if (challenge.accessible) {
      onPress();
    }
  };

  // Define difficulty colors
  const getDifficultyColor = () => {
    switch (challenge.difficulte) {
      case "FACILE":
        return "#4CAF50";
      case "MOYEN":
        return "#FF9800";
      case "DIFFICILE":
        return "#F44336";
      default:
        return "#FF9800";
    }
  };

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <TouchableOpacity
        onPress={handleCardPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={!challenge.accessible}
        style={[
          styles.container,
          {
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            opacity: challenge.accessible ? 1 : 0.8,
          },
        ]}
      >
        {/* Gradient border effect */}
        <LinearGradient
          colors={[COLORS.primary, "#FF7538"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        />

        <View style={styles.contentContainer}>
          {/* Challenge image */}
          <View style={styles.imageContainer}>
            <Image
              source={challenge.media}
              resizeMode="cover"
              style={styles.challengeImage}
            />

            {/* Difficulty badge */}
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor() },
              ]}
            >
              <Text style={styles.difficultyText}>{challenge.difficulte}</Text>
            </View>

            {/* Duration badge */}
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={12} color={COLORS.white} />
              <Text style={styles.durationText}>{challenge.duree} min</Text>
            </View>
          </View>

          <View style={styles.textContainer}>
            <View style={styles.nameAndIconContainer}>
              <Text
                style={[
                  styles.name,
                  {
                    color: dark ? COLORS.white : COLORS.greyscale900,
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {challenge.nom}
              </Text>

              <TouchableOpacity style={styles.actionIcon}>
                {challenge.accessible ? (
                  <Ionicons
                    name="play-circle"
                    size={24}
                    color={COLORS.primary}
                  />
                ) : (
                  <SimpleLineIcons name="lock" size={20} color={COLORS.gray} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.statusContainer}>
                {challenge.pourcentageReussite === 0 ? (
                  <Text style={styles.newBadge}>Nouveau</Text>
                ) : challenge.pourcentageReussite === 100 ? (
                  <Text style={styles.completedBadge}>Complété</Text>
                ) : (
                  <Text style={styles.inProgressBadge}>En cours</Text>
                )}
              </View>

              <View style={styles.tentativesContainer}>
                <Text style={styles.tentativesText}>
                  {challenge.nombreTentatives} tentative
                  {challenge.nombreTentatives !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>

            {totalExercices > 0 && (
              <View style={styles.progressBarContainer}>
                <ChallengeProgressBar
                  numberOfLessonsCompleted={completedExercices}
                  totalNumberOfLessons={totalExercices}
                />
                <Text style={styles.progressText}>
                  {completedExercices}/{totalExercices} Questions
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: SIZES.width * 0.9,
    marginVertical: 10,
    alignSelf: "center",
    borderRadius: 16,
  },
  container: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: "hidden",
    position: "relative",
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
  contentContainer: {
    flexDirection: "row",
    height: 140,
  },
  imageContainer: {
    width: "45%",
    position: "relative",
  },
  challengeImage: {
    width: "100%",
    height: "100%",
  },
  difficultyBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: "semiBold",
  },
  durationBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: "medium",
    marginLeft: 4,
  },
  textContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  nameAndIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 18,
    fontFamily: "bold",
    flex: 1,
    marginRight: 8,
  },
  actionIcon: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  newBadge: {
    backgroundColor: "#2196F3",
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "semiBold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  inProgressBadge: {
    backgroundColor: "#FF9800",
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "semiBold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  completedBadge: {
    backgroundColor: "#4CAF50",
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "semiBold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tentativesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tentativesText: {
    fontSize: 12,
    color: COLORS.gray,
    fontFamily: "medium",
  },
  progressBarContainer: {
    marginTop: 4,
  },
  progressText: {
    fontSize: 11,
    color: COLORS.gray,
    fontFamily: "medium",
    textAlign: "right",
    marginTop: 4,
  },
});

export default ChallengeLessonCard;
