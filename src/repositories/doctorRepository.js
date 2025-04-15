const pool = require('../config/db');

const getAllDoctors = async () => {
    const [rows] = await pool.query(`
        SELECT 
            d.*,
            h.name as hospital_name,
             h.area as area_name,
            s.name as specialization_name
        FROM doctor d
        LEFT JOIN hospital h ON d.hospital_id = h.id
        LEFT JOIN specialization s ON d.specialization_id = s.id
    `);
    return rows;
};

const getDoctorById = async (id) => {
    const [rows] = await pool.query(`
        SELECT 
            d.*,
            h.name as hospital_name,
            h.area as area_name,
            s.name as specialization_name
        FROM doctor d
        LEFT JOIN hospital h ON d.hospital_id = h.id
        LEFT JOIN specialization s ON d.specialization_id = s.id
        WHERE d.id = ?
    `, [id]);
    return rows[0];
};

const createPatient = async (patientData) => {
    const [result] = await pool.query(`
        INSERT INTO patient (name, age, gender, email) 
        VALUES (?, ?, ?, ?)`,
        [
            patientData.patient_name,
            patientData.patient_age,
            patientData.patient_gender,
            patientData.patient_email
        ]
    );
    return result.insertId;
};

const createAppointment = async (appointmentData) => {
    const [result] = await pool.query(`
        INSERT INTO appointments (
            doctor_id,
            patient_id,
            appointment_date,
            appointment_time
        ) VALUES (?, ?, ?, ?)`,
        [
            appointmentData.doctor_id,
            appointmentData.patient_id,
            appointmentData.appointment_date,
            appointmentData.time_slot
        ]
    );
    return result;
};



module.exports = {
    getAllDoctors,
    getDoctorById,
    createPatient,
    createAppointment
};