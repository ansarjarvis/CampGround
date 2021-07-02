const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./model/compground");
const methodOverride = require("method-override");

mongoose.connect('mongodb://localhost:27017/camp-ground', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("DataBase is connected")
});

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("home");
})
app.get("/campground", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campground/index", { campgrounds })
})

app.get("/campground/new", (req, res) => {
    res.render("campground/new");
})

app.post("/campground", async (req, res) => {
    const newCampground = await new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campground/${newCampground.id}`)
})


app.get("/campground/:id", async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id);
    res.render("campground/show", { foundCamp });
})

app.get("/campground/:id/edit", async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id)
    res.render("campground/edit", { foundCamp });
})

app.patch("/campground/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campground/${id}`)
})

app.delete("/campground/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect("/campground");
})

app.listen(3000, () => {
    console.log("listing to 3000")
})