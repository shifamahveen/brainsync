function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next(); // User is authenticated, proceed to the next middleware
    }
    res.redirect('/auth/login?error=You%20need%20to%20log%20in%20to%20access%20this%20page'); // Redirect if not authenticated
}

module.exports = isAuthenticated;
