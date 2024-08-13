const express = require('express');
const multer = require('multer');
const path = require('path');
const { register, login, getUserBookings, cancelBooking, getTours, createBooking } = require('../controllers/userController');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware for authentication

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique filenames
  }
});

const upload = multer({ storage: storage });

// Register route with file upload handling
router.post('/register', upload.single('photo'), register); // 'photo' should match the key used in your form

// Login route
router.post('/login', login);

router.get('/tours', getTours);

// Create Booking
router.post('/bookings', auth, createBooking);

// Get User Bookings
router.get('/bookings', auth, getUserBookings);

// Cancel Booking
router.delete('/bookings/:id', auth, cancelBooking);

module.exports = router;
