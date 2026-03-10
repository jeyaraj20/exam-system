const subjectModel = require("../models/subject");
const questionModel = require("../models/question");
const { body, validationResult } = require("express-validator");

const addQuestionValidation = [
  body("body").notEmpty().withMessage("Empty Question"),
  body("marks").isInt({ min: 1, max: 4 }).withMessage("Invalid marks"),
  body("options")
    .isArray({ min: 1, max: 4 })
    .withMessage("Invalid length of options"),
  body("options.*")
    .isLength({ min: 1, max: 256 })
    .withMessage("Invalid Null option"),
  body("subject").notEmpty().withMessage("Invalid Subject"),
  body("answer").notEmpty().withMessage("Invalid Answer"),
];

const addQuestion = async (req, res, next) => {
  try {
    const creator = req.user;
    if (!creator || creator.usertype !== "TEACHER") {
      return res
        .status(401)
        .json({ success: false, message: "Permissions not granted!" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        errors: errors.array(),
      });
    }

    const {
      body: questionBody,
      explanation,
      options,
      subject,
      marks,
      answer,
    } = req.body;

    if (!options.includes(answer)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
        error: "Answer is not in list of options",
      });
    }

    const subjectExists = await subjectModel.findOne({
      _id: subject,
      status: true,
    });
    if (!subjectExists) {
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });
    }

    const newQuestion = new questionModel({
      body: questionBody,
      explanation: explanation || null,
      options,
      subject,
      marks,
      answer,
      status: true,
      createdBy: creator._id,
    });

    await newQuestion.save();
    return res.json({
      success: true,
      message: "Question created successfully!",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Unable to add question" });
  }
};

const searchQuestion = async (req, res, next) => {
  try {
    const creator = req.user;
    if (!creator || creator.usertype !== "TEACHER") {
      return res
        .status(401)
        .json({ success: false, message: "Permissions not granted!" });
    }

    const { query } = req.body;
    if (!query || query.trim() === "") {
      return res.status(400).json({ success: false, message: "Empty Query" });
    }

    const questions = await questionModel
      .find({ body: new RegExp(query, "i") })
      .limit(20);
    const result = questions.map((q) => ({
      _id: q._id,
      body: q.body,
      status: q.status,
    }));
    return res.json({ success: true, list: result });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    const creator = req.user;
    if (!creator || creator.usertype !== "TEACHER") {
      return res
        .status(401)
        .json({ success: false, message: "Permissions not granted!" });
    }

    const {
      id,
      body: questionBody,
      explanation,
      options,
      subject,
      marks,
      answer,
    } = req.body;
    if (!id || !questionBody || !options || !answer) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    if (!options.includes(answer)) {
      return res
        .status(400)
        .json({ success: false, message: "Answer is not in list of options" });
    }

    const updated = await questionModel.findByIdAndUpdate(
      id,
      {
        body: questionBody,
        explanation: explanation || null,
        options,
        subject,
        marks,
        answer,
        createdBy: creator._id,
      },
      { new: true },
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    return res.json({
      success: true,
      message: "Question updated successfully",
      question: updated,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getQuestionById = async (req, res, next) => {
  try {
    const creator = req.user;
    if (!creator || creator.usertype !== "TEACHER") {
      return res
        .status(401)
        .json({ success: false, message: "Permissions not granted!" });
    }

    const { id } = req.body;
    if (!id)
      return res.status(400).json({ success: false, message: "ID not found" });

    const question = await questionModel.findById(id);
    if (!question)
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });

    return res.json({ success: true, question });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const changeQuestionStatus = async (req, res, next) => {
  try {
    const creator = req.user;
    if (!creator || creator.usertype !== "TEACHER") {
      return res
        .status(401)
        .json({ success: false, message: "Permissions not granted!" });
    }

    const { id, status } = req.body;
    if (!id || typeof status !== "boolean") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid inputs" });
    }

    const updated = await questionModel.findByIdAndUpdate(id, {
      status,
      createdBy: creator._id,
    });
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });

    return res.json({ success: true, message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const getQuestionAnswerByIds = async (req, res) => {
  try {
    const creator = req.user;

    if (!creator) {
      return res.json({
        success: false,
        message: "Permissions not granted!",
      });
    }

    const { queids } = req.body;

    if (!Array.isArray(queids) || queids.length === 0) {
      return res.json({
        success: false,
        message: "No question ids provided",
      });
    }

    const ques = await questionModel.find({ _id: { $in: queids } }).lean();

    if (ques.length < queids.length) {
      return res.json({
        success: false,
        message: "Not all questions found",
      });
    }

    const questionMap = {};
    ques.forEach((q) => {
      questionMap[q._id.toString()] = q;
    });

    const questions = queids.map((id) => {
      const q = questionMap[id.toString()];
      return {
        _id: q._id,
        body: q.body,
        options: q.options,
        marks: q.marks,
        answer: q.answer,
        explanation: q.explanation,
      };
    });

    return res.json({
      success: true,
      questions,
    });
  } catch (err) {
    console.error(err);

    return res.json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getQuestionAnswerById = async (req, res) => {
  try {
    const creator = req.user;

    if (!creator || creator.usertype !== "TEACHER") {
      return res.status(401).json({
        success: false,
        message: "Permissions not granted!",
      });
    }

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID not found",
      });
    }

    const result = await questionModel.findById(id).lean();

    if (!result) {
      return res.json({
        success: false,
        message: "Not found",
      });
    }

    return res.json({
      success: true,
      question: result,
      answer: result.answer,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};
const getAnsByQuestionId = async (req, res) => {
  try {
    const creator = req.user;

    if (!creator || creator.usertype !== "TEACHER") {
      return res.status(401).json({
        success: false,
        message: "Permissions not granted!",
      });
    }

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID not found",
      });
    }

    const result = await questionModel.findById(id).lean();

    if (!result) {
      return res.json({
        success: false,
        message: "Not found",
      });
    }

    return res.json({
      success: true,
      answer: result.answer,
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
  addQuestion,
  searchQuestion,
  updateQuestion,
  getQuestionById,
  changeQuestionStatus,
  addQuestionValidation,
  getQuestionAnswerByIds,
  getQuestionAnswerById,
  getAnsByQuestionId,
};
