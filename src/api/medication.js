/*
This will be the routes for the medications
*/
const db    = require("../database/database");
const utils = require("../utils");

module.exports = function(router) {

    /*
    req has auth token and UID
    */
    router.post("/getMedications", function(req, res) {
        
    });

    /*
    req has loginToken, and id
    */
    router.post("/getSchedule", function(req, res) {
        var params = utils.checkParameters(req,
                    "loginToken",
                    "id");
        db.user.checkLogin(params.id, params.loginToken, (err, stuff) => {
            if (err) {
                res.status(400).json(utils.createErrorObject("Session expired."));
                return;
            }
            db.med.getMedications(params.id, (err, allMeds) => {
                var medsByTime = [];
                allMeds.foreach(function(medication) {
                    medication.times.split(",").sort().foreach(function(time) {
                        medsByTime.push(
                            {
                            id                  : medication.id,
                            user_id             : medication.user_id,
                            name                : medication.name,
                            dosage              : medication.dosage,
                            dosage_unit         : medication.dosage_unit,
                            start_date          : medication.start_date,
                            end_date            : medication.end_date,
                            time                : timeArr[j],
                            days_of_week        : medication.days_of_week,
                            notes               : medication.notes,
                            notification        : medication.notification,
                            notification_before : medication.notification_before,
                            hits                : medication.hits,
                            misses              : medication.misses
                            }
                        );
                    });
                });
            });
             // res = giveMeJSON(dayArray)
            res.status(200).json(medsByTime);
        });
    });

    /*
    req has auth token, UID, and medID
    if medID is not provided, a new medication should be added
    */
    router.post("/updateMedication", function(req, res) {

    });
    
    /*
    req has auth token, UID, and medID
    */
    router.post("/deleteMedication", function(req, res) {

    });
};
