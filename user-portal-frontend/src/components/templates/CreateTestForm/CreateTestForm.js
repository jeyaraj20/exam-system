import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubjectDetails } from "../../../redux/actions/subjectAction";
import { setAlert } from "../../../redux/actions/alertAction";
import { createTestAction } from "../../../redux/actions/teacherTestAction";

const CreateTestForm = () => {
  const dispatch = useDispatch();
  const subjectDetails = useSelector((state) => state.subjectDetails);

  // Using a single object to hold all refs to keep the code clean
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

  // Checkboxes need special handling since they are lists
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

    // 1. Extract values from refs
    const subjects = subjectsRef.current
      .filter((el) => el && el.checked)
      .map((el) => el.name);

    const queTypes = queTypesRef.current
      .filter((el) => el && el.checked)
      .map((el) => parseInt(el.name));

    const durMs = timeStringtoMs(formRefs.duration.current.value);

    const payload = {
      title: formRefs.title.current.value,
      subjects,
      queTypes,
      maxmarks: parseInt(formRefs.maxmarks.current.value),
      duration: durMs / 1000, // Seconds for backend
      regStartTime: formRefs.regStartTime.current.value,
      regEndTime: formRefs.regEndTime.current.value,
      startTime: formRefs.startTime.current.value,
      endTime: formRefs.endTime.current.value,
      resultTime: formRefs.resultTime.current.value,
    };
    // 2. Validation Logic
    if (payload.subjects.length < 1)
      return sendAlert("error", "Error", "Select a subject");
    if (payload.queTypes.length < 1)
      return sendAlert("error", "Error", "Select question type");

    const times = {
      regStart: Date.parse(payload.regStartTime),
      regEnd: Date.parse(payload.regEndTime),
      testStart: Date.parse(payload.startTime),
      testEnd: Date.parse(payload.endTime),
      result: Date.parse(payload.resultTime),
    };
    console.log(times, "Sdfgxhj");
    // if (times.regStart >= times.regEnd)
    //   return sendAlert("error", "Error", "Invalid Registration Window");
    // if (times.regEnd >= times.testStart)
    //   return sendAlert(
    //     "error",
    //     "Error",
    //     "Registration must end before Test starts",
    //   );

    // if (times.testStart >= times.testEnd)
    //   return sendAlert("error", "Error", "Invalid Test Window");
    // if (times.testEnd >= times.result)
    //   return sendAlert("error", "Error", "Result must be after Test");
    // if (times.testEnd - times.testStart - durMs < 0)
    //   return sendAlert("error", "Error", "Test duration exceeds window");

    dispatch(createTestAction(payload));
  };

  if (!subjectDetails.retrived) return <div className="loader">Loading...</div>;

  return (
    <div className="test-page">
      <div className="test-card">
        <h2 className="form-title">Create Test (Uncontrolled)</h2>

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
              <label>Duration</label>
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
              <label>Reg Start</label>
              <input
                ref={formRefs.regStartTime}
                type="datetime-local"
                required
              />
            </div>
            <div className="form-group">
              <label>Reg End</label>
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
