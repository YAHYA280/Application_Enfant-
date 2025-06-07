import type { RouteProp, NavigationProp } from "@react-navigation/native";

import React from "react";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Alert,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import type { Module, Exercise } from "@/data";

import { moduleQuestions } from "@/data";
import LessonSectionCard from "@/components/LessonSectionCard";
import CourseProgressCircleBar from "@/components/CourseProgressCircleBar";

import { SIZES, COLORS } from "../constants";
import { useTheme } from "../theme/ThemeProvider";

type RootStackParamList = {
  lessondetailsmore: { module: Module };
  exerciseview: {
    module: Module;
    exercise: Exercise;
  };
  reviewlesson: {
    module: Module;
  };
};

Dimensions.get("window");

const LessonDetailsMore = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<{ params: { module: Module } }>>();
  const { module } = route.params;
  const { colors } = useTheme();

  // Animation values for scroll effects
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [1.2, 1, 0.8],
    extrapolate: "clamp",
  });

  // Calculate completion percentage
  const completionPercentage = Math.round(
    (module.numberOfLessonsCompleted / module.totalNumberOfLessons) * 100
  );

  const handleExercisePress = (exercise: Exercise) => {
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="dark" />

      {/* Animated Header Background */}
      <Animated.View
        style={[
          styles.headerBackground,
          {
            opacity: headerOpacity,
            backgroundColor: COLORS.white,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonFixed}
        >
          <Feather name="arrow-left" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.black }]}>
          {module.name}
        </Text>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section with Image */}
        <View style={styles.heroContainer}>
          <Animated.Image
            source={module.image}
            style={[styles.lessonImage, { transform: [{ scale: imageScale }] }]}
            resizeMode="cover"
          />

          <LinearGradient
            colors={[
              "rgba(255,255,255,0)",
              "rgba(255,255,255,0.8)",
              colors.background,
            ]}
            style={styles.imageOverlay}
          />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <View style={styles.backButtonInner}>
              <Feather name="arrow-left" size={24} color={COLORS.white} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Module Info Card */}
          <View
            style={[styles.moduleInfoCard, { backgroundColor: COLORS.white }]}
          >
            <LinearGradient
              colors={[
                "rgba(255,142,105,0.3)",
                "rgba(255,255,255,0)",
                "rgba(255,255,255,0)",
                "rgba(255,142,105,0.3)",
              ]}
              locations={[0, 0.3, 0.7, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradientBackground}
            />

            <View style={styles.moduleInfoHeader}>
              <View style={styles.titleContainer}>
                <Text
                  style={[styles.moduleName, { color: COLORS.greyscale900 }]}
                >
                  {module.name}
                </Text>

                <View style={styles.categoryContainer}>
                  <LinearGradient
                    colors={["#ff6040", "#ff8e69"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.categoryGradient}
                  >
                    <Text style={styles.categoryName}>{module.category}</Text>
                  </LinearGradient>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <CourseProgressCircleBar
                  numberOfCourseCompleted={module.numberOfLessonsCompleted}
                  totalNumberOfCourses={module.totalNumberOfLessons}
                />
              </View>
            </View>

            <Text
              style={[styles.descriptionText, { color: COLORS.grayscale700 }]}
            >
              {module.description}
            </Text>

            {/* Module stats - Reorganized to show one under another */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Feather name="book-open" size={18} color={COLORS.primary} />
                </View>
                <Text
                  style={[
                    styles.statText,
                    {
                      color: COLORS.greyscale900,
                    },
                  ]}
                >
                  {module.numberOfLessonsCompleted} /{" "}
                  {module.totalNumberOfLessons} Exercices
                </Text>
              </View>

              <View style={[styles.statItem, styles.statItemMiddle]}>
                <View style={styles.statIconContainer}>
                  <Feather name="clock" size={18} color={COLORS.primary} />
                </View>
                <Text
                  style={[
                    styles.statText,
                    {
                      color: COLORS.greyscale900,
                    },
                  ]}
                >
                  {module.estimatedTime}
                </Text>
              </View>

              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Feather name="file-text" size={18} color={COLORS.primary} />
                </View>
                <Text
                  style={[
                    styles.statText,
                    {
                      color: COLORS.greyscale900,
                    },
                  ]}
                >
                  Documents
                </Text>
              </View>
            </View>

            {/* Review Button */}
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => navigation.navigate("reviewlesson", { module })}
            >
              <LinearGradient
                colors={["#ff6040", "#ff8e69"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.reviewButtonGradient}
              >
                <Feather
                  name="play-circle"
                  size={18}
                  color={COLORS.white}
                  style={styles.reviewButtonIcon}
                />
                <Text style={styles.reviewButtonText}>Voir le cours</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Exercises Section */}
          <View style={styles.exercisesSection}>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.sectionTitle, { color: COLORS.greyscale900 }]}
              >
                Exercices
              </Text>

              <View style={styles.exerciseCountContainer}>
                <Text style={styles.exerciseCountText}>
                  {module.numberOfLessonsCompleted}/
                  {module.totalNumberOfLessons}
                </Text>
              </View>
            </View>

            <View style={styles.exercisesList}>
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
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "bold",
    marginLeft: 32,
  },
  backButtonFixed: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  heroContainer: {
    position: "relative",
    height: SIZES.width * 0.75,
    width: "100%",
  },
  lessonImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 30,
    zIndex: 10,
  },
  backButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 10,
  },
  moduleInfoCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: "hidden",
    position: "relative",
  },
  cardGradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  moduleInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  moduleName: {
    fontSize: 26,
    fontFamily: "bold",
    marginBottom: 12,
  },
  categoryContainer: {
    alignSelf: "flex-start",
    borderRadius: 12,
    overflow: "hidden",
  },
  categoryGradient: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  categoryName: {
    fontSize: 13,
    fontFamily: "semiBold",
    color: COLORS.white,
  },
  progressContainer: {
    alignItems: "center",
  },

  descriptionText: {
    fontSize: 16,
    fontFamily: "regular",
    lineHeight: 24,
    marginBottom: 24,
  },
  statsContainer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    marginBottom: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  statItemMiddle: {
    paddingVertical: 14,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 142, 105, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statText: {
    fontSize: 16,
    fontFamily: "medium",
  },
  reviewButton: {
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  reviewButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  reviewButtonIcon: {
    marginRight: 8,
  },
  reviewButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "semiBold",
  },
  exercisesSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "bold",
  },
  exerciseCountContainer: {
    backgroundColor: "rgba(255, 142, 105, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  exerciseCountText: {
    color: COLORS.primary,
    fontFamily: "semiBold",
    fontSize: 14,
  },
  exercisesList: {
    flex: 1,
    gap: 12,
  },
});

export default LessonDetailsMore;
