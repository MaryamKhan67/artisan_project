const express = require("express")
const router = express.Router()

const Wishlist = require("../../models/users/wishlist");

router.post("/add-to-wishlist", async (req, res) => {
    try {
        const { userID, productID } = req.body;

        const existingWishlistItem = await Wishlist.findOne({ userID, productID });

        if (existingWishlistItem) {
            return res.status(200).json("Product already in Wishlist");
        }

        const newWishlist = new Wishlist({
            userID,
            productID,
        });

        await newWishlist.save();
        return res.status(200).json("Product added to Wishlist");
    } catch (error) {
        return res.status(500).json({ error: "Something went wrong, please try again" });
    }
});

router.get('/get-wishlist-items/:userID', async (req, res) => {
    try {
        const WishlistItems = await Wishlist.find({ userID: req.params.userID }).populate("productID");

        if (!WishlistItems.length) {
            return res.status(404).json({ message: "No items in Wishlist" });
        }

        return res.status(200).json(WishlistItems);
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error });
    }
});

router.delete('/remove-item/:userID/:productID', async (req, res) => {
    try {
        await Wishlist.findOneAndDelete({ userID: req.params.userID, productID: req.params.productID });
        return res.status(200).json({ message: "Item removed from Wishlist" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to remove product", error });
    }
});



module.exports = router