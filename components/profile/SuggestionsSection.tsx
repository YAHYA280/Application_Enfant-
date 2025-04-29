// components/profile/SuggestionsSection.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "@/constants";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface SuggestionsSectionProps {
  dark: boolean;
  suggestions: string[];
}

const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({
  dark,
  suggestions,
}) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
      ]}
    >
      <LinearGradient
        colors={
          dark
            ? ["rgba(255,96,64,0.15)", "rgba(255,142,105,0.02)"]
            : ["rgba(255,96,64,0.05)", "rgba(255,255,255,0)"]
        }
        style={styles.containerGradient}
      >
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Feather
              name="star"
              size={20}
              color={COLORS.primary}
              style={styles.titleIcon}
            />
            <Text
              style={[
                styles.sectionTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Suggestions et Conseils
            </Text>
          </View>
          <Text
            style={[
              styles.sectionSubtitle,
              { color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" },
            ]}
          >
            Recommandations personnalisées pour votre progression
          </Text>
        </View>

        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <View key={index} style={styles.suggestionItem}>
              <View
                style={[
                  styles.suggestionIconContainer,
                  {
                    backgroundColor: dark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(255,96,64,0.1)",
                  },
                ]}
              >
                <Feather name="check-circle" size={16} color={COLORS.primary} />
              </View>
              <Text
                style={[
                  styles.suggestionText,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {suggestion}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: dark ? COLORS.dark3 : COLORS.white },
          ]}
        >
          <LinearGradient
            colors={[COLORS.primary, "#ff8e69"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.actionButtonGradient}
          >
            <Text style={styles.actionButtonText}>Voir plus de conseils</Text>
            <Feather name="arrow-right" size={16} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  containerGradient: {
    padding: 20,
  },
  headerContainer: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  titleIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "bold",
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: "regular",
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  suggestionIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "medium",
    lineHeight: 22,
  },
  actionButton: {
    borderRadius: 25,
    overflow: "hidden",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "semiBold",
    marginRight: 8,
  },
});

export default SuggestionsSection;
