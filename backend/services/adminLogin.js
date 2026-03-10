const jwt = require("jsonwebtoken");
const config = require("config");
const passport = require("./passportconf");
const { body, validationResult } = require("express-validator");

// ✅ VALIDATION
const adminLoginValidation = [
  body("username").notEmpty().withMessage("Invalid username"),
  body("password")
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be 4–20 characters"),
];

// ✅ LOGIN
const adminLogin = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({
      success: false,
      message: "Invalid inputs",
      errors: errors.array(),
    });
  }
  console.log("token-1");
  passport.authenticate(
    "admin-login",
    { session: false },
    (err, admin, info) => {
      if (err || !admin) {
        return res.json(info);
      }
      console.log("token-2");
      req.login({ _id: admin._id }, { session: false }, (err) => {
        if (err) {
          return res.json({
            success: false,
            message: "server error",
          });
        }
        console.log("token-3");
        const token = jwt.sign({ _id: admin._id }, config.get("jwt.secret"), {
          expiresIn: "1d",
        });
        console.log(token);
        return res.json({
          success: true,
          message: "login successful",
          admin: {
            username: admin.username,
            _id: admin._id,
          },
          token,
        });
      });
    },
  )(req, res, next);
};

module.exports = {
  adminLogin,
  adminLoginValidation,
};
