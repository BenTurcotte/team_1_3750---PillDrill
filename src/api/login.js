/*
This file will have all of the user login functionality
*/

const db = require("../database/database");
const utils = require("../utils");

module.exports = function(router) {
    //Tries to create a new login token for the given account
    router.post("/login", function(req, res) {
        var params = utils.checkParameters(req, "email", "password");
        if (!params) {
            res.status(400).json(utils.createErrorObject("Email and password are required"));
            return;
        }

        db.user.login(params.email, params.password, function(err, userData) {
            if (err) {
                // res.status(400).json(utils.createErrorObject(err.stack));
                res.status(400).json(utils.createErrorObject("The email or password were incorrect"));
                return;
            }

            //Send the userData as a JSON object if it worked
            res.status(200).json(utils.createResponseObject(userData));
        });
    });

    //Tries to create an account
    router.post("/createAccount", function(req, res) {
        var params = utils.checkParameters(req, "email", "password", "accountType");
        if (!params) {
            res.status(400).json(utils.createErrorObject("Email, password and accountType are required"));
            return;
        }

        //Will probably need to make rules for who can create accounts
        
        db.user.createNewUser(params.email, params.password, params.accountType, function(err) {
            if (err) {
                res.status(500).json(utils.createErrorObject("Couldn't create the user"));
                return;
            }

            res.status(200).json(utils.createErrorObject());
        });
    });

    //Tries to verify a login token with an email
    router.post("/checkToken", function(req, res) {
        
    });
};
