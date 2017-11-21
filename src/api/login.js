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
                res.status(400).json(utils.createErrorObject("The email or password were incorrect"));
                return;
            }

            //Send the userData as a JSON object if it worked
            res.status(200).json(utils.createResponseObject(userData));
        });
    });

    //Tries to create an account
    router.post("/createAccount", function(req, res) {
        //should accept login_tokin, creator_id, new_user
        var params = utils.checkParameters(req, "loginToken", "new_user", "creator");
        
        if (!params) {
            res.status(400).json(utils.createErrorObject("Could not find loginToken, new_user object, and/or creator object"));
            return;
        }
        
        db.user.checkLogin(params.creator.user_id, params.loginToken, (err) => {
            
            if (err) {
                res.status(400).json(utils.createErrorObject("Session has expired."));
                return;
            }
            else if (creator.account_type == "Admin") {  
                
                db.user.createNewUser(params.new_user, function(err) {
                
                    if (err) {
                        res.status(500).json(utils.createErrorObject("Couldn't create the user"));
                        return;
                    }
                });
            }
            else {
                res.status(400).json(utils.createErrorObject("User does not have permission to create an account"));
            }

        });
    });
};
