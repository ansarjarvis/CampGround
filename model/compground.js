const mongoose = require("mongoose");
const Review = require("./reviews")
const opts = { toJSON: { virtuals: true } }

const imageSchema = new mongoose.Schema({
    url: String,
    filename: String
});

imageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200")
})

const campSchema = new mongoose.Schema({
    title: String,
    price: Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [imageSchema],
    description: String,
    location: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
}, opts)

campSchema.virtual("properties.popUpMarkup").get(function () {
    return `
    <strong><a href ="/campground/${this.id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 25)}...</p >
`
})

campSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
})

const Campground = mongoose.model("Campground", campSchema);
module.exports = Campground;