/*
This file will keep track of all the user database calls
*/

const crypto = require("crypto");

//Constants that are used throughout
const USER_TABLE_NAME = "Users";

//Pass this function an open database to create an object
module.exports = function(db) {
    //Define some functions here that will only be accessible to this object
    /**
     * Create a randomized salt with a default length of 16 bytes
     */
    function createSalt(len = 16) {
        return crypto.randomBytes(len).toString("hex");
    }

    /**
     * Hashes the given text password with the salt
     * If a salt is not given, a new salt will be created
     * The callback is called with (err, hashed password, salt)
     * If there is an error, err will be truthy, and hashed password and salt will be undefined
     */
    function hashPassword(rawPassword, salt, callback) {
        if (typeof(salt) == "function") {
            //If only the password and callback were given, move the real callback
            callback = salt;
            var useSalt = createSalt();
        } else {
            var useSalt = salt;
        }

        //Create the hash with 100 000 iterations because it doesn't take too long and it still
        // secure
        crypto.pbkdf2(rawPassword, useSalt, 100000, 64, "sha512", function(err, hashed) {
            if (err) {
                callback(err);
            } else {
                callback(undefined, hashed.toString("hex"), useSalt);
            }
        });
    }

    return {
        /**
         * Creates the user table and will not drop it if it's already there
         */
        createTable() {
            db.run(`CREATE TABLE IF NOT EXISTS ${USER_TABLE_NAME} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE,
                passwordHash TEXT NOT NULL,
                passwordSalt TEXT NOT NULL,
                accountType TEXT NOT NULL,
                loginToken TEXT,
                loginTokenExpires TEXT
            )`);
        },

        /**
         * Creates a new user with the given email and password
         * The password will be in plain text at this point
         * The callback is (err) and will be called when the user has been created, or not.
         * err will be truthy if an error exists
         */
        createNewUser(email, rawPassword, accountType, callback) {
            hashPassword(rawPassword, (err, hashedPassword, salt) => {
                if (err) {
                    callback(err);
                    return;
                }

                //Insert the new user into the DB with the mapped data
                //Callback the callback with maybe an error once it completes
                db.run(`INSERT INTO ${USER_TABLE_NAME} (
                    email,
                    passwordHash,
                    passwordSalt,
                    accountType
                ) VALUES (
                    $email,
                    $hashedPassword,
                    $salt,
                    $accountType
                )`, {
                    $email: email,
                    $hashedPassword: hashedPassword,
                    $salt: salt,
                    $accountType: accountType
                }, (dbErr) => {
                    if (dbErr) {
                        callback(dbErr);
                        return;
                    }
                    
                    callback();
                });
            });
        },

        /**
         * Creates a new login token if the correct password is given
         * The callback is (err, userData). If there is no error, err is undefined, and userData is
         * all of the data associated with the user that the front-end might need upon login
         * It destroys the old loginToken if it succeeds.
         */
        login(email, rawPassword, callback) {
            //Get the hashed password and salt associated with the email
            db.get(`SELECT * FROM ${USER_TABLE_NAME} WHERE email = $email`, {
                $email: email
            }, (err, row) => {
                if (err) {
                    callback(err);
                    return;
                }

                //Return an error if there was no row with the given email
                if (!row) {
                    callback(new Error("Couldn't get a row with email"));
                    return;
                }
                
                //Try to hash the password and check that against what we got earlier
                hashPassword(rawPassword, row.passwordSalt, (err, passwordHash, salt) => {
                    if (err) {
                        callback(err);
                        return;
                    }

                    //Check for a correct password
                    if (passwordHash === row.passwordHash) {
                        //Generate the new login token for this account
                        var loginToken = createSalt();

                        //Set the expiry date to 7 days in the future
                        var future = new Date();
                        future.setDate(future.getDate() + 7);

                        var loginTokenExpires = future.toJSON();

                        //If we were able to get the row with email, we can't get an error here
                        db.run(`UPDATE ${USER_TABLE_NAME} SET loginToken = $loginToken,
                        loginTokenExpires = $loginTokenExpires
                        WHERE email = $email`, {
                            $loginToken: loginToken,
                            $loginTokenExpires: loginTokenExpires,
                            $email: email
                        });

                        callback(undefined, {
                            id: row.id,
                            loginToken: loginToken,
                            loginTokenExpires: loginTokenExpires,
                            accountType: row.accountType
                        });
                    } else {
                        callback(new Error("Passwords don't match"));
                    }
                });
            });
        },

        /**
         * Checks the loginToken against the email
         * The callback is (err). The loginToken is assumed to be good if err is undefined
         */
        checkLogin(email, loginToken, callback) {
        }
    };
};