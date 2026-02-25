// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // must have ref
        required: true
      },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  address: { type: String },
  status:{
    type:String,
    enum:["Pending","Confirmed","Shipped","Delivered","Cancelled"],
    default:"Pending",
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);