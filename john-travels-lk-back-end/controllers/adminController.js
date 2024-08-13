// controllers/adminController.js
const User = require('../models/User');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tour-uploads'); // Define upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Define file naming convention
  }
});

const upload = multer({ storage });

exports.login = async (req, res) => {
  console.log('Request Body:', req.body); 
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, role: 'admin' });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
// View Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// View Tours
exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours); // Send array of tours
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addTour = async (req, res) => {
  const { title, city, address, distance, desc, price, maxGroupSize, featured } = req.body;
  const photo = req.file ? req.file.path : '';  // Get the uploaded photo path

  try {
    const newTour = new Tour({ title, city, address, distance, photo, desc, price, maxGroupSize, featured });
    await newTour.save();
    res.status(201).json({ success: true, message: 'Tour package added successfully' });
  } catch (error) {
    console.error('Error adding tour:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// View Bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Edit Booking
exports.editBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete Booking
exports.deleteBooking = async (req, res) => {
  const { id } = req.params;
  try {
    await Booking.findByIdAndDelete(id);
    res.json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete Tour
exports.deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    await Tour.findByIdAndDelete(id);
    res.json({ success: true, message: 'Tour deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get a single tour by ID
exports.getTourById = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json(tour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update tour
exports.updateTour = async (req, res) => {
  const { id } = req.params;
  const { title, city, address, distance, desc, price, maxGroupSize, featured } = req.body;
  const photo = req.file ? req.file.path : '';  // Get the uploaded photo path if available

  try {
    const updatedTour = await Tour.findByIdAndUpdate(id, { title, city, address, distance, photo, desc, price, maxGroupSize, featured }, { new: true });
    if (!updatedTour) return res.status(404).json({ message: 'Tour not found' });
    res.json({ success: true, message: 'Tour updated', tour: updatedTour });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
