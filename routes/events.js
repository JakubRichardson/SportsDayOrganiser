const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrapper = require("../utilities/asyncWrapper");

const SportsDay = require("../models/sportsDay");
const Event = require("../models/event");

const { eventSchema } = require("../schemas.js"); //TODO remove me

router.get("/:eventId", asyncWrapper(async (req, res) => {
    const { id, eventId } = req.params;
    const sportsDay = await SportsDay.findById(id);
    const event = await Event.findById(eventId).populate("participants");
    res.render("events/show", { day: sportsDay, event });
}))

router.get("/new", asyncWrapper(async (req, res) => {
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

router.post("/", validateEvent, asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id);
    if (req.body.template && req.body.template === "true") {
        const template = new TemplateEvent({ name: req.body.name });
        await template.save();
    }
    const newEvent = new Event({ name: req.body.name, gender: req.body.gender });
    await newEvent.save();
    sportsDay.events.push(newEvent);
    await sportsDay.save();

    // TODO
    // req.flash("success", "Created new review!");

    res.redirect(`/sportsDays/${sportsDay._id}`);
}))

router.delete("/:eventId", asyncWrapper(async (req, res) => {
    const { id, eventId } = req.params;
    await SportsDay.findByIdAndUpdate({ _id: id }, { $pull: { events: eventId } });
    await Event.findByIdAndDelete(req.params.eventId);

    // TODO
    // req.flash("success", "Successfully deleted review!");

    res.redirect(`/sportsDays/${id}`);
}))

module.exports = router;