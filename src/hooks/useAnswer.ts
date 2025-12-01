import { useDispatch, useSelector } from "react-redux";
import { questionsActions } from "../store/question-slice";
import { type RootState } from "../store";
import { type QuestionCheckbox, type QuestionRadio } from "../types";

const useAnswer = (questionIndex: number, answerIndex: number) => {
  const dispatch = useDispatch();
  const answerData = useSelector(
    (state: RootState) => state.questions.questions[questionIndex] as QuestionRadio | QuestionCheckbox
  ).answers[answerIndex];

  const textHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    dispatch(questionsActions.setAnswerText({ questionIndex, answerIndex, value }));
  };

  const isOpenHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { checked } = e.target;
    dispatch(
      questionsActions.setAnswerOptions({
        questionIndex,
        answerIndex,
        optionsData: { isOpen: checked },
      })
    );
  };

  const endsSurveyHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { checked } = e.target;
    dispatch(
      questionsActions.setAnswerOptions({
        questionIndex,
        answerIndex,
        optionsData: { endsSurvey: checked },
      })
    );
  };

  const removeAnswerHandler = () => {
    dispatch(questionsActions.removeAnswer({ questionIndex, answerIndex }));
  };

  const changeOrderHandler = (newAnswerIndex: number) => {
    dispatch(questionsActions.setAnswerOrder({ questionIndex, answerIndex, newAnswerIndex }));
  };

  const limitHandler = (e: React.ChangeEvent) => {
    const { value } = e.target as HTMLInputElement;
    dispatch(questionsActions.setAnswerOptions({ questionIndex, answerIndex, optionsData: { limit: +value } }));
  };

  return {
    answerData,
    textHandler,
    isOpenHandler,
    endsSurveyHandler,
    removeAnswerHandler,
    limitHandler,
    changeOrderHandler,
  };
};

export default useAnswer;
