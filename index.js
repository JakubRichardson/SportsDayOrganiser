const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const asyncWrapper = require("./utilities/asyncWrapper");
const AppError = require("./utilities/AppError");
// const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("passport");
const passportLocal = require("passport-local");

const SportsDay = require("./models/sportsDay");
const Event = require("./models/event");
const TemplateEvent = require("./models/tempEvent");
const User = require("./models/user");

const { notLoggedIn } = require("./middleware");

const { sportsDaySchema, eventSchema, userSchema } = require("./schemas.js"); //TODO remove me

const sportsDayRoutes = require("./routes/sportsDays");
const eventRoutes = require("./routes/events");
const userRoutes = require("./routes/users");
const templateRoutes = require("./routes/templateEvents");

mongoose.connect("mongodb://localhost:27017/sportsApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connection Open!");
})
    .catch(err => {
        console.log("Error:" + err);
    })

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const config = {
    secret: "todo",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 42 * 7 * 4, // expires in 4 weeks
        maxAge: 1000 * 60 * 60 * 42 * 7 * 4
    }
}
app.use(session(config));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
    res.locals.signedInUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.fail = req.flash("fail");
    next();
})

app.use("/sportsDays", sportsDayRoutes)
app.use("/sportsDays/:id/events", eventRoutes)
app.use("/sportsDays/:id/events/:eventId", userRoutes)
app.use("/templateEvents", templateRoutes)

app.get("/", (req, res) => {
    res.redirect("/sportsDays");
})

app.get("/login", notLoggedIn, (req, res) => {
    res.render("users/login")
})

app.post("/login", notLoggedIn, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "Succesfully logged in! Welcome Back!");
    res.redirect("/sportsDays");
})

app.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Succesfully logged out. See you soon!");
    res.redirect("/sportsDays");
})

app.get("/registerStudent", (req, res) => {
    res.render("users/registerStudent");
})

app.post("/registerStudent", async (req, res) => {
    const { firstname, surname, formGroup, house, username, password } = req.body;
    const user = new User({ teacher: false, firstname, surname, formGroup, house, username });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, err => {
        if (err) return next(err);
    });

    req.flash("success", "Welcome!");
    res.redirect("/sportsDays");
})

app.get("/registerTeacher", (req, res) => {
    res.render("users/registerTeacher")
})

app.post("/registerTeacher", async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, teacher: true });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, err => {
        if (err) return next(err);
    });

    req.flash("success", "Welcome!");
    res.redirect("/sportsDays");
})


app.all("*", (req, res, next) => {
    next(new AppError("Page Not Found!", 404));
})

app.use((err, req, res, next) => {
    const { text = "Oops, something went wrong", code = 500 } = err;
    res.status(code).render("error", { text, code });
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})