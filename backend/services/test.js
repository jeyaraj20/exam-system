var testModel = require("../models/test");
var questionModel = require("../models/question");
const testRegistrationModel = require("../models/testRegistration");
const { validationResult } = require("express-validator");

var getTestStatus = (test) => {
  if (test.status === "CANCELLED") return test.status;
  var status = "CREATED";
  var now = new Date();
  if (Date.parse(test.resultTime) < now) {
    status = "RESULT_DECLARED";
  } else if (Date.parse(test.endTime) < now) {
    status = "TEST_COMPLETE";
  } else if (Date.parse(test.startTime) < now) {
    status = "TEST_STARTED";
  } else if (Date.parse(test.regEndTime) < now) {
    status = "REGISTRATION_COMPLETE";
  } else if (Date.parse(test.regStartTime) < now) {
    status = "REGISTRATION_STARTED";
  }

  return status;
};

var generateTestpaper = async (subjects, maxmarks, queTypes) => {
  templist = [];
  quelist = [];
  anslist = [];
  totalMarks = 0;
  try {
    const allQuestions = await questionModel.find({
      status: true,
      subject: { $in: subjects },
      marks: { $in: queTypes },
    });
    for (var x in allQuestions) {
      totalMarks += allQuestions[x].marks;
    }
    if (totalMarks < maxmarks) {
      console.log("not enough question for subjects");
    } else {
      var remaining = maxmarks;
      var qIndexSet = new Set();
      while (remaining > 0) {
        var i = Math.floor(Math.random() * allQuestions.length);
        if (qIndexSet.has(i) || allQuestions[i].marks > remaining) {
          continue;
        } else {
          qIndexSet.add(i);
          quelist.push(allQuestions[i]._id);
          anslist.push(allQuestions[i].answer);
          remaining -= allQuestions[i].marks;
        }
      }
    }
    return { quelist, anslist };
  } catch (err) {
    console.log(err);
    return { quelist, anslist };
  }
};

var createTest = async (req, res, next) => {
  var creator = req.user || null;

  // 1. Authorization Check
  if (creator == null || req.user.usertype !== "TEACHER") {
    return res.status(401).json({
      success: false,
      message: "Permissions not granted!",
    });
  }

  // 2. Validation Check (Modern Syntax)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Invalid inputs",
      errors: errors.array(),
    });
  }

  try {
    // 3. Generate Paper
    var genQue = await generateTestpaper(
      req.body.subjects,
      req.body.maxmarks,
      req.body.queTypes,
    );

    if (!genQue || genQue.quelist.length < 1) {
      return res.json({
        success: false,
        message: "Not enough questions for selected subject",
      });
    }

    // 4. Save Test
    var tempdata = new testModel({
      title: req.body.title,
      subjects: req.body.subjects,
      maxmarks: req.body.maxmarks,
      queTypes: req.body.queTypes,
      questions: genQue.quelist,
      answers: genQue.anslist,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      duration: req.body.duration,
      regStartTime: req.body.regStartTime,
      regEndTime: req.body.regEndTime,
      resultTime: req.body.resultTime,
      createdBy: creator._id,
    });

    await tempdata.save();
    res.json({
      success: true,
      message: "Test created successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Unable to create test",
    });
  }
};

var updateStatus = (test, correctStatus) => {
  if (correctStatus !== test.status) {
    console.log(correctStatus + " " + test.status);

    testModel
      .findByIdAndUpdate({ _id: test._id }, { status: correctStatus })
      .then((updated) => {
        console.log(
          "updated status of test " + updated._id + " to " + correctStatus,
        );
      })
      .catch((err) => {
        console.log("Error in status update");
        console.log(err);
      });
  }
};

var getAllTest = (req, res, next) => {
  var creator = req.user || null;
  if (creator == null) {
    res.status(401).json({
      success: false,
      message: "Permissions not granted!",
    });
  }

  try {
    testModel
      .find()
      .sort({ startTime: -1 })
      .then((result) => {
        for (x in result) {
          var correctStatus = getTestStatus(result[x]);
          if (correctStatus !== result[x].status) {
            updateStatus(result[x], correctStatus);
            result[x].status = correctStatus;
          }
        }
        res.json({
          success: true,
          testlist: result.map((v) => ({
            _id: v._id,
            title: v.title,
            status: v.status,
          })),
        });
      });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      testlist: [],
    });
  }
};

const testRegistration = async (req, res) => {
  try {
    const creator = req.user;

    if (!creator || creator.usertype !== "STUDENT") {
      return res.status(401).json({
        success: false,
        message: "Permissions not granted!",
      });
    }

    if (!req.body.testid) {
      return res.json({
        success: false,
        message: "Empty test id",
      });
    }

    const test = await testModel.findById(req.body.testid);

    if (!test) {
      return res.json({
        success: false,
        message: "Test not found",
      });
    }

    const correctStatus = getTestStatus(test);

    if (correctStatus !== test.status) {
      await updateStatus(test, correctStatus);
      test.status = correctStatus;
    }

    if (test.status !== "REGISTRATION_STARTED") {
      return res.json({
        success: false,
        message: "Test registration is not open",
      });
    }

    const alreadyRegistered = await testRegistrationModel.findOne({
      user: creator._id,
      test: req.body.testid,
    });

    if (alreadyRegistered) {
      return res.json({
        success: false,
        message: "Your registration for the test is already done",
      });
    }

    const registration = new testRegistrationModel({
      test: req.body.testid,
      user: creator._id,
    });

    await registration.save();

    return res.json({
      success: true,
      message: "Test registration success",
    });
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      message: "Server error",
    });
  }
};

