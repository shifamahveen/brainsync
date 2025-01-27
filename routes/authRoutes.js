const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const editProfileController = require('../controllers/editProfileController');

// Login Page
router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/home'); // Redirect to home if logged in
    }
    const error = req.query.error || null;
    res.render('login', { error }); // Render login page with error if provided
});

// Handle Login
router.post('/login', authController.login);

// Registration Page
router.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/home'); // Redirect to home if logged in
    }
    res.render('register'); // Render registration page
});

// Handle Registration
router.post('/register', authController.register);

// Logout
router.get('/logout', authController.logout);

// Profile Page (Protected)
router.get('/profile', (req, res) => {
    if (req.session.user) {
        return profileController.getProfile(req, res);
    }
    res.redirect('/auth/login?error=You%20need%20to%20log%20in%20to%20access%20this%20page');
});

// Edit Profile Page (Protected)
router.get('/edit-profile', (req, res) => {
    if (req.session.user) {
        return res.render('edit-profile', { user: req.session.user });
    }
    res.redirect('/auth/login?error=You%20need%20to%20log%20in%20to%20access%20this%20page');
});

// Handle Edit Profile Form
router.post('/edit-profile', editProfileController.updateProfile);

module.exports = router;
