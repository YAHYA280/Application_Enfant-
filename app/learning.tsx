import type { ImageSourcePropType } from "react-native";
import type { NavigationProp } from "@react-navigation/native";

import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-virtualized-view";
import { SafeAreaView } from "react-native-safe-area-context";
import ConditionalComponent from "@/components/ConditionalComponent";
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Modules } from "../data";
import { useTheme } from "../theme/ThemeProvider";
import { SIZES, icons, COLORS } from "../constants";
import LearningLessonCard from "../components/LearningLessonCard";

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

const Learning: React.FC<LearningProps> = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { colors, dark } = useTheme();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["1"]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter lessons based on both category and search query
  const filteredLessons = Modules.filter((lesson) => {
    const matchesCategory =
      selectedCategories.includes("1") ||
      selectedCategories.includes(lesson.categoryId);
    const matchesSearch = lesson.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && (searchQuery === "" || matchesSearch);
  });

  /**
   * Render header
   */
  const renderHeader = () => {
    if (isSearching) {
      return (
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              setIsSearching(false);
              setSearchQuery("");
            }}
          >
            <Image
              source={icons.back}
              resizeMode="contain"
              style={[
                styles.backIcon,
                {
                  tintColor: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            />
          </TouchableOpacity>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={[
                styles.searchInput,
                {
                  color: dark ? COLORS.white : COLORS.greyscale900,
                  backgroundColor: dark
                    ? COLORS.greyScale800
                    : COLORS.grayscale100,
                },
              ]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Rechercher des leçons..."
              placeholderTextColor={
                dark ? COLORS.greyscale500 : COLORS.grayscale700
              }
              autoFocus
            />
            <ConditionalComponent isValid={searchQuery.length > 0}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery("")}
              >
                <Image
                  source={icons.clear}
                  style={[
                    styles.clearIcon,
                    {
                      tintColor: dark
                        ? COLORS.greyscale500
                        : COLORS.grayscale700,
                    },
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </ConditionalComponent>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.back}
              resizeMode="contain"
              style={[
                styles.backIcon,
                {
                  tintColor: dark ? COLORS.white : COLORS.greyscale900,
                },
              ]}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            J&apos;apprends
          </Text>
        </View>
        <TouchableOpacity onPress={() => setIsSearching(true)}>
          <Image
            source={icons.search3}
            resizeMode="contain"
            style={[
              styles.searchIcon,
              {
                tintColor: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };
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
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            data={filteredLessons}
            keyExtractor={(item) => item.id}
            renderItem={renderLessonItem}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: colors.text }]}>
                Aucune leçon trouvée
              </Text>
            }
          />
        </ScrollView>
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
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.black,
    marginLeft: 16,
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingRight: 40,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "regular",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  clearButton: {
    position: "absolute",
    right: 10,
  },
  clearIcon: {
    width: 20,
    height: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontFamily: "medium",
  },
});

export default Learning;
