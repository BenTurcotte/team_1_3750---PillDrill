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

        deleteMedication(medID, uID) {
            db.run(`DELETE * FROM ${MEDICATION_TABLE_NAME} where medId = id,
            uID = user_id
            )`);
        },

        addMedication(medId, medName, medDosage, medDosageUnit, uID, startDate, endDate, times,
            DaysOfWeek, Note, Notif, Notif_before, Hits, Misses){
                
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
            $DaysOfWeek, $Note, $Notif, $Notif_before, $Hits, $Misses`), {
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
            }
        },


        /*
        */
        updateMedication(medId, medName, medDosage, medDosageUnit, uID, startDate, endDate, times,
            DaysOfWeek, Note, Notif, Notif_before, Hits, Misses){

            db.run(`UPDATE ${MEDICATION_TABLE_NAME} 
            SET
            user_id TEXT UNIQUE = $medName,
            name TEXT NOT NULL = $medDosage,
            dosage INTEGER = $medDosageUnit,
            dosage_unit TEXT NOT NULL = $uID,
            start_date TEXT NOT NULL = $startDate,,
            end_date TEXT NOT NULL =  $endDate,
            times TEXT NOT NULL = $times,
            days_of_week TEXT NOT NULL = $DaysOfWeek,
            notes TEXT = $Note,
            notification INTEGER = $Notif,
            notification_before INTEGER = $Notif_before, 
            hits INTEGER =  $Hits,
            misses INTEGER =  $Misses),

            WHERE medId = id;`),
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
            }
        }
    };
}