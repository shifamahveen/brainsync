const express = require('express');
const { chatController } = require('../controllers/chatController');
const isAuthenticated = require('../middleware/authMiddleware'); // Ensure authentication middleware is applied

const router = express.Router();

router.get('/index', isAuthenticated, (req, res) => {
    res.render('index', { 
        response: '', 
        user: req.session.user || null // Pass user from session, or null if not available
    });
});

router.post('/index', isAuthenticated, chatController);


module.exports = router;
