const express = require("express");
const session = require("express-session");
const path = require("path");



const authRoutes = require("./routers/authRoutes");
const userRoutes = require("./routers/userRoutes");
const adminRoutes = require("./routers/adminRoutes");
const cartRoutes = require("./routers/cartRoutes");
const app = express();

console.log("Starting app.js..."); 
require("./db");
// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: "your secret key",
    resave: false,             
    saveUninitialized: false   
}));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
// Home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "role-selection.html")); 
});

// Role selection
app.post("/role/select", (req, res) => {
    const { role } = req.body;
    res.redirect(`/auth/login?role=${role}`);
});


// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/", cartRoutes);

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

// Server
app.listen(4000, () => {
    console.log("Server running at http://localhost:4000");
});