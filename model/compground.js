const mongoose = require("mongoose");

const campSchema = mongoose.Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

const Campground = mongoose.model("Campground", campSchema);
module.exports = Campground;