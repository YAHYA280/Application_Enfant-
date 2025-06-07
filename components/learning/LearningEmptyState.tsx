import React from "react";
import { Feather } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

import { COLORS } from "@/constants";

interface LearningEmptyStateProps {}

const LearningEmptyState: React.FC<LearningEmptyStateProps> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Feather name="search" size={50} color={COLORS.greyscale400} />
      </View>
      <Text style={[styles.title, { color: COLORS.greyscale900 }]}>
        Aucune leçon trouvée
      </Text>
      <Text style={[styles.subtitle, { color: COLORS.greyscale600 }]}>
        Essayez de modifier vos critères de recherche ou sélectionnez une autre
        catégorie.
      </Text>
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
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "regular",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default LearningEmptyState;