var getAllTestWithStudentRegisterCheck = async (req, res, next) => {
  var creator = req.user || null;
  if (creator == null || req.user.usertype != "STUDENT") {
    res.status(401).json({
      success: false,
      message: "Permissions not granted!",
    });
    return;
  }

  var tests = await testModel
    .find()
    .sort({ startTime: 1 })
    .catch((err) => {
      console.log(err);
      res.json({
        success: false,
        message: "Internal server error",
      });
      return;
    });

  var testlist = new Array(tests.length);
  var registeredList = await testRegistrationModel
    .find({ user: creator._id }, { test: 1 })
    .catch((err) => {
      console.log(err);
      res.json({
        success: false,
        message: "Internal server error",
      });
      return;
    });

  for (x in tests) {
    var correctStatus = getTestStatus(tests[x]);
    if (correctStatus !== tests[x].status) {
      updateStatus(tests[x], correctStatus);
      tests[x].status = correctStatus;
    }
    var isReg = registeredList.find(
      (test, index) => test.test.toString() == tests[x]._id.toString(),
    );
    testlist[x] = {
      _id: tests[x]._id,
      title: tests[x].title,
      status: tests[x].status,
      isRegistered: isReg !== undefined,
      startTime: tests[x].startTime,
      endTime: tests[x].endTime,
      regStartTime: tests[x].regStartTime,
      regEndTime: tests[x].regEndTime,
      resultTime: tests[x].resultTime,
      maxmarks: tests[x].maxmarks,
      duration: tests[x].duration,
    };
  }

  res.json({
    success: true,
    testlist: testlist,
  });
};

var getUpcomingTestforStudent = async (req, res, next) => {
  var creator = req.user || null;
  if (creator == null || req.user.usertype != "STUDENT") {
    res.status(401).json({
      success: false,
      message: "Permissions not granted!",
    });
    return;
  }

  var tests = await testModel
    .find({ endTime: { $gt: Date.now() } })
    .sort({ startTime: 1 })
    .catch((err) => {
      console.log(err);
      res.json({
        success: false,
        message: "Internal server error",
      });
      return;
    });

  var testlist = [];
  var registeredList = await testRegistrationModel
    .find({ user: creator._id }, { test: 1 })
    .catch((err) => {
      console.log(err);
      res.json({
        success: false,
        message: "Internal server error",
      });
      return;
    });

  for (x in tests) {
    var correctStatus = getTestStatus(tests[x]);
    if (correctStatus !== tests[x].status) {
      updateStatus(tests[x], correctStatus);
      tests[x].status = correctStatus;
    }
    var isReg = registeredList.find(
      (test, index) => test.test.toString() == tests[x]._id.toString(),
    );
    if (isReg) {
      testlist.push({
        _id: tests[x]._id,
        title: tests[x].title,
        status: tests[x].status,
        startTime: tests[x].startTime,
        endTime: tests[x].endTime,
        resultTime: tests[x].resultTime,
        maxmarks: tests[x].maxmarks,
        duration: tests[x].duration,
      });
    }
  }

  res.json({
    success: true,
    upcomingtestlist: testlist,
  });
};

var getTestDetailsFromId = async (req, res, next) => {
  try {
    const creator = req.user || null;

    // 1. Auth Check
    if (!creator) {
      return res.status(401).json({
        success: false,
        message: "Permissions not granted!",
      });
    }

    // 2. Validation Check (express-validator v6+)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: errors.array(),
      });
    }

    // 3. Find Test
    // Note: Use req.body.testid or req.params.testid based on your route
    const test = await testModel.findById(req.body.testid);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "test id not found",
      });
    }

    // 4. Update Status if necessary
    const correctStatus = getTestStatus(test);
    if (correctStatus !== test.status) {
      await updateStatus(test, correctStatus); // Assuming updateStatus is async
      test.status = correctStatus;
    }

    // 5. Build Response Object
    // Common fields for both Student and Teacher
    const responseData = {
      _id: test._id,
      title: test.title,
      status: test.status,
      startTime: test.startTime,
      endTime: test.endTime,
      regStartTime: test.regStartTime,
      regEndTime: test.regEndTime,
      resultTime: test.resultTime,
      maxmarks: test.maxmarks,
      duration: test.duration,
    };

    // Add extra fields for non-students (Teachers/Admins)
    if (req.user.usertype !== "STUDENT") {
      responseData.subjects = test.subjects;
      responseData.queTypes = test.queTypes;
    }

    return res.json({
      success: true,
      test: responseData,
    });
  } catch (err) {
    console.error("Error fetching test details:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createTest,
  getAllTest,
  testRegistration,
  getAllTestWithStudentRegisterCheck,
  getUpcomingTestforStudent,
  getTestDetailsFromId,
  getTestStatus,
  updateStatus,
};
