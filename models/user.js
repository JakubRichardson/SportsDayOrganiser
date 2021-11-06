const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    house: {
        type: String,
        enum: ["bison", "wolf", "bear", "lynx"],
        required: true
    }
});

module.exports = mongoose.model("User", UserSchema);