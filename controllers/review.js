const Campground = require("../model/compground")
const Review = require("../model/reviews")

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    foundCamp.reviews.push(newReview);
    await foundCamp.save();
    await newReview.save();
    req.flash("success", " You Successfully Created a Review")
    res.redirect(`/campground/${foundCamp.id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "  Successfully Daleted Your Review")
    res.redirect(`/campground/${id}`)

}