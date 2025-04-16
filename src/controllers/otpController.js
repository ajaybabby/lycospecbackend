const otpService = require('../services/otpService');

const sendOTP = async (req, res) => {
    try {
        const { email, userType } = req.body;

        if (!email || !userType) {
            return res.status(400).json({
                success: false,
                error: 'Email and user type are required'
            });
        }

        let result;
        if (userType === 'doctor') {
            result = await otpService.sendOTPToDoctor(email);
        } else if (userType === 'patient') {
            result = await otpService.sendOTPToPatient(email);
        } else {
            return res.status(400).json({
                success: false,
                error: 'Invalid user type'
            });
        }
        
        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

const verifyOTPAndLogin = async (req, res) => {
    try {
        const { email, otp, userType } = req.body;

        if (!email || !otp || !userType) {
            return res.status(400).json({
                success: false,
                error: 'Email, OTP, and user type are required'
            });
        }

        let result;
        if (userType === 'doctor') {
            result = await otpService.verifyOTPAndLogin(email, otp);
        } else if (userType === 'patient') {
            result = await otpService.verifyPatientOTPAndLogin(email, otp);
        } else {
            return res.status(400).json({
                success: false,
                error: 'Invalid user type'
            });
        }

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

module.exports = {
    sendOTP,
    verifyOTPAndLogin
};