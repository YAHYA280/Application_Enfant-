import type { RouteProp, NavigationProp } from "@react-navigation/native";

import React, { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  Animated,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import type { Exercice, Challenge } from "@/services/mock";

import { COLORS } from "@/constants";
import QuestionComponent from "@/components/QuestionComponent";
import { mockExercices, challengeExerciceMap } from "@/services/mock";
import { ChallengeHeader, ChallengeResultItem } from "@/components/challenge";

type RootStackParamList = {
  exerciseview: {
    challenge: Challenge;
    exercice: Exercice;
  };
  challengedetailsmore: {
    challenge: Challenge;
  };
  recompenseMessage: {
    challenge: Challenge;
    score: number;
    totalPossibleScore: number;
  };
};

interface ExerciseAnswer {
  exerciceId: number;
  userAnswer: string;
  isCorrect: boolean;
}

const ExerciseView = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "exerciseview">>();
  const insets = useSafeAreaInsets();
  const { challenge, exercice: initialExercice } = route.params;

  const [currentExercice, setCurrentExercice] =
    useState<Exercice>(initialExercice);
  const [userAnswers, setUserAnswers] = useState<ExerciseAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Animation for the results section
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  const exerciceIds = challengeExerciceMap[challenge.id] || [];
  const challengeExercices = mockExercices.filter((ex) =>
    exerciceIds.includes(ex.id)
  );

  const currentExerciceIndex = challengeExercices.findIndex(
    (ex) => ex.id === currentExercice.id
  );

  const isLastExercice = currentExerciceIndex === challengeExercices.length - 1;

  const totalScore = userAnswers.reduce((total, answer) => {
    if (answer.isCorrect) {
      const exercice = challengeExercices.find(
        (ex) => ex.id === answer.exerciceId
      );
      return total + (exercice?.pointQuestion || 0);
    }
    return total;
  }, 0);

  const totalPossibleScore = challengeExercices.reduce((total, exercice) => {
    return total + exercice.pointQuestion;
  }, 0);

  const handleExerciseSubmit = (
    exerciceId: number,
    answer: string,
    isCorrect: boolean
  ) => {
    const newAnswers = [
      ...userAnswers,
      { exerciceId, userAnswer: answer, isCorrect },
    ];
    setUserAnswers(newAnswers);

    setShowResults(true);

    // Animate the results section
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNextExercice = (
    exerciceId: number,
    answer: string,
    isCorrect: boolean
  ) => {
    const newAnswers = [
      ...userAnswers,
      { exerciceId, userAnswer: answer, isCorrect },
    ];
    setUserAnswers(newAnswers);

    const currentIndex = challengeExercices.findIndex(
      (ex) => ex.id === exerciceId
    );

    if (currentIndex < challengeExercices.length - 1) {
      setTimeout(() => {
        const nextExercice = challengeExercices[currentIndex + 1];
        setCurrentExercice(nextExercice);
      }, 300);
    }
  };

  const navigateToRecompenseMessage = () => {
    navigation.navigate("recompenseMessage", {
      challenge,
      score: totalScore,
      totalPossibleScore,
    });
  };

  const correctAnswers = userAnswers.filter((a) => a.isCorrect).length;
  const incorrectAnswers = userAnswers.filter((a) => !a.isCorrect).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Safe area for status bar only */}
      <SafeAreaView style={styles.statusBarSafeArea} edges={["top"]} />

      {/* Header */}
      <ChallengeHeader
        title={challenge.nom}
        subtitle="Question"
        onBackPress={() =>
          navigation.navigate("challengedetailsmore", { challenge })
        }
      />

      <View
        style={[
          styles.mainContainer,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        {showResults ? (
          <Animated.View
            style={[
              styles.resultsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY }],
              },
            ]}
          >
            {/* Results Header */}
            <View style={styles.resultsHeader}>
              <LinearGradient
                colors={["#ff6040", "#ff8e69"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.resultsGradient}
              >
                <Text style={styles.resultsTitle}>Résultats</Text>
                <Text style={styles.scoreText}>
                  Vous avez obtenu {totalScore} points!
                </Text>

                <View style={styles.resultsStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{correctAnswers}</Text>
                    <Text style={styles.statLabel}>Correctes</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{incorrectAnswers}</Text>
                    <Text style={styles.statLabel}>Incorrectes</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Results List */}
            <View style={styles.resultsListContainer}>
              <Text style={styles.sectionTitle}>Vos réponses:</Text>

              <FlatList
                data={userAnswers}
                renderItem={({ item }) => {
                  const exercice = challengeExercices.find(
                    (ex) => ex.id === item.exerciceId
                  );
                  if (!exercice) return null;

                  return (
                    <ChallengeResultItem
                      title={exercice.titre}
                      question={exercice.contenu}
                      userAnswer={item.userAnswer}
                      correctAnswer={
                        item.isCorrect ? undefined : exercice.reponseCorrecte
                      }
                      isCorrect={item.isCorrect}
                      points={exercice.pointQuestion}
                      image={exercice.media || undefined}
                    />
                  );
                }}
                keyExtractor={(item) => item.exerciceId.toString()}
                contentContainerStyle={styles.resultsList}
                showsVerticalScrollIndicator={false}
              />

              <View style={styles.doneButtonContainer}>
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={navigateToRecompenseMessage}
                >
                  <LinearGradient
                    colors={["#ff6040", "#ff8e69"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.doneButtonGradient}
                  >
                    <Text style={styles.doneButtonText}>Terminer</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ) : (
          <View style={styles.exerciseContainer}>
            {/* Question Title */}
            <Text style={styles.exerciseTitle}>{currentExercice.titre}</Text>

            {/* Progress Indicator */}
            <View style={styles.progressIndicator}>
              <Text style={styles.progressText}>
                Question {currentExerciceIndex + 1} /{" "}
                {challengeExercices.length}
              </Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${((currentExerciceIndex + 1) / challengeExercices.length) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Question Component */}
            <QuestionComponent
              exercice={currentExercice}
              isLastExercice={isLastExercice}
              onSubmit={handleExerciseSubmit}
              onNext={handleNextExercice}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  statusBarSafeArea: {
    backgroundColor: COLORS.white,
  },
  mainContainer: {
    flex: 1,
    padding: 16,
  },
  exerciseContainer: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 22,
    fontFamily: "bold",
    marginBottom: 16,
    color: COLORS.greyscale900,
  },
  progressIndicator: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: "semiBold",
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultsGradient: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.white,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.white,
    marginBottom: 20,
  },
  resultsStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  statNumber: {
    fontSize: 24,
    fontFamily: "bold",
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.white,
    opacity: 0.8,
  },
  resultsListContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 16,
    color: COLORS.greyscale900,
  },
  resultsList: {
    paddingBottom: 100,
  },
  doneButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    backgroundColor: "transparent",
  },
  doneButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  doneButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  doneButtonText: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.white,
  },
});

export default ExerciseView;
