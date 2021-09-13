const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sportsDaySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        max: 13,
        min: 1,
        required: true
    },
    date: {
        type: Date,
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