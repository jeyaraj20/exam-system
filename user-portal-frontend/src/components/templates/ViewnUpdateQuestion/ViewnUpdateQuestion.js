import React from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Select, InputNumber, Typography } from "antd";
import { setAlert } from "../../../redux/actions/alertAction";
import { getSubjectDetails } from "../../../redux/actions/subjectAction";
import { updateQuestionAction } from "../../../redux/actions/questionAction";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

class ViewnUpdateQuestion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.question._id,
      body: props.question.body,
      options: props.question.options,
      subject: props.question.subject,
      answer: props.question.answer === "" ? "None" : props.question.answer,
      marks: props.question.marks,
      explanation: props.question.explanation,
    };
  }

  bodyInputHandler = (e) => {
    this.setState({ body: e.target.value });
  };

  optionInputHandler = (e, i) => {
    const options = [...this.state.options];
    options[i] = e.target.value;
    this.setState({ options });
  };

  subjectInputHandler = (value) => {
    this.setState({ subject: value });
  };

  answerInputHandler = (value) => {
    this.setState({ answer: value });
  };

  marksInputHandler = (value) => {
    this.setState({ marks: value });
  };

  explanationInputHandler = (e) => {
    this.setState({ explanation: e.target.value });
  };

  handleSubmit = () => {
    if (this.state.answer === "None") {
      this.props.setAlert({
        isAlert: true,
        type: "error",
        title: "Invalid input",
        message: "Please select answer",
      });
      return;
    }

    this.props.updateQuestionAction(this.state);
  };

  render() {
    if (!this.props.subjectDetails.retrived) {
      this.props.getSubjectDetails();
      return <div></div>;
    }

    return (
      <div
        style={{
          margin: "20px",
          padding: "25px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          maxWidth: "700px",
        }}
      >
        <Title level={3}>View and Update Question</Title>

        <Form layout="vertical" onFinish={this.handleSubmit}>
          <Form.Item label="Question">
            <Input value={this.state.body} onChange={this.bodyInputHandler} />
          </Form.Item>

          <Form.Item label="Option A">
            <Input
              value={this.state.options[0]}
              onChange={(e) => this.optionInputHandler(e, 0)}
            />
          </Form.Item>

          <Form.Item label="Option B">
            <Input
              value={this.state.options[1]}
              onChange={(e) => this.optionInputHandler(e, 1)}
            />
          </Form.Item>

          <Form.Item label="Option C">
            <Input
              value={this.state.options[2]}
              onChange={(e) => this.optionInputHandler(e, 2)}
            />
          </Form.Item>

          <Form.Item label="Option D">
            <Input
              value={this.state.options[3]}
              onChange={(e) => this.optionInputHandler(e, 3)}
            />
          </Form.Item>

          <Form.Item label="Marks">
            <InputNumber
              min={1}
              max={4}
              value={this.state.marks}
              onChange={this.marksInputHandler}
            />
          </Form.Item>

          <Form.Item label="Subject">
            <Select
              value={this.state.subject}
              onChange={this.subjectInputHandler}
            >
              {this.props.subjectDetails.list.map((sub) => (
                <Option key={sub.id} value={sub.id}>
                  {sub.subject}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Answer">
            <Select
              value={this.state.answer}
              onChange={this.answerInputHandler}
            >
              <Option value="None">None</Option>
              <Option value={this.state.options[0]}>Option A</Option>
              <Option value={this.state.options[1]}>Option B</Option>
              <Option value={this.state.options[2]}>Option C</Option>
              <Option value={this.state.options[3]}>Option D</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Explanation">
            <TextArea
              rows={3}
              value={this.state.explanation || ""}
              onChange={this.explanationInputHandler}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Question
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapStatetoProps = (state) => ({
  subjectDetails: state.subjectDetails,
  question: state.questionDetails.question,
  answer: state.questionDetails.answer,
});

export default connect(mapStatetoProps, {
  getSubjectDetails,
  setAlert,
  updateQuestionAction,
})(ViewnUpdateQuestion);
