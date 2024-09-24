const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    artistID: { type: mongoose.Schema.Types.ObjectId, ref: 'artists', required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    sender: { type: String, required: true }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
