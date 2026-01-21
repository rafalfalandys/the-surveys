import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { getSurvey } from "../services/api";

const SurveyView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!id) {
        message.error("No survey ID provided");
        navigate("/dashboard");
        return;
      }

      try {
        const response = await getSurvey(id);
        const surveyData = response.data.survey;

        window.createSurvey(surveyData.questions, surveyData.settings);
      } catch (error) {
        console.error("Failed to load survey:", error);
        message.error("Failed to load survey");
        navigate("/dashboard");
      }
    };

    fetchSurveyData();
  }, [id, navigate]);

  return <div id="surveyContainer"></div>;
};

export default SurveyView;
