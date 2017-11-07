/*
This is the base route for all of our user routes
This is the only file that main.js should be interacting with in the user/ directory
*/

const express = require("express");

//Include all of our submodules that we will pass our router
const login = require("./login");

//Create a router to create different paths related to the users
var router = express.Router();

//Pass this router to all of our sub-modules
login(router);

module.exports = router;