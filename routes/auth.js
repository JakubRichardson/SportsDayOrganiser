const express = require("express");
const router = express.Router();

const passport = require("passport");
const { studentSchema, studentSchemaNoPass, teacherSchema } = require("../schemas.js"); //TODO remove me
const asyncWrapper = require("../utilities/asyncWrapper");
const { notLoggedIn, checkLoggedIn, checkStudent } = require("../middleware");
const User = require("../models/user");
const Event = require("../models/event");

const validateStudent = (req, res, next) => {
    const { error } = studentSchema.validate(req.body);
    if (error) {
        const text = error.details.map(ind => ind.message).join(", ");
        throw new AppError(text, 400)
    } else {
        next();
    }
}

const validateStudentNoPass = (req, res, next) => {
    const { error } = studentSchemaNoPass.validate(req.body);
    if (error) {
        const text = error.details.map(ind => ind.message).join(", ");
        throw new AppError(text, 400)
    } else {
        next();
    }
}

const validateTeacher = (req, res, next) => {
    const { error } = teacherSchema.validate(req.body);
    if (error) {
        const text = error.details.map(ind => ind.message).join(", ");
        throw new AppError(text, 400)
    } else {
        next();
    }
}

router.get("/settings", checkLoggedIn, (req, res) => {
    res.render("users/settings")
})

router.get("/signedUpStudent", checkLoggedIn, checkStudent, asyncWrapper(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: 'participating',
        populate: { path: "day", select: "name" }
    });
    res.render("users/studentEvents", { user })
}))

router.get("/login", notLoggedIn, (req, res) => {
    res.render("users/login")
})

router.post("/login", notLoggedIn, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "Succesfully logged in! Welcome Back!");
    res.redirect("/sportsDays");
})

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Succesfully logged out. See you soon!");
    res.redirect("/sportsDays");
})

router.get("/registerStudent", (req, res) => {
    res.render("users/registerStudent");
})

router.post("/registerStudent", validateStudent, asyncWrapper(async (req, res) => {
    const { name, surname, year, house, gender, username, password } = req.body;
    const user = new User({ teacher: false, name, surname, year, house, gender, username });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, err => {
        if (err) return next(err);
    });

    req.flash("success", "Welcome!");
    res.redirect("/sportsDays");
}))

router.put("/updateStudent", checkLoggedIn, validateStudentNoPass, async (req, res) => {
    const student = await User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true, new: true });
    res.redirect("/sportsDays")
})

router.get("/registerTeacher", (req, res) => {
    res.render("users/registerTeacher")
})

router.post("/registerTeacher", validateTeacher, asyncWrapper(async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, teacher: true });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, err => {
        if (err) return next(err);
    });

    req.flash("success", "Welcome!");
    res.redirect("/sportsDays");
}))

router.delete("/deleteAccount", checkLoggedIn, async (req, res) => {
    const user = await User.findByIdAndDelete(req.user._id);
    for (let event of user.participating) {
        await Event.findOneAndUpdate({ _id: event }, { $pull: { participants: req.user._id } });
    }
    req.flash("success", "Deleted account");
    res.redirect("/sportsDays");
})

module.exports = router;