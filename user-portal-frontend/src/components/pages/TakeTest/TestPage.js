import React from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { Layout, Typography, Button } from "antd";

import Timer from "../../molecues/TestView/Timer";
import QuestionList from "../../molecues/TestView/QuestionList";
import TestQuestion from "../../molecues/TestView/TestQuestion";
import AlertBox from "../../atoms/Alertbox/AlertBox";

import { endTestAction } from "../../../redux/actions/takeTestAction";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

class TestPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      curIndex: 0,
    };
  }

  setCurIndex = (x, obj) => {
    obj.setState({
      curIndex: x,
    });
  };

  goToPrev() {
    if (this.state.curIndex > 0) {
      this.setState({
        curIndex: this.state.curIndex - 1,
      });
    }
  }

  goToNext() {
    if (
      this.state.curIndex + 1 <
      this.props.taketest.answersheet.answers.length
    ) {
      this.setState({
        curIndex: this.state.curIndex + 1,
      });
    }
  }

  endtest() {
    this.props.endTestAction();
  }

  render() {
    if (this.props.taketest.isRetrived === false) {
      return <Navigate to="/" />;
    }

    const timerTime =
      this.props.taketest.test.duration * 1000 -
      (Date.now() - Date.parse(this.props.taketest.answersheet.startTime));

    return (
      <Layout style={{ minHeight: "100vh" }}>
        {/* Header */}
        <Header
          style={{
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            {this.props.taketest.test.title}
          </Title>

          <div>
            <Text strong>Time Remaining: </Text>
            <Timer time={timerTime} />
          </div>

          <Button danger type="primary" onClick={() => this.endtest()}>
            End Test
          </Button>
        </Header>

        {/* Content */}
        <Content style={{ padding: "30px" }}>
          <div style={{ display: "flex" }}>
            {/* jai */}
            {/* Question List */}
            {/* {this.props.taketest.answersheet.answers ? (
              <div style={{ width: "18%", margin: "20px" }}>
                <QuestionList
                  answers={this.props.taketest.answersheet.answers}
                  callback={this.setCurIndex}
                  obj={this}
                />
              </div>
            ) : (
              <></>
            )} */}

            {/* Question Area */}
            <div style={{ width: "100%" }}>
              <AlertBox />

              <TestQuestion
                question={this.state.curIndex}
                answer={
                  this.props.taketest.answersheet.answers[this.state.curIndex]
                }
              />

              <br />

              <Button
                style={{ margin: "10px" }}
                onClick={() => this.goToPrev()}
              >
                Prev
              </Button>

              <Button
                type="primary"
                style={{ margin: "10px" }}
                onClick={() => this.goToNext()}
              >
                Next
              </Button>
            </div>
          </div>
        </Content>
      </Layout>
    );
  }
}

const mapStatetoProps = (state) => ({
  user: state.user,
  taketest: state.takeTestDetails,
});

export default connect(mapStatetoProps, {
  endTestAction,
})(TestPage);
