import type { RouteProp, NavigationProp } from "@react-navigation/native";

import { COLORS } from "@/constants";
import React, { useState } from "react";
import { useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute, useTheme } from "@react-navigation/native";
import ExerciseComponent from "@/components/ExerciceComponent";
import { type Module, type Exercise, moduleQuestions } from "@/data";
import {
  View,
  Text,
  Alert,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");

type RootStackParamList = {
  exerciseview: {
    module: Module;
    exercise: Exercise;
  };
};

const ExerciseView = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { colors, dark } = useTheme();
  const route = useRoute<RouteProp<RootStackParamList, "exerciseview">>();
  const { module, exercise } = route.params;
  const exerciseQuestions = moduleQuestions[module.name][exercise.id] || [];

  // Animation value for header
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Track progress
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<any>>(
    Array(exerciseQuestions.length).fill(null)
  );

  // Progress percentage
  const progress =
    (currentQuestionIndex / Math.max(exerciseQuestions.length - 1, 1)) * 100;

  const handleSubmit = (results: boolean[]) => {
    // Show success animation or feedback
    Alert.alert(
      "Exercice terminé !",
      "Félicitations ! Vous avez terminé cet exercice.",
      [
        {
          text: "Retour aux leçons",
          onPress: () => {
            navigation.reset({
              index: 1,
              routes: [
                {
                  name: "home",
                  params: {},
                },
                {
                  name: "learning",
                  params: {},
                },
                {
                  name: "lessondetailsmore",
                  params: { module },
                },
              ],
            });
          },
        },
      ]
    );
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exerciseQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Last question reached
      handleSubmit([true]); // Placeholder result
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={dark ? "light" : "dark"} />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.headerBackground,
          {
            opacity: headerOpacity,
            backgroundColor: dark ? COLORS.dark1 : COLORS.white,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonFixed}
        >
          <Feather
            name="arrow-left"
            size={24}
            color={dark ? COLORS.white : COLORS.black}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: dark ? COLORS.white : COLORS.black },
          ]}
        >
          {module.name} - Exercice
        </Text>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={dark ? ["#ff6040", "#ff8e69"] : ["#ff8e69", "#ffb692"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Feather name="arrow-left" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <View>
                <Text style={styles.moduleTitle}>{module.name}</Text>
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
              </View>

              <View style={styles.progressIndicator}>
                <Text style={styles.progressText}>
                  {currentQuestionIndex + 1}/{exerciseQuestions.length}
                </Text>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[styles.progressBar, { width: `${progress}%` }]}
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.contentContainer}>
          {/* Exercise Card */}
          <View
            style={[
              styles.exerciseCard,
              { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
            ]}
          >
            <LinearGradient
              colors={
                dark
                  ? [
                      "rgba(255,100,64,0.25)",
                      "rgba(30,30,30,0)",
                      "rgba(30,30,30,0)",
                      "rgba(255,100,64,0.25)",
                    ]
                  : [
                      "rgba(255,142,105,0.3)",
                      "rgba(255,255,255,0)",
                      "rgba(255,255,255,0)",
                      "rgba(255,142,105,0.3)",
                    ]
              }
              locations={[0, 0.3, 0.7, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradientBackground}
            />

            <ExerciseComponent
              exercice={exercise}
              questions={exerciseQuestions}
              currentQuestionIndex={currentQuestionIndex}
              module={module}
              onSubmit={handleSubmit}
              onNext={handleNextQuestion}
              answers={answers}
              setAnswers={setAnswers}
            />
          </View>
        </View>
      </Animated.ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtonsContainer}>
        <TouchableOpacity
          onPress={handlePreviousQuestion}
          style={[
            styles.navButton,
            styles.prevButton,
            { opacity: currentQuestionIndex === 0 ? 0.5 : 1 },
          ]}
          disabled={currentQuestionIndex === 0}
        >
          <Feather name="chevron-left" size={24} color={COLORS.white} />
          <Text style={styles.navButtonText}>Précédent</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNextQuestion}
          style={[styles.navButton, styles.nextButton]}
        >
          <Text style={styles.navButtonText}>
            {currentQuestionIndex === exerciseQuestions.length - 1
              ? "Terminer"
              : "Suivant"}
          </Text>
          <Feather name="chevron-right" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginLeft: 32,
  },
  backButtonFixed: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  heroContainer: {
    width: "100%",
    overflow: "hidden",
  },
  heroGradient: {
    paddingTop: 60,
    paddingBottom: 30,
  },
  heroContent: {
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  moduleTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontFamily: "medium",
    marginBottom: 8,
  },
  exerciseTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "bold",
    marginBottom: 20,
  },
  progressIndicator: {
    marginTop: 15,
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "medium",
    marginBottom: 8,
    textAlign: "right",
  },
  progressBarContainer: {
    height: 6,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: -15,
  },
  exerciseCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 100, // Space for bottom navigation buttons
    position: "relative",
    overflow: "hidden",
  },
  cardGradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  navigationButtonsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 120,
    justifyContent: "center",
  },
  prevButton: {
    backgroundColor: COLORS.secondary,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
  },
  navButtonText: {
    color: COLORS.white,
    fontFamily: "bold",
    fontSize: 16,
    marginHorizontal: 8,
  },
});

export default ExerciseView;
