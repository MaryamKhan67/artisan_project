const express = require("express")
const router = express.Router()

const Products = require('../../models/artists/product');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const firebaseApp = require("../firebase");
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require("firebase/storage");
const storage = getStorage(firebaseApp);

const verifyToken = require('../middleware/verify_token');

router.post("/", verifyToken, async (req, res) => {
    const { artistID } = req.body;
    const products = await Products.find({ artistID })
    return res.status(200).json(products)
})

router.get("/get-by-id/(:productID)", verifyToken, async (req, res) => {
    const { productID } = req.params;
    const product = await Products.findById(productID)
    return res.status(200).json(product)
})

router.post("/add-product", verifyToken, upload.array("images"), async (req, res) => {
    try {
        const { productName, description, price, stockQuantity, artistID } = req.body;
        const files = req.files;

        // Upload images to Firebase Storage and get the URLs
        const imageUrls = await Promise.all(
            files.map(async (file) => {
                const storageRef = ref(storage, `products/${[productName]}/${file.originalname}`);
                const snapshot = await uploadBytes(storageRef, file.buffer);
                return await getDownloadURL(snapshot.ref);
            })
        );

        // Create new product instance
        const newProduct = new Products({
            productName,
            images: imageUrls,
            description,
            price,
            stockQuantity,
            artistID,
        });

        // Save the product to MongoDB
        await newProduct.save();

        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error: error.message });
    }
});

router.post("/edit-product/:id", verifyToken, upload.array("images"), async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, description, price, stockQuantity } = req.body;

        // Find the product by ID
        const product = await Products.findById(id);

        // Update product fields
        product.productName = productName;
        product.description = description;
        product.price = price;
        product.stockQuantity = stockQuantity;

        const newImages = req.files;
        if (newImages && newImages.length > 0) {
            // If there are existing images, delete them from Firebase Storage
            if (product.images && product.images.length > 0) {
                try {
                    const imagePromises = product.images.map(async (imageUrl) => {
                        const fileRef = ref(storage, imageUrl);
                        await deleteObject(fileRef);
                    });
                    await Promise.all(imagePromises);
                } catch (e) {
                    console.log('Error deleting files from Firebase Storage:', e.message);
                }
            }

            // Upload new images to Firebase Storage and update product.images with new URLs
            product.images = await Promise.all(
                newImages.map(async (file) => {
                    const storageRef = ref(storage, `products/${productName}/${file.originalname}`);
                    const snapshot = await uploadBytes(storageRef, file.buffer);
                    return await getDownloadURL(snapshot.ref);
                })
            );
        }

        // Save the updated product
        await product.save();

        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
});


router.post('/delete-product', verifyToken, async (req, res, next) => {
    const { productId } = req.body;
    // const orders = await Order.find({ productID: prodID })
    // if (orders.length != 0) {
    //     await Product.findByIdAndUpdate(prodID, { active: false }, { new: true });
    // } else {
    const product = await Products.findById(productId);

    if (product.images && product.images.length > 0) {
        try {
            const imagePromises = product.images.map(async (imageUrl) => {
                const fileRef = ref(storage, imageUrl);
                await deleteObject(fileRef);
            });
            await Promise.all(imagePromises);
        } catch (e) {
            console.log('Error in File Deletion')
        }
    }

    await Products.deleteOne({ _id: productId });
    // }
    return res.status(200).json({ message: "Product deleted successfully" });
})

module.exports = router