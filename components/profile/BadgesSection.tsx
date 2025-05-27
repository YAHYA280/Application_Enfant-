// components/profile/BadgesSection.tsx
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  FlatList,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "@/constants";

interface BadgeItem {
  id: number;
  iconName: string;
  color: string;
  label: string;
}

interface BadgesSectionProps {
  dark: boolean;
  badges: BadgeItem[];
}

const BadgesSection: React.FC<BadgesSectionProps> = ({ dark, badges }) => {
  // Animation for each badge
  const animatedScales = badges.map(() => new Animated.Value(1));

  const handlePress = (index: number) => {
    // Sequence animation: scale up then back to normal
    Animated.sequence([
      Animated.timing(animatedScales[index], {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animatedScales[index], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderBadge = ({ item, index }: { item: BadgeItem; index: number }) => {
    const animatedStyle = {
      transform: [{ scale: animatedScales[index] }],
    };

    return (
      <Animated.View style={[styles.badgeWrapper, animatedStyle]}>
        <TouchableOpacity
          style={[
            styles.badgeContainer,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
          onPress={() => handlePress(index)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[
              `${item.color}20`, // 10% opacity
              `${item.color}05`, // 2% opacity
            ]}
            style={styles.badgeGradient}
          >
            <View style={styles.badgeIconContainer}>
              <Ionicons
                name={item.iconName as any}
                size={36}
                color={item.color}
              />
            </View>
            <Text
              style={[
                styles.badgeLabel,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
              numberOfLines={2}
            >
              {item.label}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.sectionTitle,
            { color: dark ? COLORS.white : COLORS.black },
          ]}
        >
          Récompenses et Distinctions
        </Text>
        <Text
          style={[
            styles.sectionSubtitle,
            { color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" },
          ]}
        >
          Vos badges et accomplissements
        </Text>
      </View>

      <FlatList
        data={badges}
        renderItem={renderBadge}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.badgesContainer}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />

      <TouchableOpacity
        style={[
          styles.viewAllButton,
          { backgroundColor: dark ? COLORS.dark3 : "rgba(0,0,0,0.05)" },
        ]}
      >
        <Text
          style={[
            styles.viewAllText,
            { color: dark ? COLORS.white : COLORS.black },
          ]}
        >
          Voir tous les badges
        </Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={dark ? COLORS.white : COLORS.black}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerContainer: {
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: "regular",
  },
  badgesContainer: {
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeWrapper: {
    width: "33%",
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  badgeContainer: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    aspectRatio: 0.9,
  },
  badgeGradient: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  badgeLabel: {
    fontSize: 12,
    fontFamily: "medium",
    textAlign: "center",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: "medium",
    marginRight: 4,
  },
});

export default BadgesSection;
