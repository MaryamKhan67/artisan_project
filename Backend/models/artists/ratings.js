const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    artistID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'artists',
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    orderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        required: true
    },
    overallRating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    metrics: {
        artQuality: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        creativity: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        communication: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        }
    },
    comment: {
        type: String,
        maxlength: 500
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
