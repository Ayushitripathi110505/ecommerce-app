const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required:true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
  },

  stock: {
    type: Number,
    default: 0,
  },

  image: {
    type: String,   // later: Cloudinary URL
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Product", productSchema);