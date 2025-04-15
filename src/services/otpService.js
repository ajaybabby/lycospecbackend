const nodemailer = require('nodemailer');
const doctorRepository = require('../repositories/doctorRepository');

// ... existing code ...

const sendOTPToDoctor = async (email) => {
    try {
        // Check if doctor exists
        // const doctor = await doctorRepository.getDoctorByEmail(email);
        // if (!doctor) {
        //     return {
        //         success: false,
        //         error: 'Doctor not found with this email'
        //     };
        // }

        const otp = generateOTP();
        await sendEmailOTP(email, otp);
        await createOTPRecord(doctor.id, otp, 'email');

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

const verifyOTPAndLogin = async (doctorId, otp) => {
    try {
        const isValid = await verifyOTP(doctorId, otp);
        
        if (!isValid) {
            return {
                success: false,
                error: 'Invalid or expired OTP'
            };
        }

        // Get doctor details for login response
        const doctorDetails = await doctorRepository.getFullDoctorDetails(doctorId);
        
        return {
            success: true,
            message: 'Login successful',
            data: doctorDetails
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    // ... existing exports ...
    sendOTPToDoctor,
    verifyOTPAndLogin
};