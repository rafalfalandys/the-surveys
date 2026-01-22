import { Input } from "antd";
import useQuestion from "../../hooks/useQuestion";
import { type QuestionOpen as OpenType } from "../../types/surveyTypes";

type QuestionOpenProps = {
  questionIndex: number;
};

const QuestionOpen: React.FC<QuestionOpenProps> = ({ questionIndex }) => {
  const { questionData, changeLimitHandler } = useQuestion(questionIndex);

  return (
    <div className="builder_flex--align-end">
      <label>Limit:</label>
      <Input type="number" value={(questionData as OpenType).limit} onChange={changeLimitHandler} />
    </div>
  );
};

export default QuestionOpen;
