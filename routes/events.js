const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrapper = require("../utilities/asyncWrapper");

const SportsDay = require("../models/sportsDay");
const Event = require("../models/event");
const TemplateEvent = require("../models/tempEvent");

const { eventSchema } = require("../schemas.js"); //TODO remove me

const { checkLoggedIn, checkTeacher } = require("../middleware");

router.get("/new", checkLoggedIn, checkTeacher, asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id);
    res.render("events/new", { day: sportsDay });
}))

const validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);
    if (error) {
        const text = error.details.map(ind => ind.message).join(", ");
        throw new AppError(text, 400)
    } else {
        next();
    }
}

router.post("/", checkLoggedIn, checkTeacher, validateEvent, asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id);
    if (req.body.template && req.body.template === "true") {
        const template = new TemplateEvent({ name: req.body.name, limit: req.body.limit });
        await template.save();
    }
    const newEvent = new Event({ name: req.body.name, gender: req.body.gender, limit: req.body.limit });
    await newEvent.save();
    sportsDay.events.push(newEvent);
    await sportsDay.save();

    req.flash("success", "Created new event!");

    res.redirect(`/sportsDays/${sportsDay._id}`);
}))

router.get("/:eventId", checkLoggedIn, asyncWrapper(async (req, res) => {
    const { id, eventId } = req.params;
    const sportsDay = await SportsDay.findById(id);
    let populateObj = { path: "participants", match: { _id: req.user._id } };
    if (req.user?.teacher === true) {
        populateObj = { path: "participants" }
    }
    const event = await Event.findById(eventId).populate(populateObj);
    res.render("events/show", { day: sportsDay, event });
}))

router.delete("/:eventId", checkLoggedIn, checkTeacher, asyncWrapper(async (req, res) => {
    const { id, eventId } = req.params;
    await SportsDay.findByIdAndUpdate({ _id: id }, { $pull: { events: eventId } });
    await Event.findByIdAndDelete(req.params.eventId);

    req.flash("success", "Successfully deleted event!");

    res.redirect(`/sportsDays/${id}`);
}))

module.exports = router;