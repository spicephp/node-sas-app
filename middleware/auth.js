function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.loggedin) {
        return next();
    }
    req.flash('errorMsg', 'Please log in to access this page.');
    res.redirect('/');
}
module.exports = ensureAuthenticated;