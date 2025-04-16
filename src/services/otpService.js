const pool = require('../config/db');
const nodemailer = require('nodemailer');
const doctorRepository = require('../repositories/doctorRepository');
const otpRepository = require('../repositories/otpRepository');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPToPatient = async (email) => {
    try {
        const otp = generateOTP();
        const expiryTime = new Date(Date.now() + 5 * 60000); // 5 minutes expiry

        // Save OTP in database
        await otpRepository.savePatientOTP(email, otp, expiryTime);

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Patient Verification',
            text: `Your OTP is: ${otp}. Valid for 5 minutes.`
        });

        return {
            success: true,
            message: 'OTP sent successfully'
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};


const verifyPatientOTPAndLogin = async (email, otp) => {
    try {
        const otpRecord = await otpRepository.getPatientOTP(email);
        
        if (!otpRecord) {
            return {
                success: false,
                error: 'No OTP found for this email'
            };
        }

        if (otpRecord.otp !== otp) {
            return {
                success: false,
                error: 'Invalid OTP'
            };
        }

        if (new Date() > new Date(otpRecord.expiry_time)) {
            return {
                success: false,
                error: 'OTP has expired'
            };
        }

        // Delete used OTP
        await otpRepository.deletePatientOTP(email);

        return {
            success: true,
            message: 'OTP verified successfully'
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
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

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Doctor Verification',
            text: `Your OTP is: ${otp}. Valid for 5 minutes.`
        });
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
    verifyOTPAndLogin,
    sendOTPToPatient,
    verifyPatientOTPAndLogin
};