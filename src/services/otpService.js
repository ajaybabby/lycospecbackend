const pool = require('../config/db');
const nodemailer = require('nodemailer');
const doctorRepository = require('../repositories/doctorRepository');

const generateOTP = () => {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmailOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Login OTP',
        text: `Your OTP is: ${otp}`
    };

    return await transporter.sendMail(mailOptions);
};

const sendOTPToDoctor = async (email) => {
    try {
        // Check if doctor exists
        const doctor = await doctorRepository.getDoctorByEmail(email);
        if (!doctor) {
            return {
                success: false,
                error: 'Doctor not found with this email'
            };
        }

        const otp = generateOTP();
        await sendEmailOTP(email, otp);
        await createOTPRecord(email, otp); // Changed to use email instead of doctor.id

        return {
            success: true,
            message: 'OTP sent successfully',
            doctorId: doctor.id
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

const verifyOTPAndLogin = async (email, otp) => {
    try {
        const isValid = await verifyOTP(email, otp);
        
        if (!isValid) {
            return {
                success: false,
                error: 'Invalid or expired OTP'
            };
        }

        // Get doctor details for login response
        const doctor = await doctorRepository.getDoctorByEmail(email);
        
        return {
            success: true,
            message: 'Login successful',
            data: doctor
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

const createOTPRecord = async (email, otp) => {
    try {
        const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes expiry
        const [result] = await pool.query(
            'INSERT INTO otp_verification (email, otp, expires_at) VALUES (?, ?, ?)',
            [email, otp, expiresAt]
        );
        return result;
    } catch (error) {
        console.error('OTP Record Creation Error:', error);
        throw new Error('Failed to create OTP record: ' + error.message);
    }
};

const verifyOTP = async (email, otp) => {
    try {
        const isValid = await doctorRepository.verifyOTPInDB(email, otp);
        return isValid;
    } catch (error) {
        throw new Error('Failed to verify OTP');
    }
};

module.exports = {
    sendOTPToDoctor,
    verifyOTPAndLogin
};