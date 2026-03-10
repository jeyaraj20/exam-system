const mongoose = require("mongoose");
const config = require("config");
const adminService = require("../services/admin");

mongoose.set("strictQuery", true); // optional (removes warning)

// ✅ Modern options
const options = {
  maxPoolSize: 10,
  autoIndex: false,
};

if (process.env.NODE_ENV === "docker") {
  options.authSource = config.get("mongodb.authDB");
}

mongoose
  .connect(config.get("mongodb.connectionString"), options)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    adminService.addAdminIfNotFound();
  })
  .catch((err) => {
    console.log("❌ Error connecting to database", err);
  });

module.exports = mongoose;
