import React from "react";
import { connect } from "react-redux";
import { Typography, Tag } from "antd";
import {
  saveAnswerAction,
  endTestAction,
} from "../../../redux/actions/takeTestAction";

const { Text } = Typography;

class Timer extends React.Component {
  interval = null;

  constructor(props) {
    super(props);

    this.state = this.getTimeFromMs(props.time);
  }

  getTimeFromMs = (ms = 0) => ({
    h: parseInt(ms / 3600000),
    m: parseInt(((ms / 1000) % 3600) / 60),
    s: parseInt((ms / 1000) % 60),
  });

  componentDidMount() {
    if (this.props.time) {
      this.startCountdown();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  startCountdown = () => {
    this.interval = setInterval(() => {
      let { h, m, s } = this.state;

      s--;

      if (s < 0) {
        this.props.saveAnswerAction();
        s = 59;
        m--;
      }

      if (m < 0) {
        m = 59;
        h--;
      }

      if (h < 0) {
        clearInterval(this.interval);
        this.props.endTestAction();

        this.setState({ h: 0, m: 0, s: 0 });
        return;
      }

      this.setState({ h, m, s });
    }, 1000);
  };

  format = (val) => String(val).padStart(2, "0");

  render() {
    const { h, m, s } = this.state;

    return (
      <Tag
        color={h === 0 && m < 5 ? "red" : "blue"}
        style={{ fontSize: 18, padding: "6px 14px" }}
      >
        ⏳ {this.format(h)} : {this.format(m)} : {this.format(s)}
      </Tag>
    );
  }
}

export default connect(null, {
  saveAnswerAction,
  endTestAction,
})(Timer);
