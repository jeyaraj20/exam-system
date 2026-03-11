import React from "react";
import { connect } from "react-redux";
import { Typography } from "antd";
import { getCompletedTestsStudentAction } from "../../../redux/actions/studentTestAction";
import CompletedTestTableStudent from "../../molecues/TestTable/CompletedTestTableStudent";
import TestResultStudent from "../../molecues/ResultView/TestResultStudent";

const { Title } = Typography;

class CompletedTestsDetailsStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const titleStyle = {
      textAlign: "center",
      margin: "20px",
    };

    if (this.props.testDetails.completedTestRetrived === true) {
      return (
        <div>
          <Title level={3} style={titleStyle}>
            Completed Tests
          </Title>

          <CompletedTestTableStudent />
        </div>
      );
    } else if (this.props.testDetails.viewTestResult === true) {
      return (
        <div>
          <Title level={3} style={titleStyle}>
            Test Result
          </Title>

          <TestResultStudent />
        </div>
      );
    } else {
      this.props.getCompletedTestsStudentAction();
      return <div></div>;
    }
  }
}

const mapStatetoProps = (state) => ({
  user: state.user,
  testDetails: state.testDetails,
});

export default connect(mapStatetoProps, {
  getCompletedTestsStudentAction,
})(CompletedTestsDetailsStudent);
