import React from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Typography } from "antd";
import { loginRequestAction } from "../../../redux/actions/loginAction";
import "./loginForm.css";

const { Title } = Typography;

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  emailInputHandler = (e) => {
    this.setState({ email: e.target.value });
  };

  passwordInputHandler = (e) => {
    this.setState({ password: e.target.value });
  };

  handleSubmit = () => {
    this.props.loginRequestAction(this.state);
  };

  render() {
    return (
      <div className="form-class">
        <Title level={3} style={{ textAlign: "center" }}>
          LOGIN
        </Title>

        <Form layout="vertical" onFinish={this.handleSubmit}>
          <Form.Item
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input
              placeholder="Enter email"
              type="email"
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

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapStatetoProps = (state) => ({
  state: state.user,
});

export default connect(mapStatetoProps, {
  loginRequestAction,
})(LoginForm);
