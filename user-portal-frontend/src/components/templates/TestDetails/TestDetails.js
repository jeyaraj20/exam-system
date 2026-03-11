import React from "react";
import { connect } from "react-redux";
import { Button, Typography } from "antd";
import {
  getAllTestAction,
  goBackToAllTest,
} from "../../../redux/actions/teacherTestAction";
import TestTable from "../../molecues/TestTable/TestTable";
import ViewTest from "../CreateTestForm/ViewTest";

const { Title } = Typography;

class TestDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const titleStyle = {
      textAlign: "center",
      margin: "20px",
    };

    if (this.props.testDetails.searched === true) {
      return (
        <div style={{ textAlign: "center", margin: "20px" }}>
          <ViewTest />

          <Button
            type="primary"
            style={{ marginTop: "20px" }}
            onClick={() => this.props.goBackToAllTest()}
          >
            Back
          </Button>
        </div>
      );
    }

    if (this.props.testDetails.retrived === false) {
      this.props.getAllTestAction();
      return <div></div>;
    } else {
      return (
        <div>
          <Title level={3} style={titleStyle}>
            All Tests
          </Title>

          <TestTable />
        </div>
      );
    }
  }
}

const mapStatetoProps = (state) => ({
  user: state.user,
  testDetails: state.testDetails,
});

export default connect(mapStatetoProps, {
  getAllTestAction,
  goBackToAllTest,
})(TestDetails);
