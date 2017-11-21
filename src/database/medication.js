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
        deleteMedication(medID, uID) {
            db.run(`DELETE * FROM ${MEDICATION_TABLE_NAME} where id = $medID,
            user_id = $uID 
            )`,{
                $uID: uID,
                $medId: medID
            },(dbErr) => {
                if (dbErr) {
                    callback(dbErr);
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

        addMedication(medId,medName,medDosage,medDosageUnit,uID,startDate,endDate,times,
            DaysOfWeek,Note,Notif,Notif_before,Hits,Misses){
                
            db.run(`INSERT INTO ${MEDICATION_TABLE_NAME} (
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
            misses INTEGER)

            VALUES ($medId, $medName, $medDosage, $medDosageUnit, $uID, $startDate, $endDate, $times,
            $DaysOfWeek, $Note, $Notif, $Notif_before, $Hits, $Misses`, {
                $medId: medId,
                $medName: medName,
                $medDosage: medDosage,
                $medDosageUnit: medDosageUnit, 
                $uID: uID, 
                $startDate: startDate, 
                $endDate: endDate, 
                $times: times,
                $DaysOfWeek: DaysOfWeek, 
                $Note: Note, 
                $Notif: Notif, 
                $Notif_before: Notif_before, 
                $Hits: Hits, 
                $Misses: Misses
            }, (dbErr) => {
                if (dbErr) {
                    callback(dbErr);
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
        updateMedication(medId, medName, medDosage, medDosageUnit, uID, startDate, endDate, times,
            DaysOfWeek, Note, Notif, Notif_before, Hits, Misses){

            db.run(`UPDATE ${MEDICATION_TABLE_NAME} 
            SET
            user_id TEXT UNIQUE = $uID,
            name TEXT NOT NULL = $medName,
            dosage INTEGER = $medDosage,
            dosage_unit TEXT NOT NULL = $medDosageUnit,
            start_date TEXT NOT NULL = $startDate,,
            end_date TEXT NOT NULL =  $endDate,
            times TEXT NOT NULL = $times,
            days_of_week TEXT NOT NULL = $DaysOfWeek,
            notes TEXT = $Note,
            notification INTEGER = $Notif,
            notification_before INTEGER = $Notif_before, 
            hits INTEGER =  $Hits,
            misses INTEGER =  $Misses),

            WHERE $medId = id;`,
            {
                $medId: medId,
                $medName: medName,
                $medDosage: medDosage,
                $medDosageUnit: medDosageUnit, 
                $uID: uID, 
                $startDate: startDate, 
                $endDate: endDate, 
                $times: times,
                $DaysOfWeek: DaysOfWeek, 
                $Note: Note, 
                $Notif: Notif, 
                $Notif_before: Notif_before, 
                $Hits: Hits, 
                $Misses: Misses
            }, (dbErr) => {
                if (dbErr) {
                    callback(dbErr);
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
                    return;
                }

                if(!rows){
                    callback(new Error("User has no medicatons"));
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
            })
        }
    };
}
