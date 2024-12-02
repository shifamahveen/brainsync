const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes'); // Auth routes for login, register, etc.
const indexRoutes = require('./routes/indexRoutes'); // Home and other index-related routes
const chatRoutes = require('./routes/chatRoutes'); // Chat routes
const path = require('path');

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure views directory is set

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Session Configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production if using HTTPS
}));


// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/login'); // Redirect to login page after logout
    });
});

// Index Route
app.get('/index', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');  // Redirect to login if not logged in
    }
    res.render('index', { user: req.session.user });
});


// Register Routes
app.use('/', indexRoutes); // Home and other index-related routes
app.use('/', authRoutes); // Auth routes for login, registration, etc.
app.use('/index', chatRoutes); // Chat-related routes



// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
