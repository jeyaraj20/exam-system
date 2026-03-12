import React from "react";
import { connect } from "react-redux";
import { Table, Card, Tag, Spin } from "antd";
import { getTestDetailsFromId } from "../../../redux/actions/teacherTestAction";

class TestTable extends React.Component {
  onTestClick = (id) => {
    this.props.getTestDetailsFromId({ testid: id });
  };

  render() {
    const columns = [
      {
        title: "No.",
        key: "index",
        render: (_, __, index) => index + 1,
        width: 80,
      },
      {
        title: "Test",
        dataIndex: "title",
        key: "title",
        render: (text, record) => (
          <span
            onClick={() => this.onTestClick(record._id)}
            style={{
              color: "#1677ff",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {text}
          </span>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <Tag color={status === "ACTIVE" ? "green" : "orange"}>{status}</Tag>
        ),
      },
    ];

    return (
      <Card style={{ background: "#e7e7e7" }}>
        {" "}
        <Spin spinning={!this.props.testlist}>
          <Table
            columns={columns}
            dataSource={this.props.testlist}
            rowKey="_id"
            pagination={false}
            scroll={{ x: true }}
          />{" "}
        </Spin>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  testlist: state.testDetails.list,
});

export default connect(mapStateToProps, {
  getTestDetailsFromId,
})(TestTable);
