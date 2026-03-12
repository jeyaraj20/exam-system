import React from "react";
import { connect } from "react-redux";
import { Layout, Menu, Typography, Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Navigate } from "react-router-dom";

import LogoutButton from "../../atoms/LogoutButton/LogoutButton";
import Auth from "../../../helper/Auth";
import { getUserDetails } from "../../../redux/actions/loginAction";

import AlertBox from "../../atoms/Alertbox/AlertBox";
import TestDetailsStudent from "../../templates/TestDetails/TestDetailsStudent";
import UpcomingStudentTestsDetails from "../../templates/TestDetails/UpcomingStudentTestsDetails";
import CompletedTestsDetailsStudent from "../../templates/TestDetails/CompletedTestsDetailsStudent";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

class StudentHomepage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mobile: window.innerWidth < 768,
      drawerVisible: false,
      content: <div>Welcome to Exam portal</div>,

      menuList: [
        {
          key: "home",
          title: "Home",
          content: <div>Welcome to Exam portal</div>,
        },
        {
          key: "allTests",
          title: "View All Tests",
          content: <TestDetailsStudent />,
        },
        {
          key: "upcoming",
          title: "Upcoming Tests",
          content: <UpcomingStudentTestsDetails />,
        },
        {
          key: "completed",
          title: "Completed Tests",
          content: <CompletedTestsDetailsStudent />,
        },
      ],
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    this.setState({
      mobile: window.innerWidth < 768,
    });
  };

  onMenuItemClick = (content) => {
    this.setState({
      content,
      drawerVisible: false,
    });
  };

  toggleDrawer = () => {
    this.setState({
      drawerVisible: !this.state.drawerVisible,
    });
  };

  renderMenu = () => (
    <Menu theme="dark" mode="inline">
      {this.state.menuList.map((item) => (
        <Menu.Item
          key={item.key}
          onClick={() => this.onMenuItemClick(item.content)}
        >
          {item.title}
        </Menu.Item>
      ))}

      <Menu.Item>
        <LogoutButton />
      </Menu.Item>
    </Menu>
  );

  render() {
    if (!Auth.retriveToken() || Auth.retriveToken() === "undefined") {
      return <Navigate to="/" />;
    } else if (!this.props.user.isLoggedIn) {
      this.props.getUserDetails();
      return <div></div>;
    } else if (this.props.user.userDetails.type !== "STUDENT") {
      return <Navigate to="/" />;
    }

    return (
      <Layout style={{ minHeight: "100vh" }}>
        {/* Desktop Sidebar */}
        {!this.state.mobile && <Sider width={220}>{this.renderMenu()}</Sider>}

        {/* Mobile Drawer */}
        {this.state.mobile && (
          <Drawer
            placement="left"
            open={this.state.drawerVisible}
            onClose={this.toggleDrawer}
            bodyStyle={{ padding: 0 }}
          >
            {this.renderMenu()}
          </Drawer>
        )}

        <Layout>
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
            {/* Mobile Menu Button */}
            {this.state.mobile && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={this.toggleDrawer}
              />
            )}

            {/* <Title level={4} style={{ margin: 0 }}>
              Student Homepage
            </Title> */}

            <Title level={4} style={{ margin: 0 }}>
              Welcome, {this.props.user.userDetails.username} !!
            </Title>
          </Header>

          {/* Content */}
          <Content style={{ padding: "20px" }}>
            <AlertBox />
            {this.state.content}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

const mapStatetoProps = (state) => ({
  user: state.user,
});

export default connect(mapStatetoProps, {
  getUserDetails,
})(StudentHomepage);
