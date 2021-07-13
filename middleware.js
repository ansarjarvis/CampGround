const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", " you are not login ")
        res.redirect("/login")
    }
    else {
        next()
    }
}

module.exports = isLoggedIn;