const express = require("express")
const router = express.Router({ mergeParams: true });
const Campground = require("../model/compground");
const Review = require("../model/reviews")
const catchAsync = require("../error-utilities/catchAsync")
const isLoggedIn = require("../middleware").isLoggedIn
const isReviewAuthor = require("../middleware").isReviewAuthor
const reviewValidator = require("../middleware").reviewValidator
const review = require("../controllers/review")

router.post("/", isLoggedIn, reviewValidator, catchAsync(review.createReview))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview))

module.exports = router;