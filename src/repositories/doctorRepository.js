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
    const currentDate = new Date().toISOString().split('T')[0];
    const [result] = await pool.query(`
        INSERT INTO appointment (
            doctor_id,
            patient_id,
            appointment_date,
            time_slot
        ) VALUES (?, ?, ?, ?)`,
        [
            appointmentData.doctor_id,
            appointmentData.patient_id,
            currentDate,
            appointmentData.time_slot
        ]
    );
    return result;
};

const getAllAppointments = async () => {
    const [rows] = await pool.query(`
        SELECT 
            a.*,
            d.name as doctor_name,
            p.name as patient_name
        FROM appointment a
        LEFT JOIN doctor d ON a.doctor_id = d.id
        LEFT JOIN patient p ON a.patient_id = p.id
        ORDER BY a.appointment_date, a.time_slot
    `);
    return rows;
};

const getDoctorByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM doctor WHERE email = ?', [email]);
    return rows[0];
};

const getFullDoctorDetails = async (doctorId) => {
    const [rows] = await pool.query(`
        SELECT 
            d.*,
            h.name as hospital_name,
            h.area as area_name,
            s.name as specialization_name
        FROM doctor d
        LEFT JOIN hospital h ON d.hospital_id = h.id
        LEFT JOIN specialization s ON d.specialization_id = s.id
        WHERE d.id = ?`,
        [doctorId]
    );
    return rows[0];
};

const verifyOTPInDB = async (email, otp) => {
    const [rows] = await pool.query(
        `SELECT * FROM otp_verification 
        WHERE email = ? 
        AND otp = ? 
        AND expires_at > NOW() 
        AND is_verified = FALSE 
        ORDER BY created_at DESC 
        LIMIT 1`,
        [email, otp]
    );

    if (rows.length > 0) {
        await pool.query(
            'UPDATE otp_verification SET is_verified = TRUE WHERE id = ?',
            [rows[0].id]
        );
        return true;
    }
    return false;
};

const getVideoEnabledDoctors = async () => {
    const [rows] = await pool.query(`
        SELECT 
            d.*,
            h.name as hospital_name,
            s.name as specialization_name
        FROM doctor d
        LEFT JOIN hospital h ON d.hospital_id = h.id
        LEFT JOIN specialization s ON d.specialization_id = s.id
        WHERE d.video_enabled = 'yes'
        ORDER BY d.name
    `);
    return rows;
};

module.exports = {
    getAllDoctors,
    getDoctorById,
    createPatient,
    createAppointment,
    getAllAppointments,
    getDoctorByEmail,
    getFullDoctorDetails,
    verifyOTPInDB  ,
    getVideoEnabledDoctors
    // Add this to exports
};