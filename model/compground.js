const mongoose = require("mongoose");
const Review = require("./reviews")

const campSchema = mongoose.Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
});

campSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
})

const Campground = mongoose.model("Campground", campSchema);
module.exports = Campground;