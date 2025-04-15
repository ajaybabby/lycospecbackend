const appointmentService = require('../services/appointmentService');

const getAllAppointments = async (req, res) => {
    try {
        const result = await appointmentService.getAllAppointments();
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const bookAppointment = async (req, res) => {
    try {
        const result = await appointmentService.bookAppointment(req.body);
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    getAllAppointments,
    bookAppointment
};