const express = require('express');
const router = express.Router({ mergeParams: true });
/*
Dengan set options mergeParams: true, maka file ini jadi punya akses ke :id di req.params.
Hal ini karena :id ada di file app.js, dan express scr default ga kasi akses ID tsbt ke file lain.
*/
const wrap = require('../utilities/wrap');
const Review = require('../models/review');
const Campgrounds = require('../models/campground');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');


router.post('/', isLoggedIn, validateReview, wrap(reviews.createReview));

router.delete('/:reviewID', isLoggedIn, isReviewAuthor, wrap(reviews.deleteReview));

module.exports = router;

