const express = require('express');
const router = express.Router();

// Home page route (redirect to login if user is not logged in)
router.get('/', (req, res) => {
    if (req.session.user) {
        res.render('index', { user: req.session.user }); // Show the home page if logged in
    } else {
        res.redirect('/login'); // Otherwise, redirect to the login page
    }
});

module.exports = router;
