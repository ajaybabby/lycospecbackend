const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/appointments', appointmentController.getAllAppointments);
router.post('/book-appointment', appointmentController.bookAppointment);

module.exports = router;