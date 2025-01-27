const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/authRoutes'); // Auth routes for login, registration, etc.
const indexRoutes = require('./routes/indexRoutes'); // Home and other index-related routes
const chatRoutes = require('./routes/chatRoutes'); // Chat routes
const isAuthenticated = require('./middleware/authMiddleware'); // Authentication middleware
const adminRoutes = require('./routes/adminRoutes'); // Admin routes

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
        cookie: { secure: false }, // Use true in production if HTTPS is enabled
    })
);

// Routes
app.use('/auth', authRoutes); // Auth routes for login, registration, etc.
app.use('/', isAuthenticated, indexRoutes); // Protect index-related routes
app.use('/chat', isAuthenticated, chatRoutes); // Protect chat routes
app.use('/admin', isAuthenticated, adminRoutes); // Protect admin routes

// Root Route (Redirect to Login or Home)
app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/home'); // Redirect to home if logged in
    }
    res.redirect('/auth/login'); // Redirect to login if not logged in
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
