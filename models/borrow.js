const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user"},
        book: { type: mongoose.Schema.Types.ObjectId, ref: "book"},
        fromDate: { type: Date, required: true},
        toDate: { type: Date, required: true},
        returnDate: { type: Date},
        status: { type: Boolean, required: true}
    },
    {
        timestamps: true
    }
);

const borrow = mongoose.model("borrow", borrowSchema);
module.exports = borrow;