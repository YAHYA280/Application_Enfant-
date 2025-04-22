import type { RouteProp, NavigationProp } from "@react-navigation/native";

import React from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-virtualized-view";
import { useRoute, useNavigation } from "@react-navigation/native";
import challengeDetailsMoreStyles from "@/styles/challengeDetailsMoreStyle";
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";

import type { Exercice, Challenge} from "../services/mock";

import { icons, COLORS } from "../constants";
import { useTheme } from "../theme/ThemeProvider";
import Challengesectioncard from "./challengesectioncard";
import { mockExercices, challengeExerciceMap } from "../services/mock";

type RootStackParamList = {
  challengedetailsmore: { challenge: Challenge };
  questionviewsreen: {
    challenge: Challenge;
    exercice: Exercice;
  };
};

const Challengedetailsmore = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<{ params: { challenge: Challenge } }>>();
  const { challenge } = route.params;

  const { colors, dark } = useTheme();
  
  const exerciceIds = challengeExerciceMap[challenge.id] || [];
  const exercises = mockExercices.filter(ex => exerciceIds.includes(ex.id));
  
  const completedExercisesCount = Math.floor(challenge.pourcentageReussite / 100 * exercises.length);

  const handleExercisePress = (exercice: Exercice) => {
    if (exercice && challenge.accessible) {
      navigation.navigate("questionviewsreen", {
        challenge,
        exercice,
      });
    } else {
      Alert.alert(
        "Exercice non disponible",
        `Cet exercice n'est pas disponible pour le moment.`
      );
    }
  };

  return (
    <ScrollView
      style={[challengeDetailsMoreStyles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar hidden />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={challengeDetailsMoreStyles.headerContainer}
      >
        <Image
          source={icons.back}
          resizeMode="contain"
          style={challengeDetailsMoreStyles.backIcon}
        />
      </TouchableOpacity>
      <Image
        source={challenge.media}
        resizeMode="cover"
        style={challengeDetailsMoreStyles.lessonImage}
      />

      <View style={challengeDetailsMoreStyles.lessonInfoContainer}>
        <View style={challengeDetailsMoreStyles.titleContainer}>
          <Text
            style={[
              challengeDetailsMoreStyles.lessonName,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            {challenge.nom}
          </Text>
        </View>
        <View style={challengeDetailsMoreStyles.ratingContainer}>
          <TouchableOpacity style={challengeDetailsMoreStyles.categoryContainer}>
            <Text style={challengeDetailsMoreStyles.categoryName}>{challenge.difficulte}</Text>
          </TouchableOpacity>
        </View>

        <View style={challengeDetailsMoreStyles.descriptionContainer}>
          <Text
            style={[
              challengeDetailsMoreStyles.descriptionText,
              {
                color: dark ? COLORS.secondaryWhite : COLORS.grayscale700,
              },
            ]}
          >
            {challenge.description}
          </Text>
        </View>

        <View style={challengeDetailsMoreStyles.lessonResumeContainer}>
          <View style={challengeDetailsMoreStyles.lessonViewContainer}>
            <Image
              source={icons.users}
              resizeMode="contain"
              style={challengeDetailsMoreStyles.lessonViewIcon}
            />
            <Text
              style={[
                challengeDetailsMoreStyles.lessonViewTitle,
                {
                  color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
                },
              ]}
            >
              {completedExercisesCount} / {exercises.length} Questions
            </Text>
          </View>
          <View style={challengeDetailsMoreStyles.lessonViewContainer}>
            <Image
              source={icons.time}
              resizeMode="contain"
              style={challengeDetailsMoreStyles.lessonViewIcon}
            />
            <Text
              style={[
                challengeDetailsMoreStyles.lessonViewTitle,
                {
                  color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
                },
              ]}
            >
              {challenge.duree} min
            </Text>
          </View>
        </View>
        <View style={challengeDetailsMoreStyles.separateLine} />

        <View style={challengeDetailsMoreStyles.exercisesContainer}>
          <Text
            style={[
              challengeDetailsMoreStyles.exercisesTitle,
              {
                color: dark ? COLORS.white : COLORS.greyscale900,
              },
            ]}
          >
            Questions
          </Text>
          {exercises.map((exercice, index) => {
            const isCompleted = index < completedExercisesCount;
            
            return (
              <Challengesectioncard
                key={exercice.id}
                exercice={exercice}
                isCompleted={isCompleted}
                onPress={() => handleExercisePress(exercice)}
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default Challengedetailsmore;