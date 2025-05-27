import React, { useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";

interface ChallengeResultItemProps {
  title: string;
  question: string;
  userAnswer: string;
  correctAnswer?: string;
  isCorrect: boolean;
  points: number;
  image?: any;
}

const ChallengeResultItem: React.FC<ChallengeResultItemProps> = ({
  title,
  question,
  userAnswer,
  correctAnswer,
  isCorrect,
  points,
  image,
}) => {
  const { dark } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isCorrect
            ? dark
              ? "rgba(76, 175, 80, 0.15)"
              : "#EFF8FF"
            : dark
              ? "rgba(244, 67, 54, 0.15)"
              : "#FFF1F0",
          borderLeftColor: isCorrect ? "#4CAF50" : "#F44336",
        },
      ]}
    >
      <TouchableOpacity style={styles.header} onPress={toggleExpanded}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            {isCorrect ? (
              <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            ) : (
              <MaterialIcons name="cancel" size={24} color="#F44336" />
            )}
          </View>
          <View style={styles.headerTextContainer}>
            <Text
              style={[
                styles.title,
                { color: dark ? COLORS.white : COLORS.greyscale900 },
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            <View style={styles.statusContainer}>
              <Text
                style={[
                  styles.statusText,
                  { color: isCorrect ? "#4CAF50" : "#F44336" },
                ]}
              >
                {isCorrect ? "Correct" : "Incorrect"}
              </Text>
              <View style={styles.pointsContainer}>
                <Ionicons name="star" size={12} color={COLORS.primary} />
                <Text style={styles.pointsText}>
                  {isCorrect ? `+${points}` : "0"} pts
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={dark ? COLORS.greyscale500 : COLORS.gray}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          {image && (
            <View style={styles.imageContainer}>
              <Image
                source={typeof image === "string" ? { uri: image } : image}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          )}

          <View style={styles.questionContainer}>
            <Text
              style={[
                styles.questionLabel,
                { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
              ]}
            >
              Question:
            </Text>
            <Text
              style={[
                styles.questionText,
                { color: dark ? COLORS.white : COLORS.greyscale900 },
              ]}
            >
              {question}
            </Text>
          </View>

          <View style={styles.answerContainer}>
            <Text
              style={[
                styles.answerLabel,
                { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
              ]}
            >
              Votre réponse:
            </Text>
            <View
              style={[
                styles.answerBox,
                {
                  backgroundColor: dark
                    ? isCorrect
                      ? "rgba(76, 175, 80, 0.2)"
                      : "rgba(244, 67, 54, 0.2)"
                    : isCorrect
                      ? "rgba(76, 175, 80, 0.1)"
                      : "rgba(244, 67, 54, 0.1)",
                  borderColor: isCorrect ? "#4CAF50" : "#F44336",
                },
              ]}
            >
              <Text
                style={[
                  styles.answerText,
                  { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
              >
                {userAnswer}
              </Text>
            </View>
          </View>

          {!isCorrect && correctAnswer && (
            <View style={styles.correctAnswerContainer}>
              <Text
                style={[
                  styles.correctAnswerLabel,
                  { color: dark ? COLORS.greyscale500 : COLORS.greyscale600 },
                ]}
              >
                Réponse correcte:
              </Text>
              <View
                style={[
                  styles.correctAnswerBox,
                  {
                    backgroundColor: dark
                      ? "rgba(76, 175, 80, 0.2)"
                      : "rgba(76, 175, 80, 0.1)",
                    borderColor: "#4CAF50",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.correctAnswerText,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                  ]}
                >
                  {correctAnswer}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: "semiBold",
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusText: {
    fontSize: 14,
    fontFamily: "medium",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pointsText: {
    fontSize: 12,
    color: COLORS.primary,
    fontFamily: "semiBold",
    marginLeft: 4,
  },
  content: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  imageContainer: {
    height: 150,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  questionContainer: {
    marginBottom: 12,
  },
  questionLabel: {
    fontSize: 12,
    fontFamily: "medium",
    marginBottom: 4,
  },
  questionText: {
    fontSize: 15,
    fontFamily: "regular",
    lineHeight: 22,
  },
  answerContainer: {
    marginBottom: 12,
  },
  answerLabel: {
    fontSize: 12,
    fontFamily: "medium",
    marginBottom: 4,
  },
  answerBox: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  answerText: {
    fontSize: 14,
    fontFamily: "medium",
  },
  correctAnswerContainer: {
    marginTop: 8,
  },
  correctAnswerLabel: {
    fontSize: 12,
    fontFamily: "medium",
    marginBottom: 4,
  },
  correctAnswerBox: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  correctAnswerText: {
    fontSize: 14,
    fontFamily: "medium",
  },
});

export default ChallengeResultItem;
