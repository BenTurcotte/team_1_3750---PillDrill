/*
This is the base route for all of our user routes
This is the only file that main.js should be interacting with in the user/ directory
*/

const express    = require("express");

//Include all of our submodules that we will pass our router
const utils      = require('../utils');
const db         = require('../database/database');
const login      = require("./login");
const medication = require("./medication");

//Create a router to create different paths related to the users
var router = express.Router();

//Pass this router to all of our sub-modules
login(router);
medication(router);

router.get("/getUserTable", function(req, res) {
    
    db.user.getTable((err, table) => {
        if (err) {
            res.status(400).json(utils.createErrorObject(err.message));
            return;
        }
    
        // do stuff with table
        res.set("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(table, null, 4));
    });
});

router.get("/getMedicationsTable", function(req, res) {
    
    db.med.getTable((err, table) => {
        if (err) {
            res.status(400).json(utils.createErrorObject(err.message));
            return;
        }
    
        // do stuff with table
        res.set("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(table, null, 4));
    });
});

module.exports = router;
