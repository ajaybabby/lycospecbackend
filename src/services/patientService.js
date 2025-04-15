const patientRepository = require('../repositories/patientRepository');

const registerPatient = async (patientData) => {
    try {
        // Validate aadhar format
        if (!/^\d{12}$/.test(patientData.aadhar)) {
            return {
                success: false,
                error: 'Invalid Aadhar number format'
            };
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientData.email)) {
            return {
                success: false,
                error: 'Invalid email format'
            };
        }

        const result = await patientRepository.createPatient(patientData);
        return {
            success: true,
            data: {
                id: result.insertId,
                ...patientData
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    registerPatient
};