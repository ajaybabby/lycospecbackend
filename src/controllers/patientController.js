const patientService = require('../services/patientService');

const registerPatient = async (req, res) => {
    try {
        const { name, age, gender, aadhar, email } = req.body;

        // Check for required fields
        if (!name || !age || !gender || !aadhar || !email) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        const result = await patientService.registerPatient({
            name,
            age,
            gender,
            aadhar,
            email
        });

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
    registerPatient
};