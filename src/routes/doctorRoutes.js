const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorById,getVideoEnabledDoctors } = require('../controllers/doctorController');


router.get('/video-enabled', getVideoEnabledDoctors);
router.get('/getdoctors', getAllDoctors);
router.get('/:id', getDoctorById);


module.exports = router;