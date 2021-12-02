const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utilities/asyncWrapper");

const TemplateEvent = require("../models/tempEvent");

const { checkLoggedIn, checkTeacher } = require("../middleware");
const { returnToSchema } = require("../schemas")

const validateReturnTo = (req, res, next) => {
    const { error } = returnToSchema.validate(req.body);
    if (error) {
        const text = error.details.map(ind => ind.message).join(", ");
        throw new AppError(text, 400)
    } else {
        next();
    }
}

router.delete("/:id", checkLoggedIn, checkTeacher, validateReturnTo, asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const deleted = await TemplateEvent.findByIdAndDelete(id);

    req.flash("success", `Successfully deleted ${deleted.name} from templates!!`);

    res.redirect(req.body.returnTo);
}))

module.exports = router;