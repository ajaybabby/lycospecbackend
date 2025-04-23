const doctorRepository = require('../repositories/doctorRepository');
const appointmentRepository = require('../repositories/appointmentRepository');

const getAllAppointments = async () => {
    try {
        const appointments = await appointmentRepository.getAllAppointments();
        return {
            success: true,
            data: appointments
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

const getAppointmentsByDoctorId = async (doctorId) => {
    try {
        const appointments = await appointmentRepository.getAppointmentsByDoctorId(doctorId);
        return {
            success: true,
            data: appointments
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

const bookAppointment = async (bookingData) => {
    try {
        let patientId;

        // If patient_id is provided, use it; otherwise create new patient
        if (bookingData.patient_id) {
            patientId = bookingData.patient_id;
        } else {
            // Create patient only if patient_id is not provided
            patientId = await doctorRepository.createPatient(bookingData);
        }

        // Create appointment with the patient ID
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
    getAllAppointments,
    bookAppointment,
    getAppointmentsByDoctorId
    // keeping your existing bookAppointment service
};