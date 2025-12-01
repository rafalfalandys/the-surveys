export type QuestionType = "single" | "multi" | "scale" | "open" | "date";

export type ValidationType = "flagRed" | "disableButtons";

export type SurveySettings = {
  description: string;
  questionsPerPage: number;
  validationType: ValidationType;
};

export type Question = {
  question: string;
  required: boolean;
  questionId: number;
};

export type QuestionRadio = Question & {
  type: "single";
  answers: Answer[];
  shuffleAnswers: boolean;
};

export type QuestionCheckbox = Question & {
  type: "multi";
  answers: Answer[];
  shuffleAnswers: boolean;
};

export type QuestionScale = Question & {
  type: "scale";
  length: number;
  legendLow: string;
  legendHigh: string;
};

export type QuestionOpen = Question & {
  type: "open";
  limit: number;
  uploadImg: boolean;
};

export type QuestionDate = Question & {
  type: "date";
  minDate: string;
  maxDate: string;
};

export type QuestionEmpty = Question & {
  type: "empty";
};

export type AnyQuestion =
  | QuestionCheckbox
  | QuestionRadio
  | QuestionScale
  | QuestionOpen
  | QuestionDate
  | QuestionEmpty;

export type Answer = { answer: string | number; options: AnswerOptions };

export type AnswerOptions = {
  isOpen: boolean;
  endsSurvey: boolean;
  limit: number;
};

export type ImgsConfig = string[];

export type AnswerIndex = {
  index: number;
  no: number;
};
