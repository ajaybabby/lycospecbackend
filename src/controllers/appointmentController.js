const appointmentService = require('../services/appointmentService');

const bookAppointment = async (req, res) => {
    try {
        const bookingData = {
            doctor_id: req.body.doctor_id,
            appointment_date: req.body.appointment_date,
            time_slot: req.body.time_slot,
            patient_name: req.body.patient_name,
            patient_age: req.body.patient_age,
            patient_gender: req.body.patient_gender,
            patient_email: req.body.patient_email
        };

        // Validate required fields
        if (!bookingData.doctor_id || !bookingData.appointment_date || 
            !bookingData.time_slot || !bookingData.patient_name) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const result = await appointmentService.bookAppointment(bookingData);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

module.exports = {
    bookAppointment
};