const Campground = require("./model/compground")
const Review = require("./model/reviews");
const { campValidSchema } = require("./validator/joiSchema");
const expressError = require("./error-utilities/expressError");
const { reviewValidSchema } = require("./validator/joiSchema");


const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", " you are not login ")
        return res.redirect("/login")
    }
    else {
        next();
    }
}

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id);
    if (!foundCamp.author.equals(req.user.id)) {
        req.flash("error", "you dont have permission to do that")
        return res.redirect(`/campground/${id}`)
    }
    else {
        next();
    }

}

const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const foundReview = await Review.findById(reviewId);
    if (!foundReview.author.equals(req.user.id)) {
        req.flash("error", "you dont have permission to do that")
        return res.redirect(`/campground/${id}`)
    }
    else {
        next();
    }

}

const campgroundValidator = (req, res, next) => {

    const { error } = campValidSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((ele) => { return ele.message }).join(",")
        throw new expressError(msg, 404)
    }
    else {
        next();
    }
}

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

module.exports = {
    isLoggedIn,
    isAuthor,
    isReviewAuthor,
    campgroundValidator,
    reviewValidator
}