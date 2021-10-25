const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
})

EventSchema.post("findOneAndDelete", async function (document) {
    if (document) {
        await User.deleteMany({
            _id: {
                $in: document.participants
            }
        })
    }
})

module.exports = mongoose.model("Event", EventSchema);