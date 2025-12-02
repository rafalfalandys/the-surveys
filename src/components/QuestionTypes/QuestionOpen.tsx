import { Input } from "antd";
import useQuestion from "../../hooks/useQuestion";
import { type QuestionOpen as OpenType } from "../../types";

type QuestionOpenProps = {
  questionIndex: number;
};

const QuestionOpen: React.FC<QuestionOpenProps> = ({ questionIndex }) => {
  const { questionData, changeLimitHandler, changeUploadImgHandler } = useQuestion(questionIndex);

  return (
    <div className="builder_flex--align-end">
      <label>Limit:</label>
      <Input type="number" value={(questionData as OpenType).limit} onChange={changeLimitHandler} />
      <label>Image upload:</label>
      <Input
        type="checkbox"
        onChange={changeUploadImgHandler}
        className="builder_checkbox"
        checked={(questionData as OpenType).uploadImg}
      />
    </div>
  );
};

export default QuestionOpen;
