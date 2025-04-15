const doctorRepository = require('../repositories/doctorRepository');

const bookAppointment = async (bookingData) => {
    try {
        

        // Create patient first
        const patientId = await doctorRepository.createPatient(bookingData);

        // Create appointment with the new patient ID
        const appointmentData = {
            ...bookingData,
            patient_id: patientId
        };

        const result = await doctorRepository.createAppointment(appointmentData);

        return {
            success: true,
            data: {
                appointment_id: result.insertId,
                patient_id: patientId,
                ...bookingData
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
    bookAppointment
};