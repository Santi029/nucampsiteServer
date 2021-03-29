const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    campsites: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campsite",
    },
});

module.exports = mongoose.model("favorites", favoriteSchema);
