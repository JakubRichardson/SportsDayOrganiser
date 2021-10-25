const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrapper = require("../utilities/asyncWrapper");

const Event = require("../models/event");
const User = require("../models/user");

const { userSchema } = require("../schemas.js"); //TODO remove me

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const text = error.details.map(ind => ind.message).join(", ");
        throw new AppError(text, 400)
    } else {
        next();
    }
}

router.post("/", validateUser, asyncWrapper(async (req, res) => {
    const { id, eventId } = req.params;
    const user = new User(req.body);
    await user.save();
    const event = await Event.findById(eventId);
    event.participants.push(user);
    await event.save();

    // TODO
    // req.flash("success", "Successfully signed up!");

    res.redirect(`/sportsDays/${id}/events/${eventId}`);
}))


router.delete("/:userId", asyncWrapper(async (req, res) => {
    const { id, eventId, userId } = req.params;
    const event = await Event.findById(eventId);
    const deletedUser = await User.findByIdAndDelete(userId);
    event.participants.pull({ _id: deletedUser._id });
    await event.save();

    // TODO
    // req.flash("success", "Successfully signed up!");

    res.redirect(`/sportsDays/${id}/events/${eventId}`);
}))

module.exports = router;