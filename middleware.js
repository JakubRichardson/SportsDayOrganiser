const asyncWrapper = require("./utilities/asyncWrapper");
const SportsDay = require("./models/sportsDay");
const Event = require("./models/event");
const User = require("./models/user");
const AppError = require("./utilities/AppError");

module.exports.notLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    req.flash("success", "You are already signed in.");
    res.redirect("/sportsDays");
}

module.exports.checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.hasPermission = (req, res, next) => {
    const { id, eventId, userId } = req.params;
    if (req.user?.teacher === true) {
        return next();
    }
    if (!req.user._id.equals(userId)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/sportsDays/${id}/events/${eventId}`);
    }
    next();
}

module.exports.checkStudent = asyncWrapper(async (req, res, next) => {
    const { id, eventId } = req.params;
    if (req.user?.teacher === true) {
        req.flash("error", "Sorry, teachers can't sign up for sportsdays!");
        return res.redirect(`/sportsDays/${id}/events/${eventId}`);
    }
    next();
});

module.exports.checkTeacher = (req, res, next) => {
    if (req.user?.teacher === true) {
        return next();
    } else {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/sportsDays`);
    }
};

module.exports.checkYear = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id);
    res.locals.sportsDay = sportsDay;
    if (req.user?.teacher === false && sportsDay.year !== req.user.year) { // Check Yeargroup if student
        req.flash("error", `You can only access Year ${req.user.year} Sports Days`);
        return res.redirect("/sportsDays");
    }
    next();
})

module.exports.checkGenderAndNotSignedUp = asyncWrapper(async (req, res, next) => {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    res.locals.event = event;
    if (event.gender !== req.user?.gender) {
        req.flash("error", `You are trying to sign up for a ${event.gender} event as a ${req.user.gender}!`);
        return res.redirect(`/sportsDays/${id}/events/${eventId}`);
    }
    if (event.participants.includes(req.user?._id)) {
        req.flash("error", `You have already signed up for ${event.name}!`);
        return res.redirect(`/sportsDays/${id}/events/${eventId}`);
    }
    next();
})