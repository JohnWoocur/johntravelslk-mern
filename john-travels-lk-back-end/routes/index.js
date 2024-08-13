const express = require('express');
const adminRoutes = require('./adminRoutes');
const authRoutes = require('./authRoutes');
const router = express.Router();
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);

module.exports = router;
