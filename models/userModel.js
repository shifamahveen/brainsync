const db=require('../config/db');

exports.registerUser = (username, phone, email, hashedPassword, gender, location, callback) => {
    const role = 'user';
    const query = "INSERT INTO users (username, phone, email, password, role, gender, location) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(query, [username, phone, email, hashedPassword, role, gender, location], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        console.log('User registered in database with ID:', result.insertId);
        callback(null, result);
    });
};


exports.getUserByEmail = (email, callback) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error in getUserByEmail:', err);
            return callback(err, null);
        }
        callback(null, results.length > 0 ? results[0] : null);
    });
};
