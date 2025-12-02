import { useSelector } from "react-redux";
import { Input } from "antd";
import { type RootState } from "../../store";
import { type QuestionDate as DateType } from "../../types";
import useDate from "../../hooks/useDate";

type QuestionDateProps = {
  questionIndex: number;
};

const QuestionDate: React.FC<QuestionDateProps> = ({ questionIndex }) => {
  const questionData = useSelector((state: RootState) => state.questions.questions)[questionIndex] as DateType;

  const {
    isMinLimit,
    isMaxLimit,
    isDateMinVisible,
    isDateMaxVisible,
    showMinLimitHandler,
    showMaxLimitHandler,
    changeDateHandler,
  } = useDate(questionIndex);

  return (
    <>
      <div className="builder__flex--align-end">
        <label>Minimum date limit:</label>
        <Input type="checkbox" onChange={showMinLimitHandler} className="builder__checkbox" checked={isMinLimit} />
        {(isMinLimit || questionData.minDate) && (
          <>
            <label>Day of taking the survey</label>
            <Input
              type="checkbox"
              onChange={changeDateHandler}
              data-type="minDateToday"
              className="builder__checkbox"
              checked={questionData.minDate === "today"}
            />
            {isDateMinVisible && (
              <Input type="date" onChange={changeDateHandler} data-type="minDate" value={questionData.minDate} />
            )}
          </>
        )}
      </div>
      <div className="builder__flex--align-end">
        <label>Maximum date limit:</label>
        <Input type="checkbox" onChange={showMaxLimitHandler} className="builder__checkbox" checked={isMaxLimit} />
        {(isMaxLimit || questionData.maxDate) && (
          <>
            <label>Day of taking the survey</label>
            <Input
              type="checkbox"
              onChange={changeDateHandler}
              data-type="maxDateToday"
              className="builder__checkbox"
              checked={questionData.maxDate === "today"}
            />
            {(isDateMaxVisible || (questionData.maxDate && questionData.maxDate !== "today")) && (
              <Input type="date" onChange={changeDateHandler} data-type="maxDate" value={questionData.maxDate} />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default QuestionDate;
