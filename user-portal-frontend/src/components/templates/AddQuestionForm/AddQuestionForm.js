import React from "react";
import { connect } from "react-redux";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Upload,
  Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { setAlert } from "../../../redux/actions/alertAction";
import { getSubjectDetails } from "../../../redux/actions/subjectAction";
import { addQuestionAction } from "../../../redux/actions/questionAction";
import * as XLSX from "xlsx";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

class AddQuestionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      body: "",
      options: ["", "", "", ""],
      subject: "",
      answer: "",
      marks: 1,
      explanation: "",
    };
  }

  componentDidMount() {
    if (!this.props.subjectDetails.retrived) {
      this.props.getSubjectDetails();
    }
  }

  bodyInputHandler = (e) => this.setState({ body: e.target.value });

  optionInputHandler = (e, i) => {
    const options = [...this.state.options];
    options[i] = e.target.value;
    this.setState({ options });
  };

  subjectInputHandler = (value) => this.setState({ subject: value });

  answerInputHandler = (value) => this.setState({ answer: value });

  marksInputHandler = (value) => this.setState({ marks: value });

  explanationInputHandler = (e) =>
    this.setState({ explanation: e.target.value });

  handleSubmit = () => {
    if (!this.state.answer) {
      this.props.setAlert({
        isAlert: true,
        type: "error",
        title: "Invalid input",
        message: "Please select the answer",
      });
      return;
    }

    this.props.addQuestionAction(this.state);

    this.setState({
      body: "",
      options: ["", "", "", ""],
      subject: "",
      answer: "",
      marks: 1,
      explanation: "",
    });
  };

  handleBulkUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const firstSheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheet];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      let count = 0;

      jsonData.forEach((q) => {
        if (
          q.question &&
          q.optionA &&
          q.optionB &&
          q.optionC &&
          q.optionD &&
          q.answer &&
          q.mark
        ) {
          const questionObj = {
            body: q.question,
            options: [q.optionA, q.optionB, q.optionC, q.optionD],
            answer:
              q.answer == 0
                ? q.optionA
                : q.answer == 1
                  ? q.optionB
                  : q.answer == 2
                    ? q.optionC
                    : q.answer == 3
                      ? q.optionD
                      : "",
            subject: "69afd017a428b1991840cf80",
            marks: q.mark,
            explanation: q.explanation || "",
          };

          this.props.addQuestionAction(questionObj);
          count++;
        }
      });

      this.props.setAlert({
        isAlert: true,
        type: "success",
        title: "Bulk upload completed",
        message: `${count} questions added successfully`,
      });
    };

    reader.readAsArrayBuffer(file);
    return false;
  };

  render() {
    return (
      <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
        <Title level={3}>Add Question</Title>

        <Form layout="vertical" onFinish={this.handleSubmit}>
          <Form.Item label="Question">
            <Input
              value={this.state.body}
              onChange={this.bodyInputHandler}
              placeholder="Enter question"
              required
            />
          </Form.Item>

          {["A", "B", "C", "D"].map((label, i) => (
            <Form.Item key={i} label={`Option ${label}`}>
              <Input
                value={this.state.options[i]}
                onChange={(e) => this.optionInputHandler(e, i)}
                placeholder={`Enter option ${label}`}
                required
              />
            </Form.Item>
          ))}

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
              placeholder="Select Subject"
              onChange={this.subjectInputHandler}
              value={this.state.subject}
            >
              {this.props.subjectDetails.list?.map((sub) => (
                <Option key={sub.id} value={sub.id}>
                  {sub.subject}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Answer">
            <Select
              placeholder="Select correct answer"
              onChange={this.answerInputHandler}
              value={this.state.answer}
            >
              {this.state.options.map((opt, i) => (
                <Option key={i} value={opt}>
                  Option {["A", "B", "C", "D"][i]}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Explanation">
            <TextArea
              rows={3}
              value={this.state.explanation}
              onChange={this.explanationInputHandler}
              placeholder="Enter explanation"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Question
            </Button>
          </Form.Item>

          <Form.Item label="Bulk Upload Questions (Excel)">
            <Upload
              beforeUpload={this.handleBulkUpload}
              accept=".xlsx,.xls"
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Upload Excel File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapStatetoProps = (state) => ({
  subjectDetails: state.subjectDetails,
});

export default connect(mapStatetoProps, {
  getSubjectDetails,
  setAlert,
  addQuestionAction,
})(AddQuestionForm);
