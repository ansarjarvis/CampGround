const express = require("express");
const router = express.Router();
const Campground = require("../model/compground");
const catchAsync = require("../error-utilities/catchAsync")
const expressError = require("../error-utilities/expressError")
const { campValidSchema } = require("../validator/joiSchema");
const isLoggedIn = require("../middleware")



const validator = (req, res, next) => {

    const { error } = campValidSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((ele) => { return ele.message }).join(",")
        throw new expressError(msg, 404)
    }
    else {
        next();
    }
}

router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campground/index", { campgrounds })
}))

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campground/new");
})

router.post("/", validator, catchAsync(async (req, res) => {
    const newCampground = await new Campground(req.body.campground);
    await newCampground.save();
    req.flash("success", " You Successfully Created Form")
    res.redirect(`/campground/${newCampground.id}`)
}))

router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id).populate("reviews")
    if (!foundCamp) {
        req.flash("error", "Campground Not Found")
        return res.redirect("/campground")
    }
    res.render("campground/show", { foundCamp });
}))

router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id)
    res.render("campground/edit", { foundCamp });
}))

router.patch("/:id", isLoggedIn, validator, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash("success", " You Successfully Update Form")
    res.redirect(`/campground/${id}`)
}))

router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash("success", " You Successfully Deleted Form")
    res.redirect("/campground");
}))




module.exports = router;