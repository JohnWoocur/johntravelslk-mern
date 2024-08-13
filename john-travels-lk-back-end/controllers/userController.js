const User = require('../models/User');
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const photo = req.file ? req.file.path : '';

  // Log incoming data
  console.log('Request Body:', req.body);
  console.log('Uploaded File:', req.file);

  // Validate request data
  if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create a new user
      const newUser = new User({ username, email, password: hashedPassword, photo });

      // Save the user to the database
      await newUser.save();
      res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
};

// exports.login = async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(400).json({ success: false, message: 'Invalid credentials' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ success: false, message: 'Invalid credentials' });
//         }

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ success: true, token });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// };
// In userController.js
exports.login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      // Respond with user data and token
      res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          // Add any other fields you need
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
// Get User Bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create Booking
// Create a new booking
exports.createBooking = async (req, res) => {
    const { userId, userEmail, tourName, fullName, guestSize, phone, bookAt } = req.body;
  
    try {
      // Create a new booking
      const newBooking = new Booking({
        userId,
        userEmail,
        tourName,
        fullName,
        guestSize,
        phone,
        bookAt
      });
  
      // Save the booking to the database
      await newBooking.save();
      res.status(201).json({ success: true, message: 'Booking created successfully' });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
// Cancel Booking
exports.cancelBooking = async (req, res) => {
    const { id } = req.params;
    try {
      await Booking.findByIdAndDelete(id);
      res.json({ success: true, message: 'Booking canceled' });
    } catch (error) {
      console.error(error);
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
