import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { icons, COLORS } from "@/constants";

type MaterialItem = {
  id: string;
  type: string;
  title: string;
  size: string;
  icon: any;
  description: string;
};

type CategoryType = "Tous" | "PDF" | "Images" | "Documents" | "Exercices";

interface MaterialsContentProps {
  dark: boolean;
}

const lessonMaterials = [
  {
    id: "1",
    type: "pdf",
    title: "Leçon complète",
    size: "2.4 MB",
    icon: icons.pdf,
    description:
      "Notes détaillées couvrant tous les concepts clés de cette leçon",
  },
  {
    id: "2",
    type: "image",
    title: "Diagramme 1: Architecture du système",
    size: "1.1 MB",
    icon: icons.image,
    description: "Représentation visuelle de l'architecture du système",
  },
  {
    id: "3",
    type: "doc",
    title: "Instructions d'exercice",
    size: "540 KB",
    icon: icons.document,
    description:
      "Instructions étape par étape pour compléter les exercices pratiques",
  },
  {
    id: "4",
    type: "pdf",
    title: "Guide de référence",
    size: "3.7 MB",
    icon: icons.pdf,
    description: "Matériel de référence complet pour études avancées",
  },
  {
    id: "5",
    type: "image",
    title: "Diagramme 2: Flux de processus",
    size: "890 KB",
    icon: icons.image,
    description: "Visualisation des processus et flux de travail clés",
  },
  {
    id: "6",
    type: "exercice",
    title: "Ressources additionnelles",
    size: "1.8 MB",
    icon: icons.pdf,
    description: "Matériaux supplémentaires pour approfondir l'apprentissage",
  },
];

const MaterialsContent: React.FC<MaterialsContentProps> = ({ dark }) => {
  // Add state to track the selected category
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>("Tous");

  // Filter materials based on selected category
  const filteredMaterials = lessonMaterials.filter((item) => {
    if (selectedCategory === "Tous") return true;
    if (selectedCategory === "PDF" && item.type === "pdf") return true;
    if (selectedCategory === "Images" && item.type === "image") return true;
    if (selectedCategory === "Documents" && item.type === "doc") return true;
    if (selectedCategory === "Exercices" && item.type === "exercice")
      return true;
    return false;
  });

  const renderMaterialItem = ({ item }: { item: MaterialItem }) => (
    <TouchableOpacity
      style={[
        styles.materialItem,
        { backgroundColor: dark ? COLORS.dark2 : "#FFFFFF" },
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.materialItemContent}>
        <View
          style={[
            styles.materialIconContainer,
            {
              backgroundColor: dark
                ? "rgba(255, 142, 105, 0.2)"
                : "rgba(255, 142, 105, 0.15)",
            },
          ]}
        >
          <Image
            source={item.icon}
            style={[styles.materialIcon, { tintColor: COLORS.primary }]}
            resizeMode="contain"
          />
        </View>

        <View style={styles.materialInfo}>
          <Text
            style={[
              styles.materialTitle,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.materialDescription,
              { color: dark ? COLORS.greyscale500 : COLORS.greyScale800 },
            ]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
          <Text style={styles.materialMeta}>
            {item.type.toUpperCase()} • {item.size}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.downloadButton,
            { backgroundColor: dark ? COLORS.dark3 : "rgba(0,0,0,0.05)" },
          ]}
        >
          <Feather name="download" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Define all available categories
  const categories: CategoryType[] = [
    "Tous",
    "PDF",
    "Images",
    "Documents",
    "Exercices",
  ];

  return (
    <View style={styles.materialsTabContent}>
      <View style={styles.materialsHeaderContainer}>
        <Text
          style={[
            styles.materialsHeaderTitle,
            { color: dark ? COLORS.white : COLORS.greyscale900 },
          ]}
        >
          Supports de cours disponibles
        </Text>
        <Text
          style={[
            styles.materialsHeaderSubtitle,
            { color: dark ? COLORS.greyscale500 : COLORS.greyScale800 },
          ]}
        >
          Téléchargez ces ressources pour approfondir votre apprentissage
        </Text>
      </View>

      <View style={styles.materialsCategoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.materialsCategoriesContent}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.activeCategoryChip,
                {
                  backgroundColor:
                    dark && selectedCategory !== category
                      ? COLORS.dark2
                      : selectedCategory !== category
                        ? "#F5F5F5"
                        : undefined,
                },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category &&
                    styles.activeCategoryChipText,
                  {
                    color:
                      dark && selectedCategory !== category
                        ? COLORS.greyscale500
                        : selectedCategory !== category
                          ? COLORS.greyScale800
                          : undefined,
                  },
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredMaterials.length > 0 ? (
        <FlatList
          data={filteredMaterials}
          renderItem={renderMaterialItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => (
            <View
              style={[
                styles.separator,
                {
                  backgroundColor: dark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
            />
          )}
          contentContainerStyle={styles.materialsListContent}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Feather
            name="inbox"
            size={50}
            color={dark ? COLORS.greyscale500 : COLORS.greyscale400}
          />
          <Text
            style={[
              styles.emptyStateText,
              { color: dark ? COLORS.greyscale500 : COLORS.greyScale800 },
            ]}
          >
            Aucun document disponible dans cette catégorie
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  materialsTabContent: {
    marginBottom: 40,
  },
  materialsHeaderContainer: {
    marginBottom: 20,
  },
  materialsHeaderTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginBottom: 8,
  },
  materialsHeaderSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  materialsCategoriesContainer: {
    marginBottom: 20,
  },
  materialsCategoriesContent: {
    paddingBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 12,
    fontFamily: "medium",
  },
  activeCategoryChipText: {
    color: "#FFFFFF",
  },
  materialsListContent: {
    paddingBottom: 20,
  },
  materialItem: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: "hidden",
  },
  materialItemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  materialIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  materialIcon: {
    width: 24,
    height: 24,
  },
  materialInfo: {
    flex: 1,
    marginRight: 10,
  },
  materialTitle: {
    fontSize: 16,
    fontFamily: "medium",
    marginBottom: 4,
  },
  materialDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
  materialMeta: {
    fontSize: 10,
    color: COLORS.primary,
    fontFamily: "medium",
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 1,
    marginVertical: 8,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateText: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "medium",
  },
});

export default MaterialsContent;
