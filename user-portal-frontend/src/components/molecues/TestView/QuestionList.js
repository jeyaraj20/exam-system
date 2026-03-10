import React from "react";
import { connect } from "react-redux";
import { Card, Button, Descriptions, Tag, Space } from "antd";
import { getUpcomingTestsStudentAction } from "../../../redux/actions/studentTestAction";
import { setAlert } from "../../../redux/actions/alertAction";
import { startTestAction } from "../../../redux/actions/takeTestAction";
import { Navigate } from "react-router-dom";
import { getDatePretty, getTimePretty } from "../../../helper/common";

class TakeTestStudent extends React.Component {
  goBack = () => {
    this.props.getUpcomingTestsStudentAction();
  };

  onStartTest = (test) => {
    const isStarted = test.status?.toUpperCase() === "TEST_STARTED";

    if (isStarted) {
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
    const value = status?.toUpperCase();

    if (value === "TEST_STARTED") return <Tag color="green">Started</Tag>;
    if (value === "TEST_ENDED") return <Tag color="red">Ended</Tag>;

    return <Tag color="orange">Not Started</Tag>;
  };

  render() {
    const { test, isTestStarted } = this.props;

    if (isTestStarted) return <Navigate to="/takeTestPage" />;

    if (!test) return <Card loading />;

    const isStarted = test.status?.toUpperCase() === "TEST_STARTED";

    return (
      <Card
        title="Test Details"
        style={{ borderRadius: 12 }}
        extra={<Button onClick={this.goBack}>Back</Button>}
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
                disabled={!isStarted}
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
