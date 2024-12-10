// middleware/isAdminMiddleware.js
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next(); // Allow access to the next middleware or route
    }
    res.status(403).send('Access denied. You are not an admin.');
}

module.exports = isAdmin;
