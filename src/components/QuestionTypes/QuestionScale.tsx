import { Input } from "antd";
import { useSelector } from "react-redux";
import ScaleLegend from "../SettingsComponents/ScaleLegend";
import useQuestion from "../../hooks/useQuestion";
import classes from "./QuestionScale.module.scss";
import { type RootState } from "../../store";
import { type QuestionScale as ScaleType } from "../../types";

type QuestionScaleProps = {
  questionIndex: number;
};

const QuestionScale: React.FC<QuestionScaleProps> = ({ questionIndex }) => {
  const questionData = useSelector((state: RootState) => state.questions.questions)[questionIndex] as ScaleType;

  const { changeLengthHandler } = useQuestion(questionIndex);

  return (
    <div className="survey__flex--align-end">
      <label>Length:</label>
      <Input type="number" onChange={changeLengthHandler} value={questionData.length} className={classes.scaleValue} />
      <ScaleLegend questionIndex={questionIndex} />
    </div>
  );
};

export default QuestionScale;
