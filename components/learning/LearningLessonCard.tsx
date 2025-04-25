import type { ImageSourcePropType } from "react-native";

import React from "react";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";

import { SIZES, COLORS } from "../../constants";
import { useTheme } from "../../theme/ThemeProvider";
import LessonProgressBar from "./../LessonProgressBar";
import ConditionalComponent from "./../ConditionalComponent";

interface LessonCardProps {
  name: string;
  image: ImageSourcePropType;
  category: string;
  numberOfLessonsCompleted?: number;
  totalNumberOfLessons?: number;
  onPress: () => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;

const LearningLessonCard: React.FC<LessonCardProps> = ({
  name,
  image,
  category,
  numberOfLessonsCompleted = 0,
  totalNumberOfLessons = 0,
  onPress,
}) => {
  const { dark } = useTheme();
  const progressPercentage =
    totalNumberOfLessons > 0
      ? Math.round((numberOfLessonsCompleted / totalNumberOfLessons) * 100)
      : 0;

  // Animation for the card
  const animatedScale = new Animated.Value(1);

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

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.98}
        style={[
          styles.container,
          {
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          },
        ]}
      >
        {/* Premium border effect with orange gradient */}
        <LinearGradient
          colors={[COLORS.primary, "#ff8e50", "#ff6040"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        />

        <View style={styles.cardContent}>
          {/* Left side - Image */}
          <View style={styles.imageContainer}>
            <Image source={image} style={styles.lessonImage} />

            {/* Category badge */}
            <View style={styles.categoryBadge}>
              <Feather name="book-open" size={12} color={COLORS.white} />
              <Text style={styles.categoryName}>{category}</Text>
            </View>
          </View>

          {/* Right side - Content */}
          <View style={styles.contentContainer}>
            {/* Title */}
            <Text
              style={[
                styles.name,
                { color: dark ? COLORS.white : COLORS.greyscale900 },
              ]}
              numberOfLines={2}
            >
              {name}
            </Text>

            {/* Progress section */}
            <ConditionalComponent isValid={totalNumberOfLessons > 0}>
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.lessonsText}>
                    {numberOfLessonsCompleted}/{totalNumberOfLessons} leçons
                  </Text>
                  <View style={styles.percentageBadge}>
                    <Text style={styles.percentageText}>
                      {progressPercentage}%
                    </Text>
                  </View>
                </View>

                <LessonProgressBar
                  numberOfLessonsCompleted={numberOfLessonsCompleted}
                  totalNumberOfLessons={totalNumberOfLessons}
                />
              </View>
            </ConditionalComponent>

            {/* Continue Button with Gradient */}
            {/* <TouchableOpacity style={styles.continueButtonWrapper}>
              <LinearGradient
                colors={["#ffb300", "#e53935"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButton}
              >
                <Text style={styles.continueButtonText}>Continuer</Text>
                <Feather name="chevron-right" size={16} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity> */}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: CARD_WIDTH,
    marginVertical: 10, // Reduced vertical margin
    alignSelf: "center",
    borderRadius: 12,
  },
  container: {
    width: "100%",
    overflow: "hidden",
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  gradientBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    zIndex: -1,
    margin: -2,
  },
  cardContent: {
    flexDirection: "row",
    height: 140,
  },
  imageContainer: {
    position: "relative",
    width: "35%",
  },
  lessonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryName: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "semiBold",
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 17,
    fontFamily: "bold",
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 20,
  },
  progressSection: {
    marginBottom: 10,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  lessonsText: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.white,
  },
  percentageBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  percentageText: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "bold",
  },
  //   continueButtonWrapper: {
  //     overflow: "hidden",
  //     borderRadius: 8,
  //   },
  //   continueButton: {
  //     flexDirection: "row",
  //     alignItems: "center",
  //     justifyContent: "center",
  //     paddingVertical: 6,
  //     paddingHorizontal: 12,
  //     borderRadius: 8,
  //   },
  //   continueButtonText: {
  //     color: COLORS.white,
  //     fontSize: 12,
  //     fontFamily: "semiBold",
  //     marginRight: 4,
  //   },
});

export default LearningLessonCard;
