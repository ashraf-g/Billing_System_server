const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  // Extract token from headers
  const token = req.header("authorization");

  if (!token) {
    return res.status(401).json({ message: "Login required" });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = isAuthenticated;
