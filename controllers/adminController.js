const db = require('../config/db');

exports.getAllUsers = (req, res) => {
    db.query('SELECT id, username, email, location, phone , gender, role FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).send('Internal server error');
        }
        res.render('admin/users', { users: results, user: req.session.user });
    });
};
