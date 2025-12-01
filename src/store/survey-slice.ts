import { createSlice } from "@reduxjs/toolkit";
import type { SurveySettings, ValidationType } from "../types";

const initialState: { settings: SurveySettings } = {
  settings: {
    description:
      "Hi, <br> Thanks for taking this survey. It's anonymous and its filling <strong>will not take longer than 1 minute.</strong>",
    questionsPerPage: 3,
    validationType: "disableButtons",
  },
};

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    setSurveySettings(state, action: { type: string; payload: SurveySettings }) {
      state.settings = action.payload;
    },
    setDescription(state, action: { type: string; payload: string }) {
      state.settings.description = action.payload;
    },
    setQuestionsPerPage(state, action: { type: string; payload: number }) {
      state.settings.questionsPerPage = action.payload;
    },
    setValidationType(state, action: { type: string; payload: ValidationType }) {
      state.settings.validationType = action.payload;
    },
  },
});

export const surveyActions = surveySlice.actions;

export default surveySlice.reducer;
