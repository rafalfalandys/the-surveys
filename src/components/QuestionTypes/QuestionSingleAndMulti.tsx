import Answer from "../SettingsComponents/ClosedAnswer";
import Button from "antd/lib/button/button";
import { Input } from "antd";
import useQuestion from "../../hooks/useQuestion";
import classes from "./QuestionSingleAndMulti.module.scss";
import { type QuestionCheckbox, type QuestionRadio } from "../../types";

type QuestionSingleAndMultiProps = {
  questionIndex: number;
};

const QuestionSingleAndMulti: React.FC<QuestionSingleAndMultiProps> = ({ questionIndex }) => {
  const { questionData, addAnswerHandler, shuffleAnswersHandler } = useQuestion(questionIndex);
  const question = questionData as QuestionCheckbox | QuestionRadio;

  const answers = question.answers.map((_, i) => <Answer questionIndex={questionIndex} answerIndex={i} key={i} />);

  return (
    <>
      <div className={classes.shuffleRow}>
        <label>Shuffle answers?</label>
        <Input
          type="checkbox"
          onChange={shuffleAnswersHandler}
          className="survey__checkbox"
          checked={question.shuffleAnswers}
        />
      </div>
      {answers}
      <Button onClick={addAnswerHandler}>+</Button>
      <br />
    </>
  );
};

export default QuestionSingleAndMulti;
