const pool = require('../config/db');

const createPatient = async (patientData) => {
    const [result] = await pool.query(
        `INSERT INTO patient (name, age, gender, aadhar, email) 
         VALUES (?, ?, ?, ?, ?)`,
        [
            patientData.name,
            patientData.age,
            patientData.gender,
            patientData.aadhar,
            patientData.email
        ]
    );
    return result;
};

module.exports = {
    createPatient
};