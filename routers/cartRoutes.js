const express = require("express");
const router = express.Router();
const mongoose = require('../db'); // Use the same connection

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
// ADD TO CART
// ======================
router.post("/add-to-cart/:id", isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;
  const productId = req.params.id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // create cart if not exists
      cart = await Cart.create({ user: userId, items: [] });
    }

    // Check if product already in cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Increase quantity by 1
      cart.items[itemIndex].quantity += 1;
    } else {
      // Add new product
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
      return res.redirect("/cart");
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    res.redirect("/cart");

  } catch (err) {
    console.log("REMOVE ERROR:", err);
    res.status(500).send("Error removing item");
  }
});

module.exports = router;