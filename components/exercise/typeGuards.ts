import type { Question } from "@/data";

interface MultipleChoiceQuestion extends Question {
  type: "multipleChoice";
  options: { id: string; text: string }[];
  correctAnswer: string;
}

interface TrueOrFalseQuestion extends Question {
  type: "trueOrFalse";
  correctAnswer: boolean;
}

interface FillInBlankQuestion extends Question {
  type: "fillInBlank";
  correctAnswer: string;
}

interface ShortAnswerQuestion extends Question {
  type: "shortAnswer";
  expectedKeywords: string[];
}

interface SpeakingQuestion extends Question {
  type: "speaking";
  guidanceText: string;
}

export const typeGuards = {
  isMultipleChoiceQuestion(
    question: Question
  ): question is MultipleChoiceQuestion {
    return question.type === "multipleChoice";
  },

  isTrueOrFalseQuestion(question: Question): question is TrueOrFalseQuestion {
    return question.type === "trueOrFalse";
  },

  isFillInBlankQuestion(question: Question): question is FillInBlankQuestion {
    return question.type === "fillInBlank";
  },

  isShortAnswerQuestion(question: Question): question is ShortAnswerQuestion {
    return question.type === "shortAnswer";
  },

  isSpeakingQuestion(question: Question): question is SpeakingQuestion {
    return question.type === "speaking";
  },
};

export type {
  MultipleChoiceQuestion,
  TrueOrFalseQuestion,
  FillInBlankQuestion,
  ShortAnswerQuestion,
  SpeakingQuestion,
};
