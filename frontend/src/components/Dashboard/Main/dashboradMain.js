import React from "react";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { Button, Row, Col, Space } from "antd";

import {
  logoutUser,
  getAdminDetails,
} from "../../../redux/actions/loginAction";
import { getDashboardCount } from "../../../redux/actions/dashboardDetails";

import Auth from "../../../services/Auth";

import { HomepageHeader } from "../../basic/header/header";
import logoImg from "../../basic/Homepage/main.jpg";

import { MainCard } from "../Card/card";

import TeacherImg from "../teacher.png";
import StudentImg from "../student.jfif";
import SubjectImg from "../subject.jfif";

import TeacherTable from "../teacherTable/teacherTable";
import SubjectTable from "../subjectTable/subjectTable";
import StudentTable from "../studentTable/studentTable";

class DashboardMain extends React.Component {
  constructor(props) {
    super(props);
    this.expand = "none";
  }

  logout = () => {
    this.props.logoutUser();
  };

  handleTableExpand = (type) => {
    if (type === this.expand) {
      this.expand = "none";
    } else {
      this.expand = type;
    }
    this.forceUpdate();
  };

  render() {
    if (!Auth.retriveToken() || Auth.retriveToken() === "undefined") {
      return <Navigate to="/" />;
    }

    if (!this.props.user.isLoggedIn) {
      this.props.getAdminDetails();
      return <div></div>;
    }

    if (!this.props.dashboardDetails.retrived) {
      this.props.getDashboardCount();
    }

    let tableView = null;

    if (this.expand === "Teacher") tableView = <TeacherTable />;
    if (this.expand === "Student") tableView = <StudentTable />;
    if (this.expand === "Subject") tableView = <SubjectTable />;

    return (
      <div>
        <HomepageHeader title="Exam Portal" img={logoImg} />

        <div style={{ marginTop: 80, padding: 20 }}>
          {/* Logout */}
          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <Button type="primary" danger onClick={this.logout}>
              Logout
            </Button>
          </div>

          {/* Dashboard Cards */}
          <Row gutter={20}>
            {/* Teacher */}
            <Col span={8}>
              <MainCard
                title="Teacher"
                value={this.props.dashboardDetails.teacherActive}
                total={
                  this.props.dashboardDetails.teacherActive +
                  this.props.dashboardDetails.teacherBlocked
                }
                image={TeacherImg}
              />

              <Space>
                <Link to="/addTeacher">
                  <Button type="primary">Add Teacher</Button>
                </Link>

                <Button onClick={() => this.handleTableExpand("Teacher")}>
                  Show
                </Button>
              </Space>
            </Col>

            {/* Student */}
            <Col span={8}>
              <MainCard
                title="Student"
                value={this.props.dashboardDetails.studentActive}
                total={
                  this.props.dashboardDetails.studentActive +
                  this.props.dashboardDetails.studentBlocked
                }
                image={StudentImg}
              />

              <Button
                style={{ marginTop: 10 }}
                onClick={() => this.handleTableExpand("Student")}
              >
                Show
              </Button>
            </Col>

            {/* Subject */}
            <Col span={8}>
              <MainCard
                title="Subject"
                value={this.props.dashboardDetails.subjectActive}
                total={
                  this.props.dashboardDetails.subjectActive +
                  this.props.dashboardDetails.subjectBlocked
                }
                image={SubjectImg}
              />

              <Space style={{ marginTop: 10 }}>
                <Link to="/addSubject">
                  <Button type="primary">Add Subject</Button>
                </Link>

                <Button onClick={() => this.handleTableExpand("Subject")}>
                  Show
                </Button>
              </Space>
            </Col>
          </Row>

          {/* Table View */}
          <div style={{ marginTop: 30 }}>{tableView}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  dashboardDetails: state.dashboardDetails,
});

export default connect(mapStateToProps, {
  logoutUser,
  getAdminDetails,
  getDashboardCount,
})(DashboardMain);
