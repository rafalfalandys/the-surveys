import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Form, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import classes from "./Login.module.scss";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (values: { email: string; password: string }) => {
    setIsLoading(true);

    // Simulate login - in future this will call an API
    setTimeout(() => {
      console.log("Login attempt:", values);
      setIsLoading(false);
      navigate("/dashboard");
    }, 500);
  };

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <div className={classes.header}>
          <h1 className={classes.title}>Survey Builder</h1>
          <p className={classes.subtitle}>Sign in to manage your surveys</p>
        </div>

        <Form name="login" onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: false, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: false, message: "Please input your password!" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div className={classes.footer}>This is a demo login - any credentials will work</div>
      </Card>
    </div>
  );
};

export default Login;
