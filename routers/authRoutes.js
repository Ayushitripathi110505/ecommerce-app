// routers/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const path = require("path");
const mongoose = require('../db'); // Use the same connection
const User = require("../models/User");

// -----------------------------
// SECRET PASSKEY for admin registration
// Only someone knowing this can create a new admin
// -----------------------------
const ADMIN_PASSKEY = "mySuperSecretAdminKey"; // <-- change this to your secret

// -----------------------------
// GET Login page
// -----------------------------
router.get("/login", (req, res) => {
  const role = req.query.role;
  if (role === "admin") {
    res.sendFile(path.join(__dirname, "../views/admin-login.html"));
  } else {
    res.sendFile(path.join(__dirname, "../views/user-login.html"));
  }
});

// -----------------------------
// GET Register page
// -----------------------------
router.get("/register", (req, res) => {
  const role = req.query.role;
  if (role === "admin") {
    res.sendFile(path.join(__dirname, "../views/admin-register.html"));
  } else {
    res.sendFile(path.join(__dirname, "../views/user-register.html"));
  }
});

// -----------------------------
// POST Register
// -----------------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, passkey } = req.body;

    // Only allow admin registration if passkey matches
    if (role === "admin" && passkey !== ADMIN_PASSKEY) {
      return res.send("Invalid admin passkey. You cannot create an admin account.");
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send(
        `Email already registered. <a href="/auth/login?role=${role}">Login</a>`
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    // Redirect to login
    res.redirect(`/auth/login?role=${role}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// -----------------------------
// POST Login
// -----------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body; // role comes from hidden input in login form

    // Find user with correct email AND role
    const user = await User.findOne({ email, role });
    if (!user) return res.send(`No ${role} found with this email`);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("Incorrect password");

    // Save user info in session
    req.session.user = {
      name: user.name,
      id: user.id,
      email: user.email,
      role: user.role
    };

    // Redirect based on role
    if (user.role === "admin") {
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/user/dashboard");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// -----------------------------
// LOGOUT
// -----------------------------
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

module.exports = router;