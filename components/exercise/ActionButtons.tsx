import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants";

interface ActionButtonsProps {
  onOpenAiModal: () => void;
  onOpenSummaryModal: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onOpenAiModal,
  onOpenSummaryModal,
}) => {
  return (
    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity style={styles.actionButton} onPress={onOpenAiModal}>
        <LinearGradient
          colors={["#ff6040", "#ff8e69"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.actionButtonGradient}
        >
          <MaterialCommunityIcons name="robot" size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Assistant IA</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={onOpenSummaryModal}
      >
        <LinearGradient
          colors={["#3f87f5", "#8ab4f8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.actionButtonGradient}
        >
          <Feather name="list" size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Vos réponses</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    flex: 0.48,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontFamily: "medium",
    fontSize: 14,
    marginLeft: 8,
  },
});

export default ActionButtons;
