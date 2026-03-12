/*const express = require("express");
const router = express.Router();
const mongoose = require('../db'); // Use the same connection

const Cart = require("../models/Cart");
const { isAuthenticated } = require("../authentication/authMiddleware");
*/

const express = require("express");
const router = express.Router();
const mongoose = require('../db');
const Cart = require("../models/Cart");
const { isAuthenticated } = require("../authentication/authMiddleware");
// ======================
// VIEW CART
// ======================
/*router.get("/cart", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product");

    res.render("cart", { cart });

  } catch (err) {
    console.log("CART ERROR:", err);
    res.status(500).send("Error loading cart");
  }
});
*/
// ======================
// SHOW CART PAGE
// ======================
router.get("/user/cart", isAuthenticated, async (req, res) => {

  const cart = await Cart.findOne({ user: req.session.user.id })
    .populate("items.product");

  let grandTotal = 0;

  if (cart && cart.items && cart.items.length > 0) {
    cart.items.forEach(item => {
      grandTotal += item.product.price * item.quantity;
    });
  }

  res.render("cart", {
    cart: cart || { items: [] },   // prevents EJS crash
    grandTotal,
    razorpayKey: process.env.RAZORPAY_KEY_ID
  });

});
//===================CREATE ORDER==========
router.post("/create-order", isAuthenticated, async (req, res) => {
  try {
    const razorpay = req.app.locals.razorpay;   // ✅ get razorpay instance

    const amount = req.body.amount;

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {
    console.log("Razorpay Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ======================
// ADD TO CART
// ======================
router.post("/add-to-cart/:id", isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;
  const productId = req.params.id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res.redirect("/user/cart");

  } catch (err) {
    console.log("Add to cart error:", err);
    res.send("Failed to add to cart");
  }
});
// ======================
// REMOVE FROM CART
// ======================
router.post("/remove-from-cart/:id", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const productId = req.params.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.redirect("/user/cart");
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    res.redirect("/user/cart");

  } catch (err) {
    console.log("REMOVE ERROR:", err);
    res.status(500).send("Error removing item");
  }
});

module.exports = router;