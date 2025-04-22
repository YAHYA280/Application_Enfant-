import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface RecapCardProps {
  IconComponent: React.ReactElement;
  value: string | number;
  label: string;
}

const RecapCard: React.FC<RecapCardProps> = ({
  IconComponent,
  value,
  label,
}) => {
  return (
    <View style={styles.card}>
      {/* Affichage de l'icône passée en prop */}
      {IconComponent}
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "50%",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  cardLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});

export default RecapCard;
