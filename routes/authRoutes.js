const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const editProfileController = require('../controllers/editProfileController');

// Serve login page
router.get('/login', (req, res) => res.render('login'));

// Handle login
router.post('/login', authController.login);

// Serve register page
router.get('/register', (req, res) => res.render('register'));

// Handle registration
router.post('/register', authController.register);

// Logout user
router.post('/logout', authController.logout);

// Profile route (requires user to be authenticated)
router.get('/profile', (req, res) => {
    if (req.session.user) {
        profileController.getProfile(req, res);
    } else {
        res.redirect('/login');
    }
});

// Edit profile page route
router.get('/edit-profile', (req, res) => {
    if (req.session.user) {
        res.render('edit-profile', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

// Handle edit profile form submission
router.post('/edit-profile', editProfileController.updateProfile);

module.exports = router;
