const userModel = require("../models/user");

// Get all students
const getAllStudents = async (req, res, next) => {
  try {
    const users = await userModel.find({ usertype: "STUDENT" }).lean();

    const students = users.map((student) => ({
      id: student._id,
      name: student.username,
      status: student.status,
    }));

    res.json({
      success: true,
      students,
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
  getAllStudents,
};
