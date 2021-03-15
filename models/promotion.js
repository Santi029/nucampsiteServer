const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema(
    {
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const promotionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            required: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        cost: {
            type: Currency,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            required: true,
        },
        comments: [commentSchema],
    },
    {
        timestamps: true,
    }
);

const promotion = mongoose.model("promotion", promotionSchema);

module.exports = promotion;
