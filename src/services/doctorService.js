const doctorRepository = require('../repositories/doctorRepository');

const getAllDoctors = async () => {
    try {
        const doctors = await doctorRepository.getAllDoctors();
        return {
            success: true,
            data: doctors
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

const getDoctorById = async (id) => {
    try {
        const doctor = await doctorRepository.getDoctorById(id);
        if (!doctor) {
            return {
                success: false,
                error: 'Doctor not found'
            };
        }
        return {
            success: true,
            data: doctor
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    getAllDoctors,
    getDoctorById
};