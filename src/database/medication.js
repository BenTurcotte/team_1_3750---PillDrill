/*
This file will hold all of the function calls for the medications
*/

const MEDICATION_TABLE_NAME = "Medications";

module.exports = function(db, userDB) {
    return {
        /**
         * This will create the medication table
         * 
         * Columns (as specified in the google doc):
         * - id
         * - user_id
         * - name
         * - dosage_amount
         * - dosage_unit
         * - start_date
         * - end_date
         * - times
         * - days_of_week : each day stores a string with comma-separated times
         * - notes
         * - notification
         * - notification_before
         * - hits
         * - misses
         * 
         * link: https://docs.google.com/document/d/19EfGXJbhmD3z-u2Ud4jsdQaSt6Fuxf-8L5xDz8mQ5cc/edit?usp=sharing
         */
        /**
         * Creates the user table and will not drop it if it's already there
         */
        createTable() {
            db.run(`CREATE TABLE IF NOT EXISTS ${MEDICATION_TABLE_NAME} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT UNIQUE,
                name TEXT NOT NULL,
                dosage INTEGER,
                dosage_unit TEXT NOT NULL,
                start_date TEXT NOT NULL,
                end_date TEXT NOT NULL,
                times TEXT NOT NULL,
                days_of_week TEXT NOT NULL,
                notes TEXT,
                notification INTEGER,
                notification_before INTEGER,
                hits INTEGER,
                misses INTEGER
            )`);
        },
        /**
         * This will delete the medication
         * by searching medication ID
         */
        deleteMedication(med_id, user_id, callback) {
            db.run(`DELETE * FROM ${MEDICATION_TABLE_NAME} where id = $med_id and
            user_id = $user_id)`,{
                $user_id: user_id,
                $med_id: med_id
            },(dbErr) => {
                if (dbErr) {
                    callback(dbErr);
                    console.error("deleteMedication: delete error", dbErr);
                    return;
                }     
                callback();
            })
        },

        /**
         * This will add the medication table
         * 
         * Columns (as specified in the google doc):
         * - user_id
         * - name
         * - dosage_amount
         * - dosage_unit
         * - start_date
         * - end_date
         * - times
         * - days_of_week : each day stores a string with comma-separated times
         * - notes
         * - notification
         * - notification_before
         * - hits
         * - misses
         * 
         * link: https://docs.google.com/document/d/19EfGXJbhmD3z-u2Ud4jsdQaSt6Fuxf-8L5xDz8mQ5cc/edit?usp=sharing
         */
        addMedication(med, callback){        
            db.run(`INSERT INTO ${MEDICATION_TABLE_NAME} (id, user_id, name, dosage, dosage_unit, start_date, end_date, 
            times, days_of_week, notes, notification, notification_before, hits, misses)
            VALUES ($med_id, $user_id, $name, $dosage, $dosage_unit, $start_date, $end_date, $times, $days_of_week, 
            $notes, $notification, $notification_before, $hits, $misses)`, {
                $med_id: med.med_id,
                $user_id: med.user_id, 
                $name: med.name, 
                $dosage: med.dosage, 
                $dosage_unit: med.dosage_unit, 
                $start_date: med.start_date, 
                $end_date: med.end_date, 
                $times: med.times, 
                $days_of_week: med.days_of_week, 
                $notes: med.notes, 
                $notification: med.notification, 
                $notification_before: med.notification_before, 
                $hits: med.hits, 
                $misses: med.misses
            }, (dbErr) => {
                if (dbErr) {
                    callback(dbErr);
                    console.error("addMedication: insert error", dbErr);
                    return;
                }               
                callback();
            })
        },

        /*
        * This will update the medication table
         * 
         * Columns (as specified in the google doc):
         * - user_id
         * - name
         * - dosage_amount
         * - dosage_unit
         * - start_date
         * - end_date
         * - times
         * - days_of_week : each day stores a string with comma-separated times
         * - notes
         * - notification
         * - notification_before
         * - hits
         * - misses
        */
        /**
         * searching by medication id and update the meduacation table
         * 
         * will not drop it if id==NULL
         */
        updateMedication(med, callback) { 
            db.run(`UPDATE ${MEDICATION_TABLE_NAME} SET name = $name, dosage = $dosage, dosage_unit = $dosage_unit, 
            start_date = $start_date, end_date = $end_date , times = $times, days_of_week = $days_of_week, notes = $notes, 
            notification = $notification, notification_before = $notification_before, hits = $hits, misses = $misses
            WHERE id = $med_id`, {                    
                $name: med.name, 
                $dosage: med.dosage, 
                $dosage_unit: med.dosage_unit, 
                $start_date: med.start_date, 
                $end_date: med.end_date, 
                $times: med.times, 
                $days_of_week: med.days_of_week, 
                $notes: med.notes, 
                $notification: med.notification, 
                $notification_before: med.notification_before, 
                $hits: med.hits, 
                $misses: med.misses,
                $med_id: med.med_id
            },(dbErr) => {
                if (dbErr) {
                    callback(dbErr);
                    console.error("updateMedication: update error", dbErr);
                    return;
                }               
                callback();
            })                                
        },
/*
        /* This will get information from  the medication table
         * searching by medication id and user id
         * 
         * Columns (as specified in the google doc):
         * - id
         * - name
         * - dosage_amount
         * - dosage_unit
         * - start_date
         * - end_date
         * - times
         * - days_of_week : each day stores a string with comma-separated times
         * - notes
         * - notification
         * - notification_before
         * - hits
         * - misses
        */
        getMedications(user_id,callback){
            db.get(`SELECT * FROM ${MEDICATION_TABLE_NAME}
                    WHERE user_id = $user_id`,{
                $user_id: user_id,
            },(err, rows) => {
                if (err) {
                    callback(err);
                    console.error("getMedications: select error", err);
                    return;
                }

                if(!rows){
                    callback(new Error("User has no medicatons"));
                    console.error("getMedications: no rows from user", user_id);
                    return;
                }

                var medicationArray = [];
                rows.array.forEach(row => {
                    medicationArray.push(
                        {
                            med_id              : row.id,  
                            user_id             : row.user_id,  
                            name                : row.name,  
                            dosage              : row.dosage,  
                            dosage_unit         : row.dosage_unit,  
                            start_date          : row.start_date,  
                            end_date            : row.end_date,  
                            times               : row.times,  
                            days_of_week        : row.days_of_week,  
                            notes               : row.notes,  
                            notification        : row.notification,  
                            notification_before : row.notification_before,  
                            hits                : row.hits,  
                            misses              : row.misses
                        }
                    )
                    
                });   
                callback(undefined, medicationArray);             
            });
        },

        /**
         * Returns a JSON array containing information about all medications
         * Last Updated: Nov 22/2017
         * Author: Tamara
         */
        getTable(callback) {
            db.get(`SELECT * FROM ${MEDICATION_TABLE_NAME}`, (err, rows) => {
                if(err)
                {
                    callback(err)
                    return;
                }

                var medicationArray = [];
                rows.array.forEach(row => {
                    medicationArray.push(
                    {
                        id: row.id,
                        user_id: row.user_id,
                        name: row.name,
                        dosage: row.dosage,
                        dosage_unit: row.dosage_unit,
                        start_date: row.start_date,
                        end_date: row.end_date,
                        times: row.times,
                        days_of_week: row.days_of_week,
                        notes: row.notes,
                        notification: row.notification,
                        notification_before: row.notification_before,
                        hits: row.hits,
                        misses: row.misses
                    })
                });
                callback(undefined, medicationArray);
            });
        }
    };
}
