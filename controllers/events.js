const SportsDay = require("../models/sportsDay");
const Event = require("../models/event");
const TemplateEvent = require("../models/tempEvent");
const countByHouse = require("../utilities/countByHouse");

module.exports.renderNewEvent = async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id);
    const templates = await TemplateEvent.find({})
    res.render("events/new", { day: sportsDay, templates });
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

module.exports.createTemplateEvents = async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id);
    if (req.body.events) {
        if (req.body.events.male) {
            for (let templateEvent of req.body.events.male) {
                const template = await TemplateEvent.findById(templateEvent.id);
                if (template) {
                    const newEvent = new Event({ name: template.name, limit: templateEvent.limit, gender: "male" });
                    newEvent.day = sportsDay;
                    await newEvent.save(); // doesn't need await
                    sportsDay.events.push(newEvent);
                }
            }
        }
        if (req.body.events.female) {
            for (let templateEvent of req.body.events.female) {
                const template = await TemplateEvent.findById(templateEvent.id);
                if (template) { // if template id wrong it won't be used and app won't crash
                    const newEvent = new Event({ name: template.name, limit: templateEvent.limit, gender: "female" });
                    newEvent.day = sportsDay;
                    await newEvent.save(); // doesn't need await
                    sportsDay.events.push(newEvent);
                }
            }
        }
        await sportsDay.save();
        req.flash("success", "Created new events!");
    } else {
        req.flash("error", "No events selected!");
    }
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

