import { Input } from "antd";
import useQuestion from "../../hooks/useQuestion";
import { type QuestionScale } from "../../types";

const ScaleLegend: React.FC<{ questionIndex: number }> = ({ questionIndex }) => {
  const { questionData, legendMinHandler, legendMaxHandler } = useQuestion(questionIndex);

  return (
    <div className="builder__flex--align-end">
      <label>Legend - min:</label>
      <Input type="text" onChange={legendMinHandler} value={(questionData as QuestionScale).legendLow} />
      <label>Legend - max:</label>
      <Input type="text" onChange={legendMaxHandler} value={(questionData as QuestionScale).legendHigh} />
    </div>
  );
};

export default ScaleLegend;
