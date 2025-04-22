import type { RouteProp, NavigationProp } from "@react-navigation/native";

import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import questionviewsreenStyles from "@/styles/questionviewsreenStyle";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";

import type { Exercice, Challenge } from "../services/mock";

import { icons, COLORS } from "../constants";
import { useTheme } from "../theme/ThemeProvider";
import ExerciseComponent from "../components/QuestionComponent";
import { mockExercices, challengeExerciceMap } from "../services/mock";


type RootStackParamList = {
  exerciseview: {
    challenge: Challenge;
    exercice: Exercice;
  };
  challengedetailsmore: { 
    challenge: Challenge;
  };
  recompenseMessage: {
    challenge: Challenge;
    score: number;
    totalPossibleScore: number;
  };
};

interface ExerciseAnswer {
  exerciceId: number;
  userAnswer: string;
  isCorrect: boolean;
}

const ExerciseView = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "exerciseview">>();
  const { challenge, exercice: initialExercice } = route.params;
  const { colors, dark } = useTheme();

  const [currentExercice, setCurrentExercice] = useState<Exercice>(initialExercice);
  const [userAnswers, setUserAnswers] = useState<ExerciseAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);

  const exerciceIds = challengeExerciceMap[challenge.id] || [];
  const challengeExercices = mockExercices.filter(ex => exerciceIds.includes(ex.id));
  
  const currentExerciceIndex = challengeExercices.findIndex(ex => ex.id === currentExercice.id);
  
  const isLastExercice = currentExerciceIndex === challengeExercices.length - 1;

  const totalScore = userAnswers.reduce((total, answer) => {
    if (answer.isCorrect) {
      const exercice = challengeExercices.find(ex => ex.id === answer.exerciceId);
      return total + (exercice?.pointQuestion || 0);
    }
    return total;
  }, 0);
  
  const totalPossibleScore = challengeExercices.reduce((total, exercice) => {
    return total + exercice.pointQuestion;
  }, 0);

  const handleExerciseSubmit = (exerciceId: number, answer: string, isCorrect: boolean) => {
    const newAnswers = [...userAnswers, { exerciceId, userAnswer: answer, isCorrect }];
    setUserAnswers(newAnswers);
    
    setShowResults(true);
  };

  const handleNextExercice = (exerciceId: number, answer: string, isCorrect: boolean) => {
    const newAnswers = [...userAnswers, { exerciceId, userAnswer: answer, isCorrect }];
    setUserAnswers(newAnswers);
    
    const currentIndex = challengeExercices.findIndex(ex => ex.id === exerciceId);
    
    if (currentIndex < challengeExercices.length - 1) {
      setTimeout(() => {
        const nextExercice = challengeExercices[currentIndex + 1];
        setCurrentExercice(nextExercice);
      }, 100);
    }
  };

  const navigateToRecompenseMessage = () => {
    navigation.navigate("recompenseMessage", {
      challenge,
      score: totalScore,
      totalPossibleScore
    });
  };

  const renderResultItem = ({ item, index }: { item: ExerciseAnswer, index: number }) => {
    const exercice = challengeExercices.find(ex => ex.id === item.exerciceId);
    if (!exercice) return null;

    return (
      <View 
        style={[
          questionviewsreenStyles.resultItemContainer, 
          { backgroundColor: item.isCorrect ? "#EFF8FF" : "#FFF1F0" }
        ]}
      >
        <View style={questionviewsreenStyles.resultItemHeader}>
          <Text style={questionviewsreenStyles.resultItemTitle}>{exercice.titre}</Text>
          <Text 
            style={[
              questionviewsreenStyles.resultItemStatus, 
              { color: item.isCorrect ? "#FF9B71" : "#999999" }
            ]}
          >
            {item.isCorrect ? "Correct" : "Incorrect"}
          </Text>
        </View>
        
        {/* Display media if it exists */}
        {exercice.media && exercice.media !== "" ?(
          <View style={questionviewsreenStyles.mediaContainer}>
            <Image 
              source={typeof exercice.media === 'string' ? { uri: exercice.media } : exercice.media} 
              style={questionviewsreenStyles.mediaImage}
              resizeMode="contain"
            />
          </View>
        ):(
          <>
          </>
        )}
        
        <Text style={questionviewsreenStyles.resultItemQuestion}>Q: {exercice.contenu}</Text>
        <Text style={questionviewsreenStyles.resultItemAnswer}>
          Votre réponse: {item.userAnswer}
        </Text>
        
        {!item.isCorrect && (
          <Text style={questionviewsreenStyles.resultItemCorrectAnswer}>
            Réponse correcte: {exercice.reponseCorrecte}
          </Text>
        )}
      </View>
    );
  };

  const renderResults = () => (
    <View style={questionviewsreenStyles.resultsContainer}>
      <Text style={questionviewsreenStyles.resultsTitle}>Résultats</Text>
      <Text style={questionviewsreenStyles.scoreText}>Vous avez obtenu {totalScore} points!</Text>
      
      <View style={questionviewsreenStyles.resultsStats}>
        <View style={questionviewsreenStyles.statsItem}>
          <Text style={questionviewsreenStyles.statsNumber}>
            {userAnswers.filter(a => a.isCorrect).length}
          </Text>
          <Text style={questionviewsreenStyles.statsLabel}>Correctes</Text>
        </View>
        <View style={questionviewsreenStyles.statsItem}>
          <Text style={questionviewsreenStyles.statsNumber}>
            {userAnswers.filter(a => !a.isCorrect).length}
          </Text>
          <Text style={questionviewsreenStyles.statsLabel}>Incorrectes</Text>
        </View>
      </View>
      
      <Text style={questionviewsreenStyles.resultsSectionTitle}>Vos réponses:</Text>
      
      <FlatList
        data={userAnswers}
        renderItem={renderResultItem}
        keyExtractor={(item) => item.exerciceId.toString()}
        contentContainerStyle={questionviewsreenStyles.resultsList}
      />
      
      <TouchableOpacity 
        style={questionviewsreenStyles.doneButton}
        onPress={navigateToRecompenseMessage}
      >
        <Text style={questionviewsreenStyles.doneButtonText}>Terminé</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[questionviewsreenStyles.container, { backgroundColor: colors.background }]}>
      <View style={questionviewsreenStyles.header}>
        <TouchableOpacity 
          style={questionviewsreenStyles.backButton}
          onPress={() => navigation.navigate("challengedetailsmore", { challenge })}
        >
          <Image
            source={icons.back}
            resizeMode="contain"
            style={[questionviewsreenStyles.backIcon, { tintColor: dark ? COLORS.white : COLORS.greyscale900 }]}
          />
        </TouchableOpacity>
        <Text style={[questionviewsreenStyles.headerTitle, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
          {challenge.nom} - Question
        </Text>
      </View>
      
      <View style={questionviewsreenStyles.exerciseContainer}>
        {showResults ? (
          renderResults()
        ) : (
          <>
            <Text style={[questionviewsreenStyles.exerciseTitle, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
              {currentExercice.titre}
            </Text>
            
            <ExerciseComponent 
              exercice={currentExercice}
              isLastExercice={isLastExercice}
              onSubmit={handleExerciseSubmit}
              onNext={handleNextExercice}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ExerciseView;