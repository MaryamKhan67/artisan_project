const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

const Product = require('../../models/artists/product');
const Order = require('../../models/users/order');
const Cart = require('../../models/users/cart');

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-order', async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const options = {
            amount: parseInt(amount) * 100,
            currency: currency || "INR",
            receipt: `order_rcptid_${Math.random() * 10000}`
        };

        const order = await razorpayInstance.orders.create(options);
        console.log(order)
        res.status(200).json({ orderId: order.id, amount: options.amount });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
});

router.post('/place-order', async (req, res) => {
    try {
        const userID = req.body.userID;
        const cartItems = await Cart.find({ userID }).populate('productID');

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        for (const item of cartItems) {
            if (item.productID.stockQuantity < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${item.productID.productName}. Only ${item.productID.stockQuantity} left.`,
                });
            }
        }

        const orders = await Promise.all(
            cartItems.map(async (item) => {
                const order = new Order({
                    userID,
                    product: [
                        {
                            productID: item.productID._id,
                            productName: item.productID.productName,
                            images: item.productID.images,
                            price: item.productID.price,
                        },
                    ],
                    quantity: item.quantity,
                    shippingAddress: {
                        name: req.body.name,
                        email: req.body.email,
                        mobile: req.body.mobile,
                        flatNo: req.body.flatNo,
                        streetAddress: req.body.streetAddress,
                        landmark: req.body.landmark,
                        pincode: req.body.pincode,
                        city: req.body.city,
                        state: req.body.state,
                        deliveryNotes: req.body.deliveryNotes,
                        raz_paymentID: req.body.payment_id,
                        raz_orderID: req.body.order_id,
                        raz_signature: req.body.signature,
                    },
                    status: 'Pending',
                });

                await order.save();

                // Update product stock after creating the order
                await Product.findByIdAndUpdate(item.productID._id, {
                    $inc: { stockQuantity: -item.quantity },
                });

                return order;
            })
        );

        await Cart.deleteMany({ userID });

        res.status(200).json({ message: 'Orders created successfully', orders });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});

module.exports = router;
