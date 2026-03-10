// services/passportconf.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcryptjs");
const config = require("config");

const userModel = require("../models/user");
const adminModel = require("../models/admin");

// =========================
// ✅ USER LOGIN STRATEGY
// =========================
const localStrategyOptionUser = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
};

async function localStrategyVerifyUser(req, email, password, done) {
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return done(null, false, {
        success: false,
        message: "Email not registered",
      });
    }
    if (!user.status) {
      return done(null, false, { success: false, message: "Account blocked" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return done(null, false, { success: false, message: "Invalid password" });
    }

    return done(null, user, {
      success: true,
      message: "Logged in successfully",
    });
  } catch (err) {
    return done(err, false, { success: false, message: "Server error" });
  }
}

passport.use(
  "login",
  new LocalStrategy(localStrategyOptionUser, localStrategyVerifyUser),
);

// =========================
// ✅ ADMIN LOGIN STRATEGY
// =========================
const localStrategyOptionAdmin = {
  usernameField: "username",
  passwordField: "password",
  passReqToCallback: true,
};

async function localStrategyVerifyAdmin(req, username, password, done) {
  try {
    const admin = await adminModel.findOne({ username });

    if (!admin) {
      return done(null, false, { success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return done(null, false, { success: false, message: "Invalid password" });
    }

    return done(null, admin, {
      success: true,
      message: "Logged in successfully",
    });
  } catch (err) {
    return done(err, false, { success: false, message: "Server error" });
  }
}

passport.use(
  "admin-login",
  new LocalStrategy(localStrategyOptionAdmin, localStrategyVerifyAdmin),
);

// =========================
// ✅ JWT OPTIONS
// =========================
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get("jwt.secret"),
};

// =========================
// ✅ USER JWT STRATEGY
// =========================
async function jwtStrategyVerifyUser(jwt_payload, done) {
  try {
    const user = await userModel.findById(jwt_payload._id);
    if (!user)
      return done(null, false, {
        success: false,
        message: "Authorization failed",
      });
    return done(null, user, {
      success: true,
      message: "Authorization successful",
    });
  } catch (err) {
    return done(err, false, { success: false, message: "Server error" });
  }
}

passport.use("user-token", new JwtStrategy(jwtOptions, jwtStrategyVerifyUser));

// =========================
// ✅ ADMIN JWT STRATEGY
// =========================
async function jwtStrategyVerifyAdmin(jwt_payload, done) {
  try {
    const admin = await adminModel.findById(jwt_payload._id);
    if (!admin)
      return done(null, false, {
        success: false,
        message: "Authorization failed",
      });
    return done(null, admin, {
      success: true,
      message: "Authorization successful",
    });
  } catch (err) {
    return done(err, false, { success: false, message: "Server error" });
  }
}

passport.use(
  "admin-token",
  new JwtStrategy(jwtOptions, jwtStrategyVerifyAdmin),
);

module.exports = passport;
