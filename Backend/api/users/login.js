const express = require("express")
const router = express.Router()
var jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

const User = require('../../models/users/user');

router.post('/login', async (req, res) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send("User Not Found");
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid Password");
        }

        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {});

        return res.status(200).json({
            userID: user._id,
            token: token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});


router.post('/register', async (req, res) => {
    const check = await User.findOne({ email: req.body.email })
    if (check) {
        return res.status(201).send('User already exists!');
    }
    const hashPassword = await bcrypt.hash(req.body.password, 10)
    await new User({
        userName: req.body.userName,
        email: req.body.email,
        password: hashPassword,
        mobile: req.body.mobile,
    }).save()
    return res.status(200).send('Registration Successful!');
})

module.exports = router