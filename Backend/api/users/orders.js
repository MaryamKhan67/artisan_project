const express = require("express")
const router = express.Router()

const Order = require("../../models/users/order");

router.get('/get-orders/:userID', async (req, res) => {
    try {
        const orders = await Order.find({ userID: req.params.userID });

        if (!orders.length) {
            return res.status(404).json([]);
        }

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error });
    }
});

router.get('/get-order-by-id/:orderID', async (req, res) => {
    try {
        const orderData = await Order.findById(req.params.orderID);
        if (!orderData) {
            return res.status(404).json([]);
        }

        return res.status(200).json(orderData);
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error });
    }
});

module.exports = router