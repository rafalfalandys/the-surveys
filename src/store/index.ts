import { configureStore } from "@reduxjs/toolkit";
import questionsReducer from "./question-slice";
import surveyReducer from "./survey-slice";

const store = configureStore({
  reducer: { questions: questionsReducer, survey: surveyReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
