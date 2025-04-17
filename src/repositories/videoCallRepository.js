const pool = require('../config/db');

const createVideoCallRequest = async (doctorId, patientId) => {
    const [result] = await pool.query(
        'INSERT INTO video_call_requests (doctor_id, patient_id) VALUES (?, ?)',
        [doctorId, patientId]
    );
    return result.insertId;
};

const getVideoCallRequest = async (id) => {
    const [rows] = await pool.query(
        `SELECT vcr.*, 
         d.name as doctor_name,
         p.name as patient_name
         FROM video_call_requests vcr
         JOIN doctor d ON vcr.doctor_id = d.id
         JOIN patient p ON vcr.patient_id = p.id
         WHERE vcr.id = ?`,
        [id]
    );
    return rows[0];
};

const updateCallStatus = async (id, status) => {
    const [result] = await pool.query(
        'UPDATE video_call_requests SET status = ? WHERE id = ?',
        [status, id]
    );
    return result.affectedRows > 0;
};

module.exports = {
    createVideoCallRequest,
    getVideoCallRequest,
    updateCallStatus
};