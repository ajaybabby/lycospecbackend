const videoCallRepository = require('../repositories/videoCallRepository');

const requestVideoCall = async (doctorId, patientId) => {
    try {
        const requestId = await videoCallRepository.createVideoCallRequest(doctorId, patientId);
        const callDetails = await videoCallRepository.getVideoCallRequest(requestId);
        
        return {
            success: true,
            message: 'Video call request created successfully',
            data: callDetails
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

const updateCallStatus = async (callId, status) => {
    try {
        const updated = await videoCallRepository.updateCallStatus(callId, status);
        if (!updated) {
            return {
                success: false,
                error: 'Call request not found'
            };
        }
        return {
            success: true,
            message: `Call status updated to ${status}`
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

const getDoctorVideoRequests = async (doctorId) => {
    try {
        const requests = await videoCallRepository.getDoctorVideoRequests(doctorId);
        return {
            success: true,
            data: requests
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    requestVideoCall,
    updateCallStatus,
    getDoctorVideoRequests
};