import { getEmptyQuestion } from "./helper";
import {
  type Answer,
  type QuestionCheckbox,
  type QuestionDate,
  type QuestionOpen,
  type QuestionRadio,
  type QuestionScale,
} from "./types";

export const DEFAULT_CHARS_LIMIT = 20;
export const DEFAULT_SCALE_LENGTH = 5;
export const DEFAULT_MIN_SCALE = "Worst";
export const DEFAULT_MAX_SCALE = "Best";
export const DEFAULT_REQUIRED = true;
export const DEFAULT_MAX_DATE = "";
export const DEFAULT_MIN_DATE = "";
export const DEFAULT_ENDS_SURVEY = false;
export const DEFAULT_SHUFFLE_ANSWERS = false;
export const DEFAULT_UPLOAD_IMG = false;

export const EMPTY_ANSWER: Answer = {
  answer: "",
  options: {
    isOpen: false,
    limit: DEFAULT_CHARS_LIMIT,
    endsSurvey: DEFAULT_ENDS_SURVEY,
  },
};

export const DEFAULT_DATE: QuestionDate = {
  ...getEmptyQuestion(),
  type: "date",
  maxDate: "",
  minDate: "",
};

export const DEFAULT_OPEN: QuestionOpen = {
  ...getEmptyQuestion(),
  type: "open",
  limit: DEFAULT_CHARS_LIMIT,
  uploadImg: DEFAULT_UPLOAD_IMG,
};

export const DEFAULT_SCALE: QuestionScale = {
  ...getEmptyQuestion(),
  type: "scale",
  legendLow: DEFAULT_MIN_SCALE,
  legendHigh: DEFAULT_MAX_SCALE,
  length: DEFAULT_SCALE_LENGTH,
};

export const DEFAULT_MULTI: QuestionCheckbox = {
  ...getEmptyQuestion(),
  type: "multi",
  answers: [EMPTY_ANSWER, EMPTY_ANSWER],
  shuffleAnswers: DEFAULT_SHUFFLE_ANSWERS,
};

export const DEFAULT_SINGLE: QuestionRadio = {
  ...getEmptyQuestion(),
  type: "single",
  answers: [EMPTY_ANSWER, EMPTY_ANSWER],
  shuffleAnswers: DEFAULT_SHUFFLE_ANSWERS,
};
