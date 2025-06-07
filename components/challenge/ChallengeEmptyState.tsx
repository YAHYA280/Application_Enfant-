import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "@/constants";
import { useTheme } from "@/theme/ThemeProvider";

interface ChallengeEmptyStateProps {
  message?: string;
  subMessage?: string;
  icon?: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

const ChallengeEmptyState: React.FC<ChallengeEmptyStateProps> = ({
  message = "Aucun challenge trouvé",
  subMessage = "Essayez de modifier vos critères de recherche ou sélectionnez une autre catégorie.",
  icon = "trophy",
  buttonText,
  onButtonPress,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: "rgba(255, 142, 105, 0.05)",
          },
        ]}
      >
        <Ionicons
          name={icon as any}
          size={60}
          color={COLORS.primary}
          style={styles.icon}
        />
      </View>

      <Text style={[styles.title, { color: COLORS.greyscale900 }]}>
        {message}
      </Text>

      <Text style={[styles.subtitle, { color: COLORS.greyscale600 }]}>
        {subMessage}
      </Text>

      {buttonText && onButtonPress && (
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={onButtonPress}
        >
          <LinearGradient
            colors={["#ff6040", "#ff8e69"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginTop: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  icon: {
    textShadowColor: "rgba(255, 142, 105, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "regular",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 8,
    width: "70%",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "semiBold",
  },
});

export default ChallengeEmptyState;
