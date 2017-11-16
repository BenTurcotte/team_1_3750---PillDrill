/*
This will be the routes for the medications
*/
const db    = require("../database/database");
const utils = require("../utils");

module.exports = function(route) {

    /*
    req has auth token and UID
    */
    router.post("/GetMedications", function(req, res) {
        
    });

    /*
    req has auth token and UID
    */
    router.post("/GetSchedule", function(req, res) {
        // authTok = req.body.authenticationToken;
        // check authentication token with db to grant access
        // retrieve all medication for the given userID from the db
        /*
          for every medication with more than one specified time
          - make as many copies of the medication as there are unique times
          - delete the medication with multiple times (master copy)
        */
        // sort the list of medications by time
        // create an array of length 7 (one element per day of the week)
        /*
          for each day in the array
            for each medication in the list of medications
              if the medication is to be taken on the day in question,
              AND the day in question is not past the end date or before the
              start date
                add it to the list at the day specified by the array index
        */
        // res = giveMeJSON(dayArray)
    });

    /*
    req has auth token, UID, and medID
    if medID is not provided, a new medication should be added
    */
    router.post("/UpdateMedication", function(req, res) {

    });
    
    /*
    req has auth token, UID, and medID
    */
    router.post("/DeleteMedication", function(req, res) {

    });
};