import React from "react";
import { Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import type { Question } from "@/data";

import { COLORS } from "../../constants";

interface SummaryModalProps {
  visible: boolean;
  onClose: () => void;
  questions: Question[];
  answers: Array<any>;
  dark: boolean;
}

const SummaryModal: React.FC<SummaryModalProps> = ({
  visible,
  onClose,
  questions,
  answers,
  dark,
}) => {
  // Format the answer based on its type
  const formatAnswer = (answer: any): string => {
    if (answer === undefined || answer === null) {
      return "Non répondu";
    }

    if (typeof answer === "boolean") {
      return answer ? "Vrai" : "Faux";
    }

    return answer.toString();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.summaryModalContainer,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <View style={styles.summaryModalHeader}>
            <Text
              style={[
                styles.summaryModalTitle,
                { color: dark ? COLORS.white : COLORS.greyscale900 },
              ]}
            >
              Résumé de vos réponses
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather
                name="x"
                size={24}
                color={dark ? COLORS.white : COLORS.greyscale900}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.summaryModalContent}>
            {questions.map((question, index) => (
              <View
                key={index}
                style={[
                  styles.summaryQuestionItem,
                  {
                    borderBottomColor: dark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  },
                ]}
              >
                <View style={styles.summaryQuestionHeader}>
                  <Text
                    style={[
                      styles.summaryQuestionNumber,
                      { color: dark ? COLORS.primary : COLORS.primary },
                    ]}
                  >
                    Question {index + 1}
                  </Text>
                  <View
                    style={[
                      styles.summaryQuestionStatus,
                      {
                        backgroundColor:
                          answers[index] !== undefined
                            ? "rgba(76, 175, 80, 0.2)"
                            : "rgba(244, 67, 54, 0.2)",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          answers[index] !== undefined ? "#4CAF50" : "#F44336",
                        fontSize: 12,
                        fontFamily: "medium",
                      }}
                    >
                      {answers[index] !== undefined ? "Répondu" : "Non répondu"}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.summaryQuestionText,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                  ]}
                >
                  {question.text}
                </Text>

                {answers[index] !== undefined && (
                  <View style={styles.summaryAnswerContainer}>
                    <Text
                      style={[
                        styles.summaryAnswerLabel,
                        {
                          color: dark
                            ? COLORS.greyscale500
                            : COLORS.greyScale800,
                        },
                      ]}
                    >
                      Votre réponse:
                    </Text>
                    <Text
                      style={[
                        styles.summaryAnswerText,
                        { color: dark ? COLORS.white : COLORS.greyscale900 },
                      ]}
                    >
                      {formatAnswer(answers[index])}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.summaryCloseButton} onPress={onClose}>
            <Text style={styles.summaryCloseButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  summaryModalContainer: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  summaryModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  summaryModalTitle: {
    fontSize: 18,
    fontFamily: "bold",
  },
  summaryModalContent: {
    padding: 16,
    maxHeight: 400,
  },
  summaryQuestionItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  summaryQuestionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryQuestionNumber: {
    fontSize: 14,
    fontFamily: "bold",
  },
  summaryQuestionStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  summaryQuestionText: {
    fontSize: 16,
    marginBottom: 12,
  },
  summaryAnswerContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 12,
    borderRadius: 8,
  },
  summaryAnswerLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  summaryAnswerText: {
    fontSize: 15,
    fontFamily: "medium",
  },
  summaryCloseButton: {
    margin: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  summaryCloseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "bold",
  },
});

export default SummaryModal;
