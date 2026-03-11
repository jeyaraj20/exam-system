import React from "react";
import { Layout, Typography, Button } from "antd";
import { Navigate } from "react-router-dom";

import AlertBox from "../../atoms/Alertbox/AlertBox";
import StudentRegisterForm from "../../templates/studentRegisterForm/studentRegisterForm";

const { Header, Content } = Layout;
const { Title } = Typography;

class StudentRegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gotoHome: false,
    };
  }

  onHomeClick() {
    this.setState({
      gotoHome: true,
    });
  }

  render() {
    if (this.state.gotoHome) {
      return <Navigate to="/" />;
    }

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
            Student Register
          </Title>

          <Button type="primary" onClick={() => this.onHomeClick()}>
            Home
          </Button>
        </Header>

        {/* Content */}
        <Content
          style={{
            textAlign: "center",
            paddingTop: "5%",
          }}
        >
          <AlertBox />
          <StudentRegisterForm />
        </Content>
      </Layout>
    );
  }
}

export default StudentRegisterPage;
