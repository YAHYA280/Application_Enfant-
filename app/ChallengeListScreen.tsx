import type { NavigationProp } from "@react-navigation/native";

import { StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, Animated, TouchableOpacity } from "react-native";

import type { Challenge } from "@/services/mock";

import { icons, COLORS } from "@/constants";
import { mockChallenges } from "@/services/mock";
import { useTheme } from "@/theme/ThemeProvider";
import {
  ChallengeLessonCard,
  ChallengeEmptyState,
  ChallengeCategoryFilter,
} from "@/components/challenge";

const CATEGORIES = [
  { id: "all", name: "Tous" },
  { id: "FACILE", name: "Facile" },
  { id: "MOYEN", name: "Moyen" },
  { id: "DIFFICILE", name: "Difficile" },
];

type RootStackParamList = {
  home: undefined;
  ChallengeListScreen: undefined;
  ChallengeDetailsScreen: { challenge: Challenge };
};

const ChallengeListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [filteredChallenges, setFilteredChallenges] =
    useState<Challenge[]>(mockChallenges);

  // Animation for header
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const handleBackPress = () => {
    navigation.navigate("home");
  };

  useEffect(() => {
    const filtered = mockChallenges.filter(
      (challenge) =>
        selectedCategory === "all" || selectedCategory === challenge.difficulte
    );
    setFilteredChallenges(filtered);
  }, [selectedCategory]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleChallengePress = (challenge: Challenge) => {
    navigation.navigate("ChallengeDetailsScreen", { challenge });
  };

  const renderHeader = () => {
    return (
      <>
        {/* Fixed header that appears on scroll */}
        <Animated.View
          style={[
            styles.fixedHeader,
            {
              opacity: headerOpacity,
              backgroundColor: colors.background,
              borderBottomColor: COLORS.greyscale300,
            },
          ]}
        >
          <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={handleBackPress}>
                <Image
                  source={icons.back}
                  resizeMode="contain"
                  style={[
                    styles.backIcon,
                    {
                      tintColor: COLORS.greyscale900,
                    },
                  ]}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color: COLORS.greyscale900,
                  },
                ]}
              >
                Challenges
              </Text>
            </View>

            <View style={styles.headerRight}>
              <View style={styles.gradeContainer}>
                <Text style={styles.gradeText}>CE2</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Regular header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleBackPress}>
              <Image
                source={icons.back}
                resizeMode="contain"
                style={[
                  styles.backIcon,
                  {
                    tintColor: COLORS.greyscale900,
                  },
                ]}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.headerTitle,
                {
                  color: COLORS.greyscale900,
                },
              ]}
            >
              Challenges
            </Text>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.gradeContainer}>
              <Text style={styles.gradeText}>CE2</Text>
            </View>
          </View>
        </View>

        {/* Header banner with gradient */}
        <View style={styles.bannerContainer}>
          <LinearGradient
            colors={[COLORS.primary, "#ff8e69"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.banner}
          >
            <View style={styles.bannerContent}>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>Défiez-vous !</Text>
                <Text style={styles.bannerSubtitle}>
                  Testez vos connaissances à travers nos challenges éducatifs.
                </Text>
              </View>
              <Text style={styles.trophyEmoji}>🏆</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Category filter */}
        <ChallengeCategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {renderHeader()}

          {filteredChallenges.length > 0 ? (
            <View style={styles.challengesContainer}>
              {filteredChallenges.map((challenge) => (
                <ChallengeLessonCard
                  key={challenge.id}
                  challenge={challenge}
                  onPress={() => handleChallengePress(challenge)}
                />
              ))}
            </View>
          ) : (
            <ChallengeEmptyState
              message="Aucun challenge trouvé"
              subMessage="Essayez de sélectionner une autre catégorie."
              buttonText="Voir tous les challenges"
              onButtonPress={() => setSelectedCategory("all")}
            />
          )}
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "bold",
    marginLeft: 12,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  gradeContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  gradeText: {
    color: COLORS.white,
    fontFamily: "semiBold",
    fontSize: 14,
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  banner: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  bannerContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  bannerTitle: {
    fontSize: 22,
    fontFamily: "bold",
    color: COLORS.white,
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.white,
    opacity: 0.9,
    lineHeight: 20,
  },
  trophyEmoji: {
    fontSize: 64,
    marginLeft: 8,
  },
  challengesContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
});

export default ChallengeListScreen;
