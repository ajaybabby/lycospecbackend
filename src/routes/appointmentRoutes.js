const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/appointments', appointmentController.getAllAppointments);
router.post('/book-appointment', appointmentController.bookAppointment);
router.get('/doctor/:doctorId/appointments', appointmentController.getAppointmentsByDoctorId);

module.exports = router;