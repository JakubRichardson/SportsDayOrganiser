const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminUserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", UserSchema);