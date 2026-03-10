const mongoose = require("mongoose");
const adminService = require("../services/admin");

mongoose.set("strictQuery", true);

const options = {
  maxPoolSize: 10,
  autoIndex: false,
};

mongoose
  .connect(process.env.MONGO_URI, options)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    adminService.addAdminIfNotFound();
  })
  .catch((err) => {
    console.log("❌ Error connecting to database", err);
  });

module.exports = mongoose;
