const Review = require('../models/Review');
const Listing = require('../models/Listing');

//to delete review

let distroyReview = async (req, res, next) => {
    try {
        const reviewId = req.params.reviewId;
        const listId = req.params.listId;
        const review = await Review.findById(reviewId);
        if (req.session.admin) {
            const result = await Review.findByIdAndDelete(reviewId);
            req.flash('success', 'comment successfully deleted');
            res.redirect(`/list/${listId}`);
        } else {
            if (req.user._id.equals(review.author)) {
                const result = await Review.findByIdAndDelete(reviewId);
                req.flash('success', 'comment successfully deleted');
                res.redirect(`/list/${listId}`);
            } else { 
                req.flash('error', 'you can not delete others user comment');
                res.redirect(`/list/${listId}`);
            }
        }
    } catch (error) {
        next(error); 
    }

}

module.exports = {
    distroyReview: distroyReview
}