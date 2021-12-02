const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrapper = require("../utilities/asyncWrapper");
const countByHouse = require("../utilities/countByHouse");

const Event = require("../models/event");
const User = require("../models/user");

const { checkLoggedIn, hasPermission, checkStudent } = require("../middleware");

router.post("/", checkLoggedIn, checkStudent, asyncWrapper(async (req, res) => {
    const { id, eventId } = req.params;
    const event = await Event.findById(eventId);
    if (event.gender !== req.user.gender) {
        req.flash("error", `You are trying to sign up for a ${event.gender} event as a ${req.user.gender}!`);
        return res.redirect(`/sportsDays/${id}/events/${eventId}`);
    }
    if (event.participants.includes(req.user._id)) {
        req.flash("error", `You have already signed up for ${event.name}!`);
        return res.redirect(`/sportsDays/${id}/events/${eventId}`);
    }
    await event.populate("participants", "house");
    const counted = countByHouse(event.participants);
    if (counted[req.user.house] >= event.limit) {
        req.flash("error", `Sorry, the event limit of ${event.limit} students per house has already been reached!`);
        return res.redirect(`/sportsDays/${id}/events/${eventId}`);
    }
    const user = await User.findById(req.user._id);
    event.participants.push(req.user._id);
    await event.save();
    user.participating.push(event);
    await user.save();

    req.flash("success", `Successfully signed up for ${event.name}!`);

    res.redirect(`/sportsDays/${id}/events/${eventId}`);
}))


router.delete("/:userId", checkLoggedIn, hasPermission, asyncWrapper(async (req, res) => {
    const { id, eventId, userId } = req.params;
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);
    event.participants.pull({ _id: userId });
    await event.save();
    user.participating.pull({ _id: event._id });
    await user.save();

    req.flash("success", `Successfully removed from ${event.name}!`);

    res.redirect(`/sportsDays/${id}/events/${eventId}`);
}))

module.exports = router;