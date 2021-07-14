const express = require("express");
const router = express.Router();
const Campground = require("../model/compground");
const catchAsync = require("../error-utilities/catchAsync")
const isLoggedIn = require("../middleware").isLoggedIn
const isAuthor = require("../middleware").isAuthor
const campgroundValidator = require("../middleware").campgroundValidator


router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campground/index", { campgrounds })
}))

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campground/new");
})

router.post("/", isLoggedIn, campgroundValidator, catchAsync(async (req, res) => {
    const newCampground = await new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", " Successfully Created Farm")
    res.redirect(`/campground/${newCampground.id}`)
}))

router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await (await Campground.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("author"))
    if (!foundCamp) {
        req.flash("error", "Campground Not Found")
        return res.redirect("/campground")
    }
    res.render("campground/show", { foundCamp });
}))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id)
    if (!foundCamp) {
        req.flash("error", " cannot find that campground")
        return res.redirect("/campground")
    }
    res.render("campground/edit", { foundCamp });
}))

router.patch("/:id", isLoggedIn, isAuthor, campgroundValidator, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash("success", " Successfully Update Farm")
    res.redirect(`/campground/${id}`)
}))

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash("success", " Successfully Deleted Farm")
    res.redirect("/campground");
}))

module.exports = router;