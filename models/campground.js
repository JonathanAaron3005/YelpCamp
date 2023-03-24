const mongoose = require('mongoose');
const Review = require("./review");
const { cloudinary } = require('../cloudinary/index');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    name: String
})

//https://res.cloudinary.com/dkdmbqzaq/image/upload/v1677220681/YelpCamp/nfsvwiebhuy7n3uq4wys.jpg
imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300');
})

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
    title: {
        type: String
    },
    images: [imageSchema],
    price: {
        type: Number
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts)

campgroundSchema.virtual('properties.popUpMarkUp').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}"><h4>${this.title}</h4></a></strong>
    <p>${this.description.substring(0, 25)}...</p>
    `;
})
//THIS pada virtual akan refer ke particular instance

campgroundSchema.post('findOneAndDelete', async (doc) => {
    await Review.deleteMany({
        _id: { $in: doc.reviews }
    })

    // for(let filename of doc.images.name){
    //     await cloudinary.uploader.destroy(filename);
    // }
})

module.exports = mongoose.model('Campground', campgroundSchema);