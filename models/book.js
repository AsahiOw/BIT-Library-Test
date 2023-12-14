const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    ISBN: { type: String, required: [true, 'ISBN must be filled'], unique: true},
    title: { type: String, required: [true, 'Title need to be filled']},
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'publisher'},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'author'},
    numberofpages: { type: Number},
    bookCountAvailable: { type: Number},
    bookStatus: { type: String, default: "Available", enum: ['Available', 'Borrowed']},
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'category'}],
    borrow: [{ type: mongoose.Schema.Types.ObjectId, ref: 'borrow'}],
    description: {type: String},
},
{
    timestamps: true
}
);

const book = mongoose.model("book", bookSchema);
module.exports = book;