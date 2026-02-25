// db.js
const mongoose = require("mongoose");

// Simply pass the URI without options
mongoose.connect("mongodb://127.0.0.1:27017/e_commerce_app")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

module.exports = mongoose;