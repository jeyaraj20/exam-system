const userModel = require("../models/user");

// Get all teachers
const getAllTeacher = async (req, res) => {
  try {
    const users = await userModel.find({ usertype: "TEACHER" }).lean();
    const teachers = users.map((u) => ({
      id: u._id,
      name: u.username,
      status: u.status,
    }));

    return res.json({ success: true, teachers });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Get teacher status count (active vs blocked)
const getTeacherStatusCount = async (req, res) => {
  try {
    const result = await userModel.aggregate([
      { $match: { usertype: "TEACHER" } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    let active = 0,
      blocked = 0;
    result.forEach((r) => {
      if (r._id === true) active = r.count;
      if (r._id === false) blocked = r.count;
    });

    return res.json({ success: true, active, blocked });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getAllTeacher,
  getTeacherStatusCount,
};
