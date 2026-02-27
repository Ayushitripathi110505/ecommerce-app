require('dotenv').config(); // Load .env
const mongoose = require("mongoose");

console.log("Mongo URI:", process.env.MONGO_URI); // debug

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB!"))
  .catch(err => console.error("❌ Connection error:", err));