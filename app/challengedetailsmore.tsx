import type { RouteProp, NavigationProp } from "@react-navigation/native";

import React from "react";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-virtualized-view";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import type { Exercice, Challenge } from "@/services/mock";

import { useTheme } from "@/theme/ThemeProvider";
import { icons, SIZES, COLORS } from "@/constants";
import { mockExercices, challengeExerciceMap } from "@/services/mock";
import {
  ChallengeSectionCard,
  ChallengeProgressBar,
} from "@/components/challenge";

type RootStackParamList = {
  defi: undefined;
  challengedetailsmore: { challenge: Challenge };
  questionviewsreen: {
    challenge: Challenge;
    exercice: Exercice;
  };
};

const Challengedetailsmore = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<{ params: { challenge: Challenge } }>>();
  const { challenge } = route.params;
  const insets = useSafeAreaInsets();

  const { colors } = useTheme();

  const exerciceIds = challengeExerciceMap[challenge.id] || [];
  const exercises = mockExercices.filter((ex) => exerciceIds.includes(ex.id));

  const completedExercisesCount = Math.floor(
    (challenge.pourcentageReussite / 100) * exercises.length
  );

  const handleBackPress = () => {
    navigation.navigate("defi");
  };

  const handleExercisePress = (exercice: Exercice) => {
    if (exercice && challenge.accessible) {
      navigation.navigate("questionviewsreen", {
        challenge,
        exercice,
      });
    } else {
      Alert.alert(
        "Exercice non disponible",
        "Cet exercice n'est pas disponible pour le moment."
      );
    }
  };

  // Get the color corresponding to the difficulty level
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

  const bottomPadding = Math.max(insets.bottom, 16);

  return (
    <View
      style={[styles.mainContainer, { backgroundColor: colors.background }]}
    >
      <StatusBar style="dark" />

      {/* Safe area for status bar only */}
      <SafeAreaView style={styles.statusBarSafeArea} edges={["top"]} />

      {/* Hero section with image and linear gradient overlay */}
      <View style={styles.heroSection}>
        <Image
          source={challenge.media}
          resizeMode="cover"
          style={styles.headerImage}
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)", "rgba(255,255,255,0.9)"]}
          style={styles.imageGradient}
        />

        {/* Back button */}
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <View style={styles.backButtonInner}>
            <Image
              source={icons.back}
              resizeMode="contain"
              style={[styles.backIcon, { tintColor: COLORS.white }]}
            />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 120 + bottomPadding }, // Extra space for bottom button
        ]}
      >
        <View style={styles.contentContainer}>
          {/* Challenge header section */}
          <View style={styles.headerContainer}>
            <View style={styles.titleRow}>
              <Text
                style={[styles.challengeName, { color: COLORS.greyscale900 }]}
              >
                {challenge.nom}
              </Text>

              <TouchableOpacity
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor() },
                ]}
              >
                <Text style={styles.difficultyText}>
                  {challenge.difficulte}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.descriptionContainer}>
              <Text
                style={[styles.descriptionText, { color: COLORS.grayscale700 }]}
              >
                {challenge.description}
              </Text>
            </View>

            {/* Challenge metrics */}
            <View style={styles.metricsContainer}>
              <View style={styles.metricItem}>
                <View style={styles.metricIconContainer}>
                  <Image
                    source={icons.users}
                    resizeMode="contain"
                    style={styles.metricIcon}
                  />
                </View>
                <View style={styles.metricTextContainer}>
                  <Text
                    style={[styles.metricValue, { color: COLORS.greyscale900 }]}
                  >
                    {completedExercisesCount} / {exercises.length}
                  </Text>
                  <Text style={styles.metricLabel}>Questions</Text>
                </View>
              </View>

              <View style={styles.metricItem}>
                <View style={styles.metricIconContainer}>
                  <Image
                    source={icons.time}
                    resizeMode="contain"
                    style={styles.metricIcon}
                  />
                </View>
                <View style={styles.metricTextContainer}>
                  <Text
                    style={[styles.metricValue, { color: COLORS.greyscale900 }]}
                  >
                    {challenge.duree}
                  </Text>
                  <Text style={styles.metricLabel}>Minutes</Text>
                </View>
              </View>

              <View style={styles.metricItem}>
                <View style={styles.metricIconContainer}>
                  <Image
                    source={icons.star}
                    resizeMode="contain"
                    style={styles.metricIcon}
                  />
                </View>
                <View style={styles.metricTextContainer}>
                  <Text
                    style={[styles.metricValue, { color: COLORS.greyscale900 }]}
                  >
                    {challenge.nombreTentatives}
                  </Text>
                  <Text style={styles.metricLabel}>Tentatives</Text>
                </View>
              </View>
            </View>

            {/* Progress section */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text
                  style={[styles.progressTitle, { color: COLORS.greyscale900 }]}
                >
                  Progression
                </Text>
                <Text
                  style={[styles.progressPercentage, { color: COLORS.primary }]}
                >
                  {challenge.pourcentageReussite}%
                </Text>
              </View>

              <ChallengeProgressBar
                numberOfLessonsCompleted={completedExercisesCount}
                totalNumberOfLessons={exercises.length}
                size="large"
                showText={false}
              />

              <View style={styles.progressStatus}>
                {challenge.pourcentageReussite === 0 ? (
                  <View style={styles.statusBadgeNew}>
                    <Text style={styles.statusTextNew}>Nouveau</Text>
                  </View>
                ) : challenge.pourcentageReussite === 100 ? (
                  <View style={styles.statusBadgeComplete}>
                    <Text style={styles.statusTextComplete}>Terminé</Text>
                  </View>
                ) : (
                  <View style={styles.statusBadgeInProgress}>
                    <Text style={styles.statusTextInProgress}>En cours</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.separator} />

          {/* Exercises section */}
          <View style={styles.exercisesContainer}>
            <Text
              style={[styles.exercisesTitle, { color: COLORS.greyscale900 }]}
            >
              Questions
            </Text>

            <View style={styles.exercisesList}>
              {exercises.map((exercice, index) => {
                const isCompleted = index < completedExercisesCount;

                return (
                  <ChallengeSectionCard
                    key={exercice.id}
                    exercice={exercice}
                    isCompleted={isCompleted}
                    onPress={() => handleExercisePress(exercice)}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Start/Continue Challenge Button */}
      <View
        style={[styles.bottomActionContainer, { paddingBottom: bottomPadding }]}
      >
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            if (exercises.length > 0) {
              const nextExerciseIndex =
                completedExercisesCount < exercises.length
                  ? completedExercisesCount
                  : 0;
              handleExercisePress(exercises[nextExerciseIndex]);
            }
          }}
        >
          <LinearGradient
            colors={["#ff6040", "#ff8e69"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.actionButtonGradient}
          >
            <Text style={styles.actionButtonText}>
              {completedExercisesCount > 0 &&
              completedExercisesCount < exercises.length
                ? "Continuer"
                : completedExercisesCount === exercises.length
                  ? "Recommencer"
                  : "Commencer"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  statusBarSafeArea: {
    backgroundColor: COLORS.white,
  },
  heroSection: {
    height: SIZES.width * 0.6,
    width: "100%",
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 10,
  },
  backButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 50,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  headerContainer: {
    paddingHorizontal: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  challengeName: {
    fontSize: 24,
    fontFamily: "bold",
    flex: 1,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "semiBold",
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: "regular",
    lineHeight: 24,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  metricItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 142, 105, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  metricIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
  },
  metricTextContainer: {
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: "bold",
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.gray,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontFamily: "semiBold",
  },
  progressPercentage: {
    fontSize: 18,
    fontFamily: "bold",
  },
  progressStatus: {
    marginTop: 12,
    alignItems: "flex-start",
  },
  statusBadgeNew: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusTextNew: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "medium",
  },
  statusBadgeInProgress: {
    backgroundColor: "#FF9800",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusTextInProgress: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "medium",
  },
  statusBadgeComplete: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusTextComplete: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "medium",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginVertical: 20,
    marginHorizontal: 16,
  },
  exercisesContainer: {
    paddingHorizontal: 16,
  },
  exercisesTitle: {
    fontSize: 22,
    fontFamily: "bold",
    marginBottom: 16,
  },
  exercisesList: {
    marginBottom: 24,
  },
  bottomActionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "transparent",
  },
  actionButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "bold",
  },
});

export default Challengedetailsmore;
