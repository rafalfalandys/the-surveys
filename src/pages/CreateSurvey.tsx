import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import SurveyForm from "../components/SurveyForm";
import JsonForm from "../components/JsonForm";
import classes from "./CreateSurvey.module.scss";

const CreateSurvey = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Back button */}
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/dashboard")} className={classes.backButton}>
        Back to Dashboard
      </Button>

      {/* Survey Form */}
      <div className={classes.formWrapper}>
        <SurveyForm />
        <JsonForm />
      </div>
    </>
  );
};

export default CreateSurvey;
