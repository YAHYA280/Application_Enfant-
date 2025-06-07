import type { ImageSourcePropType } from "react-native";

import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  Image,
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import type { Exercice as ExerciceBase } from "@/services/mock";

import { COLORS } from "@/constants";

interface QuestionComponentProps {
  exercice: ExerciceBase;
  isLastExercice: boolean;
  onSubmit: (exerciceId: number, answer: string, isCorrect: boolean) => void;
  onNext: (exerciceId: number, answer: string, isCorrect: boolean) => void;
}

// Update the interface to include the options property
declare module "@/services/mock" {
  interface Exercice {
    options: string[];
  }
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
  exercice,
  isLastExercice,
  onSubmit,
  onNext,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [submittedAnswer, setSubmittedAnswer] = useState<string>("");
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  // Animation for feedback
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const pulseAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAnswerSelect = (answer: string) => {
    if (!showAnswer) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      const isCorrect = selectedAnswer === exercice.reponseCorrecte;
      setSubmittedAnswer(selectedAnswer);
      setIsAnswerCorrect(isCorrect);
      setShowAnswer(true);
      pulseAnimation();
    }
  };

  const handleNext = () => {
    if (isLastExercice) {
      onSubmit(exercice.id, submittedAnswer, isAnswerCorrect);
    } else {
      onNext(exercice.id, submittedAnswer, isAnswerCorrect);
      // Reset state for next question
      setSelectedAnswer("");
      setSubmittedAnswer("");
      setIsAnswerCorrect(false);
      setShowAnswer(false);
    }
  };

  // Fallback options if exercice.options doesn't exist
  const optionsToRender = exercice.options || [
    exercice.reponseCorrecte,
    ...(exercice.reponseCorrecte !== "Option 1" ? ["Option 1"] : ["Option 2"]),
    ...(exercice.reponseCorrecte !== "Option 3" ? ["Option 3"] : ["Option 4"]),
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Question Info Header */}
      <View style={styles.infoContainer}>
        <View
          style={[
            styles.pointBadge,
            {
              backgroundColor: "rgba(255, 142, 105, 0.1)",
            },
          ]}
        >
          <MaterialIcons name="star" size={14} color={COLORS.primary} />
          <Text style={[styles.pointText, { color: COLORS.primary }]}>
            {exercice.pointQuestion} points
          </Text>
        </View>

        <View
          style={[styles.timeBadge, { backgroundColor: "rgba(0,0,0,0.05)" }]}
        >
          <Ionicons name="time-outline" size={14} color={COLORS.gray} />
          <Text style={styles.timeText}>{exercice.dureeQuestion} secondes</Text>
        </View>
      </View>

      {/* Question Content */}
      <View style={styles.questionContainer}>
        <Text style={[styles.questionText, { color: COLORS.greyscale900 }]}>
          {exercice.contenu}
        </Text>
      </View>

      {/* Question Image (if available) */}
      {exercice.media && (
        <View style={styles.imageContainer}>
          <Image
            source={
              typeof exercice.media === "string"
                ? { uri: exercice.media }
                : (exercice.media as ImageSourcePropType)
            }
            style={styles.questionImage}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Options Container */}
      <View style={styles.optionsContainer}>
        <Text style={[styles.optionsTitle, { color: COLORS.greyscale900 }]}>
          Choisissez une réponse :
        </Text>

        {/* Answer Options */}
        {optionsToRender.map((option: string, index: number) => {
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === exercice.reponseCorrecte;
          const isIncorrectSelected =
            showAnswer && isSelected && !isCorrectAnswer;

          let optionStyle = {};
          let textStyle = {
            color: COLORS.greyscale900,
          };

          if (showAnswer) {
            if (isCorrectAnswer) {
              optionStyle = styles.correctOption;
              textStyle = { color: COLORS.white };
            } else if (isIncorrectSelected) {
              optionStyle = styles.incorrectOption;
              textStyle = { color: COLORS.white };
            }
          } else if (isSelected) {
            optionStyle = {
              backgroundColor: "rgba(255, 142, 105, 0.1)",
              borderColor: COLORS.primary,
            };
            textStyle = { color: COLORS.primary };
          }

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                {
                  backgroundColor: COLORS.white,
                  borderColor: COLORS.greyscale300,
                },
                optionStyle,
              ]}
              onPress={() => handleAnswerSelect(option)}
              disabled={showAnswer}
            >
              <Text style={[styles.optionText, textStyle]}>{option}</Text>

              {showAnswer && isCorrectAnswer && (
                <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
              )}

              {isIncorrectSelected && (
                <MaterialIcons name="cancel" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feedback when answer is shown */}
      {showAnswer && (
        <Animated.View
          style={[
            styles.feedbackContainer,
            {
              backgroundColor: isAnswerCorrect
                ? "rgba(76, 175, 80, 0.1)"
                : "rgba(244, 67, 54, 0.1)",
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.feedbackHeader}>
            <MaterialIcons
              name={isAnswerCorrect ? "check-circle" : "cancel"}
              size={24}
              color={isAnswerCorrect ? "#4CAF50" : "#F44336"}
            />
            <Text
              style={[
                styles.feedbackTitle,
                { color: isAnswerCorrect ? "#4CAF50" : "#F44336" },
              ]}
            >
              {isAnswerCorrect ? "Correct !" : "Incorrect"}
            </Text>
          </View>

          <Text style={[styles.feedbackText, { color: COLORS.greyscale900 }]}>
            {isAnswerCorrect
              ? "Bravo ! Vous avez choisi la bonne réponse."
              : `La réponse correcte était: ${exercice.reponseCorrecte}`}
          </Text>
        </Animated.View>
      )}

      {/* Action Buttons */}
      {!showAnswer ? (
        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              opacity: selectedAnswer ? 1 : 0.5,
            },
          ]}
          onPress={handleSubmit}
          disabled={!selectedAnswer}
        >
          <LinearGradient
            colors={["#ff6040", "#ff8e69"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>Valider ma réponse</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <LinearGradient
            colors={["#ff6040", "#ff8e69"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {isLastExercice ? "Terminer le challenge" : "Question suivante"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  pointBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  pointText: {
    fontSize: 14,
    fontFamily: "semiBold",
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.gray,
  },
  questionContainer: {
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontFamily: "medium",
    lineHeight: 24,
  },
  imageContainer: {
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  questionImage: {
    width: "100%",
    height: "100%",
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionsTitle: {
    fontSize: 16,
    fontFamily: "semiBold",
    marginBottom: 12,
  },
  optionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  correctOption: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  incorrectOption: {
    backgroundColor: "#F44336",
    borderColor: "#F44336",
  },
  optionText: {
    fontSize: 15,
    fontFamily: "medium",
    flex: 1,
  },
  feedbackContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  feedbackTitle: {
    fontSize: 16,
    fontFamily: "bold",
  },
  feedbackText: {
    fontSize: 14,
    fontFamily: "medium",
    lineHeight: 20,
  },
  submitButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "bold",
  },
  nextButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonGradient: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "bold",
  },
});

export default QuestionComponent;
