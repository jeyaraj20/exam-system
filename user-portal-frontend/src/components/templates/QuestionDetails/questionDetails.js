import React from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import QuestionSearchBox from "../../atoms/SearchBox/QuestionSearchBox";
import {
  searchQuestion,
  goBacktoSearch,
} from "../../../redux/actions/questionAction";
import QuestionTable from "../../molecues/QuestionsTable/QuestionTable";
import ViewnUpdateQuestion from "../ViewnUpdateQuestion/ViewnUpdateQuestion";

class QuestionDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  backHandler = () => {
    this.props.goBacktoSearch();
  };

  render() {
    const containerStyle = {
      margin: "20px",
      display: "inline-block",
      textAlign: "center",
    };

    if (this.props.questionDetails.searched === true) {
      return (
        <div style={containerStyle}>
          <QuestionSearchBox searchCallback={this.props.searchQuestion} />
          <QuestionTable />
        </div>
      );
    } else if (this.props.questionDetails.question._id !== undefined) {
      return (
        <div style={containerStyle}>
          <QuestionSearchBox searchCallback={this.props.searchQuestion} />
          <br />
          <ViewnUpdateQuestion />
          <Button type="primary" onClick={this.props.goBacktoSearch}>
            Back
          </Button>
        </div>
      );
    } else {
      return (
        <div style={containerStyle}>
          <QuestionSearchBox searchCallback={this.props.searchQuestion} />
        </div>
      );
    }
  }
}

const mapStatetoProps = (state) => ({
  user: state.user,
  questionDetails: state.questionDetails,
});

export default connect(mapStatetoProps, {
  searchQuestion,
  goBacktoSearch,
})(QuestionDetails);
