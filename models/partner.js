const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema(
    {
        name: "Mongo Fly Shop",
        image: "images/mongo-logo.png",
        featured: false,
        description:
            "Need a new fishing pole, a tacklebox, or flies of all kinds? Stop by Mongo Fly Shop.",
    },
    {
        timestamps: true,
    }
);

const Partner = mongoose.model("Partner", campsiteSchema);

module.exports = Partner;
