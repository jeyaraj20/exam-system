import React from "react";
import { connect } from "react-redux";
import { Table, Button, Card, Tag } from "antd";
import { getTestResultStudent } from "../../../redux/actions/studentTestAction";

class CompletedTestTableStudent extends React.Component {
  onTestClick = (id) => {
    this.props.getTestResultStudent({ testid: id });
  };

  render() {
    const columns = [
      {
        title: "Test",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <Tag
            color={status === "RESULT_DECLARED" ? "green" : "orange"}
            style={{ textTransform: "lowercase" }}
          >
            {status}
          </Tag>
        ),
      },
      {
        title: (
          <>
            Total <br /> Marks
          </>
        ),
        dataIndex: "maxmarks",
        key: "maxmarks",
      },
      {
        title: "View",
        key: "view",
        render: (_, record) => (
          <Button type="primary" onClick={() => this.onTestClick(record._id)}>
            View
          </Button>
        ),
      },
    ];

    return (
      <Card style={{ background: "#e7e7e7" }}>
        <Table
          columns={columns}
          dataSource={this.props.testlist}
          rowKey="_id"
          pagination={false}
        />
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  testlist: state.testDetails.list,
});

export default connect(mapStateToProps, {
  getTestResultStudent,
})(CompletedTestTableStudent);
