import React from "react";
import { connect } from "react-redux";
import { Typography } from "antd";
import { getAllTestStudentAction } from "../../../redux/actions/studentTestAction";
import TestTableStudent from "../../molecues/TestTable/TestTableStudent";

const { Title } = Typography;

class TestDetailsStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const titleStyle = {
      textAlign: "center",
      margin: "20px",
    };

    if (this.props.testDetails.retrived) {
      return (
        <div>
          <Title level={3} style={titleStyle}>
            All Tests
          </Title>

          <TestTableStudent />
        </div>
      );
    } else {
      this.props.getAllTestStudentAction();
      return <div></div>;
    }
  }
}

const mapStatetoProps = (state) => ({
  user: state.user,
  testDetails: state.testDetails,
});

export default connect(mapStatetoProps, {
  getAllTestStudentAction,
})(TestDetailsStudent);
