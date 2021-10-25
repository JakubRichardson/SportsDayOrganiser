const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Event = require("./event");

const SportsDaySchema = new mongoose.Schema({
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

SportsDaySchema.post("findOneAndDelete", async function (document) {
    if (document) {
        for (let event of document.events) {
            await Event.findByIdAndDelete(event);
        }
    }
})


module.exports = mongoose.model("SportsDay", SportsDaySchema);