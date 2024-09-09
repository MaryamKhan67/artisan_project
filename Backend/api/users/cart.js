const express = require("express")
const router = express.Router()

const Cart = require("../../models/users/cart");

router.post("/add-to-cart", async (req, res) => {
    try {
        const { userID, productID } = req.body;

        const existingCartItem = await Cart.findOne({ userID, productID });

        if (existingCartItem) {
            return res.status(200).json("Product already in Cart");
        }

        const newCart = new Cart({
            userID,
            productID,
        });

        await newCart.save();
        return res.status(200).json("Product added to cart");
    } catch (error) {
        return res.status(500).json({ error: "Something went wrong, please try again" });
    }
});

router.get('/get-cart-products/:userID', async (req, res) => {
    try {
        const cartItems = await Cart.find({ userID: req.params.userID }).populate("productID");

        if (!cartItems.length) {
            return res.status(404).json({ message: "No items in cart" });
        }

        const totalAmount = cartItems.reduce((total, item) => {
            return total + item.productID.price;
        }, 0);

        return res.status(200).json({ cartItems, totalAmount });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error });
    }
});

router.delete('/remove-product/:userID/:productID', async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userID: req.params.userID, productID: req.params.productID });
        return res.status(200).json({ message: "Product removed from cart" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to remove product", error });
    }
});



module.exports = router