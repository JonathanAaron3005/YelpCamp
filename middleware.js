const ExpressError = require('./utilities/ExpressError');
const { reviewSchema, campgroundSchema } = require('./schemas');
const Campgrounds = require('./models/campground');
const Reviews = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { //method from passport
        req.session.returnTo = req.originalUrl;
        console.log(req.session.returnTo)
        req.flash('error', 'you must be signed in first');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campgrounds.findById(id);
    const author = campground.author;
    if (req.user._id.equals(author)) {
        next();
    } else {
        req.flash('error', 'you do not have a permission!');
        res.redirect(`/campgrounds/${id}`);
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewID, id } = req.params;
    const review = await Reviews.findById(reviewID);
    const author = review.author;
    if (req.user.equals(author)) {
        next();
    } else {
        req.flash('error', 'you do not have a permission!');
        res.redirect(`/campgrounds/${id}`);
    }
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
