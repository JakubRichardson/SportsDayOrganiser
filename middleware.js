const AppError = require("./utilities/AppError");
// const { campgroundSchema, reviewSchema } = require("./schemas.js");
const asyncWrapper = require("./utilities/asyncWrapper");
const User = require("./models/user");

module.exports.notLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    req.flash("success", "You are already signed in.");
    res.redirect("/sportsDays");
}

module.exports.checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("fail", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.hasPermission = asyncWrapper(async (req, res, next) => {
    const { id, eventId, userId } = req.params;
    if (req.user?.teacher === true) {
        return next();
    }
    if (!req.user._id.equals(userId)) {
        req.flash("fail", "You don't have permission to do that!");
        return res.redirect(`/sportsDays/${id}/events/${eventId}`);
    }
    next();
})

module.exports.checkStudent = asyncWrapper(async (req, res, next) => {
    const { id, eventId } = req.params;
    if (req.user?.teacher === true) {
        req.flash("fail", "Sorry, teachers can't sign up for sportsdays!");
        return res.redirect(`/sportsDays/${id}/events/${eventId}`);
    }
    next();
});

module.exports.checkTeacher = async (req, res, next) => {
    if (req.user?.teacher === true) {
        return next();
    } else {
        req.flash("fail", "You don't have permission to do that!");
        return res.redirect(`/sportsDays`);
    }
};