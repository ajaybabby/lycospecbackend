require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require('./routes/appointmentRoutes');
const otpRoutes = require('./routes/otpRoutes');
const { verifyAdminToken } = require("./middleware/authMiddleware");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Register routes
app.use("/api", appointmentRoutes);  // Move this first
app.use("/api", patientRoutes);
app.use("/api", doctorRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', otpRoutes);


module.exports = app;