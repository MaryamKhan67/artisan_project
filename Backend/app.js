const express = require('express');
const app = express()
const session = require('express-session');
const http = require('http')

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://artisangallery04:' + process.env.MONGO_PASS + '@cluster0.lvg86.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

var cors = require('cors')
app.use(cors({ origin: 'http://localhost:3030', credentials: true }))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// --- User Routes --- //
const userLoginRoute = require('./api/users/login')
app.use('/api/user', userLoginRoute)

// --- Artist Routes --- //
const artLoginRoute = require('./api/artists/login')
app.use('/api/artist', artLoginRoute)

const artProductsRoute = require('./api/artists/products')
app.use('/api/artist/products', artProductsRoute)

const artStoreRoute = require('./api/artists/store')
app.use('/api/artist/store', artStoreRoute)

const artOrderRoute = require('./api/artists/orders')
app.use('/api/artist/orders', artOrderRoute)

const artMessageRoute = require('./api/artists/message')
app.use('/api/artist/messages', artMessageRoute)


const userHomeRoute = require('./api/users/home')
app.use('/api/user/home', userHomeRoute)

const userProductRoute = require('./api/users/product')
app.use('/api/user/product', userProductRoute)

const userCartRoute = require('./api/users/cart')
app.use('/api/user/cart', userCartRoute)

const userWishlistRoute = require('./api/users/wishlist')
app.use('/api/user/wishlist', userWishlistRoute)

const userCheckoutRoute = require('./api/users/checkout')
app.use('/api/user/checkout', userCheckoutRoute)

const userOrdersRoute = require('./api/users/orders')
app.use('/api/user/orders', userOrdersRoute)

const userRatingRoute = require('./api/users/ratings')
app.use('/api/user/ratings', userRatingRoute)

const PORT = process.env.PORT || 8080;
const server = http.createServer(app)
server.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});

module.exports = app;