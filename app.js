if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

// k1R10ZiaamIHWwTE

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const expressError = require("./error-utilities/expressError");
const campgroundRouter = require("./routes/campground");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user")
const User = require("./model/user")
const path = require("path");
const passport = require("passport")
const localStrategy = require("passport-local")
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const MongoStore = require('connect-mongo');


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/camp-ground';
// 'mongodb://localhost:27017/camp-ground'
mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("DataBase is connected")
});


app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")))

const secret = process.env.SECRET || "thisshouldbeabettersecret";

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
    console.log("session error")
})

const sessionConfig = {
    store: store,
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        HttpOnly: true,
        // secure:true;
        expires: Date.now + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
    if (!['/login', '/register', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next();
})

app.use("/campground", campgroundRouter);
app.use("/campground/:id/review", reviewRouter);
app.use("/", userRouter)

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listing at ${port}`)
})

