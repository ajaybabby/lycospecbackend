const pool = require('../config/db');

const getAllAppointments = async () => {
    const [rows] = await pool.query(`
        SELECT 
            d.name as doctor_name,
            h.name as hospital_name,
            p.name as patient_name,
            a.time_slot
        FROM appointment a
        LEFT JOIN doctor d ON a.doctor_id = d.id
        LEFT JOIN patient p ON a.patient_id = p.id
        LEFT JOIN hospital h ON d.hospital_id = h.id
        ORDER BY a.time_slot
    `);
    return rows;
};

const getAppointmentsByDoctorId = async (doctorId) => {
    const [rows] = await pool.query(`
        SELECT 
            a.*,
            p.name as patient_name,
            p.age as patient_age,
            p.gender as patient_gender,
            p.phone as patient_phone
        FROM appointment a
        LEFT JOIN patient p ON a.patient_id = p.id
        WHERE a.doctor_id = ?
        ORDER BY a.appointment_date DESC, a.time_slot ASC
    `, [doctorId]);
    return rows;
};

module.exports = {
    getAllAppointments,
    getAppointmentsByDoctorId
};