/*
This will be the routes for the medications
*/
const db    = require("../database/database");
const utils = require("../utils");

module.exports = function(route) {

    router.post("/GetSchedule", function(req, res) {
        // check authentication token
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
                add it to the list at the day specified by the array index
        */
        // res = giveMeJSON(dayArray)
    });

};