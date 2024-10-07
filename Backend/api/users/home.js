const express = require("express")
const router = express.Router()

const Artist = require('../../models/artists/artist');
const Product = require("../../models/artists/product");
const User = require("../../models/users/user");

router.get("/get-data", async (req, res) => {
    const artists = await Artist.find().select("artisticName category logo banner description").sort({ _id: -1 })
    const arts = await Product.find().select("productName images description artistID price").populate("artistID").sort({ _id: -1 }).limit(12)
    return res.status(200).json({ artists, arts })
})

router.get("/get-user/(:userID)", async (req, res) => {
    const userData = await User.findById(req.params.userID)
    return res.status(200).json(userData)
})

module.exports = router