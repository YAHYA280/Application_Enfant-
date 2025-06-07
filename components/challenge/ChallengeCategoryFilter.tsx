import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { COLORS } from "@/constants";

interface Category {
  id: string;
  name: string;
}

interface ChallengeCategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const ChallengeCategoryFilter: React.FC<ChallengeCategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.filterTitle, { color: COLORS.greyscale900 }]}>
        Catégories
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryButton}
              onPress={() => onSelectCategory(category.id)}
            >
              {isSelected ? (
                <LinearGradient
                  colors={["#ff6040", "#ff8e69"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.categoryItem}
                >
                  <Text style={styles.selectedCategoryText}>
                    {category.name}
                  </Text>
                </LinearGradient>
              ) : (
                <View
                  style={[
                    styles.categoryItem,
                    {
                      backgroundColor: COLORS.greyscale100,
                      borderColor: COLORS.greyscale300,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { color: COLORS.greyscale900 },
                    ]}
                  >
                    {category.name}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    zIndex: 5,
  },
  filterTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingRight: 16,
  },
  categoryButton: {
    marginRight: 12,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  categoryItem: {
    height: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "medium",
  },
  selectedCategoryText: {
    fontSize: 14,
    fontFamily: "semiBold",
    color: COLORS.white,
  },
});

export default ChallengeCategoryFilter;
