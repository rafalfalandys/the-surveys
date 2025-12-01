import { useState } from "react";
import { useDispatch } from "react-redux";
import { questionsActions } from "../store/question-slice";
import { DEFAULT_MIN_DATE } from "../config";

const useDate = (questionIndex: number) => {
  const [isMinLimit, setIsMinLimit] = useState(false);
  const [isMaxLimit, setIsMaxLimit] = useState(false);
  const [isDateMinVisible, setIsDateMinVisible] = useState(true);
  const [isDateMaxVisible, setIsDateMaxVisible] = useState(true);

  const dispatch = useDispatch();

  const showMinLimitHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { checked } = e.target;
    if (checked) {
      setIsMinLimit(true);
    } else {
      setIsMinLimit(false);
      dispatch(
        questionsActions.setQuestionData({
          questionIndex,
          questionData: { minDate: DEFAULT_MIN_DATE },
        })
      );
    }
  };

  const showMaxLimitHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { checked } = e.target;
    if (checked) {
      setIsMaxLimit(true);
    } else {
      setIsMaxLimit(false);
      dispatch(
        questionsActions.setQuestionData({
          questionIndex,
          questionData: { minDate: DEFAULT_MIN_DATE },
        })
      );
    }
  };

  const changeDateHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { type } = e.target.dataset;
    const { value, checked } = e.target;

    if (type === "minDate") {
      dispatch(questionsActions.setQuestionData({ questionIndex, questionData: { minDate: value } }));
    }
    if (type === "minDateToday") {
      setIsDateMinVisible(!checked);
      if (checked) dispatch(questionsActions.setQuestionData({ questionIndex, questionData: { minDate: "today" } }));
      else dispatch(questionsActions.setQuestionData({ questionIndex, questionData: { minDate: "" } }));
    }

    if (type === "maxDate") {
      dispatch(questionsActions.setQuestionData({ questionIndex, questionData: { maxDate: value } }));
    }
    if (type === "maxDateToday") {
      setIsDateMaxVisible(!checked);
      if (checked) dispatch(questionsActions.setQuestionData({ questionIndex, questionData: { maxDate: "today" } }));
      else dispatch(questionsActions.setQuestionData({ questionIndex, questionData: { maxDate: "" } }));
    }
  };

  return {
    isMinLimit,
    isMaxLimit,
    isDateMinVisible,
    isDateMaxVisible,
    showMinLimitHandler,
    showMaxLimitHandler,
    changeDateHandler,
  };
};

export default useDate;
