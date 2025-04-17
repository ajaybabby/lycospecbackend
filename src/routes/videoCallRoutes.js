const express = require('express');
const router = express.Router();
const videoCallController = require('../controllers/videoCallController');

router.post('/video-call/request', videoCallController.requestVideoCall);
router.put('/video-call/:callId/status', videoCallController.updateCallStatus);

module.exports = router;