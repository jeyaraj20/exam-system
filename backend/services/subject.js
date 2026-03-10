const subjectModel = require("../models/subject");

// Get all subjects
const getAllSubject = async (req, res, next) => {
  try {
    const sub = await subjectModel.find({}).lean();
    const subjects = sub.map((subject) => ({
      id: subject._id,
      subject: subject.name,
      status: subject.status,
    }));

    res.json({
      success: true,
      subjects,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all active subjects
const getAllActiveSubject = async (req, res, next) => {
  try {
    const sub = await subjectModel.find({ status: true }).lean();
    const subjects = sub.map((subject) => ({
      id: subject._id,
      subject: subject.name,
      status: subject.status,
    }));

    res.json({
      success: true,
      subjects,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get count of active and blocked subjects
const getStatusCount = async (req, res, next) => {
  try {
    const result = await subjectModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    let trueCount = 0;
    let falseCount = 0;
    result.forEach((x) => {
      if (x._id === true) trueCount = x.count;
      if (x._id === false) falseCount = x.count;
    });

    res.json({
      success: true,
      active: trueCount,
      blocked: falseCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllSubject,
  getAllActiveSubject,
  getStatusCount,
};
