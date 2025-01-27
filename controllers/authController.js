const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
const userModel = require('../models/userModel');

// Register user and send email notification
exports.register = async (req, res) => {
    const { username, phone, email, password, gender, location } = req.body;

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to the database
        userModel.registerUser(username, phone, email, hashedPassword, gender, location, async (err, result) => {
            if (err) {
                console.error('User registration failed:', err.message || err);
                return res.redirect('/register?err=Registration failed');
            }

            console.log('User registered successfully:', result);

            // Send welcome email
            const emailResponse = await sendWelcomeEmail(email, username);

            if (!emailResponse.success) {
                console.error(`Failed to send welcome email: ${emailResponse.error}`);
            } else {
                console.log('Welcome email sent successfully:', emailResponse.responseText);
            }

            // Redirect to login page after registration
            res.redirect('/login');
        });
    } catch (error) {
        console.error('Error in registration:', error.message || error);
        res.redirect('/register?err=Registration failed');
    }
};

// Helper function to send welcome email
const sendWelcomeEmail = async (email, username) => {
    const url = 'https://mail-sender-api1.p.rapidapi.com/';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY, // Use environment variable
            'x-rapidapi-host': 'mail-sender-api1.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sendto: email,
            name: username,
            replyTo: 'admin@go-mail.us.to',
            ishtml: 'false',
            title: 'Welcome to Our BrainSync Platform!',
            body: `Hello ${username},\n\nThank you for registering! We're glad to have you on board.\n\nBest regards,\nYour Team`
        })
    };

    try {
        const response = await fetch(url, options);
        const responseText = await response.text();
        if (!response.ok) {
            return { success: false, error: `Status: ${response.status}, Response: ${responseText}` };
        }
        return { success: true, responseText };
    } catch (emailError) {
        return { success: false, error: emailError.message || emailError };
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.error("Invalid or empty user input");
        return res.redirect('/login?error=Please provide both email and password');
    }

    try {
        userModel.getUserByEmail(email, async (err, user) => {
            if (err || !user) {
                console.error('Login failed: Invalid email or user not found.');
                return res.redirect('/login?error=Invalid email or password');
            }

            // Verify password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                console.error('Login failed: Incorrect password.');
                return res.redirect('/login?error=Invalid email or password');
            }

            // Set session details on successful login
            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role,
                email: user.email,
                phone: user.phone,
            };

            req.session.save((err) => {
                if (err) {
                    console.error("Error saving session:", err);
                    return res.redirect('/login?error=Session save failed');
                }
                console.log('User logged in successfully:', req.session.user);
                res.redirect('/index');
            });
        });
    } catch (error) {
        console.error('Error during login:', error.message || error);
        res.redirect('/login?error=Something went wrong. Please try again.');
    }
};

// Logout user
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout failed:", err);
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/login');
    });
};
