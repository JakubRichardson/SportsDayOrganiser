const User = require("../models/user");
const Event = require("../models/event");

module.exports.renderSettings = (req, res) => {
    res.render("users/settings")
}

module.exports.renderStudentEvents = async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: 'participating',
        populate: { path: "day", select: "name" }
    });
    res.render("users/studentEvents", { user })
}

module.exports.renderUser = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user.teacher === true) {
        req.flash("error", "Sorry, only students have a User Profile");
        res.redirect("/sportsDays");
    }
    res.render("users/profile", { user })
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login")
}

module.exports.login = (req, res) => {
    req.flash("success", "Succesfully logged in! Welcome Back!");
    res.redirect("/sportsDays");
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "Succesfully logged out. See you soon!");
    res.redirect("/sportsDays");
}

module.exports.renderRegisterStudent = (req, res) => {
    res.render("users/registerStudent");
}

module.exports.registerStudent = async (req, res) => {
    const { name, surname, year, house, gender, username, password } = req.body;
    const user = new User({ teacher: false, name, surname, year, house, gender, username });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, err => {
        if (err) return next(err);
    });

    req.flash("success", "Welcome!");
    res.redirect("/sportsDays");
}

module.exports.updateStudent = async (req, res) => {
    const student = await User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true, new: true });
    res.redirect("/sportsDays")
}

module.exports.renderRegisterTeacher = (req, res) => {
    res.render("users/registerTeacher")
}

module.exports.registerTeacher = async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, teacher: true });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, err => {
        if (err) return next(err);
    });

    req.flash("success", "Welcome!");
    res.redirect("/sportsDays");
}

module.exports.deleteAccount = async (req, res) => {
    const user = await User.findByIdAndDelete(req.user._id);
    for (let event of user.participating) {
        await Event.findOneAndUpdate({ _id: event }, { $pull: { participants: req.user._id } });
    }
    req.flash("success", "Deleted account");
    res.redirect("/sportsDays");
}