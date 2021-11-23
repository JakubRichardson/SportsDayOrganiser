const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utilities/asyncWrapper");
const countByHouse = require("../utilities/countByHouse");

const SportsDay = require("../models/sportsDay");
const Event = require("../models/event");
const TemplateEvent = require("../models/tempEvent");

const { sportsDaySchema } = require("../schemas.js"); //TODO remove me

const { checkLoggedIn, checkTeacher } = require("../middleware");

router.get("/", asyncWrapper(async (req, res) => {
    const sportsDays = await SportsDay.find({}).populate({ path: "events" });
    res.render("sportsDays/index", { sportsDays });
}))

router.get("/new", checkLoggedIn, checkTeacher, asyncWrapper(async (req, res) => {
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

router.post("/", checkLoggedIn, checkTeacher, validateSportsDay, asyncWrapper(async (req, res) => {
    const newSportsDay = new SportsDay({ name: req.body.name, year: req.body.year, date: req.body.date });
    if (req.body.events) {
        if (req.body.events.male) {
            for (let templateEvent of req.body.events.male) {
                const template = await TemplateEvent.findById(templateEvent.id);
                if (template) {
                    const event = new Event({ name: template.name, limit: templateEvent.limit, gender: "male" });
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
                    await event.save(); // doesn't need await
                    newSportsDay.events.push(event);
                }
            }
        }
    }
    await newSportsDay.save();

    req.flash("success", `Successfully created ${newSportsDay.name}!`);

    res.redirect(`/sportsDays/${newSportsDay._id}`);
}))

router.get("/:id", checkLoggedIn, asyncWrapper(async (req, res) => {
    const { id } = req.params;

    let genderQuery = { gender: req.user.gender };
    if (req.user?.teacher === true) genderQuery = {};

    const sportsDay = await SportsDay.findById(id).populate({
        path: 'events',
        match: genderQuery,
        populate: { path: "participants" }
    })
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

    //todo
    // if (!sportsDay) {
    //     req.flash("error", "Cannot find that Sports Day!")
    //     return res.redirect("/campgrounds");
    // }


    res.render("sportsDays/show", { day: sportsDay, counted });
}))

router.get("/:id/edit", checkLoggedIn, checkTeacher, async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id);

    // todo
    // if (!sportsDay) {
    //     req.flash("error", "Cannot find that Sports Day!")
    //     return res.redirect("/campgrounds");
    // }

    res.render("sportsDays/edit", { day: sportsDay });
})

router.put("/:id", checkLoggedIn, checkTeacher, asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });

    req.flash("success", `Successfully edited ${sportsDay.name}!!`);

    res.redirect(`/sportsDays/${sportsDay._id}`);
}))

router.delete("/:id", checkLoggedIn, checkTeacher, asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const deletedSportsDay = await SportsDay.findByIdAndDelete(id);

    req.flash("success", `Successfully deleted ${deletedSportsDay.name}!!`);

    res.redirect("/sportsDays");
}))

module.exports = router;