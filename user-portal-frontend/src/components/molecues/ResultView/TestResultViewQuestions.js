import React from "react";
import { connect } from "react-redux";
import { Table, Typography, Tag } from "antd";
import { getQuestionAnswerActionStudent } from "../../../redux/actions/studentTestAction";

const { Title } = Typography;

class TestResultViewQuestions extends React.Component {
  render() {
    if (this.props.result.resultQuestion !== undefined) {
      const resultQuestion = [];

      for (let i in this.props.result.resultQuestion) {
        resultQuestion.push({
          ...this.props.result.resultQuestion[i],
          studentanswer: this.props.result.answers[i],
        });
      }

      const columns = [
        {
          title: "Question Details",
          dataIndex: "body",
          key: "body",
          render: (_, r) => (
            <div style={{ padding: "10px" }}>
              <div>
                <Tag color="blue">Question</Tag>
                {r.body}
              </div>

              <br />

              <div>
                <Tag color="purple">Options</Tag>

                {r.options.map((opt, i) => (
                  <Tag
                    key={i}
                    color={r.answer === opt ? "green" : "default"}
                    style={{ margin: "5px" }}
                  >
                    {opt}
                  </Tag>
                ))}
              </div>

              <br />

              <div>
                <Tag color="geekblue">Marks</Tag>

                <Tag color={r.answer === r.studentanswer ? "green" : "red"}>
                  {r.answer === r.studentanswer ? r.marks : 0}
                </Tag>
              </div>

              <br />

              <div>
                <Tag color="cyan">Your Answer</Tag>

                <Tag color={r.answer === r.studentanswer ? "green" : "red"}>
                  {r.studentanswer || "(no answer selected)"}
                </Tag>
              </div>

              <br />

              <div>
                <Tag color="orange">Explanation</Tag>
                {r.explanation}
              </div>
            </div>
          ),
        },
      ];

      return (
        <div>
          <Title level={3} style={{ textAlign: "center", margin: "20px" }}>
            Questions
          </Title>

          <Table
            columns={columns}
            dataSource={resultQuestion}
            rowKey="_id"
            bordered
            pagination={false}
          />
        </div>
      );
    } else {
      this.props.getQuestionAnswerActionStudent({
        queids: this.props.result.questions,
      });

      return <div>processing...</div>;
    }
  }
}

const mapStatetoProps = (state) => ({
  result: state.testDetails.test,
});

export default connect(mapStatetoProps, {
  getQuestionAnswerActionStudent,
})(TestResultViewQuestions);
