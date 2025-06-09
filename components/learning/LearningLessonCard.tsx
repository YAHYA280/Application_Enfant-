import type { ImageSourcePropType } from "react-native";

import React from "react";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";

import { COLORS } from "../../constants";

import LessonProgressBar from "./../LessonProgressBar";
import ConditionalComponent from "./../ConditionalComponent";

interface LessonCardProps {
  name: string;
  image: ImageSourcePropType;
  category: string;
  numberOfLessonsCompleted?: number;
  totalNumberOfLessons?: number;
  estimatedTime?: string;
  difficulty?: "easy" | "medium" | "hard";
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
  estimatedTime = "15 min",
  difficulty = "medium",
  onPress,
}) => {
  // Calcul du pourcentage de progression
  const progressPercentage =
    totalNumberOfLessons > 0
      ? Math.round((numberOfLessonsCompleted / totalNumberOfLessons) * 100)
      : 0;

  // Animation pour effet de pression sur la carte
  const animatedScale = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(animatedScale, {
      toValue: Platform.OS === "android" ? 0.97 : 0.98,
      useNativeDriver: true,
      speed: Platform.OS === "android" ? 25 : 20,
      bounciness: Platform.OS === "android" ? 2 : 4,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(animatedScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: Platform.OS === "android" ? 25 : 20,
      bounciness: Platform.OS === "android" ? 2 : 4,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: animatedScale }],
  };

  // Couleurs de difficulté
  const difficultyColors = {
    easy: "#4CAF50",
    medium: "#FF9800",
    hard: "#F44336",
  };

  const difficultyLabels = {
    easy: "Facile",
    medium: "Moyen",
    hard: "Difficile",
  };

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={Platform.OS === "android" ? 0.8 : 0.9}
        style={styles.container}
      >
        {/* Gradient border - enhanced for Android */}
        {Platform.OS === "ios" ? (
          <LinearGradient
            colors={[COLORS.primary, "#FF7538"] as const}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          />
        ) : (
          <View style={styles.androidBorder} />
        )}

        <View style={styles.cardContent}>
          {/* Partie gauche - Image */}
          <View style={styles.imageContainer}>
            <Image source={image} style={styles.lessonImage} />

            {/* Badge catégorie */}
            <View style={styles.categoryBadge}>
              <Feather
                name="book-open"
                size={Platform.OS === "android" ? 10 : 12}
                color={COLORS.white}
              />
              <Text style={styles.categoryName}>{category}</Text>
            </View>

            {/* Badge temps estimé */}
            <View style={styles.timeEstimateBadge}>
              <Feather
                name="clock"
                size={Platform.OS === "android" ? 9 : 10}
                color={COLORS.white}
              />
              <Text style={styles.timeEstimateText}>{estimatedTime}</Text>
            </View>
          </View>

          {/* Partie droite - Contenu */}
          <View style={styles.contentContainer}>
            {/* En-tête avec titre et badge de difficulté */}
            <View style={styles.headerContainer}>
              <View style={styles.titleContainer}>
                <Text
                  style={styles.name}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {name}
                </Text>
              </View>

              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: difficultyColors[difficulty] },
                ]}
              >
                <Text style={styles.difficultyText}>
                  {difficultyLabels[difficulty]}
                </Text>
              </View>
            </View>

            {/* Section de progression */}
            <ConditionalComponent isValid={totalNumberOfLessons > 0}>
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.lessonsText}>
                    {numberOfLessonsCompleted}/{totalNumberOfLessons} leçons
                  </Text>
                </View>

                <LessonProgressBar
                  numberOfLessonsCompleted={numberOfLessonsCompleted}
                  totalNumberOfLessons={totalNumberOfLessons}
                />

                {/* Badge statut */}
                <View style={styles.statusContainer}>
                  {progressPercentage === 0 ? (
                    <View style={styles.statusBadgeNew}>
                      <Text style={styles.statusTextNew}>Nouveau</Text>
                    </View>
                  ) : progressPercentage === 100 ? (
                    <View style={styles.statusBadgeComplete}>
                      <Text style={styles.statusTextComplete}>Terminé</Text>
                    </View>
                  ) : (
                    <View style={styles.statusBadgeInProgress}>
                      <Text style={styles.statusTextInProgress}>En cours</Text>
                    </View>
                  )}

                  {/* Icône bouton continuer */}
                  <TouchableOpacity
                    style={styles.continueIconButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <View style={styles.continueIconGradient}>
                      <Feather
                        name="chevron-right"
                        size={Platform.OS === "android" ? 14 : 16}
                        color="#FF8A50"
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ConditionalComponent>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: CARD_WIDTH,
    marginVertical: Platform.OS === "android" ? 8 : 10,
    alignSelf: "center",
    borderRadius: Platform.OS === "android" ? 16 : 12,
  },
  container: {
    width: "100%",
    overflow: "hidden",
    borderRadius: Platform.OS === "android" ? 16 : 12,
    backgroundColor: "#FF8A50", // Changed from COLORS.white to orange
    // Platform-specific shadows
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
        shadowColor: COLORS.black,
        borderWidth: 0.5,
        borderColor: "rgba(0,0,0,0.1)",
      },
    }),
  },
  gradientBorder: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 14,
    zIndex: -1,
  },
  androidBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    zIndex: -1,
  },
  cardContent: {
    flexDirection: "row",
    height: Platform.OS === "android" ? 145 : 140,
    backgroundColor: "#FF8A50", // Changed from COLORS.white to orange
    borderRadius: Platform.OS === "android" ? 16 : 12,
  },
  imageContainer: {
    position: "relative",
    width: "40%", // Reduced from 45% to 40%
    borderTopLeftRadius: Platform.OS === "android" ? 16 : 12,
    borderBottomLeftRadius: Platform.OS === "android" ? 16 : 12,
    overflow: "hidden",
  },
  lessonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryBadge: {
    position: "absolute",
    top: Platform.OS === "android" ? 10 : 8,
    left: Platform.OS === "android" ? 10 : 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: Platform.OS === "android" ? 10 : 8,
    paddingVertical: Platform.OS === "android" ? 5 : 4,
    borderRadius: Platform.OS === "android" ? 14 : 12,
    gap: Platform.OS === "android" ? 5 : 4,
    // Android-specific styling
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },
  categoryName: {
    color: COLORS.white,
    fontSize: Platform.OS === "android" ? 8 : 9, // Reduced from 9/10
    fontFamily: Platform.OS === "android" ? "medium" : "semiBold",
    fontWeight: Platform.OS === "android" ? "600" : undefined,
  },
  timeEstimateBadge: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 10 : 8,
    left: Platform.OS === "android" ? 10 : 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: Platform.OS === "android" ? 8 : 6,
    paddingVertical: Platform.OS === "android" ? 4 : 3,
    borderRadius: Platform.OS === "android" ? 10 : 8,
    gap: Platform.OS === "android" ? 4 : 3,
  },
  timeEstimateText: {
    color: COLORS.white,
    fontSize: Platform.OS === "android" ? 7 : 8, // Reduced from 8/9
    fontFamily: "medium",
    fontWeight: Platform.OS === "android" ? "500" : undefined,
  },
  contentContainer: {
    flex: 1,
    padding: Platform.OS === "android" ? 14 : 12,
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Platform.OS === "android" ? 4 : 0,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: Platform.OS === "android" ? 15 : 16, // Reduced from 17/18
    fontFamily: "bold",
    marginBottom: Platform.OS === "android" ? 6 : 8,
    lineHeight: Platform.OS === "android" ? 20 : 18,
    color: COLORS.white, // Changed to white for better contrast on orange background
    fontWeight: Platform.OS === "android" ? "700" : undefined,
  },
  difficultyBadge: {
    borderRadius: Platform.OS === "android" ? 8 : 6,
    paddingHorizontal: Platform.OS === "android" ? 8 : 6,
    paddingVertical: Platform.OS === "android" ? 4 : 3,
    alignSelf: "flex-start",
    // Android-specific styling
    ...Platform.select({
      android: {
        elevation: 1,
      },
    }),
  },
  difficultyText: {
    color: COLORS.white,
    fontSize: Platform.OS === "android" ? 7 : 8, // Reduced from 8/9
    fontFamily: "bold",
    fontWeight: Platform.OS === "android" ? "700" : undefined,
  },
  progressSection: {
    marginTop: Platform.OS === "android" ? 6 : 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Platform.OS === "android" ? 8 : 6,
  },
  lessonsText: {
    fontSize: Platform.OS === "android" ? 10 : 11, // Reduced from 11/12
    fontFamily: "medium",
    color: COLORS.white, // Changed to white for better contrast on orange background
    fontWeight: Platform.OS === "android" ? "500" : undefined,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Platform.OS === "android" ? 10 : 8,
  },
  statusBadgeNew: {
    backgroundColor: "#2196F3",
    borderRadius: Platform.OS === "android" ? 10 : 8,
    paddingHorizontal: Platform.OS === "android" ? 10 : 8,
    paddingVertical: Platform.OS === "android" ? 4 : 3,
    ...Platform.select({
      android: {
        elevation: 1,
      },
    }),
  },
  statusTextNew: {
    color: COLORS.white,
    fontSize: Platform.OS === "android" ? 8 : 9, // Reduced from 9/10
    fontFamily: "medium",
    fontWeight: Platform.OS === "android" ? "600" : undefined,
  },
  statusBadgeInProgress: {
    backgroundColor: "#FF9800",
    borderRadius: Platform.OS === "android" ? 10 : 8,
    paddingHorizontal: Platform.OS === "android" ? 10 : 8,
    paddingVertical: Platform.OS === "android" ? 4 : 3,
    ...Platform.select({
      android: {
        elevation: 1,
      },
    }),
  },
  statusTextInProgress: {
    color: COLORS.white,
    fontSize: Platform.OS === "android" ? 8 : 9, // Reduced from 9/10
    fontFamily: "medium",
    fontWeight: Platform.OS === "android" ? "600" : undefined,
  },
  statusBadgeComplete: {
    backgroundColor: "#4CAF50",
    borderRadius: Platform.OS === "android" ? 10 : 8,
    paddingHorizontal: Platform.OS === "android" ? 10 : 8,
    paddingVertical: Platform.OS === "android" ? 4 : 3,
    ...Platform.select({
      android: {
        elevation: 1,
      },
    }),
  },
  statusTextComplete: {
    color: COLORS.white,
    fontSize: Platform.OS === "android" ? 8 : 9, // Reduced from 9/10
    fontFamily: "medium",
    fontWeight: Platform.OS === "android" ? "600" : undefined,
  },
  continueIconButton: {
    borderRadius: Platform.OS === "android" ? 18 : 15,
    overflow: "hidden",
    ...Platform.select({
      android: {
        elevation: 3,
      },
    }),
  },
  continueIconGradient: {
    width: Platform.OS === "android" ? 36 : 30,
    height: Platform.OS === "android" ? 36 : 30,
    borderRadius: Platform.OS === "android" ? 18 : 15,
    backgroundColor: COLORS.white, // White background instead of gradient
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default LearningLessonCard;
