import Question from "./QuestionTypes/Question";

import { Button, Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { questionsActions } from "../store/question-slice";
import { type RootState } from "../store";
import { Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import classes from "./SurveyForm.module.scss";
import useSurvey from "../hooks/useSurvey";

const QuestionsForm = () => {
  const dispatch = useDispatch();
  const { descriptionHandler, validationTypeHandler, questionsPerPageHandler } = useSurvey();
  const questionsData = useSelector((state: RootState) => state.questions.questions);
  const surveyData = useSelector((state: RootState) => state.survey);

  const addQuestionHandler = () => {
    dispatch(questionsActions.addQuestion());
  };

  const revealSurvey = () => {
    console.log("Survey Data:", surveyData);
    console.log("Questions Data:", questionsData);
    // @ts-expect-error - method added to window
    window.createSurvey(questionsData, surveyData.settings);
  };

  const questions = questionsData.map((el, i) => {
    return <Question questionIndex={i} questionId={el.questionId} key={el.questionId} />;
  });

  const { Option } = Select;

  return (
    <>
      <Form className="builder__form" onValuesChange={(e) => console.log(e)} onFinish={revealSurvey}>
        <h2>Survey settings:</h2>
        <div className={classes.description}>
          <label className={classes.settingName}>Description (top of a page):</label>
          <TextArea
            rows={2}
            className="builder__text-input"
            value={surveyData.settings.description}
            onChange={descriptionHandler}
          />
        </div>

        <div className={classes.settingsGrid}>
          <label className={classes.settingName}>Questions per page:</label>
          <label className={classes.settingName}>Validation type:</label>
          <Input
            type="number"
            className={classes.questionsPerPage}
            value={surveyData.settings.questionsPerPage}
            onChange={questionsPerPageHandler}
          />
          <Select value={surveyData.settings.validationType} onChange={validationTypeHandler} className={classes.type}>
            <Option value="disableButtons">Disable buttons</Option>
            <Option value="flagRed">Flag red</Option>
          </Select>
        </div>
        <h2 className={classes.header2}>Questions:</h2>
        {questions}
        <Button type="default" onClick={addQuestionHandler}>
          Add question
        </Button>
        <Button
          htmlType="submit"
          type="primary"
          className={classes.revealBtn}
          disabled={questionsData.some((q) => q.type === "empty")}
        >
          Reveal Survey
        </Button>
      </Form>
    </>
  );
};

export default QuestionsForm;
