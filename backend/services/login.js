const jwt = require("jsonwebtoken");
const config = require("config");
const passport = require("./passportconf");
const { body, validationResult } = require("express-validator");

// -----------------------------
// Validation middleware
// -----------------------------
const userLoginValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be 4–20 characters"),
];

// -----------------------------
// Controller functions
// -----------------------------
const userLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      success: false,
      message: "Invalid inputs",
      errors: errors.array(),
    });
  }

  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.json(info);
    }

    req.login({ _id: user._id }, { session: false }, (err) => {
      if (err) {
        return res.json({ success: false, message: "server error" });
      }

      const token = jwt.sign({ _id: user._id }, config.get("jwt.secret"), {
        expiresIn: "1d",
      });
      return res.json({
        success: true,
        message: "login successful",
        user: {
          username: user.username,
          type: user.usertype,
          _id: user._id,
          email: user.email,
        },
        token,
      });
    });
  })(req, res, next);
};

const userDetails = (req, res) => {
  if (req.user) {
    return res.json({
      success: true,
      user: {
        username: req.user.username,
        type: req.user.usertype,
        _id: req.user._id,
        email: req.user.email,
      },
    });
  } else {
    return res.json({ success: false, user: {} });
  }
};

module.exports = { userLogin, userDetails, userLoginValidation };
