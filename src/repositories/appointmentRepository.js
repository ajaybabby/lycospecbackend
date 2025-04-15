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

module.exports = {
    getAllAppointments
};