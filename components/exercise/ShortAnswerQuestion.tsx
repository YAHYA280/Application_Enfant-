import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import type { ShortAnswerQuestion as ShortAnswerQuestionType } from "./typeGuards";

import { COLORS } from "../../constants";

interface ShortAnswerQuestionProps {
  question: ShortAnswerQuestionType;
  currentQuestionIndex: number;
  answers: Array<any>;
  updateAnswer: (answer: any) => void;
  dark: boolean;
}

const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({
  question,
  currentQuestionIndex,
  answers,
  updateAnswer,
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
            Répondez à la question en utilisant quelques phrases.
            {question.expectedKeywords.length > 0 &&
              ` Essayez d'inclure des mots-clés comme: ${question.expectedKeywords.join(", ")}.`}
          </Text>
        </View>
      )}

      <View style={styles.shortAnswerContainer}>
        <TextInput
          style={[
            styles.shortAnswerInput,
            {
              backgroundColor: dark
                ? "rgba(50, 50, 50, 0.5)"
                : "rgba(240, 240, 240, 0.5)",
              color: dark ? COLORS.white : COLORS.greyscale900,
              borderColor: dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
            },
          ]}
          placeholder="Tapez votre réponse ici..."
          placeholderTextColor={
            dark ? COLORS.greyscale500 : COLORS.greyscale400
          }
          multiline
          value={
            typeof answers[currentQuestionIndex] === "string"
              ? (answers[currentQuestionIndex] as string)
              : ""
          }
          onChangeText={(text) => updateAnswer(text)}
        />
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
  shortAnswerContainer: {
    marginTop: 10,
  },
  shortAnswerInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "regular",
    minHeight: 120,
    textAlignVertical: "top",
  },
});

export default ShortAnswerQuestion;
