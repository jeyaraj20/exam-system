import React from "react";
import { connect } from "react-redux";
import { Layout, Typography } from "antd";

const { Header } = Layout;
const { Title, Text } = Typography;

class HeaderAppBar extends React.Component {
  render() {
    const headerStyle = {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#1677ff",
      padding: "0 20px",
      color: "#fff",
    };

    return (
      <Header style={headerStyle}>
        <Title level={4} style={{ color: "#fff", margin: 0 }}>
          {this.props.title}
        </Title>

        <Text style={{ color: "#fff", fontSize: "16px" }}>
          Welcome, {this.props.user?.userDetails?.username} !!
        </Text>
      </Header>
    );
  }
}

const mapStatetoProps = (state) => ({
  user: state.user,
});

export default connect(mapStatetoProps)(HeaderAppBar);
