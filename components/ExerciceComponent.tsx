import type { Module, Question, Exercise } from "@/data";

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";

import SummaryModal from "./exercise/SummaryModal";
import { typeGuards } from "./exercise/typeGuards";
import ActionButtons from "./exercise/ActionButtons";
import SpeakingQuestion from "./exercise/SpeakingQuestion";
import AiAssistantModal from "./exercise/AiAssistantModal";
import TrueOrFalseQuestion from "./exercise/TrueOrFalseQuestion";
import FillInBlankQuestion from "./exercise/FillInBlankQuestion";
import ShortAnswerQuestion from "./exercise/ShortAnswerQuestion";
import MultipleChoiceQuestion from "./exercise/MultipleChoiceQuestion";

interface EnhancedExerciseComponentProps {
  exercice: Exercise;
  module: Module;
  questions: Question[];
  currentQuestionIndex: number;
  onSubmit: (results: boolean[]) => void;
  onNext: () => void;
  answers: Array<any>;
  setAnswers: React.Dispatch<React.SetStateAction<Array<any>>>;
}

const EnhancedExerciseComponent: React.FC<EnhancedExerciseComponentProps> = ({
  exercice,
  module,
  questions,
  currentQuestionIndex,
  onSubmit,
  onNext,
  answers,
  setAnswers,
}) => {
  const navigation = useNavigation();
  const { dark } = useTheme();
  const currentQuestion = questions[currentQuestionIndex];
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const updateAnswer = (answer: any) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);

    // Check if answer is correct
    if (typeGuards.isMultipleChoiceQuestion(currentQuestion)) {
      setIsAnswerCorrect(currentQuestion.correctAnswer === answer);
    } else if (typeGuards.isTrueOrFalseQuestion(currentQuestion)) {
      setIsAnswerCorrect(currentQuestion.correctAnswer === answer);
    } else if (typeGuards.isFillInBlankQuestion(currentQuestion)) {
      setIsAnswerCorrect(
        currentQuestion.correctAnswer.toLowerCase() === answer.toLowerCase()
      );
    } else {
      // For short answer and speaking, we can't automatically determine correctness
      setIsAnswerCorrect(null);
    }
  };

  const handleRevise = () => {
    navigation.navigate("ReviewLesson", { module });
  };

  // Render the appropriate question type
  const renderQuestion = () => {
    if (!currentQuestion) return null;

    if (typeGuards.isMultipleChoiceQuestion(currentQuestion)) {
      return (
        <MultipleChoiceQuestion
          question={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          updateAnswer={updateAnswer}
          isAnswerCorrect={isAnswerCorrect}
          dark={dark}
        />
      );
    }

    if (typeGuards.isTrueOrFalseQuestion(currentQuestion)) {
      return (
        <TrueOrFalseQuestion
          question={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          updateAnswer={updateAnswer}
          isAnswerCorrect={isAnswerCorrect}
          dark={dark}
        />
      );
    }

    if (typeGuards.isFillInBlankQuestion(currentQuestion)) {
      return (
        <FillInBlankQuestion
          question={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          updateAnswer={updateAnswer}
          isAnswerCorrect={isAnswerCorrect}
          dark={dark}
        />
      );
    }

    if (typeGuards.isShortAnswerQuestion(currentQuestion)) {
      return (
        <ShortAnswerQuestion
          question={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          updateAnswer={updateAnswer}
          dark={dark}
        />
      );
    }

    if (typeGuards.isSpeakingQuestion(currentQuestion)) {
      return <SpeakingQuestion question={currentQuestion} dark={dark} />;
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Action Buttons - updated to include Reviser button */}
      <ActionButtons
        onOpenAiModal={() => setShowAiModal(true)}
        onOpenSummaryModal={() => setShowSummaryModal(true)}
        onRevise={handleRevise}
      />

      {/* Question Content */}
      {renderQuestion()}

      {/* AI Assistant Modal */}
      <AiAssistantModal
        visible={showAiModal}
        onClose={() => setShowAiModal(false)}
        currentQuestion={currentQuestion}
        dark={dark}
      />

      {/* Summary Modal */}
      <SummaryModal
        visible={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        questions={questions}
        answers={answers}
        dark={dark}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
});

export default EnhancedExerciseComponent;
