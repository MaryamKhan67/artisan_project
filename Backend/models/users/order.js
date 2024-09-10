const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = mongoose.Schema({
    orderID: {
        type: Number,
        unique: true,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: [
        {
            productID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            productName: String,
            images: [{
                type: String,
                required: true
            }],
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    quantity: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        mobile: { type: String, required: true },
        flatNo: { type: String, required: true },
        streetAddress: { type: String, required: true },
        landmark: { type: String },
        pincode: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        deliveryNotes: { type: String },
        raz_paymentID: { type: String },
        raz_orderID: { type: String },
        raz_signature: { type: String },
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Shipped', 'Delivered'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

orderSchema.plugin(AutoIncrement, { inc_field: 'orderID' });

const Order = new mongoose.model("orders", orderSchema)
module.exports = Order;