const express = require("express")
const router = express.Router()

const Product = require("../../models/artists/product");
const Rating = require("../../models/artists/ratings");

router.get("/get-product-by-id/(:productID)", async (req, res) => {
    const product = await Product.findById(req.params.productID).populate('artistID')
    const products = await Product.find({
        artistID: product.artistID._id,
        _id: { $ne: product._id }
    }).limit(4).populate("artistID");

    const reviews = await Rating.find({ artistID: product.artistID }).populate("orderID");
    const averageMetrics = reviews.reduce((acc, review) => {
        acc.artQuality += review.metrics.artQuality;
        acc.creativity += review.metrics.creativity;
        acc.communication += review.metrics.communication;
        acc.overallRating += review.overallRating;
        return acc;
    }, { artQuality: 0, creativity: 0, communication: 0, overallRating: 0 });

    const totalReviews = reviews.length;
    if (totalReviews > 0) {
        averageMetrics.artQuality /= totalReviews;
        averageMetrics.creativity /= totalReviews;
        averageMetrics.communication /= totalReviews;
        averageMetrics.overallRating /= totalReviews;
    }

    return res.status(200).json({ product, products, averageMetrics })
})

module.exports = router