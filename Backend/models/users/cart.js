const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
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
    quantity: { type: Number, default: 1 }
})

const Cart = new mongoose.model("cart", cartSchema)
module.exports = Cart;