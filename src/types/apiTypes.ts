import type { AnyQuestion, SurveySettings } from "./surveyTypes";

export type SurveyList = {
  _id: string;
  id: string;
  title: string;
  questionsCount: number;
  createdAt: string;
  updatedAt: string;
};

export interface SurveysListResponse {
  data: {
    surveys: SurveyList[];
  };
}

export interface SurveyResponse {
  data: {
    survey: {
      _id: string;
      title: string;
      settings: SurveySettings;
      questions: AnyQuestion[];
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface CreateSurveyPayload {
  title: string;
  settings: {
    description: string;
    questionsPerPage: number;
    validationType: "disableButtons" | "flagRed";
    allowBackNavigation?: boolean;
  };
  questions: AnyQuestion[];
}
