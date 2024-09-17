const express = require("express")
const router = express.Router()

const Order = require('../../models/users/order');
const Product = require("../../models/artists/product");
const Rating = require("../../models/artists/ratings");

router.post("/get-artist-orders", async (req, res) => {
    const { artistID } = req.body;

    try {
        const query = {
            "product.artistID": artistID,
        };

        const orders = await Order.find(query);
        return res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching artist orders", error });
    }
})

router.post("/get-recent-orders", async (req, res) => {
    const { artistID } = req.body;

    try {
        const allRecentOrders = await Order.find({ "product.artistID": artistID })
            .sort({ createdAt: -1 });

        const totalRevenue = allRecentOrders.reduce((sum, order) => {
            return sum + order.product.reduce((productSum, product) => {
                return productSum + product.price;
            }, 0);
        }, 0);

        const ratings = await Rating.find({ artistID });
        let totalOverallRating = 0;
        ratings.forEach(rating => {
            totalOverallRating += rating.overallRating;
        });
        const overallRating = parseFloat(totalOverallRating / ratings.length).toFixed(1);

        const arts = await Product.find({ artistID }).countDocuments()

        const recentOrders = allRecentOrders.slice(0, 3);

        return res.status(200).json({
            recentOrders, totalRevenue, totalOrders: allRecentOrders.length, arts,
            totalReviews: ratings.length,
            overallRating
        });
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        return res.status(500).json({ message: "Error fetching recent orders", error });
    }
});


router.post('/update-status', async (req, res) => {
    const { orderID, status } = req.body;

    console.log(orderID)

    try {
        const order = await Order.findOne({ orderID });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating order status', error });
    }
});


module.exports = router