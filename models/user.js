const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    house: {
        type: String,
        enum: ["Bison", "Wolf", "Bear", "Lynx"],
        required: true
    }
});

module.exports = mongoose.model("User", UserSchema);