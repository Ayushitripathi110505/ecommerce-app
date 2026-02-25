const mongoose = require("mongoose");

// 1️⃣ Define schema
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});

// 2️⃣ Export model
module.exports = mongoose.model("Cart", cartSchema);