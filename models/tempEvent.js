const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TempEventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model("TemplateEvent", TempEventSchema);