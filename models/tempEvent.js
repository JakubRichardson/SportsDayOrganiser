const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TempEventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    limit: {
        type: Number,
        min: 0
    }
})


module.exports = mongoose.model("TemplateEvent", TempEventSchema);