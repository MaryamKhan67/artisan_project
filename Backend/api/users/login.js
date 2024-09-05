const express = require("express")
const router = express.Router()
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");

const User = require('../../models/users/user');

router.post('/', async (req, res) => {
})

router.post('/register', (req, res) => {

})

module.exports = router