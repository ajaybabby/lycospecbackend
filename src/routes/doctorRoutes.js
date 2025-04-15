const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorById } = require('../controllers/doctorController');

router.get('/getdoctors', getAllDoctors);
router.get('/:id', getDoctorById);

module.exports = router;