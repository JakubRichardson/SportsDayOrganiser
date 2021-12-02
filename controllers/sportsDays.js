const SportsDay = require("../models/sportsDay");
const Event = require("../models/event");
const TemplateEvent = require("../models/tempEvent");
const countByHouse = require("../utilities/countByHouse");

module.exports.index = async (req, res) => {
    let yearQuery = {};
    let genderPopulate = { path: "events" };
    if (req.user?.teacher === false) { // if student
        yearQuery = { year: req.user?.year };
        genderPopulate = { path: "events", match: { gender: req.user?.gender } };
    }
    const sportsDays = await SportsDay.find(yearQuery).populate(genderPopulate);
    res.render("sportsDays/index", { sportsDays });
}

module.exports.renderNew = async (req, res) => {
    const templates = await TemplateEvent.find({})
    res.render("sportsDays/new", { templates });
}

module.exports.createSportsDay = async (req, res) => {
    const newSportsDay = new SportsDay({ name: req.body.name, year: req.body.year, date: req.body.date });
    if (req.body.events) {
        if (req.body.events.male) {
            for (let templateEvent of req.body.events.male) {
                const template = await TemplateEvent.findById(templateEvent.id);
                if (template) {
                    const event = new Event({ name: template.name, limit: templateEvent.limit, gender: "male" });
                    event.day = newSportsDay;
                    await event.save(); // doesn't need await
                    newSportsDay.events.push(event);
                }
            }
        }
        if (req.body.events.female) {
            for (let templateEvent of req.body.events.female) {
                const template = await TemplateEvent.findById(templateEvent.id);
                if (template) { // if template id wrong it won't be used and app won't crash
                    const event = new Event({ name: template.name, limit: templateEvent.limit, gender: "female" });
                    event.day = newSportsDay;
                    await event.save(); // doesn't need await
                    newSportsDay.events.push(event);
                }
            }
        }
    }
    await newSportsDay.save();

    req.flash("success", `Successfully created ${newSportsDay.name}!`);

    res.redirect(`/sportsDays/${newSportsDay._id}`);
}

module.exports.showSportsDay = async (req, res, next) => {
    const { id } = req.params;
    const sportsDay = res.locals.sportsDay;
    let genderQuery = { gender: req.user.gender };
    if (req.user.teacher === true) {
        genderQuery = {};
    }
    await sportsDay.populate({
        path: 'events',
        match: genderQuery,
        populate: { path: "participants" }
    });
    const counted = {};
    for (let event of sportsDay.events) {
        counted[event._id] = countByHouse(event.participants);
    }
    if (req.user?.teacher !== true) {
        await sportsDay.populate({
            path: 'events',
            match: genderQuery,
            populate: { path: "participants", match: { _id: req.user._id } }
        })
    }

    res.render("sportsDays/show", { day: sportsDay, counted });
}

module.exports.renderEdit = async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id);
    res.render("sportsDays/edit", { day: sportsDay });
}

module.exports.updateSportsDay = async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });

    req.flash("success", `Successfully edited ${sportsDay.name}!!`);

    res.redirect(`/sportsDays/${sportsDay._id}`);
}

module.exports.deleteSportsDay = async (req, res) => {
    const { id } = req.params;
    const deletedSportsDay = await SportsDay.findByIdAndDelete(id);

    req.flash("success", `Successfully deleted ${deletedSportsDay.name}!!`);

    res.redirect("/sportsDays");
}