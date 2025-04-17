const patientRepository = require('../repositories/patientRepository');

const registerPatient = async (patientData) => {
    try {
        // Check if patient already exists
        const existingPatient = await patientRepository.getPatientByPhone(patientData.phone);
        if (existingPatient) {
            return {
                success: false,
                error: 'Patient with this phone number already exists'
            };
        }

        // Create new patient
        const patientId = await patientRepository.createPatient(patientData);
        
        return {
            success: true,
            message: 'Patient registered successfully',
            data: {
                id: patientId,
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