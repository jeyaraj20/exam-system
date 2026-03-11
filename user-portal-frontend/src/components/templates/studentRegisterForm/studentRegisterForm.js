import React from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Typography } from "antd";
import { registerStudentAction } from "../../../redux/actions/registerStudentAction";
import { setAlert } from "../../../redux/actions/alertAction";

const { Title } = Typography;

class StudentRegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  }

  usernameInputHandler = (e) => {
    this.setState({ username: e.target.value });
  };

  emailInputHandler = (e) => {
    this.setState({ email: e.target.value });
  };

  passwordInputHandler = (e) => {
    this.setState({ password: e.target.value });
  };

  confirmpasswordInputHandler = (e) => {
    this.setState({ confirmPassword: e.target.value });
  };

  handleSubmit = () => {
    if (this.state.confirmPassword !== this.state.password) {
      this.props.setAlert({
        isAlert: false,
        type: "error",
        title: "Invalid Input",
        message: "Confirm Password does not match",
      });
      return;
    }

    this.props.registerStudentAction({
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    });
  };

  render() {
    return (
      <div
        style={{
          margin: "20px",
          display: "inline-block",
          textAlign: "center",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "30px",
          minWidth: "350px",
        }}
      >
        <Title level={3}>Register</Title>

        <Form layout="vertical" onFinish={this.handleSubmit}>
          <Form.Item
            label="Username"
            rules={[{ required: true, message: "Please enter username" }]}
          >
            <Input
              placeholder="Enter username"
              value={this.state.username}
              onChange={this.usernameInputHandler}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input
              type="email"
              placeholder="Enter email"
              value={this.state.email}
              onChange={this.emailInputHandler}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password
              placeholder="Enter password"
              value={this.state.password}
              onChange={this.passwordInputHandler}
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            rules={[{ required: true, message: "Please confirm password" }]}
          >
            <Input.Password
              placeholder="Enter password again"
              value={this.state.confirmPassword}
              onChange={this.confirmpasswordInputHandler}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default connect(null, {
  registerStudentAction,
  setAlert,
})(StudentRegisterForm);
