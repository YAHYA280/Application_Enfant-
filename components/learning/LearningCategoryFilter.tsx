import React from "react";
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

interface LearningCategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onSelectCategory: (categoryId: string) => void;
}

const LearningCategoryFilter: React.FC<LearningCategoryFilterProps> = ({
  categories,
  selectedCategories,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);

          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                isSelected
                  ? {
                      backgroundColor: COLORS.primary,
                      borderColor: COLORS.primary,
                    }
                  : {
                      backgroundColor: COLORS.greyscale100,
                      borderColor: COLORS.greyscale300,
                    },
              ]}
              onPress={() => onSelectCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: isSelected ? COLORS.white : COLORS.greyscale900,
                  },
                ]}
              >
                {category.name}
              </Text>
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
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "medium",
  },
});

export default LearningCategoryFilter;
