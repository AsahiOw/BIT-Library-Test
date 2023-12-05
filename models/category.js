const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Name need to be filled'], unique: true},
        book: [{ type: mongoose.Schema.Types.ObjectId, ref: 'book'}]
    },
    {
        timestamps: true,
    }
);

const category = mongoose.model("category", categorySchema);
module.exports = category;