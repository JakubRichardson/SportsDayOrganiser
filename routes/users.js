const express = require("express");
const router = express.Router({ mergeParams: true });
const users = require("../controllers/users");
const asyncWrapper = require("../utilities/asyncWrapper");

const { checkLoggedIn, hasPermission, checkStudent, checkYear, checkGenderAndNotSignedUp } = require("../middleware");

router.post("/", checkLoggedIn, checkStudent, checkYear, checkGenderAndNotSignedUp, asyncWrapper(users.signUp));

router.delete("/:userId", checkLoggedIn, hasPermission, asyncWrapper(users.unsignUp));

module.exports = router;