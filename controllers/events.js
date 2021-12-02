const SportsDay = require("../models/sportsDay");
const Event = require("../models/event");
const TemplateEvent = require("../models/tempEvent");
const countByHouse = require("../utilities/countByHouse");

module.exports.renderNewEvent = async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id);
    res.render("events/new", { day: sportsDay });
}

module.exports.createEvent = async (req, res) => {
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
}

module.exports.showEvent = async (req, res) => {
    const { id, eventId } = req.params;
    const event = await Event.findById(eventId).populate("participants", "house");
    const counted = countByHouse(event.participants);

    let populateObj = { path: "participants", match: { _id: req.user._id } };
    if (req.user?.teacher === true) {
        populateObj = { path: "participants" }
    }
    await event.populate(populateObj);

    res.render("events/show", { day: res.locals.sportsDay, event, counted });
}

module.exports.deleteEvent = async (req, res) => {
    const { id, eventId } = req.params;
    await SportsDay.findByIdAndUpdate({ _id: id }, { $pull: { events: eventId } });
    await Event.findByIdAndDelete(req.params.eventId);

    req.flash("success", "Successfully deleted event!");
    res.redirect(`/sportsDays/${id}`);
}

