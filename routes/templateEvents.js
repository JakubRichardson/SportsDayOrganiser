const express = require("express");
const router = express.Router();
const templateEvents = require("../controllers/templateEvents");
const asyncWrapper = require("../utilities/asyncWrapper");

const { checkLoggedIn, checkTeacher } = require("../middleware");
const { validateReturnTo } = require("../validations/validations");

router.delete("/:id", checkLoggedIn, checkTeacher, validateReturnTo, asyncWrapper(templateEvents.deleteTemplate));

module.exports = router;