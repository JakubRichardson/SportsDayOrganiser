const express = require("express");
const router = express.Router();
const sportsDays = require("../controllers/sportsDays");
const asyncWrapper = require("../utilities/asyncWrapper");

const { checkLoggedIn, checkTeacher, checkYear } = require("../middleware");
const { validateSportsDay } = require("../validations/validations");

router.route("/")
    .get(asyncWrapper(sportsDays.index))
    .post(checkLoggedIn, checkTeacher, validateSportsDay, asyncWrapper(sportsDays.createSportsDay));

router.get("/new", checkLoggedIn, checkTeacher, asyncWrapper(sportsDays.renderNew))

router.route("/:id")
    .get(checkLoggedIn, checkYear, asyncWrapper(sportsDays.showSportsDay))
    .put(checkLoggedIn, checkTeacher, asyncWrapper(sportsDays.updateSportsDay))
    .delete(checkLoggedIn, checkTeacher, asyncWrapper(sportsDays.deleteSportsDay));

router.get("/:id/edit", checkLoggedIn, checkTeacher, asyncWrapper(sportsDays.renderEdit))

module.exports = router;