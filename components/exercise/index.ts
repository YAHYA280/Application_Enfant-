export { typeGuards } from "./typeGuards";
export { default as SummaryModal } from "./SummaryModal";
// Export all exercise components
export { default as ActionButtons } from "./ActionButtons";
export { default as QuestionHeader } from "./QuestionHeader";
export { default as SpeakingQuestion } from "./SpeakingQuestion";
export { default as AiAssistantModal } from "./AiAssistantModal";
export { default as TrueOrFalseQuestion } from "./TrueOrFalseQuestion";
export { default as FillInBlankQuestion } from "./FillInBlankQuestion";
export { default as ShortAnswerQuestion } from "./ShortAnswerQuestion";
export { default as MultipleChoiceQuestion } from "./MultipleChoiceQuestion";

// Re-export types
export type {
  SpeakingQuestion as SpeakingQuestionType,
  TrueOrFalseQuestion as TrueOrFalseQuestionType,
  FillInBlankQuestion as FillInBlankQuestionType,
  ShortAnswerQuestion as ShortAnswerQuestionType,
  MultipleChoiceQuestion as MultipleChoiceQuestionType,
} from "./typeGuards";
