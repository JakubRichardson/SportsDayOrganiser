const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const EventSchema = new mongoose.Schema({
    day: {
        type: Schema.Types.ObjectId,
        ref: "SportsDay"
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true
    },
    limit: {
        type: Number,
        min: 0
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
})

EventSchema.post("findOneAndDelete", async function (document) {
    if (document) {
        for (let user of document.participants) {
            await User.findOneAndUpdate({ _id: user }, { $pull: { participating: document._id } });
        }
    }
})

module.exports = mongoose.model("Event", EventSchema);