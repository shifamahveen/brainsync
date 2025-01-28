const db = require('../config/db.js'); // Adjust path to your database connection file

const userModel = {
    // Function to get a user by email
    getUserByEmail: (email, callback) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return callback(err, null);
            }

            if (results.length === 0) {
                return callback(null, null); // User not found
            }

            return callback(null, results[0]); // Return the first user found
        });
    },

    // Function to register a new user
    registerUser: (username, phone, email, hashedPassword, gender, location, callback) => {
        const query = 'INSERT INTO users (username, phone, email, password, gender, location) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [username, phone, email, hashedPassword, gender, location], (err, result) => {
            if (err) {
                console.error('Error registering user:', err);
                return callback(err, null);
            }

            return callback(null, result);
        });
    },
};

module.exports = userModel;
