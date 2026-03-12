import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubjectDetails } from "../../../redux/actions/subjectAction";
import { setAlert } from "../../../redux/actions/alertAction";
import { createTestAction } from "../../../redux/actions/teacherTestAction";

const CreateTestForm = () => {
  const dispatch = useDispatch();
  const subjectDetails = useSelector((state) => state.subjectDetails);

  const formRefs = {
    title: useRef(),
    maxmarks: useRef(),
    duration: useRef(),
    regStartTime: useRef(),
    regEndTime: useRef(),
    startTime: useRef(),
    endTime: useRef(),
    resultTime: useRef(),
  };

  const subjectsRef = useRef([]);
  const queTypesRef = useRef([]);

  useEffect(() => {
    if (!subjectDetails.retrived) {
      dispatch(getSubjectDetails());
    }
  }, [dispatch, subjectDetails.retrived]);

  const timeStringtoMs = (str) => {
    if (!str) return 0;
    const [hours, mins] = str.split(":").map(Number);
    return (hours * 60 + mins) * 60 * 1000;
  };

  const sendAlert = (type, title, message) => {
    dispatch(setAlert({ isAlert: true, type, title, message }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const subjects = subjectsRef.current
      .filter((el) => el && el.checked)
      .map((el) => el.name);

    const queTypes = queTypesRef.current
      .filter((el) => el && el.checked)
      .map((el) => parseInt(el.name));

    const durMs = timeStringtoMs(formRefs.duration.current.value);

    const regStart = new Date(formRefs.regStartTime.current.value);
    const regEnd = new Date(formRefs.regEndTime.current.value);
    const testStart = new Date(formRefs.startTime.current.value);
    const testEnd = new Date(formRefs.endTime.current.value);
    const result = new Date(formRefs.resultTime.current.value);

    const payload = {
      title: formRefs.title.current.value,
      subjects,
      queTypes,
      maxmarks: parseInt(formRefs.maxmarks.current.value),
      duration: durMs / 1000,
      regStartTime: regStart,
      regEndTime: regEnd,
      startTime: testStart,
      endTime: testEnd,
      resultTime: result,
    };

    if (subjects.length < 1)
      return sendAlert("error", "Error", "Select a subject");

    if (queTypes.length < 1)
      return sendAlert("error", "Error", "Select question type");

    if (regStart >= regEnd)
      return sendAlert(
        "error",
        "Invalid Time",
        "Registration start must be before registration end",
      );

    if (regEnd >= testStart)
      return sendAlert(
        "error",
        "Invalid Time",
        "Registration must end before test start",
      );

    if (testStart >= testEnd)
      return sendAlert(
        "error",
        "Invalid Time",
        "Test start must be before test end",
      );

    if (testEnd >= result)
      return sendAlert(
        "error",
        "Invalid Time",
        "Result time must be after test end",
      );

    if (testEnd - testStart < durMs)
      return sendAlert(
        "error",
        "Invalid Duration",
        "Test duration exceeds available exam time",
      );

    dispatch(createTestAction(payload));
  };

  if (!subjectDetails.retrived) return <div className="loader">Loading...</div>;

  return (
    <div className="test-page">
      <div className="test-card">
        <h2 className="form-title">Create Test</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Test Title</label>
            <input
              ref={formRefs.title}
              type="text"
              required
              placeholder="Enter Title"
            />
          </div>

          <div className="section">
            <label>Subjects</label>
            <div className="check-grid">
              {subjectDetails.list.map((sub, index) => (
                <label key={sub.id} className="check-tile">
                  <input
                    type="checkbox"
                    name={sub.id}
                    ref={(el) => (subjectsRef.current[index] = el)}
                  />
                  <span>{sub.subject}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="section">
            <label>Question Types</label>
            <div className="check-grid">
              {[1, 2, 3, 4].map((m, index) => (
                <label key={m} className="check-tile">
                  <input
                    type="checkbox"
                    name={m.toString()}
                    ref={(el) => (queTypesRef.current[index] = el)}
                  />
                  <span>{m} Marks</span>
                </label>
              ))}
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label>Max Marks</label>
              <input
                ref={formRefs.maxmarks}
                type="number"
                defaultValue="30"
                min="5"
                max="100"
                required
              />
            </div>

            <div className="form-group">
              <label>Duration (HH:MM)</label>
              <input
                ref={formRefs.duration}
                type="time"
                defaultValue="00:30"
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label>Registration Start</label>
              <input
                ref={formRefs.regStartTime}
                type="datetime-local"
                required
              />
            </div>

            <div className="form-group">
              <label>Registration End</label>
              <input ref={formRefs.regEndTime} type="datetime-local" required />
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <label>Test Start</label>
              <input ref={formRefs.startTime} type="datetime-local" required />
            </div>

            <div className="form-group">
              <label>Test End</label>
              <input ref={formRefs.endTime} type="datetime-local" required />
            </div>
          </div>

          <div className="form-group">
            <label>Result Time</label>
            <input ref={formRefs.resultTime} type="datetime-local" required />
          </div>

          <button type="submit" className="submit-btn">
            Create Test
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTestForm;
