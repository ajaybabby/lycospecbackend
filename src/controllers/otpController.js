const otpService = require('../services/otpService');

const sendOTP = async (req, res) => {
    try {
        const { contact } = req.body;

        if (!contact) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }
        const email = contact;

        const result = await otpService.sendOTPToDoctor(email);
        
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
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                error: 'Email and OTP are required'
            });
        }

        const result = await otpService.verifyOTPAndLogin(email, otp);

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