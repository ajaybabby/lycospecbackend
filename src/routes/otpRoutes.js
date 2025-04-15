const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTPAndLogin } = require('../controllers/otpController');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTPAndLogin);

module.exports = router;