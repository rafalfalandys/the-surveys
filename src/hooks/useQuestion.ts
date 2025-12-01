import { useDispatch, useSelector } from "react-redux";
import { questionsActions } from "../store/question-slice";
import { type SelectValue } from "antd/lib/select";
import { type RootState } from "../store";
import { type QuestionType } from "../types";

const useQuestion = (questionIndex: number) => {
  const dispatch = useDispatch();
  const questionData = useSelector((state: RootState) => state.questions.questions)[questionIndex];

  const questionTextHandler: React.ChangeEventHandler = (e) => {
    const { value } = e.target as HTMLInputElement;
    dispatch(questionsActions.setQuestionData({ questionIndex, questionData: { question: value } }));
  };

  const changeRequiredHandler: React.ChangeEventHandler = (e) => {
    const { checked } = e.target as HTMLInputElement;
    dispatch(questionsActions.setQuestionData({ questionIndex, questionData: { required: checked } }));
  };

  const changeTypeHandler = (value: SelectValue) => {
    dispatch(
      questionsActions.setQuestionData({
        questionIndex,
        questionData: { type: value as QuestionType },
      })
    );
  };

  const removeQuestionHandler = (questionId: number) => {
    dispatch(questionsActions.removeQuestion(questionId));
  };

  const changeLimitHandler: React.ChangeEventHandler = (e) => {
    const { value } = e.target as HTMLInputElement;
    dispatch(questionsActions.setQuestionData({ questionIndex, questionData: { limit: +value } }));
  };

  const changeUploadImgHandler: React.ChangeEventHandler = (e) => {
    const { checked } = e.target as HTMLInputElement;
    dispatch(questionsActions.setQuestionData({ questionIndex, questionData: { uploadImg: checked } }));
  };

  const legendMinHandler: React.ChangeEventHandler = (e) => {
    const { value } = e.target as HTMLInputElement;
    dispatch(questionsActions.setMinLegend({ questionIndex, value }));
  };

  const legendMaxHandler: React.ChangeEventHandler = (e) => {
    const { value } = e.target as HTMLInputElement;
    dispatch(questionsActions.setMaxLegend({ questionIndex, value }));
  };

  const changeLengthHandler: React.ChangeEventHandler = (e) => {
    const { value } = e.target as HTMLInputElement;
    dispatch(questionsActions.setQuestionData({ questionIndex, questionData: { length: +value } }));
  };

  const addAnswerHandler = () => {
    dispatch(questionsActions.addAnswer({ questionIndex }));
  };

  const shuffleAnswersHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { checked } = e.target;
    dispatch(questionsActions.setQuestionData({ questionIndex, questionData: { shuffleAnswers: checked } }));
  };

  const moveQuestionHandler = (newQuestionIndex: number) => {
    dispatch(questionsActions.setQuestionOrder({ questionIndex, newQuestionIndex }));
  };

  return {
    questionData,
    questionTextHandler,
    changeRequiredHandler,
    changeTypeHandler,
    removeQuestionHandler,
    changeLimitHandler,
    changeUploadImgHandler,
    legendMinHandler,
    legendMaxHandler,
    changeLengthHandler,
    addAnswerHandler,
    shuffleAnswersHandler,
    moveQuestionHandler,
  };
};

export default useQuestion;
