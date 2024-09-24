const express = require("express")
const router = express.Router()

const Artist = require("../../models/artists/artist")
const User = require("../../models/users/user")
const Message = require("../../models/artists/message")

router.get('/artists/:userID', async (req, res) => {
    const userID = req.params.userID;

    const distinctArtistIDs = await Message.find({ userID }).distinct('artistID');

    const artists = await Artist.find({ _id: { $in: distinctArtistIDs } });

    res.json({ artists });
});

router.get('/users/:artistID', async (req, res) => {
    const artistID = req.params.artistID;

    const distinctUserIDs = await Message.find({ artistID }).distinct('userID');

    const users = await User.find({ _id: { $in: distinctUserIDs } });

    res.json({ users });
});

router.get('/:userID/:artistID', async (req, res) => {
    const { userID, artistID } = req.params;

    const messages = await Message.find({ userID, artistID }).populate("artistID").sort('timestamp');
    res.json({ messages });
});

router.post('/send-message', async (req, res) => {
    const { userID, artistID, message, sender } = req.body;

    const newMessage = new Message({
        userID,
        artistID,
        message,
        sender,
    });

    await newMessage.save();
    res.json({ message: newMessage });
});


module.exports = router