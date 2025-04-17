const pool = require('../config/db');

const savePatientOTP = async (email, otp, expiryTime) => {
    await pool.query('DELETE FROM otp_verification WHERE email = ?', [email]);
    
    const [result] = await pool.query(
        'INSERT INTO otp_verification (email, otp, user_type, expiry_time, is_verified) VALUES (?, ?, ?, ?, ?)',
        [email, otp, 'patient', expiryTime, false]
    );
    return result;
};

const saveDoctorOTP = async (email, otp, expiryTime) => {
    await pool.query('DELETE FROM otp_verification WHERE email = ?', [email]);
    
    const [result] = await pool.query(
        'INSERT INTO otp_verification (email, otp, user_type, expiry_time, is_verified) VALUES (?, ?, ?, ?, ?)',
        [email, otp, 'doctor', expiryTime, false]
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

const getDoctorOTP = async (email) => {
    const [rows] = await pool.query(
        'SELECT * FROM otp_verification WHERE email = ? AND user_type = ? ORDER BY created_at DESC LIMIT 1',
        [email, 'doctor']
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

const deleteDoctorOTP = async (email) => {
    const [result] = await pool.query(
        'DELETE FROM otp_verification WHERE email = ? AND user_type = ?',
        [email, 'doctor']
    );
    return result;
};

module.exports = {
    savePatientOTP,
    saveDoctorOTP,
    getPatientOTP,
    getDoctorOTP,
    deletePatientOTP,
    deleteDoctorOTP
};