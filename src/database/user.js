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
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone_number TEXT,
                passwordHash TEXT NOT NULL,
                passwordSalt TEXT NOT NULL,
                account_type TEXT NOT NULL,
                login_token TEXT,
                login_token_expires TEXT,
                lastLoginDate TEXT
            )`);
        },

        /**
         * Creates a new user with the given email and password
         * The password will be in plain text at this point
         * The callback is (err) and will be called when the user has been created, or not.
         * err will be truthy if an error exists
         */
        
        createNewUser(new_user, callback){         
            hashPassword(new_user.password, (err, hashedPassword, salt) => {
                if (err) {
                    callback(err);
                    console.error("createNewUser: hashPassword error", err);
                    return;
                }

                //Insert the new user into the DB with the mapped data
                //Callback the callback with maybe an error once it completes
                db.run(`INSERT INTO ${USER_TABLE_NAME} (
                    first_name,
                    last_name,
                    email,
                    phone_number,
                    passwordHash,
                    passwordSalt,
                    account_type
                ) VALUES (
                    $first_name,
                    $last_name,                    
                    $email,
                    $phone_number,
                    $hashedPassword,
                    $salt,
                    $account_type
                )`, {
                    $first_name: new_user.first_name,
                    $last_name: new_user.last_name,
                    $email: new_user.email,
                    $phone_number: new_user.phone_num,
                    $hashedPassword: hashedPassword,
                    $salt: salt,
                    $account_type: new_user.account_type
                }, (dbErr) => {
                    if (dbErr) {
                        callback(dbErr);
                        console.error("createNewUser: insert error", dbErr);
                        return;
                    }
                    
                    callback();
                });
            });
        },

        /**
         * 
         * Given aa user ID, returns the account type form the DB
         */
        getAccountType(user_id, callback){
            db.get(`SELECT account_type FROM ${USER_TABLE_NAME} WHERE id = $user_id`, { 
                $user_id: user_id
            }, (err, row) => {
                if (err) {
                    callback(err);
                    console.error("getAccountType: select error", err);
                    return;
                }

                callback(undefined, row.account_type);
            });
        },

        /**
         * Creates a new login token if the correct password is given
         * The callback is (err, userData). If there is no error, err is undefined, and userData is
         * all of the data associated with the user that the front-end might need upon login
         * It destroys the old login_token if it succeeds.
         */
        login(email, rawPassword, callback) {
            //Get the hashed password and salt associated with the email
            db.get(`SELECT * FROM ${USER_TABLE_NAME} WHERE email = $email`, {
                $email: email
            }, (err, row) => {
                if (err) {
                    callback(err);
                    console.error("login: select error", err);
                    return;
                }

                //Return an error if there was no row with the given email
                if (!row) {
                    callback(new Error("Couldn't get a row with email"));
                    console.error("login: no rows for user", email);
                    return;
                }
                
                //Try to hash the password and check that against what we got earlier
                hashPassword(rawPassword, row.passwordSalt, (err, passwordHash, salt) => {
                    if (err) {
                        callback(err);
                        console.error("login: hashPassword error", err);
                        return;
                    }

                    //Check for a correct password
                    if (passwordHash === row.passwordHash) {
                        //Generate the new login token for this account
                        var login_token = createSalt();

                        //Set the expiry date to 7 days in the future
                        var future = new Date();
                        future.setDate(future.getDate() + 7);

                        var login_token_expires = future.toJSON();

                        //If we were able to get the row with email, we can't get an error here
                        db.run(`UPDATE ${USER_TABLE_NAME} SET login_token = $login_token,
                        login_token_expires = $login_token_expires
                        WHERE email = $email`, {
                            $login_token: login_token,
                            $login_token_expires: login_token_expires,
                            $email: email
                        });

                        callback(undefined, {
                            user_id: row.id,
                            login_token: login_token,
                            login_token_expires: login_token_expires,
                            account_type: row.account_type
                        });
                    } else {
                        callback(new Error("Passwords don't match"));
                        console.error("login: passwords don't match for user", row.id);
                    }
                });
            });
        },

        /**
         * Checks the login_token against the id
         * The callback is (err). The login_token is assumed to be good if err is undefined
         * Last Updated: Nov 20th/2017
         * Author: Tamara 
         */
        checkLogin(id, login_token, callback) {            
            //Check if given loginTokin matched the loginTokin in the databse (using id)
            db.get(`SELECT * FROM ${USER_TABLE_NAME} WHERE id = $id and login_token = $login_token`, {
                $id: id,
                $login_token: login_token
            }, (err, row) => {
                if (err) {
                    callback(err);
                    console.error("checkLogin: Bad query", err);
                    return;
                }

                if (!row) {
                    //callback(new Error("Couldn't get a row with given login_token and id"));
                    callback(new Error("Login session has expired"));
                    console.error("checkLogin: no row exists from sql", row);
                    return;
                }

                //Check that login_tokenDate has not passed
                currDate = new Date()
                exp_date = new Date(row.login_token_expires)
                if (currDate > exp_date){
                    callback(new Error("Login session has expired"));
                    console.error("checkLogin: session expired");
                    return;
                } 
                
                callback();
            })            
        },

        /**
        * Given an id, returns a JSON object containing the required user information:
        * first_name, last_name, email, phone_number, and account_type
        * Last Updated: NOv 20th/ 2017
        * Author: Tamara
        */
        getClientInfo(id, callback){
            //Get user information from Users table in DB (using given id)
            db.get(`SELECT * FROM ${USER_TABLE_NAME} WHERE id = $id`, {
                $id: id,
                $login_token: login_token
            }, (err, row) => {
                if (err) {
                    callback(err);
                    console.error("getClientInfo: select error", err);
                    return;
                }

                if (!row) {                    
                    callback(new Error("Couldn't get row with id"));
                    console.error("getClientInfo: now rows for user", id);
                    return;
                }

                //Return a JSON object with 
                callback(undefined,{
                    first_name: row.first_name,
                    last_name: row.last_name,
                    email: row.email,
                    phone_num: row.phone_number,
                    account_type: row.account_type
                });
            })
        },

        /**
         * Given a JSON object (containing user information), updates the user information DB
         * Last Updated: Nov 20th/2017
         * Author: Tamara
         */

        updateClientInfo(client, callback){
            db.run(`UPDATE ${USER_TABLE_NAME} SET first_name = $first_name, last_name = $last_name, 
            email = $email, phone_number = $phone_numnber WHERE id = $user_id`, {
                $first_name: client.first_name,
                $last_name: client.last_name, 
                $email: client.email, 
                $phone_number: client.phone_num,    
                $user_id: client.user_id            
            }, (err) => {
                if (err) {
                    callback(err);
                    console.error("updateClientInfo: update error", err);
                    return;
                }
                
                //If we didn't get an error while updating, we won't get an error here
                db.get(`SELECT * FROM ${USER_TABLE_NAME} WHERE id = $user_id`, {
                    $user_id: client.user_id
                }, (row) => {
                    callback(undefined, {
                        first_name: row.first_name,
                        last_name: row.last_name,
                        phone_num: row.phone_number,
                        email: row.email,                        
                    });
                });
            });
        },

        /**
         * Returns a JSON array containing information about all users
         * Last Updated: Nov 22/2017
         * Author: Tamara
         */
        getTable(callback) {
            db.all(`SELECT * FROM ${USER_TABLE_NAME}`, (err, rows) => {
                if(err)
                {
                    callback(err)
                    return;
                }

                var userArray = [];
                rows.forEach(row => {
                    userArray.push(
                    {
                        id: row.id ,
                        first_name: row.first_name,
                        last_name: row.last_name,
                        email: row.email ,
                        phone_number: row.phone_number,
                        passwordHash: row,passwordHash ,
                        passwordSalt: row.passwordSalt ,
                        account_type: row.account_type ,
                        login_token: row.login_token ,
                        login_token_expires: row.login_token_expires ,
                        lastLoginDate: row.lastLoginDate
                    })
                });
                callback(undefined, userArray);
            });
        }
        //end of module export
    };
};
