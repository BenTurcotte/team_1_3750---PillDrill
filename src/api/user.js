/*
This is the base route for all of our user routes
This is the only file that main.js should be interacting with in the user/ directory
*/

const express    = require("express");

//Include all of our submodules that we will pass our router
const utils      = require('../utils');
const dbUser     = require('../database/user');
const login      = require("./login");
const medication = require("./medication");

//Create a router to create different paths related to the users
var router = express.Router();

//Pass this router to all of our sub-modules
login(router);
medication(router);

module.exports = function (router) {
    
    req.on('error', (err) => { utils.createErrorObject(err) }); // ??? what is err? hopefully a string...
    
    /*
    request has auth_token, userID, client_JSON
    */
    router.post("/CreateAccount", function (req, res) {
        var { email, password, accountType } = JSON.parse(req.body);
        dbUser.createNewUser(email, password, accountType, function () { /* STUFF */ });
        res.body = '{"error" : null}';
    });

    /*
    request has email and password
    */
    router.post("/Login", function(req, res) {
        var { email, password, accountType } = JSON.parse(req.body);
        login.login(email, password, function () {
            // callback function
        });
    });
};