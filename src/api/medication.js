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

    !!! so far only sorts meds based on times, not days of the week !!!
    */
    router.post("/getSchedule", function(req, res) {
        
        var params = utils.checkParameters(req, "loginToken", "id");
        
        db.user.checkLogin(params.id, params.loginToken, (err, stuff) => {
            
            if (err) {
                res.status(400).json(utils.createErrorObject("Session expired."));
                return;
            }
            
            db.med.getMedications(params.id, (err, allMeds) => {
                
                if (err) {
                    res.status(400).json(utils.createErrorObject("Session expired."));
                    return;
                }
                
                var medsByTime    = [];
                var schedule      = [[],[],[],[],[],[],[]];
                var day           = [];
                const today = new Date();
                
                allMeds.foreach(function(med) {
                    med.times.split(",").sort().foreach(function(time) {
                        medsByTime.push(
                            {
                            id                  : med.id,
                            user_id             : med.user_id,
                            name                : med.name,
                            dosage              : med.dosage,
                            dosage_unit         : med.dosage_unit,
                            start_date          : med.start_date,
                            end_date            : med.end_date,
                            time                : timeArr[j],
                            days_of_week        : med.days_of_week,
                            notes               : med.notes,
                            notification        : med.notification,
                            notification_before : med.notification_before,
                            hits                : med.hits,
                            misses              : med.misses
                            }
                        );
                    });
                });

                medsByTime.sort().foreach(function(med) {
                    var days = med.days_of_week.split(",");
                    var i = 0;
                    for (i = 0; i < days.length; i++) {
                        if (days[i] == 1) {
                            schedule[i].push(
                                {
                                    id                  : med.id,
                                    user_id             : med.user_id,
                                    name                : med.name,
                                    dosage              : med.dosage,
                                    dosage_unit         : med.dosage_unit,
                                    time                : med.time,
                                    notes               : med.notes,
                                    notification        : med.notification
                                }
                            );
                        }
                    }
                });

                res.status(200).json(schedule);
            });
        });
    });

    /*
    req has auth token, UID, and medID
    if medID is not provided, a new medication should be added
    */
    router.post("/updateMedication", function(req, res) {
        
        var params = utils.checkParameters(req, "loginToken", "id", "user_id", "med");
        
        db.user.checkLogin(params.id, params.loginToken, (err, stuff) => {
            
            if (err) {
                res.status(400).json(utils.createErrorObject("Session expired."));
                return;
            }

            if (params.id != null) {
                db.med.updateMedication()
            }
            else {

            }
        });
    });
    
    /*
    req has auth token, UID, and medID
    */
    router.post("/deleteMedication", function(req, res) {

    });
};
