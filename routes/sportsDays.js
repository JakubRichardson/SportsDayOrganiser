const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utilities/asyncWrapper");

const SportsDay = require("../models/sportsDay");
const Event = require("../models/event");
const TemplateEvent = require("../models/tempEvent");

const { sportsDaySchema } = require("../schemas.js"); //TODO remove me

router.get("/", asyncWrapper(async (req, res) => {
    const sportsDays = await SportsDay.find({}).populate({ path: "events" });
    res.render("sportsDays/index", { sportsDays });
}))

router.get("/new", asyncWrapper(async (req, res) => {
    const templates = await TemplateEvent.find({})
    res.render("sportsDays/new", { templates });
}))

const validateSportsDay = (req, res, next) => {
    const { error } = sportsDaySchema.validate(req.body);
    if (error) {
        const text = error.details.map(ind => ind.message).join(", ");
        throw new AppError(text, 400)
    } else {
        next();
    }
}

router.post("/", validateSportsDay, asyncWrapper(async (req, res) => {
    const newSportsDay = new SportsDay({ name: req.body.name, year: req.body.year, date: req.body.date });
    if (req.body.events) {
        if (req.body.events.male) {
            for (let id of req.body.events.male) {
                const template = await TemplateEvent.findById(id);
                if (template) { // if template id wrong it won't be used and app won't crash
                    const event = new Event({ name: template.name, gender: "male" });
                    await event.save(); // doesn't need await
                    newSportsDay.events.push(event);
                }
            }
        }
        if (req.body.events.female) {
            for (let id of req.body.events.female) {
                const template = await TemplateEvent.findById(id);
                if (template) { // if template id wrong it won't be used and app won't crash
                    const event = new Event({ name: template.name, gender: "female" });
                    await event.save(); // doesn't need await
                    newSportsDay.events.push(event);
                }
            }
        }
    }
    await newSportsDay.save();
    res.redirect(`/sportsDays/${newSportsDay._id}`);
}))

router.get("/:id", asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id).populate({
        path: 'events',
        populate: {
            path: 'participants',
            model: 'User'
        }
    })
    res.render("sportsDays/show", { day: sportsDay });
}))

router.get("/:id/edit", asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id);
    res.render("sportsDays/edit", { day: sportsDay });
}))

router.put("/:id", asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/sportsDays/${sportsDay._id}`);
}))

router.delete("/:id", asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const deletedSportsDay = await SportsDay.findByIdAndDelete(id);
    res.redirect("/sportsDays");
}))

module.exports = router;