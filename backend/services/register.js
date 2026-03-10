const userModel = require("../models/user");
const { hashPassword } = require("./tool");
const { body, validationResult } = require("express-validator");

// -----------------------------
// Validation middleware
// -----------------------------
const studentRegisterValidation = [
  body("username").notEmpty().withMessage("Invalid name"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 5, max: 20 })
    .withMessage("Password must be 5–20 characters"),
];

// -----------------------------
// Controller function
// -----------------------------
const studentRegister = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Invalid inputs",
      errors: errors.array(),
    });
  }

  try {
    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email already exists!",
      });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      usertype: "STUDENT",
    });

    await newUser.save();
    return res.json({
      success: true,
      message: "Profile created successfully!",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Unable to register profile",
    });
  }
};

module.exports = { studentRegister, studentRegisterValidation };
