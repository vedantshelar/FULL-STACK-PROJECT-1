const { default: mongoose } = require('mongoose');
const mogoose = require('mongoose');

let date = new Date();

const currentDate = date.getDate().toString() + "/" + date.getMonth().toString() + "/" + date.getFullYear().toString();

const reviewSchema = mongoose.Schema({
    rating: {
        type: Number
    },
    comment: {
        type: String,
        required:true
    },
    createdAt: {
        type: String,
        default: currentDate,
        required:true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }
});

const Review = mogoose.model('Review', reviewSchema);

module.exports = Review; 