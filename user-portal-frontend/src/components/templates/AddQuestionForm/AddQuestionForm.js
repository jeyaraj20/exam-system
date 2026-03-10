import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { setAlert } from "../../../redux/actions/alertAction";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { getSubjectDetails } from "../../../redux/actions/subjectAction";
import { addQuestionAction } from "../../../redux/actions/questionAction";
import { TextareaAutosize } from "@material-ui/core";
import * as XLSX from "xlsx";

const useStyles = () => ({
  questionInput: { marginTop: "20px", display: "block" },
  optionInput: { display: "inline-block", margin: "20px 20px 0px" },
  btn: { margin: "20px 20px 0px 0px", display: "inline-block" },
  formClass: {
    margin: "20px",
    display: "inline-block",
    textAlign: "center",
    border: "1px solid black",
    borderRadius: "10px",
    padding: "20px",
  },
  formTitle: { fontSize: "1.7em" },
  textarea: {
    fontSize: "1.1em",
    padding: "5px",
    margin: "20px 20px 0px 0px",
    minWidth: "60%",
  },
  uploadBtn: { marginTop: "20px", display: "inline-block" },
});

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
    this.fileInputRef = React.createRef();
  }

  bodyInputHandler = (event) => this.setState({ body: event.target.value });
  optionInputHandler = (event, i) => {
    const options = [...this.state.options];
    options[i] = event.target.value;
    this.setState({ options });
  };
  subjectInputHandler = (event) =>
    this.setState({ subject: event.target.value });
  answerInputHandler = (event) => this.setState({ answer: event.target.value });
  marksInputHandler = (event) => this.setState({ marks: event.target.value });
  explanationInputHandler = (event) =>
    this.setState({ explanation: event.target.value });

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.answer === "None") {
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

  handleBulkUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      let count = 0;
      jsonData.forEach((q) => {
        // Expecting Excel columns: body, optionA, optionB, optionC, optionD, answer, subject, marks, explanation

        //question	option1	option2	option3	option4	correctAnswer	mark

        if (
          q.question &&
          q.optionA &&
          q.optionB &&
          q.optionC &&
          q.optionD &&
          q.answer &&
          //  q.subject &&
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
            subject: "69afd017a428b1991840cf80", //q.subject,
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
    event.target.value = null; // reset input
  };

  render() {
    if (!this.props.subjectDetails.retrived) {
      this.props.getSubjectDetails();
      return <div></div>;
    }

    return (
      <form
        className={this.props.classes.formClass}
        onSubmit={this.handleSubmit}
      >
        <div className={this.props.classes.formTitle}>Add Question</div>

        <TextField
          variant="outlined"
          className={this.props.classes.questionInput}
          label="Question"
          placeholder="Enter question"
          value={this.state.body}
          onChange={this.bodyInputHandler}
          required
          fullWidth
        />

        {["A", "B", "C", "D"].map((label, i) => (
          <TextField
            key={i}
            variant="outlined"
            className={this.props.classes.optionInput}
            label={`Option ${label}`}
            placeholder={`Enter option ${label}`}
            value={this.state.options[i]}
            onChange={(e) => this.optionInputHandler(e, i)}
            required
          />
        ))}

        <br />
        <TextField
          variant="outlined"
          className={this.props.classes.optionInput}
          label="Marks"
          type="number"
          value={this.state.marks}
          onChange={this.marksInputHandler}
          InputProps={{ inputProps: { min: 1, max: 4 } }}
          required
        />
        <br />

        <InputLabel
          htmlFor="subject-label"
          className={this.props.classes.optionInput}
        >
          Subject
        </InputLabel>
        <Select
          native
          value={this.state.subject}
          onChange={this.subjectInputHandler}
          inputProps={{ name: "subject", id: "subject-label" }}
          required
          className={this.props.classes.optionInput}
        >
          <option defaultValue={""} style={{ color: "rgba(7,7,7,0.3)" }}>
            None
          </option>
          {this.props.subjectDetails.list.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.subject}
            </option>
          ))}
        </Select>

        <InputLabel
          htmlFor="answer-label"
          className={this.props.classes.optionInput}
        >
          Answer
        </InputLabel>
        <Select
          native
          value={this.state.answer}
          onChange={this.answerInputHandler}
          inputProps={{ name: "answer", id: "answer-label" }}
          required
          className={this.props.classes.optionInput}
        >
          <option value="None"></option>
          {this.state.options.map((opt, i) => (
            <option
              key={i}
              value={opt}
            >{`Option ${["A", "B", "C", "D"][i]}`}</option>
          ))}
        </Select>

        <InputLabel
          htmlFor="explanation-label"
          className={this.props.classes.optionInput}
        >
          Explanation
        </InputLabel>
        <TextareaAutosize
          id="explanation"
          placeholder="Enter explanation"
          value={this.state.explanation}
          onChange={this.explanationInputHandler}
          className={this.props.classes.textarea}
          minRows={3}
        />

        {/* Buttons */}
        <div>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={this.props.classes.btn}
          >
            Submit
          </Button>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={this.handleBulkUpload}
            ref={this.fileInputRef}
            className={this.props.classes.uploadBtn}
          />
          <label htmlFor="bulk-upload" style={{ marginLeft: 10 }}>
            Upload Excel for Bulk Questions
          </label>
        </div>
      </form>
    );
  }
}

const mapStatetoProps = (state) => ({
  subjectDetails: state.subjectDetails,
});

export default withStyles(useStyles)(
  connect(mapStatetoProps, { getSubjectDetails, setAlert, addQuestionAction })(
    AddQuestionForm,
  ),
);
