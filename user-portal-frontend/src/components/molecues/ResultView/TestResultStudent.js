import React from "react";
import { connect } from "react-redux";
import { Table, Button, Card } from "antd";
import { getCompletedTestsStudentAction } from "../../../redux/actions/studentTestAction";
import { setAlert } from "../../../redux/actions/alertAction";
import TestResultViewQuestions from "./TestResultViewQuestions";

class TestResultStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleViewQue: false,
    };
  }

  onViewQuestions = (result) => {
    if (result.status !== "RESULT_DECLARED") {
      this.props.setAlert({
        type: "info",
        title: "No Result",
        message: "Test result is not declared",
      });
      return;
    }

    this.setState({
      toggleViewQue: !this.state.toggleViewQue,
    });
  };

  goBack = () => {
    this.props.getCompletedTestsStudentAction();
  };

  render() {
    const { test, user } = this.props;

    const data = [
      { key: "1", label: "Title", value: test.title },
      { key: "2", label: "Student Name", value: user.username },
      {
        key: "3",
        label: "Status",
        value: test.status?.toLowerCase(),
      },
      { key: "4", label: "Subjects", value: test.subjects },
      { key: "5", label: "Total Marks", value: test.maxmarks },
      {
        key: "6",
        label: "Obtained Marks",
        value:
          test.status === "RESULT_DECLARED"
            ? test.score
            : "Result not declared",
      },
      {
        key: "7",
        label: "Questions",
        value: (
          <Button type="primary" onClick={() => this.onViewQuestions(test)}>
            View
          </Button>
        ),
      },
      {
        key: "8",
        label: "",
        value: <Button onClick={this.goBack}>Back</Button>,
      },
    ];

    const columns = [
      {
        title: "Field",
        dataIndex: "label",
        key: "label",
        width: "40%",
      },
      {
        title: "Details",
        dataIndex: "value",
        key: "value",
      },
    ];

    return (
      <div>
        <Card>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
          />
        </Card>

        {this.state.toggleViewQue && <TestResultViewQuestions />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  test: state.testDetails.test,
  user: state.user.userDetails,
});

export default connect(mapStateToProps, {
  getCompletedTestsStudentAction,
  setAlert,
})(TestResultStudent);
