const express = require("express");
const router = express.Router({ mergeParams: true });
const events = require("../controllers/events");
const asyncWrapper = require("../utilities/asyncWrapper");

const { checkLoggedIn, checkTeacher, checkYear } = require("../middleware");
const { validateEvent, validateTemplateEvents } = require("../validations/validations");

router.get("/new", checkLoggedIn, checkTeacher, asyncWrapper(events.renderNewEvent));

router.post("/", checkLoggedIn, checkTeacher, validateEvent, asyncWrapper(events.createEvent));
router.post("/templates", checkLoggedIn, checkTeacher, validateTemplateEvents, events.createTemplateEvents);

router.route("/:eventId")
    .get(checkLoggedIn, checkYear, asyncWrapper(events.showEvent))
    .delete(checkLoggedIn, checkTeacher, asyncWrapper(events.deleteEvent));

module.exports = router;