import React from "react";
import { connect } from "react-redux";
import { Table, Card, Tag, Button } from "antd";
import { studentTestRegister } from "../../../redux/actions/studentTestAction";
import { getDatePretty, getTimePretty } from "../../../helper/common";

class TestTableStudent extends React.Component {
  onTestRegister = (id) => {
    this.props.studentTestRegister({ testid: id });
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
          <Tag color={status === "REGISTRATION_STARTED" ? "green" : "orange"}>
            {status.toLowerCase()}
          </Tag>
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
        title: "Registration Start",
        dataIndex: "regStartTime",
        render: (val) => getDatePretty(val),
      },
      {
        title: "Registration End",
        dataIndex: "regEndTime",
        render: (val) => getDatePretty(val),
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
        title: "Register",
        key: "register",
        render: (_, record) => {
          if (record.isRegistered) {
            return <Tag color="blue">Registered</Tag>;
          }

          if (record.status === "REGISTRATION_STARTED") {
            return (
              <Button
                type="primary"
                onClick={() => this.onTestRegister(record._id)}
              >
                Register
              </Button>
            );
          }

          return <Tag>Not Registered</Tag>;
        },
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
  studentTestRegister,
})(TestTableStudent);
