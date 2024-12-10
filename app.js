// app.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/authRoutes'); // Auth routes for login, register, etc.
const indexRoutes = require('./routes/indexRoutes'); // Home and other index-related routes
const chatRoutes = require('./routes/chatRoutes'); // Chat routes
const isAuthenticated = require('./middleware/authMiddleware'); // Authentication middleware
const adminRoutes = require('./routes/adminRoutes'); // Admin routes

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure views directory is set

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Session Configuration
app.use(
    session({
        secret: 'your-secret-key', // Replace with a strong secret in production
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Set to true in production if using HTTPS
    })
);

// Routes
app.use('/', authRoutes); // Auth routes for login, registration, etc.
app.use('/', indexRoutes); // Home and other index-related routes
app.use('/chat', isAuthenticated, chatRoutes); // Protect chat routes with authentication

// Protect admin routes with authentication and admin-specific middleware
app.use('/admin', isAuthenticated, adminRoutes); // Only /admin/* routes are protected

// GET route for /index
app.get('/index', isAuthenticated, (req, res) => {
    if (req.session.user) {
        const response = 'This is a sample response from the backend.'; // Default response
        res.render('index', { user: req.session.user, response: response });
    } else {
        res.redirect('/login'); // Redirect to login if session is invalid
    }
});

// POST route for /index to handle form submissions
app.post('/index', isAuthenticated, (req, res) => {
    if (req.session.user) {
        const userInput = req.body.userInput; // Retrieve the form input
        const response = `You asked: "${userInput}". This is a sample response!`; // Replace with your logic
        res.render('index', { user: req.session.user, response: response });
    } else {
        res.redirect('/login'); // Redirect to login if session is invalid
    }
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/login'); // Redirect to login page after logout
    });
});

// Catch-All Route for Undefined Routes
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
