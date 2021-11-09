const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utilities/asyncWrapper");

const TemplateEvent = require("../models/tempEvent");

const { checkLoggedIn, checkTeacher } = require("../middleware");

router.delete("/:id", checkLoggedIn, checkTeacher, asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const deleted = await TemplateEvent.findByIdAndDelete(id);

    req.flash("success", `Successfully deleted ${deleted.name} from templates!!`);

    res.redirect(req.body.returnTo);
}))

module.exports = router;