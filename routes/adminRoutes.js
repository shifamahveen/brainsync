// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); // Your controller file for admin routes
const isAuthenticated = require('../middleware/authMiddleware'); // Authentication middleware
const isAdmin = require('../middleware/isAdminMiddleware'); // Admin role check middleware

// Admin routes
router.get('/users', isAuthenticated, isAdmin, adminController.getAllUsers); // Ensure this route is correct

module.exports = router;
