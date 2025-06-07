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
        activeOpacity={0.9}
        style={[styles.container, { backgroundColor: COLORS.white }]}
      >
        {/* Effet de bordure premium avec gradient orange */}
        <LinearGradient
          colors={[COLORS.primary, "#FF7538"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        />

        <View style={styles.cardContent}>
          {/* Partie gauche - Image */}
          <View style={styles.imageContainer}>
            <Image source={image} style={styles.lessonImage} />

            {/* Badge catégorie */}
            <View style={styles.categoryBadge}>
              <Feather name="book-open" size={12} color={COLORS.white} />
              <Text style={styles.categoryName}>{category}</Text>
            </View>

            {/* Badge temps estimé */}
            <View style={styles.timeEstimateBadge}>
              <Feather name="clock" size={10} color={COLORS.white} />
              <Text style={styles.timeEstimateText}>{estimatedTime}</Text>
            </View>
          </View>

          {/* Partie droite - Contenu */}
          <View style={styles.contentContainer}>
            {/* En-tête avec titre et badge de difficulté */}
            <View style={styles.headerContainer}>
              <Text
                style={[styles.name, { color: COLORS.greyscale900 }]}
                numberOfLines={2}
              >
                {name}
              </Text>

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
                  <Text
                    style={[
                      styles.lessonsText,
                      {
                        color: COLORS.white,
                      },
                    ]}
                  >
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
                  <TouchableOpacity style={styles.continueIconButton}>
                    <LinearGradient
                      colors={["#ff604", "#ff8e69"]}
                      style={styles.continueIconGradient}
                    >
                      <Feather
                        name="chevron-right"
                        size={16}
                        color={COLORS.white}
                      />
                    </LinearGradient>
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
    marginVertical: 10,
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
    height: 140, // Maintien de la hauteur spécifiée
  },
  imageContainer: {
    position: "relative",
    width: "45%",
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
  timeEstimateBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  timeEstimateText: {
    color: COLORS.white,
    fontSize: 9,
    fontFamily: "medium",
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 8,
    lineHeight: 20,
    marginRight: 8,
  },
  difficultyBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  difficultyText: {
    color: COLORS.white,
    fontSize: 9,
    fontFamily: "bold",
  },
  progressSection: {
    marginTop: 4,
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
  },

  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  statusBadgeNew: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusTextNew: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "medium",
  },
  statusBadgeInProgress: {
    backgroundColor: "#FF9800",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusTextInProgress: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "medium",
  },
  statusBadgeComplete: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusTextComplete: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: "medium",
  },
  continueIconButton: {
    borderRadius: 15,
    overflow: "hidden",
  },
  continueIconGradient: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LearningLessonCard;
