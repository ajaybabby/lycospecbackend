const pool = require('../config/db');

const savePatientOTP = async (email, otp, expiryTime) => {
    // First delete any existing OTP for this email
    await pool.query('DELETE FROM otp_verification WHERE email = ?', [email]);
    
    // Insert new OTP
    const [result] = await pool.query(
        'INSERT INTO otp_verification (email, otp) VALUES (?, ?, ?, ?)',
        [email, otp, expiryTime, 'patient']
    );
    return result;
};

const getPatientOTP = async (email) => {
    const [rows] = await pool.query(
        'SELECT * FROM otp_verification WHERE email = ? AND user_type = ? ORDER BY created_at DESC LIMIT 1',
        [email, 'patient']
    );
    return rows[0];
};

const deletePatientOTP = async (email) => {
    const [result] = await pool.query(
        'DELETE FROM otp_verification WHERE email = ? AND user_type = ?',
        [email, 'patient']
    );
    return result;
};

module.exports = {
    // ... existing doctor methods ...
    savePatientOTP,
    getPatientOTP,
    deletePatientOTP
};