import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import type { MultipleChoiceQuestion as MultipleChoiceQuestionType } from "./typeGuards";

import { COLORS } from "../../constants";

interface MultipleChoiceQuestionProps {
  question: MultipleChoiceQuestionType;
  currentQuestionIndex: number;
  answers: Array<any>;
  updateAnswer: (answer: any) => void;
  isAnswerCorrect: boolean | null;
  dark: boolean;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  currentQuestionIndex,
  answers,
  updateAnswer,
  isAnswerCorrect,
  dark,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <View style={styles.questionContent}>
      <View style={styles.questionTextContainer}>
        <Text
          style={[
            styles.questionText,
            { color: dark ? COLORS.white : COLORS.greyscale900 },
          ]}
        >
          {question.text}
        </Text>
        <TouchableOpacity
          style={styles.hintButton}
          onPress={() => setShowExplanation(!showExplanation)}
        >
          <Feather
            name={showExplanation ? "x" : "help-circle"}
            size={20}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {showExplanation && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationText}>
            Choisissez la bonne réponse parmi les options proposées.
          </Text>
        </View>
      )}

      <View style={styles.optionsContainer}>
        {question.options.map((option) => {
          const isSelected = answers[currentQuestionIndex] === option.id;
          const isAnswer =
            isAnswerCorrect !== null && option.id === question.correctAnswer;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                isSelected && styles.selectedOption,
                isAnswerCorrect !== null &&
                  isSelected &&
                  isAnswerCorrect &&
                  styles.correctOption,
                isAnswerCorrect !== null &&
                  isSelected &&
                  !isAnswerCorrect &&
                  styles.incorrectOption,
                isAnswerCorrect !== null &&
                  !isSelected &&
                  isAnswer &&
                  styles.correctOption,
                {
                  backgroundColor: dark
                    ? isSelected
                      ? "rgba(255, 142, 105, 0.3)"
                      : "rgba(50, 50, 50, 0.5)"
                    : isSelected
                      ? "rgba(255, 142, 105, 0.2)"
                      : "rgba(240, 240, 240, 0.5)",
                },
              ]}
              onPress={() => updateAnswer(option.id)}
              disabled={isAnswerCorrect !== null}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.optionIndicator,
                    isSelected && {
                      backgroundColor: COLORS.primary,
                      borderColor: COLORS.primary,
                    },
                    {
                      borderColor: dark
                        ? COLORS.greyscale500
                        : COLORS.greyScale800,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionIndicatorText,
                      isSelected && { color: COLORS.white },
                      {
                        color: dark ? COLORS.greyscale500 : COLORS.greyScale800,
                      },
                    ]}
                  >
                    {option.id.toUpperCase()}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.optionText,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                    isSelected && { fontFamily: "bold" },
                  ]}
                >
                  {option.text}
                </Text>

                {isAnswerCorrect !== null && isSelected && (
                  <View style={styles.resultIndicator}>
                    <Feather
                      name={isAnswerCorrect ? "check" : "x"}
                      size={20}
                      color={isAnswerCorrect ? "#4CAF50" : "#F44336"}
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  questionContent: {
    marginBottom: 20,
  },
  questionTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  questionText: {
    fontSize: 18,
    fontFamily: "medium",
    flex: 1,
    marginRight: 10,
  },
  hintButton: {
    padding: 4,
  },
  explanationContainer: {
    backgroundColor: "rgba(255, 142, 105, 0.1)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  explanationText: {
    fontSize: 14,
    color: COLORS.greyScale800,
    fontFamily: "regular",
    fontStyle: "italic",
  },
  optionsContainer: {
    marginTop: 5,
  },
  optionButton: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedOption: {
    borderColor: COLORS.primary,
  },
  correctOption: {
    borderColor: "#4CAF50",
  },
  incorrectOption: {
    borderColor: "#F44336",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  optionIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionIndicatorText: {
    fontSize: 12,
    fontFamily: "bold",
  },
  optionText: {
    fontSize: 16,
    fontFamily: "regular",
    flex: 1,
  },
  resultIndicator: {
    marginLeft: 10,
  },
});

export default MultipleChoiceQuestion;
