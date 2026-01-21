import Question from "./QuestionTypes/Question";

import { Button, Input, Select, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { questionsActions } from "../store/question-slice";
import { surveyActions } from "../store/survey-slice";
import { type RootState } from "../store";
import { Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import classes from "./SurveyForm.module.scss";
import useSurvey from "../hooks/useSurvey";

import { useState } from "react";
import { createSurvey, updateSurvey } from "../services/api";
import { addCLoseSurveyHandler } from "../helper";
import { useNavigate } from "react-router-dom";

interface SurveyFormProps {
  surveyId?: string;
}

const QuestionsForm = ({ surveyId }: SurveyFormProps = {}) => {
  const dispatch = useDispatch();
  const { descriptionHandler, validationTypeHandler, questionsPerPageHandler } = useSurvey();
  const questionsData = useSelector((state: RootState) => state.questions.questions);
  const surveyData = useSelector((state: RootState) => state.survey);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const addQuestionHandler = () => {
    dispatch(questionsActions.addQuestion());
  };

  const titleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(surveyActions.setTitle(e.target.value));
  };

  const saveSurvey = async () => {
    try {
      setIsSubmitting(true);

      // Prepare payload for backend
      const payload = {
        title: surveyData.title,
        settings: surveyData.settings,
        questions: questionsData,
      };

      let response;

      if (surveyId) {
        // Update existing survey
        response = await updateSurvey(surveyId, payload);
        message.success(`Survey "${response.data.survey.title}" updated successfully!`);
      } else {
        // Create new survey
        response = await createSurvey(payload);
        message.success(`Survey "${response.data.survey.title}" created successfully!`);
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save survey:", error);
      message.error(error instanceof Error ? error.message : "Failed to save survey");
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewSurvey = () => {
    window.createSurvey(questionsData, surveyData.settings);
    addCLoseSurveyHandler();
  };

  const questions = questionsData.map((el, i) => {
    return <Question questionIndex={i} questionId={el.questionId} key={el.questionId} />;
  });

  const { Option } = Select;

  return (
    <>
      <Form className="builder__form" onValuesChange={(e) => console.log(e)} onFinish={saveSurvey}>
        <h2>Survey settings:</h2>
        <div className={classes.description}>
          <label className={classes.settingName}>Survey Title:</label>
          <Input
            className="builder__text-input"
            value={surveyData.title}
            onChange={titleHandler}
            placeholder="Enter survey title"
            required
          />
        </div>

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
        <div className={classes.buttonsWrapper}>
          <Button type="default" onClick={addQuestionHandler}>
            Add question
          </Button>
          <Button type="default" onClick={previewSurvey} disabled={questionsData.some((q) => q.type === "empty")}>
            Preview
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            className={classes.revealBtn}
            disabled={questionsData.some((q) => q.type === "empty") || isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting
              ? surveyId
                ? "Saving Changes..."
                : "Creating Survey..."
              : surveyId
                ? "Save Changes"
                : "Create Survey"}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default QuestionsForm;
