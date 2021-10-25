const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utilities/asyncWrapper");

const TemplateEvent = require("../models/tempEvent");

router.delete("/:id", asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await TemplateEvent.findByIdAndDelete(id);
    res.redirect(req.body.returnTo);
}))

module.exports = router;