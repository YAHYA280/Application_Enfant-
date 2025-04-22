import type { Module, Exercise } from "@/data";
import type { RouteProp, NavigationProp } from "@react-navigation/native";

import React from "react";
import { moduleQuestions } from "@/data";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-virtualized-view";
import LessonSectionCard from "@/components/LessonSectionCard";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useTheme } from "../theme/ThemeProvider";
import { SIZES, icons, COLORS } from "../constants";

type RootStackParamList = {
  lessondetailsmore: { module: Module };
  exerciseview: {
    module: Module;
    exercise: Exercise;
  };
};

const LessonDetailsMore = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<{ params: { module: Module } }>>();
  const { module } = route.params;

  const { colors, dark } = useTheme();

  const handleExercisePress = (exercise: Exercise) => {
    // Get questions for the specific exercise
    const moduleQuestionsForSubject =
      moduleQuestions[module.name as keyof typeof moduleQuestions];

    // Check if module exists in moduleQuestions and if exercise exists in that module
    if (moduleQuestionsForSubject && moduleQuestionsForSubject[exercise.id]) {
      const exerciseQuestions = moduleQuestionsForSubject[exercise.id];

      if (exerciseQuestions && exerciseQuestions.length > 0) {
        // Navigate to the Exercise screen with the specific questions
        navigation.navigate("exerciseview", {
          module,
          exercise,
        });
        return;
      }
    }

    Alert.alert(
      "Aucune question disponible",
      `Aucune question trouvée pour ${exercise.title} in ${module.name}`
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar hidden />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.headerContainer}
      >
        <Image
          source={icons.back}
          resizeMode="contain"
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <Image
        source={module.image}
        resizeMode="cover"
        style={styles.lessonImage}
      />

      {/* lesson info */}
      <View style={styles.lessonInfoContainer}>
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.lessonName,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            {module.name}
          </Text>
        </View>
        {/* Reviews and rating container */}
        <View style={styles.ratingContainer}>
          <TouchableOpacity style={styles.categoryContainer}>
            <Text style={styles.categoryName}>{module.category}</Text>
          </TouchableOpacity>
        </View>

        {/* Description container */}
        <View style={styles.descriptionContainer}>
          <Text
            style={[
              styles.descriptionText,
              {
                color: dark ? COLORS.secondaryWhite : COLORS.grayscale700,
              },
            ]}
          >
            {module.description}
          </Text>
        </View>

        {/* lesson resume container */}
        <View style={styles.lessonResumeContainer}>
          <View style={styles.lessonViewContainer}>
            <Image
              source={icons.users}
              resizeMode="contain"
              style={styles.lessonViewIcon}
            />
            <Text
              style={[
                styles.lessonViewTitle,
                {
                  color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
                },
              ]}
            >
              {module.numberOfLessonsCompleted} / {module.totalNumberOfLessons}{" "}
              Exercices
            </Text>
          </View>
          <View style={styles.lessonViewContainer}>
            <Image
              source={icons.time}
              resizeMode="contain"
              style={styles.lessonViewIcon}
            />
            <Text
              style={[
                styles.lessonViewTitle,
                {
                  color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
                },
              ]}
            >
              {module.estimatedTime}
            </Text>
          </View>
          <View style={styles.lessonViewContainer}>
            <Image
              source={icons.document2}
              resizeMode="contain"
              style={styles.lessonViewIcon}
            />
            <Text
              style={[
                styles.lessonViewTitle,
                {
                  color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
                },
              ]}
            >
              Documents
            </Text>
          </View>
        </View>
        <View style={styles.separateLine} />

        {/* Exercises Section */}
        <View style={styles.exercisesContainer}>
          <Text
            style={[
              styles.exercisesTitle,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            Exercices
          </Text>
          {module.exercises.map((exercise) => (
            <LessonSectionCard
              key={exercise.id}
              num={exercise.num}
              title={exercise.title}
              duration={exercise.duration}
              isCompleted={exercise.isCompleted}
              progress={exercise.isCompleted ? 1 : 0.5}
              onPress={() => {
                handleExercisePress(exercise);
              }}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  lessonImage: {
    width: SIZES.width,
    height: SIZES.width * 0.625,
  },
  headerContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 999,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lessonName: {
    fontSize: 26,
    fontFamily: "bold",
    color: COLORS.black,
  },
  lessonInfoContainer: {
    padding: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  categoryContainer: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: COLORS.transparentTertiary,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.primary,
  },
  descriptionContainer: {
    marginVertical: 16,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: "regular",
    lineHeight: 24,
    color: COLORS.grayscale700,
  },
  lessonResumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  lessonViewContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lessonViewIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.primary,
  },
  lessonViewTitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.black,
    marginLeft: 6,
  },
  separateLine: {
    width: SIZES.width,
    height: 0.4,
    backgroundColor: COLORS.gray,
    marginTop: 16,
  },
  exercisesContainer: {
    marginTop: 16,
  },
  exercisesTitle: {
    fontSize: 20,
    fontFamily: "bold",
    marginBottom: 12,
  },
});

export default LessonDetailsMore;
