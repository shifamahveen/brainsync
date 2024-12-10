function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login?error=You need to log in to access this page');
}

module.exports = isAuthenticated;
