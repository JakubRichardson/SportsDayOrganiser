const TemplateEvent = require("../models/tempEvent");

module.exports.deleteTemplate = async (req, res) => {
    const { id } = req.params;
    const deleted = await TemplateEvent.findByIdAndDelete(id);

    req.flash("success", `Successfully deleted ${deleted.name} from templates!!`);
    res.redirect(req.body.returnTo);
}