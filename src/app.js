require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require('./routes/appointmentRoutes');
const otpRoutes = require('./routes/otpRoutes');
const { verifyAdminToken } = require("./middleware/authMiddleware");
const videoCallRoutes = require('./routes/videoCallRoutes');

const app = express();

app.use(cors({
  origin: "*",
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
app.use("/api", doctorRoutes);
app.use("/appoint", appointmentRoutes);
app.use("/api", patientRoutes);
app.use('/api', otpRoutes);
app.use('/api', videoCallRoutes);  // Add video call routes

module.exports = app;