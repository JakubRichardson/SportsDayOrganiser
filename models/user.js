const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    name: {
        type: String
    },
    surname: {
        type: String
    },
    form: {
        type: String
    },
    house: {
        type: String,
        enum: ["bison", "wolf", "bear", "lynx"],
    },
    participating: [
        {
            type: Schema.Types.ObjectId,
            ref: "Event"
        }
    ],
    teacher: {
        type: Boolean
    }
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);