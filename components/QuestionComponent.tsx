import React, { useState, useEffect } from "react";
import questionComponentStyles from "@/styles/questionComponentStyle";
import {
  View,
  Text,
  Alert,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import type { Exercice } from "../services/mock";

import { TypeExercice } from "../services/mock";

Dimensions.get('window');

interface ExerciseProps {
  exercice: Exercice;
  isLastExercice: boolean;
  onSubmit: (exerciceId: number, answer: string, isCorrect: boolean) => void;
  onNext: (exerciceId: number, answer: string, isCorrect: boolean) => void;
}

const QuestionComponent: React.FC<ExerciseProps> = ({
  exercice,
  isLastExercice,
  onSubmit,
  onNext,
}) => {
  const [userAnswer, setUserAnswer] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    setUserAnswer(undefined);
  }, [exercice.id]);

  const renderMultipleChoice = () => (
    <View style={questionComponentStyles.questionContainer}>
      <Text style={questionComponentStyles.questionText}>{exercice.contenu}</Text>
      {exercice.choix.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            questionComponentStyles.optionButton,
            userAnswer === option && questionComponentStyles.selectedOption,
          ]}
          onPress={() => {
            setUserAnswer(option);
          }}
        >
          <Text style={questionComponentStyles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOpenQuestion = () => (
    <View style={questionComponentStyles.questionContainer}>
      <Text style={questionComponentStyles.questionText}>{exercice.contenu}</Text>
      <TextInput
        style={questionComponentStyles.textInput}
        placeholder="Tapez votre réponse ici"
        value={userAnswer}
        onChangeText={(text) => {
          setUserAnswer(text);
        }}
      />
    </View>
  );

  const handleSubmit = () => {
    if (!userAnswer) {
      Alert.alert("Réponse manquante", "Veuillez répondre à la question avant de soumettre.");
      return;
    }
    
    const isAnswerCorrect = userAnswer.toLowerCase() === exercice.reponseCorrecte.toLowerCase();
    
    onSubmit(exercice.id, userAnswer, isAnswerCorrect);
  };

  const handleNext = () => {
    if (!userAnswer) {
      Alert.alert("Réponse manquante", "Veuillez répondre à la question avant de continuer.");
      return;
    }
    
    const isAnswerCorrect = userAnswer.toLowerCase() === exercice.reponseCorrecte.toLowerCase();
    
    onNext(exercice.id, userAnswer, isAnswerCorrect);
  };

  return (
    <ScrollView style={questionComponentStyles.container}>
      {exercice.media && exercice.media !== "" ? (
        <View style={questionComponentStyles.mediaContainer}>
          <Image 
            source={typeof exercice.media === 'string' ? { uri: exercice.media } : exercice.media} 
            style={questionComponentStyles.mediaImage}
            resizeMode="contain"
          />
        </View>
      ) : (
        <>
        </>
      )}
      
      {exercice.typeExercice === TypeExercice.QCM 
        ? renderMultipleChoice() 
        : renderOpenQuestion()}
      
      <TouchableOpacity 
        style={questionComponentStyles.submitButton} 
        onPress={isLastExercice ? handleSubmit : handleNext}
      >
        <Text style={questionComponentStyles.submitButtonText}>
          {isLastExercice ? "Soumettre" : "Suivant"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default QuestionComponent;