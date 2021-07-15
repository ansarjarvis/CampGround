const express = require("express");
const router = express.Router();
const Campground = require("../model/compground");
const catchAsync = require("../error-utilities/catchAsync")
const isLoggedIn = require("../middleware").isLoggedIn
const isAuthor = require("../middleware").isAuthor
const campgroundValidator = require("../middleware").campgroundValidator
const campground = require("../controllers/campground")

router.get("/", catchAsync(campground.index))

router.get("/new", isLoggedIn, campground.renderNewForm)

router.post("/", isLoggedIn, campgroundValidator, catchAsync(campground.createCampground))

router.get("/:id", catchAsync(campground.showCampground))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))

router.patch("/:id", isLoggedIn, isAuthor, campgroundValidator, catchAsync(campground.updateCampground))

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campground.deleteCampground))

module.exports = router;