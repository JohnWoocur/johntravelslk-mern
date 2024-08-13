// routes/adminRoutes.js
const express = require('express');
const { login, addTour, getUsers, getTours, getBookings, editBooking, deleteBooking, deleteUser, deleteTour, getTourById, updateTour } = require('../controllers/adminController');
const upload = require('../config/upload');
const router = express.Router();

// Admin login
router.post('/login', login);

// Admin dashboard functionalities
router.get('/users', getUsers);
router.get('/tours', getTours);
router.post('/add-tour', upload.single('photo'), addTour);

router.get('/bookings', getBookings);
router.put('/bookings/:id', editBooking);
router.delete('/bookings/:id', deleteBooking);

router.delete('/users/:id', deleteUser);

router.get('/tours/:id', getTourById);  // Route to get a single tour by ID
//router.put('/tours/:id', updateTour);  // Route to update a tour
// In your routes file
router.put('/tours/:id', upload.single('photo'), updateTour);  // Add multer middleware
router.delete('/tours/:id', deleteTour); 

module.exports = router;
