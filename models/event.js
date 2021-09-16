const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
})


module.exports = mongoose.model("Event", eventSchema);