const express = require("express");
const router = express.Router();
const User = require("../model/user")
const passport = require("passport")
const catchAsync = require("../error-utilities/catchAsync")

router.get("/register", (req, res) => {
    res.render("user/register");
})

router.post("/register", catchAsync(async (req, res) => {
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
}))

router.get("/login", (req, res) => {
    res.render("user/login")
})
router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", " welcome back");
    const redirectUrl = req.session.returnTo || "/campground"
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "successfully logOut")
    res.redirect("/campground")
})

module.exports = router;