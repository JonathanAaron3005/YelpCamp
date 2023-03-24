const Review = require('../models/review');
const Campgrounds = require('../models/campground');


//CREATE REVIEW
module.exports.createReview = async (req, res, next) => {
    const campground = await Campgrounds.findById(req.params.id);
    const review = new Review(req.body.reviews);

    campground.reviews.push(review);
    review.author = req.user._id;

    await campground.save();
    await review.save();

    req.flash('success', 'Added new review!');
    res.redirect(`/campgrounds/${req.params.id}`);
}

//DELETE REVIEW
module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewID } = req.params;
    await Campgrounds.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Review deleted!');
    res.redirect(`/campgrounds/${id}`)
}