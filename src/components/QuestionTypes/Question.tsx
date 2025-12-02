import QuestionSingleAndMulti from "./QuestionSingleAndMulti";
import QuestionOpen from "./QuestionOpen";
import QuestionScale from "./QuestionScale";
import QuestionDate from "./QuestionDate";
import { Collapse, Input } from "antd";
import Select from "antd/lib/select";
import useQuestion from "../../hooks/useQuestion";
import classes from "./Question.module.scss";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";
import type { CollapseProps } from "antd/lib";
import { useState } from "react";
import { MinusCircleIcon } from "@heroicons/react/24/outline";

type QuestionProps = {
  questionIndex: number;
  questionId: number;
};

const Question: React.FC<QuestionProps> = ({ questionIndex, questionId }) => {
  const {
    questionData,
    questionTextHandler,
    changeRequiredHandler,
    changeTypeHandler,
    removeQuestionHandler,
    moveQuestionHandler,
  } = useQuestion(questionIndex);

  const [activeKey, setActiveKey] = useState<number>(-1);

  const selectQuestionType = () => {
    const { type } = questionData;
    if (type === "multi" || type === "single") return <QuestionSingleAndMulti questionIndex={questionIndex} />;
    if (type === "open") return <QuestionOpen questionIndex={questionIndex} />;
    if (type === "scale") return <QuestionScale questionIndex={questionIndex} />;
    if (type === "date") return <QuestionDate questionIndex={questionIndex} />;
  };

  const renderQuestionSettings = () => {
    const question = selectQuestionType();
    return (
      <>
        {question}
        <br />
      </>
    );
  };

  const { Option } = Select;

  const items: CollapseProps["items"] = [
    {
      key: 1,
      label: `${questionIndex + 1} - ${questionData.question}`,
      children: (
        <div className={classes.collapseContent}>
          <div className={classes.settingsRow1}>
            <span className={classes.settingName}>Question:</span>
            <span className={classes.settingName}>Required:</span>

            <Input
              type="text"
              onChange={questionTextHandler}
              className="builder__text-input"
              value={questionData.question}
            />
            <Input
              type="checkbox"
              onChange={changeRequiredHandler}
              className="builder__checkbox"
              checked={questionData.required}
              size="small"
            />
          </div>
          <span className={classes.settingName}>Type:</span>
          <Select value={questionData.type} onChange={changeTypeHandler} className={classes.type}>
            <Option disabled hidden value="empty">
              select type
            </Option>
            <Option value="multi">Multiple choice</Option>
            <Option value="single">Single choice</Option>
            <Option value="open">Open</Option>
            <Option value="scale">Scale</Option>
            <Option value="images">Images</Option>
            <Option value="date">Date</Option>
          </Select>
          {renderQuestionSettings()}
        </div>
      ),
    },
  ];

  const moveQuestionUp = () => {
    setActiveKey(-1);
    moveQuestionHandler(questionIndex - 1);
  };
  const moveQuestionDown = () => {
    setActiveKey(-1);
    moveQuestionHandler(questionIndex + 1);
  };
  const activeKeyHandler = () => setActiveKey((key) => -key);

  return (
    <div className={classes.questionContainer}>
      <div className={classes.question}>
        <Collapse items={items} defaultActiveKey={[]} activeKey={activeKey} onChange={activeKeyHandler} />
      </div>

      <div className={classes.orderButtons}>
        <ChevronUpIcon onClick={moveQuestionUp} className={classes.icon} />
        <MinusCircleIcon onClick={removeQuestionHandler.bind(null, questionId)} className={classes.icon} />
        <ChevronDownIcon onClick={moveQuestionDown} className={classes.icon} />
      </div>
    </div>
  );
};

export default Question;
