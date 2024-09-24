const express = require("express")
const router = express.Router()

const Rating = require("../../models/artists/ratings");

router.post("/submit-rating", async (req, res) => {
    const { userID, artistID, orderID, overallRating, metrics } = req.body;

    try {
        // Check if a rating from the user for the artist already exists
        const existingRating = await Rating.findOne({ userID, artistID, orderID });

        if (existingRating) {
            // Update the existing rating
            existingRating.overallRating = overallRating;
            existingRating.metrics = metrics;
            await existingRating.save();
            res.status(200).json({ message: 'Rating updated successfully', updatedRating: existingRating });
        } else {
            // Create a new rating if it doesn't exist
            const newReview = new Rating(req.body);
            await newReview.save();
            res.status(201).json({ message: 'Rating created successfully', newReview });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error processing rating', error });
    }
});

router.post('/get-order-rating', async (req, res) => {
    try {
        const { artistID, userID, orderID } = req.body;

        const review = await Rating.findOne({ artistID, userID, orderID });

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        return res.status(200).json(review);
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error });
    }
});


module.exports = router