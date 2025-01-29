const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

exports.register = async (req, res) => {
    const { username, phone, email, password, gender, location } = req.body;

    if (!username || !phone || !email || !password || !gender || !location) {
        return res.redirect('/register?err=All fields are required');
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Register the user in the database
        userModel.registerUser(username, phone, email, hashedPassword, gender, location, (err, result) => {
            if (err) {
                console.error('Registration error:', err);
                return res.redirect('/register?err=Registration failed');
            }

            // Redirect to login page after successful registration
            res.redirect('/login?success=Registration successful');
        });
    } catch (error) {
        console.error('Unexpected error during registration:', error);
        res.redirect('/register?err=Unexpected error occurred');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.redirect('/login?error=Please provide both email and password');
    }

    try {
        // Fetch user from the database
        userModel.getUserByEmail(email, (err, user) => {
            if (err || !user) {
                return res.redirect('/login?error=Invalid email or password');
            }

            // Compare the provided password with the hashed password
            const passwordMatch = bcrypt.compareSync(password, user.password);
            if (!passwordMatch) {
                return res.redirect('/login?error=Invalid email or password');
            }

            // Store user information in the session
            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role, // Ensure role is set as 'admin' for admin users
                email: user.email,
                phone: user.phone,
            };

            // Save session and redirect to the dashboard
            req.session.save((err) => {
                if (err) {
                    return res.redirect('/login?error=Session save failed');
                }
                res.redirect('/index'); // Redirect to the index page or admin dashboard
            });
        });
    } catch (error) {
        console.error('Unexpected error during login:', error);
        res.redirect('/login?error=Unexpected error occurred');
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destroy error:', err);
            return res.redirect('/index?error=Logout failed');
        }

        res.redirect('/login?success=Logged out successfully');
    });
};
