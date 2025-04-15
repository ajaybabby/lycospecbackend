const doctorService = require('../services/doctorService');

const getAllDoctors = async (req, res) => {
    try {
        const result = await doctorService.getAllDoctors();
        if (!result.success) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await doctorService.getDoctorById(id);
        if (!result.success) {
            return res.status(404).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

module.exports = {
    getAllDoctors,
    getDoctorById
};