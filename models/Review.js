const { default: mongoose } = require('mongoose');
const mogoose = require('mongoose');

let date = new Date();

const currentDate = date.getDate().toString() + "/" + date.getMonth().toString() + "/" + date.getFullYear().toString();

const reviewSchema = mongoose.Schema({
    rating: {
        type: Number
    },
    comment: {
        type: String
    },
    createdAt: {
        type: String,
        default: currentDate
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Review = mogoose.model('Review', reviewSchema);

module.exports = Review; 