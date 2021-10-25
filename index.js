const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const asyncWrapper = require("./utilities/asyncWrapper");
const AppError = require("./utilities/AppError");
// const flash = require("connect-flash");
const methodOverride = require("method-override");

const SportsDay = require("./models/sportsDay");
const Event = require("./models/event");
const TemplateEvent = require("./models/tempEvent");
const User = require("./models/user");

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

// app.use(flash());

// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     next();
// })

app.use("/sportsDays", sportsDayRoutes)
app.use("/sportsDays/:id/events", eventRoutes)
app.use("/sportsDays/:id/events/:eventId", userRoutes)
app.use("/templateEvents", templateRoutes)

app.get("/", (req, res) => {
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