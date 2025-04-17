const patientService = require('../services/patientService');

const registerPatient = async (req, res) => {
    try {
        const result = await patientService.registerPatient(req.body);
        
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

module.exports = {
    registerPatient
};