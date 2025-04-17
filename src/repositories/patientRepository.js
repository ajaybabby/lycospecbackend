const pool = require('../config/db');

const createPatient = async (patientData) => {
    const [result] = await pool.query(
        'INSERT INTO patient (name, phone, age, gender,aadhar,email) VALUES (?, ?, ?, ?,?,?)',
        [patientData.name, patientData.phone, patientData.age, patientData.gender,patientData.aadhar,patientData.email]
    );
    return result.insertId;
};

const getPatientByPhone = async (phone) => {
    const [rows] = await pool.query('SELECT * FROM patient WHERE phone = ?', [phone]);
    return rows[0];
};

module.exports = {
    createPatient,
    getPatientByPhone
};