const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrapper = require("../utilities/asyncWrapper");

const Event = require("../models/event");
const User = require("../models/user");

const { userSchema } = require("../schemas.js"); //TODO remove me

const { checkLoggedIn, hasPermission, checkStudent } = require("../middleware");

// const validateUser = (req, res, next) => {
//     const { error } = userSchema.validate(req.body);
//     if (error) {
//         const text = error.details.map(ind => ind.message).join(", ");
//         throw new AppError(text, 400)
//     } else {
//         next();
//     }
// }

router.post("/", checkLoggedIn, checkStudent, asyncWrapper(async (req, res) => {
    const { id, eventId } = req.params;
    const event = await Event.findById(eventId);
    if (event.participants.includes(req.user._id)) {
        req.flash("fail", `You have already signed up for ${event.name}!`);
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
    const user = await User.findById(req.user._id);
    const event = await Event.findById(eventId);
    event.participants.pull({ _id: userId });
    await event.save();
    user.participating.pull({ _id: event._id });
    await user.save();

    req.flash("success", `Successfully removed from ${event.name}!`);

    res.redirect(`/sportsDays/${id}/events/${eventId}`);
}))

module.exports = router;