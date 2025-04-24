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

const acceptVideoCall = async (callId) => {
    try {
        const call = await videoCallRepository.getVideoCallById(callId);
        
        if (!call) {
            return {
                success: false,
                error: 'Video call request not found'
            };
        }

        if (call.status !== 'pending') {
            return {
                success: false,
                error: 'Can only accept pending calls'
            };
        }

        const actionTime = new Date();
        const updated = await videoCallRepository.updateCallStatus(callId, 'accepted', actionTime);
        
        if (!updated) {
            return {
                success: false,
                error: 'Failed to update call status'
            };
        }

        return {
            success: true,
            message: 'Video call accepted successfully',
            data: {
                callId: callId,
                status: 'accepted',
                acceptedAt: actionTime,
                doctorName: call.doctor_name,
                patientName: call.patient_name
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

const getCallStatus = async (callId) => {
    try {
        const call = await videoCallRepository.getVideoCallById(callId);
        
        if (!call) {
            return {
                success: false,
                error: 'Video call request not found'
            };
        }

        return {
            success: true,
            data: {
                callId: call.id,
                status: call.status,
                doctorName: call.doctor_name,
                patientName: call.patient_name,
                requestTime: call.request_time,
                callStartTime: call.call_start_time,
                callEndTime: call.call_end_time
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
    requestVideoCall,
    updateCallStatus,
    getDoctorVideoRequests,
    acceptVideoCall,
    getCallStatus
};