import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spin, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import SurveyForm from "../components/SurveyForm";
import JsonForm from "../components/JsonForm";
import { getSurvey } from "../services/api";
import classes from "./EditSurvey.module.scss";
import useSurvey from "../hooks/useSurvey";

const EditSurvey = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { setSurveyTitle, setSurveySettings, setQuestionsData } = useSurvey();

  useEffect(() => {
    if (!id) {
      message.error("No survey ID provided");
      navigate("/dashboard");
      return;
    }

    const fetchSurveyData = async () => {
      try {
        setLoading(true);
        const response = await getSurvey(id!);
        const survey = response.data.survey;

        // Load survey data into Redux store
        setSurveyTitle(survey.title);
        setSurveySettings(survey.settings);
        setQuestionsData(survey.questions);
      } catch (error) {
        console.error("Failed to load survey:", error);
        message.error("Failed to load survey");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, [id]);

  if (loading) {
    return <Spin size="large" tip="Loading survey..." />;
  }

  return (
    <>
      {/* Back button */}
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/dashboard")} className={classes.backButton}>
        Back to Dashboard
      </Button>

      {/* Survey Form */}
      <div className={classes.formWrapper}>
        <h2 className={classes.title}>Edit Survey</h2>
        <SurveyForm surveyId={id} />
        <JsonForm />
      </div>
    </>
  );
};

export default EditSurvey;
