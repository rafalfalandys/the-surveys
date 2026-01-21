import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Spin, message, Typography } from "antd";
import { PlusOutlined, FileTextOutlined } from "@ant-design/icons";
import { getSurveys } from "../services/api";
import SurveyCard from "../components/SurveyCard";
import classes from "./Dashboard.module.scss";
import { closeSurvey } from "../helper";
import type { SurveyList } from "../types/apiTypes";

const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<SurveyList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    closeSurvey(); // in case we go back from survey view we need to close any open survey
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await getSurveys();
      setSurveys(response.data.surveys);
    } catch (error) {
      console.error("Failed to fetch surveys:", error);
      message.error("Failed to load surveys");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSurvey = () => {
    navigate("/create");
  };

  return (
    <>
      {loading && <Spin size="large" />}
      {/* Header */}
      <div className={classes.header}>
        <div className={classes.headerText}>
          <h2>My Surveys</h2>
          <Text type="secondary">
            {surveys.length} {surveys.length === 1 ? "survey" : "surveys"} total
          </Text>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={handleCreateSurvey}>
          Add Survey
        </Button>
      </div>

      {/* Surveys List */}
      {surveys.length === 0 ? (
        <Card>
          <div className={classes.emptyState}>
            <FileTextOutlined className={classes.emptyIcon} />
            <Title level={4} type="secondary">
              No surveys yet
            </Title>
            <Text type="secondary">Create your first survey to get started</Text>
          </div>
        </Card>
      ) : (
        <div className={classes.surveysGrid}>
          {surveys.map((survey) => (
            <SurveyCard key={survey._id} survey={survey} onDelete={fetchSurveys} />
          ))}
        </div>
      )}
    </>
  );
};

export default Dashboard;
