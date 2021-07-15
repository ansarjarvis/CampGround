const Campground = require("../model/compground")


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campground/index", { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render("campground/new");
}

module.exports.createCampground = async (req, res) => {
    const newCampground = await new Campground(req.body.campground);
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
    await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash("success", " Successfully Update Farm")
    res.redirect(`/campground/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash("success", " Successfully Deleted Farm")
    res.redirect("/campground");
}