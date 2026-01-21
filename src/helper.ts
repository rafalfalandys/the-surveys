import { DEFAULT_REQUIRED } from "./config";
import { type QuestionEmpty } from "./types/surveyTypes";

export const getEmptyQuestion: () => QuestionEmpty = () => {
  return {
    question: "Write you question.",
    required: DEFAULT_REQUIRED,
    type: "empty",
    questionId: Math.random(),
  };
};

export const closeSurvey = () => {
  const surveyContainer = document.querySelector(".survey__main-wrapper");
  if (surveyContainer) {
    surveyContainer.classList.add("survey__hidden");
    surveyContainer.innerHTML = "";
  }
};

export const addCLoseSurveyHandler = () => {
  const surveyContainer = document.querySelector(".survey__main-wrapper");
  const surveyContent = document.querySelector(".survey__content");

  if (surveyContainer) {
    surveyContainer.addEventListener("click", closeSurvey);
    surveyContent?.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
};
