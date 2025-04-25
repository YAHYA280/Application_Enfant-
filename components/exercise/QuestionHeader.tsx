import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "../../constants";

interface QuestionHeaderProps {
  questionText: string;
  dark: boolean;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  questionText,
  dark,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <View>
      <View style={styles.questionTextContainer}>
        <Text
          style={[
            styles.questionText,
            { color: dark ? COLORS.white : COLORS.greyscale900 },
          ]}
        >
          {questionText}
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
            {/* Default explanation - will be overridden in each specific question component */}
            Lisez attentivement la question et prenez votre temps pour répondre.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default QuestionHeader;
