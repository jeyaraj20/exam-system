import React from "react";
import { connect } from "react-redux";
import { Table, Card, Tag, Button } from "antd";
import { getDatePretty, getTimePretty } from "../../../helper/common";
import { getTestById } from "../../../redux/actions/studentTestAction";

class UpcomingTestTableStudent extends React.Component {
  onTestClick = (id) => {
    this.props.getTestById({ testid: id });
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
          <Tag color="processing">{status.toLowerCase()}</Tag>
        ),
      },
      {
        title: "Total Marks",
        dataIndex: "maxmarks",
        key: "maxmarks",
      },
      {
        title: "Duration (hours)",
        dataIndex: "duration",
        key: "duration",
        render: (val) => getTimePretty(val),
      },
      {
        title: "Test Start",
        dataIndex: "startTime",
        render: (val) => getDatePretty(val),
      },
      {
        title: "Test End",
        dataIndex: "endTime",
        render: (val) => getDatePretty(val),
      },
      {
        title: "Result",
        dataIndex: "resultTime",
        render: (val) => getDatePretty(val),
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
          pagination={{ pageSize: 6 }}
        />
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  testlist: state.testDetails.list,
});

export default connect(mapStateToProps, {
  getTestById,
})(UpcomingTestTableStudent);
