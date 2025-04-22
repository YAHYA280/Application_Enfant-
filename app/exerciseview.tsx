import type { RouteProp, NavigationProp } from "@react-navigation/native";

import React from "react";
import { useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { icons, SIZES, COLORS } from "@/constants";
import { ScrollView } from "react-native-virtualized-view";
import { useRoute, useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExerciseComponent from "@/components/ExerciceComponent";
import { type Module, type Exercise, moduleQuestions } from "@/data";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const ExerciseView = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { colors, dark } = useTheme();
  const route = useRoute<
    RouteProp<{
      params: {
        module: Module;
        exercise: Exercise;
      };
    }>
  >();
  const { module, exercise } = route.params;
  const exerciseQuestions = moduleQuestions[module.name][exercise.id] || [];

  const handleSubmit = (results: boolean[]) => {
    navigation.reset({
      index: 1,
      routes: [
        {
          name: "home",
          params: {},
        },
        {
          name: "learning",
          params: {},
        },
        {
          name: "lessondetailsmore",
          params: { module },
        },
      ],
    });
  };

  /**
   * Render header
   */
  const renderHeader = () => {
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
            {module.name} - Exercice
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <StatusBar hidden={false} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1 }}>
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {exercise.title}
              </Text>
              <Text style={{ marginTop: 8, color: "gray" }}>{module.name}</Text>
            </View>

            <ExerciseComponent
              exercice={exercise}
              questions={exerciseQuestions}
              module={module}
              onSubmit={handleSubmit}
            />
          </View>
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
});

export default ExerciseView;
