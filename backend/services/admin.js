const userModel = require("../models/user");
const subjectModel = require("../models/subject");
const adminModel = require("../models/admin");
const { hashPassword } = require("../services/tool");
const { body, validationResult } = require("express-validator");

// -----------------------------
// Validation middleware
// -----------------------------
const teacherRegisterValidation = [
  body("username").notEmpty().withMessage("Invalid name"),
  body("email").isEmail().withMessage("Invalid Email Address"),
  body("password")
    .isLength({ min: 5, max: 20 })
    .withMessage("Password must be 5–20 characters"),
];

const addSubjectValidation = [
  body("name").notEmpty().withMessage("Invalid name"),
];

// -----------------------------
// Controller functions
// -----------------------------
const teacherRegister = async (req, res) => {
  const creator = req.user;
  if (!creator) {
    return res
      .status(401)
      .json({ success: false, message: "Permissions not granted!" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      success: false,
      message: "Invalid inputs",
      errors: errors.array(),
    });
  }

  const { username, email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "This email already exists!",
      });
    }

    const hash = await hashPassword(password);
    const newUser = new userModel({
      username,
      email,
      password: hash,
      usertype: "TEACHER",
      createdBy: creator._id,
    });

    await newUser.save();
    res.json({ success: true, message: "Profile created successfully!" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Unable to register Profile" });
  }
};

const userRemove = async (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, message: "Permissions not granted!" });

  try {
    await userModel.findOneAndUpdate({ _id: req.body._id }, { status: false });
    res.json({ success: true, message: "Account has been removed" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Unable to remove account" });
  }
};

const unblockUser = async (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, message: "Permissions not granted!" });

  try {
    await userModel.findOneAndUpdate({ _id: req.body._id }, { status: true });
    res.json({ success: true, message: "Account has been unblocked" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Unable to unblock account" });
  }
};

const adminDetails = (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: { username: req.user.username, _id: req.user._id },
    });
  } else {
    res.json({ success: false, user: {} });
  }
};

const addSubject = async (req, res) => {
  const creator = req.user;
  if (!creator)
    return res
      .status(401)
      .json({ success: false, message: "Permissions not granted!" });

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.json({
      success: false,
      message: "Invalid inputs",
      errors: errors.array(),
    });

  const { name } = req.body;

  try {
    const existing = await subjectModel.findOne({ name });
    if (existing)
      return res.json({ success: false, message: "Subject already exists!" });

    const newSubject = new subjectModel({
      name,
      status: true,
      createdBy: creator._id,
    });
    await newSubject.save();
    res.json({ success: true, message: "Subject created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to add Subject" });
  }
};

const subjectRemove = async (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, message: "Permissions not granted!" });

  try {
    await subjectModel.findOneAndUpdate(
      { _id: req.body._id },
      { status: false },
    );
    res.json({ success: true, message: "Subject has been removed" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Unable to remove subject" });
  }
};

const unblockSubject = async (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, message: "Permissions not granted!" });

  try {
    await subjectModel.findOneAndUpdate(
      { _id: req.body._id },
      { status: true },
    );
    res.json({ success: true, message: "Subject has been unblocked" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Unable to unblock subject" });
  }
};

const getDashboardCount = async (req, res) => {
  try {
    const subjectCounts = await subjectModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const teacherCounts = await userModel.aggregate([
      { $match: { usertype: "TEACHER" } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const studentCounts = await userModel.aggregate([
      { $match: { usertype: "STUDENT" } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const activeSubject = subjectCounts.find((x) => x._id === true)?.count || 0;
    const blockedSubject =
      subjectCounts.find((x) => x._id === false)?.count || 0;

    const activeTeacher = teacherCounts.find((x) => x._id === true)?.count || 0;
    const blockedTeacher =
      teacherCounts.find((x) => x._id === false)?.count || 0;

    const activeStudent = studentCounts.find((x) => x._id === true)?.count || 0;
    const blockedStudent =
      studentCounts.find((x) => x._id === false)?.count || 0;

    res.json({
      success: true,
      activeStudent,
      blockedStudent,
      activeTeacher,
      blockedTeacher,
      activeSubject,
      blockedSubject,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const addAdminIfNotFound = async () => {
  try {
    const admin = await adminModel.findOne({ username: "sysadmin" });
    if (admin) {
      console.log("Admin user found");
    } else {
      const hash = await hashPassword("systemadmin");
      const tempAdmin = new adminModel({
        username: "sysadmin",
        password: hash,
      });
      await tempAdmin.save();
      console.log("Admin added successfully !!");
    }
  } catch (err) {
    console.error(err);
  }
};

// -----------------------------
// Exports
// -----------------------------
module.exports = {
  teacherRegister,
  teacherRegisterValidation,
  userRemove,
  unblockUser,
  adminDetails,
  addSubject,
  addSubjectValidation,
  subjectRemove,
  unblockSubject,
  getDashboardCount,
  addAdminIfNotFound,
};
