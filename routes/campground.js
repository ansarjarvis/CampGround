const express = require("express");
const router = express.Router();
const catchAsync = require("../error-utilities/catchAsync")
const isLoggedIn = require("../middleware").isLoggedIn
const isAuthor = require("../middleware").isAuthor
const campgroundValidator = require("../middleware").campgroundValidator
const campground = require("../controllers/campground")
const storage = require("../cloudinary/index").storage;
const multer = require("multer");
const upload = multer({ storage });

router.get("/", catchAsync(campground.index))

router.get("/new", isLoggedIn, campground.renderNewForm)

router.post("/", isLoggedIn, upload.array("image"), campgroundValidator, catchAsync(campground.createCampground))

router.get("/:id", catchAsync(campground.showCampground))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))

router.patch("/:id", isLoggedIn, isAuthor, upload.array("image"), campgroundValidator, catchAsync(campground.updateCampground))

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campground.deleteCampground))

module.exports = router;