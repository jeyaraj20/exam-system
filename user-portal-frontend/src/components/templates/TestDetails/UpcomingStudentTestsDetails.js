import React from "react";
import { connect } from "react-redux";
import { Typography } from "antd";
import { getUpcomingTestsStudentAction } from "../../../redux/actions/studentTestAction";
import UpcomingTestTableStudent from "../../molecues/TestTable/UpcomingTestTableStudent";
import TakeTestStudent from "../../molecues/TestView/TakeTestStudent";

const { Title } = Typography;

class UpcomingStudentTestsDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const titleStyle = {
      textAlign: "center",
      margin: "20px",
    };

    if (this.props.testDetails.upcomingTestRetrived === true) {
      return (
        <div>
          <Title level={3} style={titleStyle}>
            Upcoming Tests
          </Title>

          <UpcomingTestTableStudent />
        </div>
      );
    } else if (this.props.testDetails.viewTestRetrived) {
      return (
        <div>
          <Title level={3} style={titleStyle}>
            Test
          </Title>

          <TakeTestStudent />
        </div>
      );
    } else {
      this.props.getUpcomingTestsStudentAction();
      return <div></div>;
    }
  }
}

const mapStatetoProps = (state) => ({
  user: state.user,
  testDetails: state.testDetails,
});

export default connect(mapStatetoProps, {
  getUpcomingTestsStudentAction,
})(UpcomingStudentTestsDetails);
