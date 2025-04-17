const videoCallService = require('../services/videoCallService');

const requestVideoCall = async (req, res) => {
    try {
        const { doctorId, patientId } = req.body;

        if (!doctorId || !patientId) {
            return res.status(400).json({
                success: false,
                error: 'Doctor ID and Patient ID are required'
            });
        }

        const result = await videoCallService.requestVideoCall(doctorId, patientId);
        
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

const updateCallStatus = async (req, res) => {
    try {
        const { callId } = req.params;
        const { status } = req.body;

        if (!status || !['accepted', 'rejected', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        const result = await videoCallService.updateCallStatus(callId, status);
        
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

module.exports = {
    requestVideoCall,
    updateCallStatus
};