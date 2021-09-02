const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sportsDaySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: "Event"
        }
    ]
})


module.exports = mongoose.model("SportsDay", sportsDaySchema);