import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Card, Descriptions, Typography } from "antd";
import { getSubjectDetails } from "../../../redux/actions/subjectAction";

const { Title } = Typography;

const getSecondToStr = (sec) => {
  const h = parseInt(sec / 3600);
  const m = parseInt((sec % 3600) / 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

const ViewTest = ({ testDetails, subjectDetails, getSubjectDetails }) => {
  const test = testDetails.test;

  useEffect(() => {
    if (!subjectDetails.retrived) {
      getSubjectDetails();
    }
  }, []);

  if (!test) return null;

  const findSubjectNames = () => {
    return subjectDetails.list
      .filter((sub) => test.subjects.includes(sub.id))
      .map((sub) => sub.subject)
      .join(", ");
  };

  const getQuesTypesString = () => {
    return test.queTypes.map((q) => `${q} Marks`).join(", ");
  };

  return (
    <Card style={{ maxWidth: 800, margin: "20px auto", borderRadius: 12 }}>
      <Title level={3}>View Test</Title>

      <Descriptions column={1} bordered size="middle">
        <Descriptions.Item label="Title">{test.title}</Descriptions.Item>

        <Descriptions.Item label="Subjects">
          {findSubjectNames()}
        </Descriptions.Item>

        <Descriptions.Item label="Question Types">
          {getQuesTypesString()}
        </Descriptions.Item>

        <Descriptions.Item label="Max Marks">{test.maxmarks}</Descriptions.Item>

        <Descriptions.Item label="Registration Start Time">
          {test.regStartTime.slice(0, -8)}
        </Descriptions.Item>

        <Descriptions.Item label="Registration End Time">
          {test.regEndTime.slice(0, -8)}
        </Descriptions.Item>

        <Descriptions.Item label="Test Start Time">
          {test.startTime.slice(0, -8)}
        </Descriptions.Item>

        <Descriptions.Item label="Test End Time">
          {test.endTime.slice(0, -8)}
        </Descriptions.Item>

        <Descriptions.Item label="Test Duration">
          {getSecondToStr(test.duration)} hours
        </Descriptions.Item>

        <Descriptions.Item label="Result Time">
          {test.resultTime.slice(0, -8)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  subjectDetails: state.subjectDetails,
  testDetails: state.testDetails,
});

export default connect(mapStateToProps, {
  getSubjectDetails,
})(ViewTest);
