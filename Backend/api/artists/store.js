const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const firebaseApp = require("../firebase");
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require("firebase/storage");
const storage = getStorage(firebaseApp);
const verifyToken = require('../middleware/verify_token');

const Product = require("../../models/artists/product");
const Artist = require('../../models/artists/artist');
const Rating = require('../../models/artists/ratings');

router.post('/get', verifyToken, async (req, res) => {
    const { artistID } = req.body;
    const artist = await Artist.findById(artistID)
    return res.status(200).json(artist)
})

router.post("/edit-logo", verifyToken, upload.single('logo'), async (req, res) => {
    const { artistID } = req.body;
    const logoFile = req.file ? req.file : null;

    try {
        const artist = await Artist.findById(artistID);
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        // Check and replace logo if necessary
        if (logoFile) {
            if (artist.logo) {
                // Remove the existing logo from Firebase
                const logoRef = ref(storage, artist.logo);
                await deleteObject(logoRef);
            }
            // Upload the new logo to Firebase and get the download URL
            const logoRef = ref(storage, `logos/${Date.now()}_${logoFile.originalname}`);
            await uploadBytes(logoRef, logoFile.buffer);
            const logoURL = await getDownloadURL(logoRef);
            artist.logo = logoURL;
        }

        await artist.save();
        return res.status(200).json({ message: 'Logo updated successfully', artist });
    } catch (error) {
        console.error('Error updating logo:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post("/edit-banner", verifyToken, upload.single('banner'), async (req, res) => {
    const { artistID } = req.body;
    const bannerFile = req.file ? req.file : null;

    try {
        const artist = await Artist.findById(artistID);
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        // Check and replace banner if necessary
        if (bannerFile) {
            if (artist.banner) {
                // Remove the existing banner from Firebase
                const bannerRef = ref(storage, artist.banner);
                await deleteObject(bannerRef);
            }
            // Upload the new banner to Firebase and get the download URL
            const bannerRef = ref(storage, `banners/${Date.now()}_${bannerFile.originalname}`);
            await uploadBytes(bannerRef, bannerFile.buffer);
            const bannerURL = await getDownloadURL(bannerRef);
            artist.banner = bannerURL;
        }

        await artist.save();
        return res.status(200).json({ message: 'Banner updated successfully', artist });
    } catch (error) {
        console.error('Error updating banner:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post("/edit-description", verifyToken, async (req, res) => {
    const { artistID, description } = req.body;

    try {
        // Find the artist by ID
        const artist = await Artist.findById(artistID);
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        // Update the description if provided
        if (description) {
            artist.description = description;
        }

        // Save the updated artist data
        await artist.save();

        return res.status(200).json({ message: 'Description updated successfully', artist });
    } catch (error) {
        console.error('Error updating description:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.delete('/delete/:artistID', verifyToken, async (req, res) => {
    try {
        const { artistID } = req.params;

        await Artist.deleteOne({ _id: artistID });

        return res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/get-artist-by-username/(:artisticName)', async (req, res) => {
    const artistData = await Artist.findOne({ artisticName: req.params.artisticName })
    const products = await Product.find({ artistID: artistData._id })
    const reviews = await Rating.find({ artistID: artistData._id });

    res.status(200).json({ artistData, products, reviews })
})


module.exports = router;