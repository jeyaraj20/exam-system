import React from "react";
import { connect } from "react-redux";
import { Table, Button, Tag } from "antd";
import {
  changeQuestionStatus,
  searchQuestionById,
} from "../../../redux/actions/questionAction";

class QuestionTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  viewQuestion = (id) => {
    this.props.searchQuestionById(id);
  };

  onQuestionStatusChange = (id, status) => {
    this.props.changeQuestionStatus({ id, status: !status });
  };

  render() {
    const columns = [
      {
        title: "No.",
        render: (text, record, index) => index + 1,
      },
      {
        title: "Question",
        dataIndex: "body",
        key: "body",
        render: (text, record) => (
          <span
            style={{ cursor: "pointer", color: "#1677ff" }}
            onClick={() => this.viewQuestion(record._id)}
          >
            {text}
          </span>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) =>
          status ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">Blocked</Tag>
          ),
      },
      {
        title: "Action",
        render: (record) => (
          <Button
            type={record.status ? "primary" : "default"}
            danger={record.status}
            onClick={() =>
              this.onQuestionStatusChange(record._id, record.status)
            }
          >
            {record.status ? "Block" : "Unblock"}
          </Button>
        ),
      },
    ];

    return (
      <div
        style={{ background: "#e7e7e7", padding: "15px", borderRadius: "12px" }}
      >
        <Table
          columns={columns}
          dataSource={this.props.questionlist}
          rowKey="_id"
          pagination={false}
          scroll={{ x: true }}
        />
      </div>
    );
  }
}

const mapStatetoProps = (state) => ({
  questionlist: state.questionDetails.list,
});

export default connect(mapStatetoProps, {
  changeQuestionStatus,
  searchQuestionById,
})(QuestionTable);
