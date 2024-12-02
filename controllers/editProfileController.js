const db = require('../config/db');

// Handle profile updates
exports.updateProfile = (req, res) => {
    const { username, phone, location, gender } = req.body;
    const email = req.session.user.email; // Email is assumed to be stored in session

    // Update user details in the database, excluding email and role
    const query = "UPDATE users SET username = ?, phone = ?, location = ?, gender = ? WHERE email = ?";
    db.query(query, [username, phone, location, gender, email], (err) => {
        if (err) {
            console.error("Error updating profile:", err);
            return res.status(500).send("An error occurred while updating profile.");
        }

        // Update session data
        req.session.user.username = username;
        req.session.user.phone = phone;
        req.session.user.location = location;
        req.session.user.gender = gender;

        // Redirect to profile page after a successful update
        res.redirect('/profile');
    });
};
