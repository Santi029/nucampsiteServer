const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: favoriteSchema,
        default: "",
    },
    campsites: {
        type: mongoose.Schema.Types.ObjectId,
        ref: favoriteSchema,
        default: "",
    },
    // facebookId: String,
    // admin: {
    //     type: Boolean,
    //     default: false,
    // },
});

favoriteSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("favorite", favoriteSchema);
