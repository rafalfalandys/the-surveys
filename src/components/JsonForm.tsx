import Button from "antd/lib/button";
import TextArea from "antd/lib/input/TextArea";
import { Form } from "antd";
import useSurvey from "../hooks/useSurvey";
import sampleQuestions from "../assets/questions.json";
import { useEffect, useState } from "react";
import type { AnyQuestion, SurveySettings } from "../types";
import classes from "./JsonForm.module.scss";

const JsonForm: React.FC = () => {
  const [form] = Form.useForm();
  const [btnCopy, setBtnCopy] = useState("Copy json");
  const { setQuestionsData, questionsData, surveySettings, setSurveySettings } = useSurvey();

  useEffect(() => {
    form.setFieldsValue({
      surveyJson: JSON.stringify({ surveySettings, questionsData }, null, 2),
    });
  }, [surveySettings, questionsData, form]);

  const setSurveyDataHandler = (data: { surveyJson: string }) => {
    const {
      surveySettings,
      questionsData,
    }: { surveySettings: { settings: SurveySettings }; questionsData: AnyQuestion[] } = JSON.parse(data.surveyJson);
    setQuestionsData([]);
    setSurveySettings(surveySettings.settings);
    setQuestionsData(questionsData);
  };

  const copyJsonHandler = () => {
    try {
      const formattedData = JSON.stringify(JSON.parse(form.getFieldValue("surveyJson")));
      navigator.clipboard.writeText(formattedData).then(() => {
        setBtnCopy("Copied!");
        setTimeout(() => setBtnCopy("Copy Json"), 2000);
      });
    } catch (error) {
      console.error("Invalid JSON format:", error);
    }
  };

  const sampleQuestionsTyped = sampleQuestions as AnyQuestion[];

  return (
    <Form
      form={form}
      className="builder__form"
      onFinish={setSurveyDataHandler}
      initialValues={{
        questionsData: JSON.stringify(sampleQuestions),
      }}
    >
      <div className={classes.hidden}>
        <h3>JSON data (updated live):</h3>
        <Form.Item name="surveyJson">
          <TextArea rows={4} />
        </Form.Item>
        <Button htmlType="button" onClick={copyJsonHandler}>
          <strong>{btnCopy}</strong>
        </Button>
        <Button htmlType="submit">Set settings from pasted json</Button>
      </div>
      <Button htmlType="button" onClick={() => setQuestionsData(sampleQuestionsTyped)}>
        Set sample questions
      </Button>
    </Form>
  );
};

export default JsonForm;
