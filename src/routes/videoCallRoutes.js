const express = require('express');
const router = express.Router();
const videoCallController = require('../controllers/videoCallController');

router.post('/video-call/request', videoCallController.requestVideoCall);
router.put('/video-call/:callId/status', videoCallController.updateCallStatus);
router.get('/doctor/:doctorId/video-requests', videoCallController.getDoctorVideoRequests);

module.exports = router;