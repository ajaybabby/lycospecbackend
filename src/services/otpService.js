const pool = require('../config/db');
const nodemailer = require('nodemailer');
const doctorRepository = require('../repositories/doctorRepository');
const otpRepository = require('../repositories/otpRepository');
const patientRepository = require('../repositories/patientRepository');
const jwt = require('jsonwebtoken');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPToPatient = async (email) => {
    try {
        const otp = generateOTP();
        const expiryTime = new Date(Date.now() + 10 * 60000); // 10 minutes expiry

        // Save OTP in database
        await otpRepository.savePatientOTP(email, otp, expiryTime);

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
            text: `Your OTP is: ${otp}. Valid for 10 minutes.`
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

const sendOTPToDoctor = async (email) => {
    try {
        const doctor = await doctorRepository.getDoctorByEmail(email);
        if (!doctor) {
            return {
                success: false,
                error: 'Doctor not found with this email'
            };
        }

        const otp = generateOTP();
        const expiryTime = new Date(Date.now() + 10 * 60000); // 10 minutes expiry

        await otpRepository.saveDoctorOTP(email, otp, expiryTime);

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
            text: `Your OTP is: ${otp}. Valid for 10 minutes.`
        });

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

        // Get patient details
        const patient = await patientRepository.getPatientByEmail(email);

        // Generate JWT token
        const token = jwt.sign(
            { 
                email: email,
                userType: 'patient',
                patientId: patient.id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            success: true,
            message: 'OTP verified successfully',
            token: token,
            userType: 'patient',
            data: {
                id: patient.id,
                name: patient.name,
                email: patient.email,
                age: patient.age,
                gender: patient.gender
            }
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
        const otpRecord = await otpRepository.getDoctorOTP(email);
        
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
        await otpRepository.deleteDoctorOTP(email);

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




module.exports = {
    sendOTPToDoctor,
    verifyOTPAndLogin,
    sendOTPToPatient,
    verifyPatientOTPAndLogin
};