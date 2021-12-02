const SportsDay = require("../models/sportsDay");
const Event = require("../models/event");
const User = require("../models/user");
const countByHouse = require("../utilities/countByHouse");

module.exports.signUp = async (req, res) => {
    const { id, eventId } = req.params;
    const event = res.locals.event; // set in checkGenderAndNotSignedUp middleware
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
}

module.exports.unsignUp = async (req, res) => {
    const { id, eventId, userId } = req.params;
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);
    event.participants.pull({ _id: userId });
    await event.save();
    user.participating.pull({ _id: event._id });
    await user.save();

    req.flash("success", `Successfully removed from ${event.name}!`);
    res.redirect(`/sportsDays/${id}/events/${eventId}`);
}