const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productName: { type: String, required: true },
    images: [{
        type: String,
        required: true
    }],
    artistID: { type: mongoose.Schema.ObjectId, required: true, ref: 'artists' },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
})

module.exports = mongoose.model("products", productSchema)