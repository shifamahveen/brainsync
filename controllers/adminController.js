const db = require('../config/db');

exports.getAllUsers = (req, res) => {
    console.log('Session:', req.session.user); // Log session data for debugging

    // Query the database to fetch all users
    db.query('SELECT id, username, email, location, phone, gender, role FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).send('Internal server error');
        }
        
        console.log('Fetched users:', results); // Log the fetched users

        // Render the users page and pass the users data
        res.render('admin/users', { users: results, user: req.session.user });
    });
};
