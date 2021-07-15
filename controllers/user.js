const User = require("../model/user")

module.exports.renderRegister = (req, res) => {
    res.render("user/register");
}

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, (e) => {
            if (e) {
                return next(e);
            }
            else {
                req.flash("success", " successfully register !!")
                res.redirect("/campground")
            }
        });
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/register")
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("user/login")
}

module.exports.login = (req, res) => {
    req.flash("success", " welcome back");
    const redirectUrl = req.session.returnTo || "/campground"
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logOut();
    req.flash("success", "successfully logOut")
    res.redirect("/campground")
}