const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;