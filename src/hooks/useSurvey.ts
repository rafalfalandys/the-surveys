import { useDispatch, useSelector } from "react-redux";
import { questionsActions } from "../store/question-slice";
import { surveyActions } from "../store/survey-slice";
import { type RootState } from "../store";
import { type AnyQuestion, type SurveySettings, type ValidationType } from "../types";

const useSurvey = () => {
  const dispatch = useDispatch();
  const questionsData = useSelector((state: RootState) => state.questions.questions);
  const surveySettings = useSelector((state: RootState) => state.survey);

  const setQuestionsData = (questionsData: AnyQuestion[]) => {
    try {
      dispatch(questionsActions.setQuestions([]));
      questionsData.forEach((el, i) => {
        dispatch(questionsActions.setQuestionData({ questionIndex: i, questionData: el }));
      });
    } catch (error) {
      console.error("Invalid questionsData.", error);
    }
  };

  const setSurveySettings = (data: SurveySettings) => {
    dispatch(surveyActions.setSurveySettings(data));
  };

  const descriptionHandler: React.ChangeEventHandler = (e) => {
    const { value } = e.target as HTMLInputElement;
    dispatch(surveyActions.setDescription(value));
  };
  const questionsPerPageHandler: React.ChangeEventHandler = (e) => {
    const { value } = e.target as HTMLInputElement;
    dispatch(surveyActions.setQuestionsPerPage(+value));
  };
  const validationTypeHandler = (value: ValidationType) => {
    dispatch(surveyActions.setValidationType(value));
  };

  const setSurveyDescription = (description: string) => {
    try {
      dispatch(surveyActions.setDescription(description));
    } catch (error) {
      console.error("Invalid questionsData.", error);
    }
  };

  return {
    surveySettings,
    questionsData,
    setSurveySettings,
    setSurveyDescription,
    descriptionHandler,
    setQuestionsData,
    questionsPerPageHandler,
    validationTypeHandler,
  };
};

export default useSurvey;
