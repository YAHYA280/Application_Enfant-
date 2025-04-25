import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import type { FillInBlankQuestion as FillInBlankQuestionType } from "./typeGuards";

import { COLORS } from "../../constants";

interface FillInBlankQuestionProps {
  question: FillInBlankQuestionType;
  currentQuestionIndex: number;
  answers: Array<any>;
  updateAnswer: (answer: any) => void;
  isAnswerCorrect: boolean | null;
  dark: boolean;
}

const FillInBlankQuestion: React.FC<FillInBlankQuestionProps> = ({
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
            Complétez l&apos;espace vide avec le mot qui convient.
          </Text>
        </View>
      )}

      <View style={styles.fillInBlankContainer}>
        <TextInput
          style={[
            styles.fillInBlankInput,
            {
              backgroundColor: dark
                ? "rgba(50, 50, 50, 0.5)"
                : "rgba(240, 240, 240, 0.5)",
              color: dark ? COLORS.white : COLORS.greyscale900,
              borderColor:
                isAnswerCorrect === true
                  ? "#4CAF50"
                  : isAnswerCorrect === false
                    ? "#F44336"
                    : dark
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.1)",
            },
          ]}
          placeholder="Tapez votre réponse ici..."
          placeholderTextColor={
            dark ? COLORS.greyscale500 : COLORS.greyscale400
          }
          value={answers[currentQuestionIndex] || ""}
          onChangeText={(text) => updateAnswer(text)}
          editable={isAnswerCorrect === null}
        />

        {isAnswerCorrect !== null && (
          <View style={styles.fillInBlankResult}>
            <View
              style={[
                styles.resultBadge,
                {
                  backgroundColor: isAnswerCorrect
                    ? "rgba(76, 175, 80, 0.1)"
                    : "rgba(244, 67, 54, 0.1)",
                },
              ]}
            >
              <Feather
                name={isAnswerCorrect ? "check" : "x"}
                size={16}
                color={isAnswerCorrect ? "#4CAF50" : "#F44336"}
                style={styles.resultIcon}
              />
              <Text
                style={[
                  styles.resultText,
                  { color: isAnswerCorrect ? "#4CAF50" : "#F44336" },
                ]}
              >
                {isAnswerCorrect
                  ? "Correct"
                  : `Incorrect. La réponse est "${question.correctAnswer}"`}
              </Text>
            </View>
          </View>
        )}
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
  fillInBlankContainer: {
    marginTop: 10,
  },
  fillInBlankInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "regular",
    minHeight: 50,
  },
  fillInBlankResult: {
    marginTop: 16,
  },
  resultBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  resultIcon: {
    marginRight: 8,
  },
  resultText: {
    fontSize: 14,
    fontFamily: "medium",
  },
});

export default FillInBlankQuestion;
