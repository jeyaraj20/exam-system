import React from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { Layout, Typography, Button } from "antd";

import AlertBox from "../../atoms/Alertbox/AlertBox";
import LoginForm from "../../templates/loginForm/loginForm";
import Auth from "../../../helper/Auth";

const { Header, Content } = Layout;
const { Title } = Typography;

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gotoStudentRegister: false,
    };
  }

  onStudentRegisterClick = () => {
    this.setState({
      gotoStudentRegister: true,
    });
  };

  render() {
    if (this.state.gotoStudentRegister) {
      return <Navigate to="/studentRegisterPage" />;
    }

    if (this.props.user.isLoggedIn) {
      if (this.props.user.userDetails.type === "TEACHER")
        return <Navigate to="/homeTeacher" />;
      else return <Navigate to="/homeStudent" />;
    } else if (Auth.retriveToken() && Auth.retriveToken() !== "undefined") {
      return <Navigate to="/homeStudent" />;
    } else {
      return (
        <Layout style={{ minHeight: "100vh" }}>
          {/* Header */}
          <Header
            style={{
              background: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 20px",
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Login
            </Title>

            <Button type="primary" onClick={this.onStudentRegisterClick}>
              Student Register
            </Button>
          </Header>

          {/* Content */}
          <Content
            style={{
              textAlign: "center",
              paddingTop: "5%",
              margin: "auto",
            }}
          >
            <AlertBox />
            <LoginForm />
          </Content>
        </Layout>
      );
    }
  }
}

const mapStatetoProps = (state) => ({
  user: state.user,
});

export default connect(mapStatetoProps)(LoginPage);
