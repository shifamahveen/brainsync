module.exports = (req, res, next) => {
    if (req.session.user) {
        next(); // Proceed if user is authenticated
    } else {
        res.redirect('/login'); // Redirect to login if not authenticated
    }
};
