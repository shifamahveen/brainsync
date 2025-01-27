exports.registerUser = (username, phone, email, hashedPassword, gender, location, callback) => {
    const role = 'user';

    // Check if the email already exists
    const checkQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkQuery, [email], (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return callback(err, null);
        }

        if (results.length > 0) {
            console.error('Registration failed: Email already exists');
            return callback(new Error('Email already exists'), null);
        }

        // If email doesn't exist, insert the user
        const query = "INSERT INTO users (username, phone, email, password, role, gender, location) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(query, [username, phone, email, hashedPassword, role, gender, location], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return callback(err, null);
            }
            console.log('User registered successfully with ID:', result.insertId);
            callback(null, result);
        });
    });
};
