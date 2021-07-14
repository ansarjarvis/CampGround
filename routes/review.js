const express = require("express")
const router = express.Router({ mergeParams: true });
const Campground = require("../model/compground");
const Review = require("../model/reviews")
const catchAsync = require("../error-utilities/catchAsync")
const isLoggedIn = require("../middleware").isLoggedIn
const isReviewAuthor = require("../middleware").isReviewAuthor
const reviewValidator = require("../middleware").reviewValidator

router.post("/", isLoggedIn, reviewValidator, catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    foundCamp.reviews.push(newReview);
    await foundCamp.save();
    await newReview.save();
    req.flash("success", " You Successfully Created a Review")
    res.redirect(`/campground/${foundCamp.id}`)
}))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "  Successfully Daleted Your Review")
    res.redirect(`/campground/${id}`)

}))

module.exports = router;