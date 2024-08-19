const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuthenticated = (req, res, next) => {
  // Extract token from headers
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Login required" });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Optionally, you can retrieve user info from the database if needed
    // const user = await User.findById(decoded.userId);
    // req.user = user;

    req.user = decoded; // Attach user info to request object if needed
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = isAuthenticated;
