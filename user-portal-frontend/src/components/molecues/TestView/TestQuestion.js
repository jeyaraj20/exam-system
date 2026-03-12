import React from "react";
import { connect } from "react-redux";
import { Card, Radio, Typography } from "antd";
import { selectedOptionAction } from "../../../redux/actions/takeTestAction";

const { Title } = Typography;

class TestQuestion extends React.Component {
  optionSelectHandler = (e) => {
    this.props.selectedOptionAction({
      index: this.props.question,
      ans: e.target.value,
    });
  };

  render() {
    const { question, taketest } = this.props;

    if (question === undefined) {
      return <div>question is undefined</div>;
    }

    const que = taketest.questionid[question];
    const selectedValue =
      taketest.answersheet.answers[parseInt(question)] || null;

    return (
      <Card
        className="table-card"
        style={{ margin: 15, borderRadius: 12 }}
        bodyStyle={{ padding: 20 }}
      >
        {/* Question */}
        <Title level={5}>{que.body}</Title>

        {/* Options */}
        <Radio.Group
          onChange={this.optionSelectHandler}
          value={selectedValue}
          style={{ display: "flex", flexDirection: "column", marginTop: 15 }}
        >
          <Radio style={{ margin: "8px 0" }} value={que.options[0]}>
            {que.options[0]}
          </Radio>

          <Radio style={{ margin: "8px 0" }} value={que.options[1]}>
            {que.options[1]}
          </Radio>

          <Radio style={{ margin: "8px 0" }} value={que.options[2]}>
            {que.options[2]}
          </Radio>

          <Radio style={{ margin: "8px 0" }} value={que.options[3]}>
            {que.options[3]}
          </Radio>
        </Radio.Group>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  taketest: state.takeTestDetails,
});

export default connect(mapStateToProps, {
  selectedOptionAction,
})(TestQuestion);
