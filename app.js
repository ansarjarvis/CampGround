const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const expressError = require("./error-utilities/expressError");
const campgroundRouter = require("./routes/campground");
const reviewRouter = require("./routes/review");
const path = require("path");


mongoose.connect('mongodb://localhost:27017/camp-ground', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("DataBase is connected")
});


const app = express();
app.engine("ejs", ejsMate);


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")))
const sessionConfig = {
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        HttpOnly: true,
        expires: Date.now + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}
app.use(session(sessionConfig));
app.use(flash());


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next();
})

app.use("/campground", campgroundRouter);
app.use("/campground/:id/review", reviewRouter);

app.get("/", (req, res) => {
    res.render("home");
})

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