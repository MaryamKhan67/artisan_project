const { initializeApp } = require("firebase/app");

const firebaseConfig = {
    apiKey: "AIzaSyBI4aKUxe1J1luA4w9g9pEQXwvd5wZnr8s",
    authDomain: "artgallery-64374.firebaseapp.com",
    projectId: "artgallery-64374",
    storageBucket: "artgallery-64374.appspot.com",
    messagingSenderId: "927922827645",
    appId: "1:927922827645:web:96788470f98f5488a09c14"
};

const firebaseApp = initializeApp(firebaseConfig);
module.exports = firebaseApp;