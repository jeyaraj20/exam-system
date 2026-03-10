const answersheetModel = require("../models/answersheet");
const testModel = require("../models/test");
const subjectModel = require("../models/subject");
const testService = require("./test");
const { body, validationResult } = require("express-validator");

// -----------------------------
// Validation Middlewares
// -----------------------------
const getResultByTestIdValidation = [
  body("testid").notEmpty().withMessage("Test id not found"),
];

// -----------------------------
// Controller Functions
// -----------------------------

// Get all completed tests for a student
const getAllCompletedTest = async (req, res, next) => {
  try {
    const creator = req.user;
    if (!creator || creator.usertype !== "STUDENT") {
      return res.status(401).json({
        success: false,
        message: "Permissions not granted!",
      });
    }

    const answersheets = await answersheetModel.find(
      { student: creator._id, completed: true },
      { test: 1 },
    );

    const testIds = answersheets.map((x) => x.test);

    let tests = await testModel.find({ _id: { $in: testIds } }).sort({
      resultTime: -1,
    });

    // Update test status if needed
    for (let t of tests) {
      const correctStatus = testService.getTestStatus(t);
      if (correctStatus !== t.status) {
        await testService.updateStatus(t, correctStatus);
        t.status = correctStatus;
      }
    }

    return res.json({
      success: true,
      completedtestlist: tests.map((t) => ({
        _id: t._id,
        title: t.title,
        status: t.status,
        maxmarks: t.maxmarks,
        subjects: t.subjects,
      })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get result details for a specific test
const getResultMainDetailsByTestId = async (req, res, next) => {
  try {
    const creator = req.user;
    if (!creator || creator.usertype !== "STUDENT") {
      return res.status(401).json({
        success: false,
        message: "Permissions not granted!",
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: errors.array(),
      });
    }

    const { testid } = req.body;

    const answersheets = await answersheetModel.find({
      student: creator._id,
      test: testid,
      completed: true,
    });

    if (!answersheets[0]) {
      return res.status(404).json({
        success: false,
        message: "Answer sheet not found",
      });
    }

    const test = await testModel.findById(testid);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    // Update test status if needed
    const correctStatus = testService.getTestStatus(test);
    if (correctStatus !== test.status) {
      await testService.updateStatus(test, correctStatus);
      test.status = correctStatus;
    }

    const subjects = await subjectModel
      .find({ _id: { $in: test.subjects } }, { name: 1 })
      .lean();
    const subs = subjects.map((s) => s.name);

    return res.json({
      success: true,
      result: {
        title: test.title,
        status: test.status,
        maxmarks: test.maxmarks,
        subjects: subs,
        score: answersheets[0].score,
        questions: test.questions,
        answers: answersheets[0].answers,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllCompletedTest,
  getResultMainDetailsByTestId,
  getResultByTestIdValidation,
};
