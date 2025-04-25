import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface ActionButtonsProps {
  onOpenAiModal: () => void;
  onOpenSummaryModal: () => void;
  onRevise: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onOpenAiModal,
  onOpenSummaryModal,
  onRevise,
}) => (
  <View style={styles.actionButtonsContainer}>
    {/* 1️⃣ Assistant IA */}
    <TouchableOpacity style={styles.actionButton} onPress={onOpenAiModal}>
      <LinearGradient
        colors={["#ff6040", "#ff8e69"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.actionButtonGradient}
      >
        <MaterialCommunityIcons name="robot" size={18} color="#FFF" />
        <Text style={styles.actionButtonText}>Assistant IA</Text>
      </LinearGradient>
    </TouchableOpacity>

    {/* 2️⃣ Réviser */}
    <TouchableOpacity style={styles.actionButton} onPress={onRevise}>
      <LinearGradient
        colors={["#4CAF50", "#8BC34A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.actionButtonGradient}
      >
        <Feather name="book" size={18} color="#FFF" />
        <Text style={styles.actionButtonText}>Réviser</Text>
      </LinearGradient>
    </TouchableOpacity>

    {/* 3️⃣ Vos réponses — full-width on its own row */}
    <TouchableOpacity
      style={[styles.actionButton, styles.fullWidthButton]}
      onPress={onOpenSummaryModal}
    >
      <LinearGradient
        colors={["#3f87f5", "#8ab4f8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.actionButtonGradient}
      >
        <Feather name="list" size={18} color="#FFF" />
        <Text style={styles.actionButtonText}>Vos réponses</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    width: "48%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  fullWidthButton: {
    width: "100%",
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontFamily: "medium",
    fontSize: 13,
    marginLeft: 6,
  },
});

export default ActionButtons;
