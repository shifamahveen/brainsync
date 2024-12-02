const db = require('../config/db');

// Fetch user profile details based on email (assuming email is stored in the session)
exports.getProfile = (req, res) => {
    if (!req.session.user || !req.session.user.email) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }

    const email = req.session.user.email;

    db.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email], (err, result) => {
        if (err) {
            console.error("Error retrieving user data:", err);
            return res.status(500).send("An error occurred while fetching profile data.");
        }
        if (result.length === 0) {
            return res.status(404).send("User not found.");
        }
        
        // Render the profile view with user data
        res.render('profile', { user: result[0] });
    });
};
