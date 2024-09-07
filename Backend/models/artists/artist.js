const mongoose = require('mongoose');

const artistSchema = mongoose.Schema({
    legalName: { type: String, required: true },
    artisticName: { type: String, required: true },
    category: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    logo: { type: String },
    banner: { type: String },
    description: { type: String },
})

module.exports = mongoose.model("artists", artistSchema)