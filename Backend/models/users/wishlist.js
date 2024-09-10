const mongoose = require("mongoose");

const wishlistSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
})

const Wishlist = new mongoose.model("wishlist", wishlistSchema)
module.exports = Wishlist;