import { Input } from "antd";
import Button from "antd/lib/button/button";
import classes from "./ClosedAnswer.module.scss";
import useAnswer from "../../hooks/useAnswer";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";

type AnswerType = {
  questionIndex: number;
  answerIndex: number;
};

const ClosedAnswer: React.FC<AnswerType> = ({ questionIndex, answerIndex }) => {
  const {
    answerData,
    textHandler,
    isOpenHandler,
    removeAnswerHandler,
    limitHandler,
    endsSurveyHandler,
    changeOrderHandler,
  } = useAnswer(questionIndex, answerIndex);

  return (
    <div className="builder__flex--align-end">
      <label>{`Answer ${answerIndex + 1}`}</label>
      <div className={`${classes.inputRow} ${classes.answerRow}`}>
        <Input onChange={textHandler} className="builder__text-input" value={answerData.answer} />
        <Button onClick={removeAnswerHandler}>-</Button>
      </div>
      <div className={classes.inputRow}>
        <label>Ends survey?</label>
        <Input
          type="checkbox"
          onChange={endsSurveyHandler}
          className="builder__checkbox"
          checked={answerData.options.endsSurvey}
        />
      </div>
      <div className={classes.inputRow}>
        <label>Is open?</label>
        <Input
          type="checkbox"
          onChange={isOpenHandler}
          className="builder__checkbox"
          checked={answerData.options.isOpen}
        />
      </div>
      {answerData.options.isOpen && (
        <>
          <label>Limit:</label>
          <Input type="number" value={answerData.options.limit} onChange={limitHandler} />
        </>
      )}
      {
        <div className={classes.orderArrows}>
          <ChevronUpIcon onClick={changeOrderHandler.bind(null, answerIndex - 1)} />
          <ChevronDownIcon onClick={changeOrderHandler.bind(null, answerIndex + 1)} />
        </div>
      }
    </div>
  );
};

export default ClosedAnswer;
