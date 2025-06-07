// components/profile/StatsCards.tsx
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, Animated, StyleSheet } from "react-native";

import { COLORS } from "@/constants";

interface StatsCardsProps {
  stats: {
    daysSpent: number;
    timeSpent: string;
    xpEarned: number;
    ranking: number;
  };
}

interface StatCardProps {
  icon: string;
  iconColor: string;
  value: string | number;
  label: string;

  gradientStart: string;
  gradientEnd: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconColor,
  value,
  label,

  gradientStart,
  gradientEnd,
}) => {
  const animatedValue = new Animated.Value(0);
  const [animation] = React.useState(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    })
  );

  React.useEffect(() => {
    animation.start();
  }, [animation]);

  const animatedStyle = {
    opacity: animatedValue,
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <LinearGradient
        colors={[gradientStart, gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { backgroundColor: COLORS.white }]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: "rgba(0,0,0,0.05)",
            },
          ]}
        >
          <Ionicons name={icon as any} size={24} color={iconColor} />
        </View>
        <Text style={[styles.cardValue, { color: COLORS.black }]}>{value}</Text>
        <Text style={[styles.cardLabel, { color: "rgba(0,0,0,0.6)" }]}>
          {label}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
};

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: COLORS.black }]}>
        Statistiques d&apos;apprentissage
      </Text>

      <View style={styles.cardsContainer}>
        <StatCard
          icon="calendar"
          iconColor="#FF4500"
          value={stats.daysSpent}
          label="Jours d'activité"
          gradientStart="rgba(255,69,0,0.1)"
          gradientEnd="rgba(255,69,0,0.02)"
        />

        <StatCard
          icon="time"
          iconColor="#FF1493"
          value={stats.timeSpent}
          label="Temps passé"
          gradientStart="rgba(255,20,147,0.1)"
          gradientEnd="rgba(255,20,147,0.02)"
        />

        <StatCard
          icon="flash"
          iconColor="#FFA500"
          value={stats.xpEarned}
          label="XP gagnés"
          gradientStart="rgba(255,165,0,0.1)"
          gradientEnd="rgba(255,165,0,0.02)"
        />

        <StatCard
          icon="ribbon"
          iconColor="#DAA520"
          value={stats.ranking}
          label="Classement"
          gradientStart="rgba(218,165,32,0.1)"
          gradientEnd="rgba(218,165,32,0.02)"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  cardContainer: {
    width: "48%",
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    height: 120,
    justifyContent: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardValue: {
    fontSize: 20,
    fontFamily: "bold",
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: "medium",
    textAlign: "center",
  },
});

export default StatsCards;
