const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const editProfileController = require('../controllers/editProfileController');

// Login page route
router.get('/login', (req, res) => res.render('login')); // Serve login page

// Handle login
router.post('/login', authController.login);

// Registration page route
router.get('/register', (req, res) => res.render('register')); // Serve register page

// Handle registration
router.post('/register', authController.register);

// Logout functionality
router.post('/logout', authController.logout);

router.get('/profile', (req, res) => {
    console.log(req.session)

    if (req.session.user) {
        profileController.getProfile(req, res); // Call profile controller
    } else {
        res.redirect('/login'); // If not logged in, redirect to login
    }
});

// Edit profile page route
router.get('/edit-profile', (req, res) => {
    if (req.session.user) {
        res.render('edit-profile', { user: req.session.user }); // Pass user info to render page
    } else {
        res.redirect('/login'); // If not logged in, redirect to login
    }
});

// Handle edit profile form submission
router.post('/edit-profile', editProfileController.updateProfile);

module.exports = router;
