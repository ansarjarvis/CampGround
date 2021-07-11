const express = require("express")
const router = express.Router({ mergeParams: true });
const Campground = require("../model/compground");
const Review = require("../model/reviews")
const { reviewValidSchema } = require("../validator/joiSchema")
const catchAsync = require("../error-utilities/catchAsync")
const expressError = require("../error-utilities/expressError")


const reviewValidator = (req, res, next) => {
    const { error } = reviewValidSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((ele) => { return ele.message }).join(",")
        throw new expressError(msg, 404)
    }
    else {
        next();
    }
}

router.post("/", reviewValidator, catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id);
    const newReview = new Review(req.body.review);
    foundCamp.reviews.push(newReview);
    await foundCamp.save();
    await newReview.save();
    req.flash("success", " You Successfully Created a Review")
    res.redirect(`/campground/${foundCamp.id}`)
}))

router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "  Successfully Daleted Your Review")
    res.redirect(`/campground/${id}`)

}))

module.exports = router;