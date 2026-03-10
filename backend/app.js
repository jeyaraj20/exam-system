var createError = require("http-errors");
var express = require("express");
const session = require("express-session");
const helmet = require("helmet");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
var passport = require("./services/passportconf");
var app = express();
const cors = require("cors");

// ✅ security
app.use(helmet());

// ✅ CORS
app.use(cors({ origin: "*" }));

//database connection
require("./services/connection");

//import routes
var publicRoutes = require("./routes/public");
var login = require("./routes/login");
var adminLogin = require("./routes/adminLogin");
var admin = require("./routes/admin");
var user = require("./routes/user");

//configs
app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "express-session secret",
    resave: false,
    saveUninitialized: false,
  }),
);

//passport
app.use(passport.initialize());
app.use(passport.session());

//bind routes
app.use("/api/v1/public", publicRoutes);
app.use("/api/v1/login", login);
app.use("/api/v1/adminlogin", adminLogin);
app.use(
  "/api/v1/admin",
  passport.authenticate("admin-token", { session: false }),
  admin,
);
app.use(
  "/api/v1/user",
  passport.authenticate("user-token", { session: false }),
  user,
);

//react / frontend fallback
app.get("/health", (req, res) => {
  res.status(200).send("KaveriLearn API is running 🚀");
});

// React fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

//404
app.use(function (req, res, next) {
  next(
    createError(
      404,
      "Invalid API. Use the official documentation to get the list of valid APIS.",
    ),
  );
});

//error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

module.exports = app;
