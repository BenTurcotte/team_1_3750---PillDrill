/*
This file will be included by other parts of our system that need access to the database
We want to keep all our database functionality close together and from a single place
*/

const sqlite = require("sqlite3");

//Include our other database files
const user = require("./user");
const medication = require("./medication");

//We need this singleton-like thing so that many files can all require this big JS file
//Make sure that we only perform init once
var init = false;
if (!init) {
    init = true;

    if (process.env.NODE_ENV == "development") {
        //Open an anonymous database on the file system for testing
        //It will be destroyed when closing the database
        var db = new sqlite.Database("");
    } else {
        //Open the database connection
        var db = new sqlite.Database("clc.db");
    }

    //Create any objects that have functionality isolated in their module
    var userDB = user(db);
    var medDB = medication(db, userDB);

    //Create any tables we need that don't exist
    userDB.createTable();
    medDB.createTable();

    userDB.createNewUser({
        first_name         : "CLC",
        last_name          : "Admin 1",
        email              : "iamadmin@clc.ca",
        password           : "iamadmin",
        phone_num          : "123-456-789",
        account_type       : "Admin"
    }, (err) => {
        if (err){
            console.log(err)
        }
        
    });

    userDB.createNewUser({
        first_name         : "CLC",
        last_name          : "Admin 2",
        email              : "testStaff@test.ca",
        password           : "Password@1",
        phone_num          : "123-456-7890",
        account_type       : "Admin"
    }, (err) => {
        if (err){
            console.log(err)
        }
        
    });
}

//Export an object full of functions to call on the database
module.exports = {
    //This is a user object that can make database calls related to the users
    user: userDB,
    med: medDB,

    /**
     * Close the database before exiting. This should be done to save everything.
     */
    close() {
        db.close();
    }
};
