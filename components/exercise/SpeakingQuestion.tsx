import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import type { SpeakingQuestion as SpeakingQuestionType } from "./typeGuards";

import { COLORS } from "../../constants";

interface SpeakingQuestionProps {
  question: SpeakingQuestionType;
  dark: boolean;
}

const SpeakingQuestion: React.FC<SpeakingQuestionProps> = ({
  question,
  dark,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Ici vous pourriez ajouter la logique d'enregistrement audio
  };

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
          <Text style={styles.explanationText}>{question.guidanceText}</Text>
        </View>
      )}

      <View style={styles.speakingContainer}>
        <TouchableOpacity style={styles.recordButton} onPress={toggleRecording}>
          <LinearGradient
            colors={
              isRecording ? ["#f44336", "#ff5252"] : ["#ff6040", "#ff8e69"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.recordGradient}
          >
            <Feather
              name={isRecording ? "stop-circle" : "mic"}
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.recordButtonText}>
              {isRecording ? "Arrêter" : "Enregistrer"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.pulseDot} />
            <Text style={styles.recordingText}>Enregistrement en cours...</Text>
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
  speakingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  recordButton: {
    width: "70%",
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  recordGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  recordButtonText: {
    color: "#FFFFFF",
    fontFamily: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F44336",
    marginRight: 8,
  },
  recordingText: {
    color: "#F44336",
    fontFamily: "medium",
    fontSize: 14,
  },
});

export default SpeakingQuestion;
