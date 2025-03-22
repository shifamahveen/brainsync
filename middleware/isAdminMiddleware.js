function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    console.log('Access denied, user is not admin');
    return res.status(403).send('Access denied. You are not an admin.'); 
}

module.exports = isAdmin;