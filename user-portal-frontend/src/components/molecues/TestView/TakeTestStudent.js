import React from "react";
import { connect } from "react-redux";
import { Card, Descriptions, Button, Tag, Space, Spin } from "antd";
import { Navigate } from "react-router-dom";

import { getUpcomingTestsStudentAction } from "../../../redux/actions/studentTestAction";
import { setAlert } from "../../../redux/actions/alertAction";
import { startTestAction } from "../../../redux/actions/takeTestAction";

import { getDatePretty, getTimePretty } from "../../../helper/common";

class TakeTestStudent extends React.Component {
  goBack = () => {
    this.props.getUpcomingTestsStudentAction();
  };

  onStartTest = (test) => {
    if (test.status === "TEST_STARTED") {
      this.props.startTestAction({ testid: test._id }, test);
    } else {
      this.props.setAlert({
        isAlert: true,
        type: "info",
        title: "Test not started yet",
      });
    }
  };

  renderStatus = (status) => {
    if (status === "TEST_STARTED") return <Tag color="green">Started</Tag>;
    if (status === "TEST_ENDED") return <Tag color="red">Ended</Tag>;
    return <Tag color="orange">Not Started</Tag>;
  };

  render() {
    const { test, isTestStarted } = this.props;

    if (isTestStarted) {
      return <Navigate to="/takeTestPage" />;
    }

    if (!test) {
      return (
        <Card>
          <Spin />
        </Card>
      );
    }

    return (
      <Card
        title="Test Details"
        extra={<Button onClick={this.goBack}>Back</Button>}
        style={{ borderRadius: 12 }}
      >
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Title">{test.title}</Descriptions.Item>

          <Descriptions.Item label="Status">
            {this.renderStatus(test.status)}
          </Descriptions.Item>

          <Descriptions.Item label="Total Marks">
            {test.maxmarks}
          </Descriptions.Item>

          <Descriptions.Item label="Duration">
            {getTimePretty(test.duration)}
          </Descriptions.Item>

          <Descriptions.Item label="Start Time">
            {getDatePretty(test.startTime)}
          </Descriptions.Item>

          <Descriptions.Item label="End Time">
            {getDatePretty(test.endTime)}
          </Descriptions.Item>

          <Descriptions.Item label="Result Time">
            {getDatePretty(test.resultTime)}
          </Descriptions.Item>

          <Descriptions.Item label="Start Test">
            <Space>
              <Button
                type="primary"
                disabled={test.status !== "TEST_STARTED"}
                onClick={() => this.onStartTest(test)}
              >
                Start Test
              </Button>
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  test: state.testDetails.test,
  isTestStarted: state.takeTestDetails.isRetrived,
});

export default connect(mapStateToProps, {
  getUpcomingTestsStudentAction,
  setAlert,
  startTestAction,
})(TakeTestStudent);
