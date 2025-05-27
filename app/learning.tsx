import type { ImageSourcePropType } from "react-native";
import type { NavigationProp } from "@react-navigation/native";

import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, FlatList, Animated, StyleSheet } from "react-native";

import ConditionalComponent from "@/components/ConditionalComponent";

import { Modules } from "../data";
import { COLORS } from "../constants";
import { useTheme } from "../theme/ThemeProvider";
import LearningHeader from "../components/learning/LearningHeader";
import LearningSearchBar from "../components/learning/LearningSearchBar";
import LearningLessonCard from "../components/learning/LearningLessonCard";
import LearningEmptyState from "../components/learning/LearningEmptyState";
import LearningCategoryFilter from "../components/learning/LearningCategoryFilter";

interface LearningProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string) => void;
  };
}

interface Module {
  id: string;
  name: string;
  image: ImageSourcePropType;
  category: string;
  categoryId: string;
  numberOfLessonsCompleted: number;
  totalNumberOfLessons: number;
  description: string;
  estimatedTime: string;
  progressPercentage: number;
}

// Category data
const categories = [
  { id: "1", name: "Tous" },
  { id: "2", name: "Mathématiques" },
  { id: "3", name: "Sciences" },
  { id: "4", name: "Français" },
  { id: "5", name: "Histoire" },
];

const Learning: React.FC<LearningProps> = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { colors, dark } = useTheme();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["1"]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollY] = useState(new Animated.Value(0));

  const filteredLessons = Modules.filter((lesson) => {
    const matchesCategory =
      selectedCategories.includes("1") ||
      selectedCategories.includes(lesson.categoryId);
    const matchesSearch = lesson.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && (searchQuery === "" || matchesSearch);
  });

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === "1") {
      setSelectedCategories(["1"]);
    } else {
      let newSelectedCategories = [...selectedCategories];

      if (newSelectedCategories.includes("1")) {
        newSelectedCategories = newSelectedCategories.filter(
          (id) => id !== "1"
        );
      }

      if (newSelectedCategories.includes(categoryId)) {
        newSelectedCategories = newSelectedCategories.filter(
          (id) => id !== categoryId
        );
        // If no categories are selected, select "All"
        if (newSelectedCategories.length === 0) {
          newSelectedCategories = ["1"];
        }
      } else {
        newSelectedCategories.push(categoryId);
      }

      setSelectedCategories(newSelectedCategories);
    }
  };

  const handleSearchQueryChange = (text: string) => {
    setSearchQuery(text);
  };

  const cancelSearch = () => {
    setIsSearching(false);
    setSearchQuery("");
  };

  // Calculate header opacity based on scroll position
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });

  /**
   * Render lesson item
   */
  const renderLessonItem = ({ item }: { item: Module }) => (
    <LearningLessonCard
      name={item.name}
      image={item.image}
      category={item.category}
      numberOfLessonsCompleted={item.numberOfLessonsCompleted}
      totalNumberOfLessons={item.totalNumberOfLessons}
      onPress={() => navigation.navigate("lessondetailsmore", { module: item })}
    />
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <Animated.View
          style={[
            styles.headerAnimatedContainer,
            {
              opacity: headerOpacity,
              backgroundColor: dark ? COLORS.dark1 : COLORS.white,
            },
          ]}
        >
          {isSearching ? (
            <LearningSearchBar
              searchQuery={searchQuery}
              onChangeText={handleSearchQueryChange}
              onCancel={cancelSearch}
              dark={dark}
            />
          ) : (
            <LearningHeader
              title="J'apprends"
              onBackPress={() => navigation.goBack()}
              onSearchPress={() => setIsSearching(true)}
              dark={dark}
            />
          )}
        </Animated.View>

        {/* Category Filter */}
        <LearningCategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          onSelectCategory={handleCategorySelect}
          dark={dark}
        />

        {/* Main Content */}
        <Animated.ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          <ConditionalComponent
            isValid={filteredLessons.length > 0}
            defaultComponent={<LearningEmptyState dark={dark} />}
          >
            <FlatList
              data={filteredLessons}
              keyExtractor={(item) => item.id}
              renderItem={renderLessonItem}
              scrollEnabled={false} // Disable scrolling inside FlatList
              contentContainerStyle={styles.listContainer}
            />
          </ConditionalComponent>
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerAnimatedContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    paddingBottom: 8,
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingBottom: 24,
  },
});

export default Learning;
