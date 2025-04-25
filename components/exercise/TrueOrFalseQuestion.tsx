import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import type { TrueOrFalseQuestion as TrueOrFalseQuestionType } from "./typeGuards";

import { COLORS } from "../../constants";

interface TrueOrFalseQuestionProps {
  question: TrueOrFalseQuestionType;
  currentQuestionIndex: number;
  answers: Array<any>;
  updateAnswer: (answer: any) => void;
  isAnswerCorrect: boolean | null;
  dark: boolean;
}

const TrueOrFalseQuestion: React.FC<TrueOrFalseQuestionProps> = ({
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
            Indiquez si l&apos;affirmation est vraie ou fausse.
          </Text>
        </View>
      )}

      <View style={styles.trueOrFalseContainer}>
        <TouchableOpacity
          style={[
            styles.trueOrFalseButton,
            answers[currentQuestionIndex] === true && styles.selectedOption,
            isAnswerCorrect !== null &&
              answers[currentQuestionIndex] === true &&
              isAnswerCorrect &&
              styles.correctOption,
            isAnswerCorrect !== null &&
              answers[currentQuestionIndex] === true &&
              !isAnswerCorrect &&
              styles.incorrectOption,
            isAnswerCorrect !== null &&
              answers[currentQuestionIndex] !== true &&
              question.correctAnswer === true &&
              styles.correctOption,
            {
              backgroundColor: dark
                ? answers[currentQuestionIndex] === true
                  ? "rgba(255, 142, 105, 0.3)"
                  : "rgba(50, 50, 50, 0.5)"
                : answers[currentQuestionIndex] === true
                  ? "rgba(255, 142, 105, 0.2)"
                  : "rgba(240, 240, 240, 0.5)",
            },
          ]}
          onPress={() => updateAnswer(true)}
          disabled={isAnswerCorrect !== null}
        >
          <Text
            style={[
              styles.trueOrFalseText,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
              answers[currentQuestionIndex] === true && { fontFamily: "bold" },
            ]}
          >
            Vrai
          </Text>
          {isAnswerCorrect !== null &&
            answers[currentQuestionIndex] === true && (
              <View style={styles.resultIndicator}>
                <Feather
                  name={isAnswerCorrect ? "check" : "x"}
                  size={20}
                  color={isAnswerCorrect ? "#4CAF50" : "#F44336"}
                />
              </View>
            )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.trueOrFalseButton,
            answers[currentQuestionIndex] === false && styles.selectedOption,
            isAnswerCorrect !== null &&
              answers[currentQuestionIndex] === false &&
              isAnswerCorrect &&
              styles.correctOption,
            isAnswerCorrect !== null &&
              answers[currentQuestionIndex] === false &&
              !isAnswerCorrect &&
              styles.incorrectOption,
            isAnswerCorrect !== null &&
              answers[currentQuestionIndex] !== false &&
              question.correctAnswer === false &&
              styles.correctOption,
            {
              backgroundColor: dark
                ? answers[currentQuestionIndex] === false
                  ? "rgba(255, 142, 105, 0.3)"
                  : "rgba(50, 50, 50, 0.5)"
                : answers[currentQuestionIndex] === false
                  ? "rgba(255, 142, 105, 0.2)"
                  : "rgba(240, 240, 240, 0.5)",
            },
          ]}
          onPress={() => updateAnswer(false)}
          disabled={isAnswerCorrect !== null}
        >
          <Text
            style={[
              styles.trueOrFalseText,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
              answers[currentQuestionIndex] === false && { fontFamily: "bold" },
            ]}
          >
            Faux
          </Text>
          {isAnswerCorrect !== null &&
            answers[currentQuestionIndex] === false && (
              <View style={styles.resultIndicator}>
                <Feather
                  name={isAnswerCorrect ? "check" : "x"}
                  size={20}
                  color={isAnswerCorrect ? "#4CAF50" : "#F44336"}
                />
              </View>
            )}
        </TouchableOpacity>
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
  trueOrFalseContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trueOrFalseButton: {
    flex: 0.48,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
    flexDirection: "row",
  },
  trueOrFalseText: {
    fontSize: 16,
    fontFamily: "medium",
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
  resultIndicator: {
    marginLeft: 10,
  },
});

export default TrueOrFalseQuestion;
