const Campground = require("../model/compground");
const cloudinay = require("../cloudinary").cloudinary;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN })

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campground/index", { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render("campground/new");
}

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const newCampground = await new Campground(req.body.campground);
    newCampground.geometry = geoData.body.features[0].geometry;
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash("success", " Successfully Created Farm")
    res.redirect(`/campground/${newCampground.id}`)
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const foundCamp = await (await Campground.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("author"))
    if (!foundCamp) {
        req.flash("error", "Campground Not Found")
        return res.redirect("/campground")
    }
    res.render("campground/show", { foundCamp });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id)
    if (!foundCamp) {
        req.flash("error", " cannot find that campground")
        return res.redirect("/campground")
    }
    res.render("campground/edit", { foundCamp });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    foundCamp.images.push(...imgs);
    await foundCamp.save();
    if (req.body.deleteImages) {
        // deletion from cloudinart 
        for (let filename of req.body.deleteImages) {
            await cloudinay.uploader.destroy(filename)
        }
        // deletion form mongo
        await foundCamp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash("success", " Successfully Update Farm")
    res.redirect(`/campground/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash("success", " Successfully Deleted Farm")
    res.redirect("/campground");
}