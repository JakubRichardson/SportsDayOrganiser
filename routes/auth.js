const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");

const passport = require("passport");
const asyncWrapper = require("../utilities/asyncWrapper");
const { notLoggedIn, checkLoggedIn, checkStudent, hasPermission, checkMasterPassword, checkUsernameAvailable } = require("../middleware");
const { validateStudent, validateTeacher, validateStudentNoPass } = require("../validations/validations");

router.get("/settings", checkLoggedIn, auth.renderSettings);
router.get("/signedUpStudent", checkLoggedIn, checkStudent, asyncWrapper(auth.renderStudentEvents));
router.get("/profiles/:userId", checkLoggedIn, hasPermission, asyncWrapper(auth.renderUser));

router.route("/registerStudent")
    .get(auth.renderRegisterStudent)
    .post(validateStudent, checkUsernameAvailable, asyncWrapper(auth.registerStudent));

router.route("/registerTeacher")
    .get(auth.renderRegisterTeacher)
    .post(validateTeacher, checkMasterPassword, checkUsernameAvailable, auth.registerTeacher);

router.route("/login")
    .get(notLoggedIn, auth.renderLogin)
    .post(notLoggedIn, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), auth.login);

router.get("/logout", auth.logout);

router.put("/updateStudent", checkLoggedIn, validateStudentNoPass, asyncWrapper(auth.updateStudent));

router.delete("/deleteAccount", checkLoggedIn, asyncWrapper(auth.deleteAccount));

module.exports = router;