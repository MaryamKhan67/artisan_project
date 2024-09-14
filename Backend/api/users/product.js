const express = require("express")
const router = express.Router()

const Product = require("../../models/artists/product");

router.get("/get-product-by-id/(:productID)", async (req, res) => {
    const product = await Product.findById(req.params.productID).populate('artistID')
    console.log(product)
    const products = await Product.find({
        artistID: product.artistID._id,
        _id: { $ne: product._id }
    }).limit(4).populate("artistID");
    return res.status(200).json({ product, products })
})

module.exports = router