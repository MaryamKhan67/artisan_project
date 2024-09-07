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

const PORT = process.env.PORT || 8080;
const server = http.createServer(app)
server.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});

module.exports = app;