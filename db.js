var firebase = require("firebase/app");
var database = require("firebase/database");
var firestore = require("firebase/firestore");
var auth = require("firebase/auth");
var functions = require("firebase/functions");

var firebaseConfig = {
    apiKey: "AIzaSyDQv2R4ijXaDooj7DiSh1WkR66PcuBA3FM",
    authDomain: "samurai-e00ed.firebaseapp.com",
    databaseURL: "https://samurai-e00ed.firebaseio.com",
    projectId: "samurai-e00ed",
    storageBucket: "samurai-e00ed.appspot.com",
    messagingSenderId: "839463369964",
    appId: "1:839463369964:web:1a06fe4c5b9c40d92c79c9",
    measurementId: "G-Q2S9RY2YKH"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();