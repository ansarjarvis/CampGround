const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./model/compground");
const Review = require("./model/reviews")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./error-utilities/catchAsync")
const expressError = require("./error-utilities/expressError")
const validSchema = require("./validator/joiSchema");
const reviewValidSchema = require("./validator/joiSchema")



mongoose.connect('mongodb://localhost:27017/camp-ground', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("DataBase is connected")
});

const app = express();

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



function validator(req, res, next) {

    const { error } = validSchema.validate(req.body)
    if (error) {
        const msg = error.details.map((ele) => { return ele.message }).join(",")
        throw new expressError(msg, 404)
    }
    else {
        next();
    }
}
function reviewValidator(req, res, next) {
    const { error } = reviewValidSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((ele) => { return ele.message }).join(",")
        throw new expressError(msg, 404)
    }
    else {
        next();
    }
}


app.get("/", (req, res) => {
    res.render("home");
})
app.get("/campground", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campground/index", { campgrounds })
}))

app.get("/campground/new", (req, res) => {
    res.render("campground/new");
})

app.post("/campground", validator, catchAsync(async (req, res) => {
    const newCampground = await new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campground/${newCampground.id}`)
}))

app.get("/campground/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id).populate("reviews")
    res.render("campground/show", { foundCamp });
}))

app.get("/campground/:id/edit", catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id)
    res.render("campground/edit", { foundCamp });
}))

app.patch("/campground/:id", validator, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campground/${id}`)
}))

app.delete("/campground/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect("/campground");
}))

app.post("/campground/:id/review", reviewValidator, catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id);
    const newReview = new Review(req.body.review);
    foundCamp.reviews.push(newReview);
    await foundCamp.save();
    await newReview.save();
    res.redirect(`/campground/${foundCamp.id}`)
}))

app.delete("/campground/:id/review/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campground/${id}`)

}))

app.all("*", (req, res, next) => {
    next(new expressError("page not found", 500))
})

app.use((err, req, res, next) => {
    const { sourceCode = 400 } = err;
    if (!err.message) { err.message = "something went wrong" }
    res.status(sourceCode).render("error", { err })
})

app.listen(3000, () => {
    console.log("listing to 3000")
})