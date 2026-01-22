import { Card, Button, Typography, Modal } from "antd";
import { FormOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { getSurvey, deleteSurvey } from "../services/api";
import classes from "./SurveyCard.module.scss";
import type { SurveyList } from "../types/apiTypes";

const { Text } = Typography;
const { confirm } = Modal;

interface SurveyCardProps {
  survey: SurveyList;
  onDelete: () => void;
}

const SurveyCard = ({ survey, onDelete }: SurveyCardProps) => {
  const navigate = useNavigate();

  const handlePreview = async () => {
    try {
      const response = await getSurvey(survey._id);
      const surveyData = response.data.survey;

      window.createSurvey(surveyData.questions, surveyData.settings);
    } catch (error) {
      console.error("Failed to load survey for preview:", error);
      message.error("Failed to load survey preview");
    }
  };

  const handleDelete = () => {
    confirm({
      title: "Delete Survey",
      content: `Are you sure you want to delete "${survey.title}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteSurvey(survey._id);
          message.success(`Survey "${survey.title}" deleted successfully`);
          onDelete();
        } catch (error) {
          console.error("Failed to delete survey:", error);
          message.error(error instanceof Error ? error.message : "Failed to delete survey");
        }
      },
    });
  };

  return (
    <Card
      hoverable
      className={classes.card}
      onClick={() => navigate(`/survey/${survey._id}`)}
      actions={[
        <Link
          to={`/edit/${survey._id}`}
          onClick={(e) => e.stopPropagation()}
          style={{ color: "inherit", textDecoration: "none" }}
        >
          <Button type="link" icon={<FormOutlined />}>
            Edit
          </Button>
        </Link>,
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handlePreview();
          }}
          disabled
        >
          Stats
        </Button>,
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleDelete();
          }}
        >
          Delete
        </Button>,
      ]}
    >
      <Card.Meta
        title={<div className={classes.title}>{survey.title}</div>}
        description={
          <div>
            <Text type="secondary">
              {survey.questionsCount} {survey.questionsCount === 1 ? "question" : "questions"}
            </Text>
            <br />
            <Text type="secondary" className={classes.date}>
              Created: {new Date(survey.createdAt).toLocaleDateString()}
            </Text>
          </div>
        }
      />
    </Card>
  );
};

export default SurveyCard;
