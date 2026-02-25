function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
}

function isUser(req, res, next) {
  if (req.session.user.role !== "user") {
    return res.send("Access Denied: Users only");
  }
  next();
}

function isAdmin(req, res, next) {
  if (req.session.user.role !== "admin") {
    return res.send("Access Denied: Admins only");
  }
  next();
}

module.exports = { isAuthenticated, isUser, isAdmin };