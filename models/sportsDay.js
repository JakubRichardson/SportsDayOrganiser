const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Event = require("./event");

const SportsDaySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        max: 13,
        min: -1,
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

SportsDaySchema.virtual('yearString').get(function () {
    if (this.year === 0) {
        return "Nursery";
    } else if (this.year === -1) {
        return "Pre-nursery";
    }
    return this.year;
});

SportsDaySchema.post("findOneAndDelete", async function (document) {
    if (document) {
        for (let event of document.events) {
            await Event.findByIdAndDelete(event);
        }
    }
})


module.exports = mongoose.model("SportsDay", SportsDaySchema);