import React from "react";
import { Input } from "antd";
import { connect } from "react-redux";
import { setAlert } from "../../../redux/actions/alertAction";

const { Search } = Input;

class QuestionSearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
    };
  }

  searchInputHandler = (e) => {
    this.setState({ query: e.target.value });
  };

  searchButtonClick = () => {
    if (this.state.query.trim() === "") {
      this.props.setAlert({
        isAlert: true,
        type: "error",
        title: "Error",
        message: "Please give input to search",
      });
      return;
    }

    this.props.searchCallback(this.state);
  };

  render() {
    return (
      <div
        style={{
          border: "2px solid #1677ff",
          borderRadius: 30,
          padding: "5px 10px",
          display: "inline-block",
          margin: 10,
        }}
      >
        <Search
          placeholder="Search Question"
          value={this.state.query}
          onChange={this.searchInputHandler}
          onSearch={this.searchButtonClick}
          enterButton
          style={{ width: 400 }}
        />
      </div>
    );
  }
}

export default connect(null, { setAlert })(QuestionSearchBox);
