const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const SportsDay = require("./models/sportsDay");
const Event = require("./models/event");

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

app.get("/", (req, res) => {
    res.redirect("/sportsDays");
})

app.get("/sportsDays", async (req, res) => {
    const sportsDays = await SportsDay.find({}).populate({ path: "events" });
    res.render("sportsDays/index", { sportsDays });
})

app.get("/sportsDays/new", (req, res) => {
    res.render("sportsDays/new");
})

app.post("/sportsDays", async (req, res) => {
    const newSportsDay = new SportsDay(req.body);
    await newSportsDay.save();
    res.redirect(`/sportsDays/${newSportsDay._id}`);
})

app.get("/sportsDays/:id", async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id).populate({ path: "events" });
    res.render("sportsDays/show", { day: sportsDay });
})

app.get("/sportsDays/:id/edit", async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id);
    res.render("sportsDays/edit", { day: sportsDay });
})

app.put("/sportsDays/:id", async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/sportsDays/${sportsDay._id}`);
})

app.delete("/sportsDays/:id", async (req, res) => {
    const { id } = req.params;
    const deletedSportsDay = await SportsDay.findByIdAndDelete(id);
    res.redirect("/sportsDays");
})


app.get("/sportsDays/:id/events/new", async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id);
    res.render("events/new", { day: sportsDay });
})


app.post("/sportsDays/:id/events", async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id);
    const newEvent = new Event({ name: req.body.event, gender: req.body.gender });
    await newEvent.save();
    sportsDay.events.push(newEvent);
    await sportsDay.save();

    // TODO
    // req.flash("success", "Created new review!");

    res.redirect(`/sportsDays/${sportsDay._id}`);
})


app.get("/sportsDays/:id/events/:eventId", async (req, res) => {
    const { id, eventId } = req.params;
    const sportsDay = await SportsDay.findById(id);
    const event = await Event.findById(eventId);
    res.render("events/show", { day: sportsDay, event });
})

app.delete("/sportsDays/:id/events/:eventId", async (req, res) => {
    const { id, eventId } = req.params;
    await SportsDay.findByIdAndUpdate({ _id: id }, { $pull: { events: eventId } })
    await Event.findByIdAndDelete(req.params.eventId);

    // TODO
    // req.flash("success", "Successfully deleted review!");

    res.redirect(`/sportsDays/${id}`);
})

app.post("/sportsDays/:id/events/:eventId/join", async (req, res) => {
    const { id, eventId } = req.params;
    const event = await Event.findById(eventId);
    event.participants.push(req.body.name);
    await event.save();

    // TODO
    // req.flash("success", "Successfully signed up!");

    res.redirect(`/sportsDays/${id}/events/${eventId}`);
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})