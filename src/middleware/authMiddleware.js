require("dotenv").config();
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token required" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.user = decoded; // Attach user data to the request
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const verifyAdminToken = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin privileges required" });
    }
    next();
  });
};

const verifyPhcToken = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "phc") {
      return res.status(403).json({ message: "PHC privileges required" });
    }
    next();
  });
};

const verifyPatientToken = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Patient privileges required" });
    }
    next();
  });
};

module.exports = {
  verifyToken,
  verifyAdminToken,
  verifyPhcToken,
  verifyPatientToken,
};