const express = require("express")
const router = express.Router()
var jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

const Artist = require('../../models/artists/artist');

router.post('/login', async (req, res) => {
    var artist = await Artist.findOne({ email: req.body.email });
    if (artist) {
        token = jwt.sign({ artistID: artist._id }, process.env.JWT_SECRET, {});
        return res.status(200).json({
            "artistID": artist._id,
            "token": token
        })
    } else {
        return res.status(201).send("Artist Not Found")
    }
})

router.post('/register', async (req, res) => {
    const check = await Artist.findOne({ email: req.body.email })
    if (check) {
        return res.status(201).send('Artist already exists!');
    }
    const hashPassword = await bcrypt.hash(req.body.password, 10)
    await new Artist({
        legalName: req.body.legalName,
        artisticName: req.body.artisticName,
        category: req.body.category,
        email: req.body.email,
        password: hashPassword,
        mobile: req.body.mobile,
    }).save()
    return res.status(200).send('Registration Successful!');
})

router.post('/check-artistic-name', async (req, res) => {
    const { artisticName } = req.body;

    try {
        const artist = await Artist.findOne({ artisticName });

        if (artist) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking artistic name uniqueness:', error);
        return res.status(500).json({ error: 'Server error' });
    }
})

module.exports = router