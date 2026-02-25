// db.js
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") }); // ✅ load dotenv here

const mongoose = require("mongoose");

// Debug: check if Mongo URI is loaded
console.log("Mongo URI in db.js:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected ✅"))
.catch(err => console.log("MongoDB connection error ❌:", err));